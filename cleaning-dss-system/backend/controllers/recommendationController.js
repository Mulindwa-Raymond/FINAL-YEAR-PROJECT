// backend/controllers/recommendationController.js
const Recommendation = require('../models/Recommendation');
const { Equipment } = require('../models/Equipment');
const mongoose = require('mongoose');
const { normalizeScenario } = require('../services/scenarioNormalizer');
const { findBestDetergent } = require('../services/detergentMatcher');
const TcoMultiplier = require('../models/TcoMultiplier');

// ============================================
// DEFAULT COST FALLBACKS (UGX)
// Used when DB fields are null and no calculable fallback exists.
// Adjust these per your market data.
// ============================================
const DEFAULT_MAINTENANCE_UGX = 800000;   // ~UGX 800k/year
const DEFAULT_RUNNING_UGX     = 500000;   // ~UGX 500k/year

// KB-DSS Inference Engine v2 - Scoring-based equipment matching
const runInferenceEngine = async (scenario) => {
  try {
    console.group('🔍 INFERENCE ENGINE ANALYSIS');
    console.log('Input Scenario:', scenario);

    // Fetch TCO multipliers once per request
    const multipliers = await TcoMultiplier.findOne();
    const maintenancePercent = multipliers?.annual_maintenance_cost_percent || 0.05;
    const electricityRate = multipliers?.local_electricity_rate_ugx_per_kwh || 780;
    const usageHoursPerYear = 2000;

    // STEP 1: Base query — hard filters (category only; domain + intensity are soft/scored)
    const baseQuery = { active: true, in_stock: true };
    if (scenario.machine_category) baseQuery.machine_category = scenario.machine_category;

    const allEquipment = await Equipment.find(baseQuery);
    console.log(
      `✓ Found ${allEquipment.length} equipment matching category "${scenario.machine_category}"` +
      `${scenario.domain ? `, domain "${scenario.domain}"` : ''}` +
      `${scenario.intensity ? `, intensity "${scenario.intensity}"` : ''}`
    );

    if (allEquipment.length === 0) {
      console.groupEnd();
      const useTypeMsg = scenario.domain
        ? `No ${scenario.domain} equipment found for this category. Try a different use type or machine category.`
        : 'No matching equipment found in category';
      return {
        recommendations: [],
        recommendation_id: new mongoose.Types.ObjectId().toString(),
        alerts: [useTypeMsg],
        summary_explanation: useTypeMsg,
      };
    }

    // STEP 1.5: Collect surface / dirt inputs — used for soft scoring below (not hard filtering)
    const surfaces = scenario.surfaces || [];
    const soils = scenario.soils || [];

    // Pass all found equipment to the scoring phase; surface/dirt mismatches are penalised there
    const filteredEquipment = allEquipment;

    console.log(`✓ Passing all ${filteredEquipment.length} equipment to scoring (surface/dirt handled as soft criteria)`);

    // STEP 2: Score each equipment
    const scoredEquipment = filteredEquipment.map((equipment) => {
      let score = 100;
      const matchDetails = [];

      // POWER SOURCE (25 pts)
      if (scenario.power_source) {
        if (equipment.power_source === scenario.power_source) {
          matchDetails.push('✓ Power source exact match');
        } else {
          score -= 15;
          matchDetails.push(`✗ Power source mismatch (need: ${scenario.power_source}, have: ${equipment.power_source})`);
        }
      }

      // SURFACE COMPATIBILITY (20 pts)
      if (surfaces.length && equipment.surface_compatibility?.length > 0) {
        const matchedSurfaces = surfaces.filter(s => equipment.surface_compatibility.includes(s));
        if (matchedSurfaces.length > 0) {
          matchDetails.push('✓ Surface type compatible');
        } else {
          score -= 20;
          matchDetails.push(`✗ Surface mismatch (need: ${surfaces.join(', ')})`);
        }
      }

      // DIRT/SOIL COMPATIBILITY (20 pts)
      if (soils.length && equipment.dirt_compatibility?.length > 0) {
        const matchedSoils = soils.filter(s => equipment.dirt_compatibility.includes(s));
        if (matchedSoils.length > 0) {
          matchDetails.push('✓ Dirt type compatible');
        } else {
          score -= 20;
          matchDetails.push(`✗ Dirt type mismatch (need: ${soils.join(', ')})`);
        }
      }

      // ENVIRONMENT (10 pts)
      if (scenario.environment && equipment.environment) {
        if (equipment.environment === scenario.environment || equipment.environment === 'any') {
          matchDetails.push('✓ Environment compatible');
        } else {
          score -= 15;
          matchDetails.push(`✗ Environment mismatch (need: ${scenario.environment})`);
        }
      }

      // INTENSITY (15 pts)
      if (scenario.intensity && equipment.intensity) {
        if (equipment.intensity === scenario.intensity) {
          score += 15;
          matchDetails.push('✓ Intensity level matches');
        } else {
          score -= 10;
          matchDetails.push(`✗ Intensity mismatch (need: ${scenario.intensity}, have: ${equipment.intensity})`);
        }
      }

      // DOMAIN (10 pts)
      if (scenario.domain && equipment.domain) {
        if (equipment.domain === scenario.domain || equipment.domain === 'any') {
          score += 10;
          matchDetails.push('✓ Usage domain matches');
        } else {
          score -= 8;
          matchDetails.push(`✗ Domain mismatch (need: ${scenario.domain}, have: ${equipment.domain})`);
        }
      }

      // SURFACE COMPATIBILITY (20 pts soft)
      if (surfaces.length > 0) {
        if (equipment.surface_compatibility && equipment.surface_compatibility.length > 0) {
          const matched = surfaces.filter(s => equipment.surface_compatibility.includes(s));
          if (matched.length > 0) {
            score += 20;
            matchDetails.push(`✓ Surface compatible (${matched.join(', ')})`);
          } else {
            score -= 15;
            matchDetails.push(`✗ Surface mismatch (need: ${surfaces.join(', ')}, have: ${equipment.surface_compatibility.join(', ')})`);
          }
        }
        // if equipment has no surface_compatibility data, no penalty — we can't assume incompatibility
      }

      // DIRT COMPATIBILITY (15 pts soft)
      if (soils.length > 0) {
        if (equipment.dirt_compatibility && equipment.dirt_compatibility.length > 0) {
          // Partial match: check if any requested soil is a substring of a DB value or vice versa
          const matched = soils.filter(s =>
            equipment.dirt_compatibility.some(d => d.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.toLowerCase()))
          );
          if (matched.length > 0) {
            score += 15;
            matchDetails.push(`✓ Dirt/soil compatible (${matched.join(', ')})`);
          } else {
            score -= 10;
            matchDetails.push(`✗ Dirt mismatch (need: ${soils.join(', ')}, have: ${equipment.dirt_compatibility.join(', ')})`);
          }
        }
        // if equipment has no dirt_compatibility data, no penalty
      }

      // AISLE WIDTH (5 pts)
      if (scenario.min_aisle_width_mm && equipment.min_aisle_width_mm) {
        if (scenario.min_aisle_width_mm >= equipment.min_aisle_width_mm) {
          matchDetails.push('✓ Fits aisle width');
        } else {
          score -= 10;
          matchDetails.push(`✗ Too wide for aisle (${equipment.min_aisle_width_mm}mm required)`);
        }
      }

      // ECO PREFERENCE (5 pts)
      if (scenario.eco_preference) {
        const isEcoFriendly = equipment.power_source === 'battery' || equipment.power_source === 'corded_electric';
        if (isEcoFriendly) {
          score += 5;
          matchDetails.push('✓ Eco-friendly power source');
        } else {
          score -= 3;
          matchDetails.push('✗ Not eco-friendly');
        }
      }

      // WEIGHT TOLERANCE (15 pts)
      if (scenario.weight_tolerance && equipment.weight_kg) {
        const weightLimits = { lightweight: 30, moderate: 60, no_constraint: 999 };
        const maxWeight = weightLimits[scenario.weight_tolerance];
        if (equipment.weight_kg <= maxWeight) {
          matchDetails.push(`✓ Weight acceptable (${equipment.weight_kg}kg ≤ ${maxWeight}kg)`);
        } else {
          score -= 25;
          matchDetails.push(`❌ TOO HEAVY: ${equipment.weight_kg}kg > ${maxWeight}kg limit`);
        }
      }

      // POWER AVAILABILITY (20 pts)
      if (scenario.power_available_kw && equipment.power_req?.kW) {
        if (equipment.power_req.kW <= scenario.power_available_kw) {
          matchDetails.push(`✓ Power available (${equipment.power_req.kW}kW ≤ ${scenario.power_available_kw}kW)`);
        } else {
          score -= 40;
          matchDetails.push(`❌ POWER PROBLEM: Equipment needs ${equipment.power_req.kW}kW, only ${scenario.power_available_kw}kW available`);
        }
      }

      // SPARE PARTS / DOWNTIME (10 pts)
      if (scenario.downtime_criticality && equipment.spare_part_lead_time_days) {
        const criticalityThresholds = { high: 3, medium: 14, low: 28 };
        const maxLeadTime = criticalityThresholds[scenario.downtime_criticality];
        if (equipment.spare_part_lead_time_days <= maxLeadTime) {
          matchDetails.push(`✓ Parts available within ${equipment.spare_part_lead_time_days} days`);
        } else {
          score -= 12;
          matchDetails.push(`⚠️ Parts take ${equipment.spare_part_lead_time_days} days (max ${maxLeadTime} acceptable)`);
        }
      }

      // CLEANING FREQUENCY (8 pts)
      if (scenario.cleaning_frequency && equipment.working_width) {
        const efficiencyMap = { light: 50, moderate: 75, daily: 100 };
        const targetWidth = efficiencyMap[scenario.cleaning_frequency];
        if (equipment.working_width >= targetWidth) {
          matchDetails.push(`✓ Efficient for ${scenario.cleaning_frequency} cleaning (${equipment.working_width}cm width)`);
        } else {
          score -= 5;
          matchDetails.push(`⚠️ Working width ${equipment.working_width}cm may be slow for ${scenario.cleaning_frequency} cleaning`);
        }
      }

      // WORKING WIDTH PREFERENCE (5 pts)
      if (scenario.working_width_preference && equipment.working_width) {
        const widthMap = {
          compact:  { min: 0,  max: 50  },
          standard: { min: 50, max: 90  },
          wide:     { min: 90, max: 999 },
        };
        const preferred = widthMap[scenario.working_width_preference];
        if (equipment.working_width >= preferred.min && equipment.working_width <= preferred.max) {
          matchDetails.push(`✓ Working width ${equipment.working_width}cm matches preference`);
        } else {
          score -= 3;
          matchDetails.push(`⚠️ Working width ${equipment.working_width}cm outside ${scenario.working_width_preference} range`);
        }
      }

      score = Math.max(0, Math.min(100, score));
      return { equipment, score, matchDetails };
    });

    // STEP 3: Sort by score, take top 10
    const rankedEquipment = scoredEquipment
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log(`\n🎯 RANKING RESULTS:`);
    rankedEquipment.forEach((item, idx) => {
      console.log(`\n#${idx + 1} - ${item.equipment.brand_name} ${item.equipment.model_name} (Score: ${item.score}/100)`);
      item.matchDetails.forEach(detail => console.log(`    ${detail}`));
    });
    console.groupEnd();

    // STEP 4: Build recommendation objects with costs + detergents
    const recommendations = await Promise.all(
      rankedEquipment.map(async (item) => {
        const detergent = await findBestDetergent(item.equipment, {
          ...scenario,
          surface_type: scenario.surfaces,
          dirt_type: scenario.soils,
          domain: scenario.domain,
          eco_preference: scenario.eco_preference,
        });

        // ── Cost computation (FIX: removed `price > 0` gate) ──────────────────
        const price  = item.equipment.current_price_ugx || 0;
        const powerKW = item.equipment.power_req?.kW || 0;

        let maintenance = item.equipment.estimated_maintenance_cost_per_year_ugx;
        let running     = item.equipment.estimated_running_cost_per_year_ugx;

        // Maintenance fallback: % of price if available, else default constant
        if (maintenance == null || maintenance === 0) {
          maintenance = price > 0
            ? Math.round(price * maintenancePercent)
            : DEFAULT_MAINTENANCE_UGX;
        }

        // Running cost fallback: electricity estimate if power known, else default
        if (running == null || running === 0) {
          running = powerKW > 0
            ? Math.round(powerKW * usageHoursPerYear * electricityRate)
            : DEFAULT_RUNNING_UGX;
        }

        maintenance = maintenance || 0;
        running     = running     || 0;
        const operatingCost = maintenance + running;
        const tco           = price + operatingCost;
        // ─────────────────────────────────────────────────────────────────────

        return {
          _id: item.equipment._id,
          id:  item.equipment._id,
          name: `${item.equipment.brand_name} ${item.equipment.model_name}`,
          model_name:       item.equipment.model_name,
          brand_name:       item.equipment.brand_name,
          machine_category: item.equipment.machine_category,
          machine_subtype:  item.equipment.machine_subtype,
          intensity:        item.equipment.intensity,
          domain:           item.equipment.domain,
          match_score:      item.score,
          current_price_ugx:                      price,
          estimated_maintenance_cost_per_year_ugx: maintenance,
          estimated_running_cost_per_year_ugx:     running,
          estimated_operating_cost_per_year_ugx:   Math.round(operatingCost),
          estimated_tco_per_year_ugx:              Math.round(tco),
          power_source:           item.equipment.power_source,
          weight_kg:              item.equipment.weight_kg,
          surface_compatibility:  item.equipment.surface_compatibility,
          dirt_compatibility:     item.equipment.dirt_compatibility,
          reasoning_trace:        item.matchDetails,
          image_url:              item.equipment.image_url,
          environment:            item.equipment.environment,
          min_aisle_width_mm:     item.equipment.min_aisle_width_mm,
          motor_type:             item.equipment.motor_type || 'Standard',
          power_requirement_kw:   item.equipment.power_req?.kW || 0,
          noise_level_db:         item.equipment.noise_level || 75,
          working_width_cm:       item.equipment.working_width || 50,
          tank_capacity_liters:   item.equipment.tank_capacity || 0,
          spare_parts_lead_time_days: item.equipment.spare_part_lead_time_days || 14,
          hint_weight: item.equipment.weight_kg > 50
            ? `⚠️ Heavy (${item.equipment.weight_kg}kg)`
            : `✓ ${item.equipment.weight_kg}kg`,
          hint_noise: item.equipment.noise_level > 85
            ? `⚠️ Loud (${item.equipment.noise_level}dB)`
            : item.equipment.noise_level > 75
              ? `🔊 Moderate (${item.equipment.noise_level}dB)`
              : `🔇 Quiet (${item.equipment.noise_level}dB)`,
          hint_power: `⚡ ${item.equipment.power_req?.kW || 0}kW (${item.equipment.power_source})`,
          specifications: {
            working_width:            item.equipment.working_width,
            tank_capacity:            item.equipment.tank_capacity,
            noise_level:              item.equipment.noise_level,
            weight_kg:                item.equipment.weight_kg,
            power_source:             item.equipment.power_source,
            power_requirement_kw:     item.equipment.power_req?.kW,
            motor_type:               item.equipment.motor_type,
            spare_parts_lead_time_days: item.equipment.spare_part_lead_time_days,
          },
          detergent: detergent
            ? {
              _id:               detergent._id,
              id:                detergent._id,
              name:              detergent.product_name,
              product_name:      detergent.product_name,
              brand_name:        detergent.brand_name,
              detergent_category: detergent.detergent_category,
              ph:                detergent.ph_value,
              ph_value:          detergent.ph_value,
              current_price_ugx: detergent.current_price_ugx,
              unit_size:         detergent.unit_size,
              dilution_ratio:    detergent.dilution_ratio,
              eco_certified:     detergent.eco_certified,
              biodegradable:     detergent.biodegradable,
              requires_ppe:      detergent.requires_ppe,
              hazard_alerts:     detergent.hazard_alerts,
              image_url:         detergent.image_url,
              surface_compatibility: detergent.surface_compatibility || [],
              dirt_compatibility:    detergent.dirt_compatibility || [],
              local_supplier:        detergent.local_supplier || null,
              domain:                detergent.domain,
              intensity:             detergent.intensity,
            }
            : null,
        };
      })
    );

    const activeFilters = [];
    if (scenario.machine_category)      activeFilters.push('category');
    if (scenario.power_source)          activeFilters.push('power_source');
    if (surfaces.length)                activeFilters.push('surfaces');
    if (soils.length)                   activeFilters.push('soils');
    if (scenario.environment)           activeFilters.push('environment');
    if (scenario.intensity)             activeFilters.push('intensity');
    if (scenario.domain)                activeFilters.push('domain');
    if (scenario.min_aisle_width_mm)    activeFilters.push('aisle_width');
    if (scenario.weight_tolerance)      activeFilters.push('weight_tolerance');
    if (scenario.power_available_kw)    activeFilters.push('power_available_kw');
    if (scenario.downtime_criticality)  activeFilters.push('downtime_criticality');
    if (scenario.cleaning_frequency)    activeFilters.push('cleaning_frequency');
    if (scenario.working_width_preference) activeFilters.push('working_width_preference');

    return {
      recommendations,
      recommendation_id: new mongoose.Types.ObjectId().toString(),
      alerts: [],
      summary_explanation: `Found ${recommendations.length} equipment ranked by match quality using filters: ${activeFilters.join(', ') || 'category only'}`,
    };
  } catch (error) {
    console.error('Inference engine error:', error);
    return {
      recommendations: [],
      recommendation_id: new mongoose.Types.ObjectId().toString(),
      alerts: [`Error querying equipment: ${error.message}`],
      summary_explanation: 'Error retrieving equipment recommendations',
    };
  }
};

/**
 * Get recommendations from inference engine
 * @route POST /api/v1/recommend
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const scenario = normalizeScenario(req.body);
    console.log('📥 Received recommendation request:', { userId, scenario });

    const result = await runInferenceEngine(scenario);

    res.json({
      success: true,
      data: {
        recommendations:   result.recommendations,
        recommendation_id: result.recommendation_id,
        alerts:            result.alerts,
        reasoning:         result.summary_explanation,
        timestamp:         new Date(),
      },
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ success: false, error: 'Failed to get recommendations' });
  }
};

/**
 * Save a recommendation to user's history
 * @route POST /api/v1/recommendations
 */
const saveRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      area_size, surface_type, dirt_type, power_stability, budget_ugx, eco_preference,
      machine_category, machine_subtype, brand_name, usage_hours_per_week, noise_sensitive,
      floor_texture, environment, power_source, aisle_width, soil_level, use_case,
      pressure_required, filtration, tank_capacity, noise_sensitivity,
      recommended_equipment_id, recommended_detergent_id, alternative_equipment_ids,
      alternative_detergent_ids, estimated_tco_per_year_ugx, final_score,
      alerts_triggered, summary_explanation, cleaning_frequency, reasoning_trace,
    } = req.body;

    const normalizeToString = (value) => {
      if (Array.isArray(value)) return value.length > 0 ? value[0] : null;
      return value || null;
    };

    const recommendation = new Recommendation({
      user_id:               userId,
      area_size:             area_size || 0,
      surface_type:          normalizeToString(surface_type),
      dirt_type:             normalizeToString(dirt_type),
      power_stability:       normalizeToString(power_stability) || 'stable',
      budget_ugx:            budget_ugx || 0,
      eco_preference:        eco_preference || false,
      machine_category:      normalizeToString(machine_category),
      machine_subtype:       normalizeToString(machine_subtype),
      brand_name:            normalizeToString(brand_name),
      usage_hours_per_week:  usage_hours_per_week || 0,
      noise_sensitive:       noise_sensitive || false,
      floor_texture:         normalizeToString(floor_texture),
      environment:           normalizeToString(environment),
      power_source:          normalizeToString(power_source),
      aisle_width:           normalizeToString(aisle_width),
      soil_level:            normalizeToString(soil_level),
      use_case:              normalizeToString(use_case),
      pressure_required:     normalizeToString(pressure_required),
      filtration:            normalizeToString(filtration),
      tank_capacity:         normalizeToString(tank_capacity),
      noise_sensitivity:     normalizeToString(noise_sensitivity),
      recommended_equipment_id:  recommended_equipment_id || null,
      recommended_detergent_id:  recommended_detergent_id || null,
      alternative_equipment_ids: alternative_equipment_ids || [],
      alternative_detergent_ids: alternative_detergent_ids || [],
      estimated_tco_per_year_ugx: estimated_tco_per_year_ugx || null,
      final_score:               final_score || null,
      alerts_triggered:          alerts_triggered || [],
      summary_explanation:       summary_explanation || null,
      reasoning_trace:           reasoning_trace || [],
      saved:                     false,
    });

    await recommendation.save();
    console.log('✅ Recommendation saved:', recommendation._id);

    res.status(201).json({
      success: true,
      data: {
        _id: recommendation._id,
        recommendation_id: recommendation.recommendation_id,
        message: 'Recommendation saved successfully',
      },
    });
  } catch (error) {
    console.error('Save recommendation error:', error);
    res.status(500).json({ success: false, error: 'Failed to save recommendation: ' + error.message });
  }
};

/**
 * Get user's recommendation history with pagination
 * @route GET /api/v1/recommendations/history
 */
const getRecommendationHistory = async (req, res) => {
  try {
    const userId  = req.user.id;
    const page    = parseInt(req.query.page)  || 1;
    const limit   = parseInt(req.query.limit) || 10;
    const savedOnly = req.query.saved_only === 'true';
    const search  = req.query.search || '';
    const skip    = (page - 1) * limit;

    let query = { user_id: userId };
    if (savedOnly) query.saved = true;
    if (search) {
      query.$or = [
        { surface_type:        { $regex: search, $options: 'i' } },
        { dirt_type:           { $regex: search, $options: 'i' } },
        { machine_category:    { $regex: search, $options: 'i' } },
        { summary_explanation: { $regex: search, $options: 'i' } },
      ];
    }

    const [recommendations, total] = await Promise.all([
      Recommendation.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('recommended_equipment_id')
        .populate('recommended_detergent_id'),
      Recommendation.countDocuments(query),
    ]);

    const formattedRecommendations = recommendations.map(rec => {
      const eq = rec.recommended_equipment_id;
      return {
        _id:               rec._id,
        recommendation_id: rec.recommendation_id,
        timestamp:         rec.timestamp,
        saved:             rec.saved,
        machine_category:  rec.machine_category,
        surface_type:      rec.surface_type,
        dirt_type:         rec.dirt_type,
        machine: eq
          ? {
            _id:        eq._id,
            name:       `${eq.brand_name} ${eq.model_name}`,
            brand:      eq.brand_name,
            match_score: rec.final_score || 85,
            current_price_ugx:                       eq.current_price_ugx || 0,
            estimated_maintenance_cost_per_year_ugx: eq.estimated_maintenance_cost_per_year_ugx || 0,
            estimated_running_cost_per_year_ugx:     eq.estimated_running_cost_per_year_ugx || 0,
            estimated_tco_per_year_ugx:              rec.estimated_tco_per_year_ugx || 0,
            intensity:   eq.intensity || 'medium',
            image_url:   eq.image_url,
          }
          : [{ intensity: 'medium', message: 'Equipment reference unavailable (may have been deleted)' }],
        detergent_name:  rec.recommended_detergent_id?.product_name,
        detergent_ph:    rec.recommended_detergent_id?.ph_value,
        detergent_price: rec.recommended_detergent_id?.current_price_ugx,
        alerts:          rec.alerts_triggered?.map(a => a.message || a) || [],
        reasoning:       rec.summary_explanation,
      };
    });

    res.json({
      success: true,
      data: {
        recommendations: formattedRecommendations,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get recommendation history error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recommendation history: ' + error.message });
  }
};

/**
 * Get a single recommendation by ID
 * @route GET /api/v1/recommendations/:id
 */
const getRecommendationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendation = await Recommendation.findOne({
      _id: req.params.id,
      user_id: userId,
    })
      .populate('recommended_equipment_id')
      .populate('recommended_detergent_id');

    if (!recommendation) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' });
    }

    const equipment = recommendation.recommended_equipment_id;

    // ── Cost fields from populated equipment ─────────────────────────────
    const price       = equipment?.current_price_ugx || 0;
    const maintenance = equipment?.estimated_maintenance_cost_per_year_ugx || 0;
    const running     = equipment?.estimated_running_cost_per_year_ugx || 0;
    const operating   = Math.round(maintenance + running);
    // FIX: use saved TCO if available; otherwise recalculate so it is never 0
    const tco = recommendation.estimated_tco_per_year_ugx
      || (price + operating)
      || 0;
    // ────────────────────────────────────────────────────────────────────

    const formattedRecommendation = {
      _id:               recommendation._id,
      recommendation_id: recommendation.recommendation_id,
      machine: equipment
        ? {
          _id:   equipment._id,
          // FIX: Equipment has no 'name' field — construct it from brand + model
          name:  `${equipment.brand_name} ${equipment.model_name}`,
          brand: equipment.brand_name,
          match_score:                             recommendation.final_score || 85,
          current_price_ugx:                       price,
          estimated_maintenance_cost_per_year_ugx: maintenance,
          estimated_running_cost_per_year_ugx:     running,
          estimated_operating_cost_per_year_ugx:   operating,
          estimated_tco_per_year_ugx:              tco,
          power_source: equipment.power_source,
          intensity:    equipment.intensity || 'medium',
          image_url:    equipment.image_url,
          specifications: {
            working_width:   equipment.working_width,
            tank_capacity:   equipment.tank_capacity,
            noise_level:     equipment.noise_level,
            area_performance: equipment.area_performance,
          },
        }
        : null,
      detergent: recommendation.recommended_detergent_id
        ? {
          name:              recommendation.recommended_detergent_id.product_name,
          ph:                recommendation.recommended_detergent_id.ph_value,
          current_price_ugx: recommendation.recommended_detergent_id.current_price_ugx,
          unit_size:         recommendation.recommended_detergent_id.unit_size,
          eco_certified:     recommendation.recommended_detergent_id.eco_certified,
          biodegradable:     recommendation.recommended_detergent_id.biodegradable,
          image_url:         recommendation.recommended_detergent_id.image_url,
        }
        : null,
      alerts:       recommendation.alerts_triggered?.map(a => a.message) || [],
      reasoning:    recommendation.summary_explanation,
      surface_type: recommendation.surface_type,
      dirt_type:    recommendation.dirt_type,
      area_size:    recommendation.area_size,
      budget_ugx:   recommendation.budget_ugx,
    };

    res.json({ success: true, data: formattedRecommendation });
  } catch (error) {
    console.error('Get recommendation error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recommendation: ' + error.message });
  }
};

/**
 * Toggle save status
 * @route PATCH /api/v1/recommendations/:id/save
 */
const toggleSaveRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { saved } = req.body;

    const recommendation = await Recommendation.findOne({ _id: req.params.id, user_id: userId });
    if (!recommendation) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' });
    }

    recommendation.saved = saved;
    await recommendation.save();

    res.json({ success: true, data: { _id: recommendation._id, saved: recommendation.saved } });
  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(500).json({ success: false, error: 'Failed to update saved status: ' + error.message });
  }
};

/**
 * Delete a recommendation
 * @route DELETE /api/v1/recommendations/:id
 */
const deleteRecommendation = async (req, res) => {
  try {
    const result = await Recommendation.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    if (!result) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' });
    }
    res.json({ success: true, message: 'Recommendation deleted successfully' });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete recommendation: ' + error.message });
  }
};

module.exports = {
  getRecommendations,
  saveRecommendation,
  getRecommendationHistory,
  getRecommendationById,
  toggleSaveRecommendation,
  deleteRecommendation,
};
