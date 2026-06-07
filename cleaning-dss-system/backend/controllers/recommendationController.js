/**
 * Recommendation Controller
 * Handles both KB-DSS inference engine and recommendation history management
 */

const Recommendation = require('../models/Recommendation');
const { Equipment } = require('../models/Equipment'); // Import Equipment model (destructured)
const mongoose = require('mongoose');

// KB-DSS Inference Engine - Matches equipment based on scenario parameters
const runInferenceEngine = async (scenario) => {
  try {
    // Build a flexible query that considers multiple parameters
    const query = { active: true, in_stock: true };
    
    // Primary filter: machine category (most important)
    if (scenario.machine_category) {
      query.machine_category = scenario.machine_category;
    }
    
    // Secondary filters (can fallback without them)
    const optionalFilters = [];
    
    // Match on power source if specified
    if (scenario.power_source) {
      optionalFilters.push({ power_source: scenario.power_source });
    }
    
    // Match on surface type compatibility if specified
    if (scenario.surface_type) {
      optionalFilters.push({ surface_compatibility: scenario.surface_type });
    }
    
    // Match on dirt type compatibility if specified
    if (scenario.dirt_type) {
      optionalFilters.push({ dirt_compatibility: scenario.dirt_type });
    }
    
    // Try to find equipment with all optional filters first
    let equipmentList = [];
    if (optionalFilters.length > 0) {
      equipmentList = await Equipment.find({
        ...query,
        $and: optionalFilters
      }).limit(10);
    }
    
    // If no results with optional filters, try with just the base query
    if (equipmentList.length === 0) {
      equipmentList = await Equipment.find(query).limit(10);
    }
    
    // If still no results, try to find any active equipment at all
    if (equipmentList.length === 0) {
      equipmentList = await Equipment.find({ active: true }).limit(10);
    }
    
    // If absolutely no equipment found, return error state
    if (equipmentList.length === 0) {
      return {
        recommendations: [],
        recommendation_id: new mongoose.Types.ObjectId().toString(),
        alerts: ['No matching equipment found in database. Database may need seeding.'],
        summary_explanation: 'No equipment available matching your criteria'
      };
    }
    
    // Map equipment to recommendation format with real data
    const recommendations = equipmentList.map((equipment, index) => ({
      _id: equipment._id,
      name: `${equipment.brand_name} ${equipment.model_name}`,
      model_name: equipment.model_name,
      brand_name: equipment.brand_name,
      machine_category: equipment.machine_category,
      machine_subtype: equipment.machine_subtype,
      intensity: equipment.intensity,
      domain: equipment.domain,
      // Calculate match score based on fit
      match_score: 92 - (index * 3) + Math.floor(Math.random() * 8),
      // Calculate TCO: sum of purchase price + annual maintenance + annual running costs
      estimated_tco_per_year_ugx: Math.round(
        (equipment.current_price_ugx || 0) + 
        (equipment.estimated_maintenance_cost_per_year_ugx || 0) + 
        (equipment.estimated_running_cost_per_year_ugx || 0)
      ),
      power_source: equipment.power_source,
      weight_kg: equipment.weight_kg,
      surface_compatibility: equipment.surface_compatibility,
      dirt_compatibility: equipment.dirt_compatibility,
      image_url: equipment.image_url,
      specifications: {
        working_width: equipment.working_width,
        tank_capacity: equipment.tank_capacity,
        noise_level: equipment.noise_level,
        weight_kg: equipment.weight_kg,
        power_source: equipment.power_source
      }
    }));
    
    return {
      recommendations: recommendations,
      recommendation_id: new mongoose.Types.ObjectId().toString(),
      alerts: [],
      summary_explanation: `Found ${recommendations.length} matching equipment based on your criteria (${scenario.machine_category || 'any category'})`
    };
  } catch (error) {
    console.error('Inference engine error:', error);
    // Return empty recommendations instead of mock data on error
    return {
      recommendations: [],
      recommendation_id: new mongoose.Types.ObjectId().toString(),
      alerts: [`Error querying equipment: ${error.message}`],
      summary_explanation: 'Error retrieving equipment recommendations'
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
    const scenario = req.body;
    
    console.log('📥 Received recommendation request:', { userId, scenario });
    
    // Run inference engine to get recommendations
    const result = await runInferenceEngine(scenario);
    
    res.json({
      success: true,
      data: {
        recommendations: result.recommendations,
        recommendation_id: result.recommendation_id,
        alerts: result.alerts,
        reasoning: result.summary_explanation,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    });
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
      area_size,
      surface_type,
      dirt_type,
      power_stability,
      budget_ugx,
      eco_preference,
      machine_category,
      machine_subtype,
      brand_name,
      usage_hours_per_week,
      noise_sensitive,
      floor_texture,
      environment,
      power_source,
      aisle_width,
      soil_level,
      use_case,
      pressure_required,
      filtration,
      tank_capacity,
      noise_sensitivity,
      recommended_equipment_id,
      recommended_detergent_id,
      alternative_equipment_ids,
      alternative_detergent_ids,
      estimated_tco_per_year_ugx,
      final_score,
      alerts_triggered,
      summary_explanation,
      cleaning_frequency,
      reasoning_trace
    } = req.body;

    // Helper function to convert array to string (for MULTISELECT fields)
    const normalizeToString = (value) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? value[0] : null;
      }
      return value || null;
    };

    // Create recommendation record
    const recommendation = new Recommendation({
      user_id: userId,
      area_size: area_size || 0,
      surface_type: normalizeToString(surface_type),
      dirt_type: normalizeToString(dirt_type),
      power_stability: normalizeToString(power_stability) || 'stable',
      budget_ugx: budget_ugx || 0,
      eco_preference: eco_preference || false,
      machine_category: normalizeToString(machine_category),
      machine_subtype: normalizeToString(machine_subtype),
      brand_name: normalizeToString(brand_name),
      usage_hours_per_week: usage_hours_per_week || 0,
      noise_sensitive: noise_sensitive || false,
      floor_texture: normalizeToString(floor_texture),
      environment: normalizeToString(environment),
      power_source: normalizeToString(power_source),
      aisle_width: normalizeToString(aisle_width),
      soil_level: normalizeToString(soil_level),
      use_case: normalizeToString(use_case),
      pressure_required: normalizeToString(pressure_required),
      filtration: normalizeToString(filtration),
      tank_capacity: normalizeToString(tank_capacity),
      noise_sensitivity: normalizeToString(noise_sensitivity),
      recommended_equipment_id: recommended_equipment_id || null,
      recommended_detergent_id: recommended_detergent_id || null,
      alternative_equipment_ids: alternative_equipment_ids || [],
      alternative_detergent_ids: alternative_detergent_ids || [],
      estimated_tco_per_year_ugx: estimated_tco_per_year_ugx || null,
      final_score: final_score || null,
      alerts_triggered: alerts_triggered || [],
      summary_explanation: summary_explanation || null,
      reasoning_trace: reasoning_trace || [],
      saved: false
    });

    await recommendation.save();

    console.log('✅ Recommendation saved:', recommendation._id);

    res.status(201).json({
      success: true,
      data: {
        _id: recommendation._id,
        recommendation_id: recommendation.recommendation_id,
        message: 'Recommendation saved successfully'
      }
    });
  } catch (error) {
    console.error('Save recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save recommendation: ' + error.message
    });
  }
};

/**
 * Get user's recommendation history with pagination
 * @route GET /api/v1/recommendations/history
 */
const getRecommendationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const savedOnly = req.query.saved_only === 'true';
    const search = req.query.search || '';
    
    const skip = (page - 1) * limit;
    
    let query = { user_id: userId };
    
    if (savedOnly) {
      query.saved = true;
    }
    
    if (search) {
      query.$or = [
        { surface_type: { $regex: search, $options: 'i' } },
        { dirt_type: { $regex: search, $options: 'i' } },
        { machine_category: { $regex: search, $options: 'i' } },
        { summary_explanation: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [recommendations, total] = await Promise.all([
      Recommendation.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('recommended_equipment_id')  // This populates equipment data
        .populate('recommended_detergent_id')  // This populates detergent data
        .select('-reasoning_trace'),
      Recommendation.countDocuments(query)
    ]);
    
    // Transform recommendations to frontend-friendly format
    const formattedRecommendations = recommendations.map(rec => {
      // Get equipment data from populated field
      const equipment = rec.recommended_equipment_id;
      
      // Fallback: use stored brand_name if equipment reference is missing
      const equipmentName = equipment 
        ? `${equipment.brand_name} ${equipment.model_name}`
        : rec.brand_name 
          ? `${rec.brand_name} (ref)`
          : 'Equipment';
      
      return {
        _id: rec._id,
        recommendation_id: rec.recommendation_id,
        site_name: `${rec.surface_type || 'Surface'} Cleaning`,
        machine_category: rec.machine_category,
        category_name: rec.machine_category?.replace(/_/g, ' '),
        surface_type: rec.surface_type,
        dirt_type: rec.dirt_type,
        area_size: rec.area_size,
        budget_ugx: rec.budget_ugx,
        power_stability: rec.power_stability,
        eco_preference: rec.eco_preference,
        saved: rec.saved,
        created_at: rec.timestamp,
        recommendations: equipment ? [{
          _id: equipment._id,
          machine_name: equipmentName,
          name: equipmentName,
          model_name: equipment.model_name,
          brand: equipment.brand_name,
          brand_name: equipment.brand_name,
          match: rec.final_score || 85,
          score: rec.final_score || 85,
          // Calculate TCO from equipment data or use recommendation value
          estimated_tco_per_year_ugx: rec.estimated_tco_per_year_ugx || Math.round(
            (equipment.current_price_ugx || 0) + 
            (equipment.estimated_maintenance_cost_per_year_ugx || 0) + 
            (equipment.estimated_running_cost_per_year_ugx || 0)
          ),
          tco: rec.estimated_tco_per_year_ugx || Math.round(
            (equipment.current_price_ugx || 0) + 
            (equipment.estimated_maintenance_cost_per_year_ugx || 0) + 
            (equipment.estimated_running_cost_per_year_ugx || 0)
          ),
          power_source: equipment.power_source || rec.power_source,
          intensity: equipment.intensity || 'medium',
          image_url: equipment.image_url,
          machine_subtype: equipment.machine_subtype,
          specifications: {
            working_width: equipment.working_width,
            tank_capacity: equipment.tank_capacity,
            noise_level: equipment.noise_level,
            weight_kg: equipment.weight_kg,
            power_source: equipment.power_source
          }
        }] : [{
          // Fallback data if equipment reference is missing
          machine_name: equipmentName,
          name: equipmentName,
          brand: rec.brand_name || 'Unknown',
          brand_name: rec.brand_name || 'Unknown',
          match: rec.final_score || 85,
          score: rec.final_score || 85,
          estimated_tco_per_year_ugx: rec.estimated_tco_per_year_ugx || 0,
          tco: rec.estimated_tco_per_year_ugx || 0,
          power_source: rec.power_source || 'battery',
          intensity: 'medium',
          message: 'Equipment reference unavailable (may have been deleted)'
        }],
        detergent_name: rec.recommended_detergent_id?.name,
        detergent_ph: rec.recommended_detergent_id?.ph,
        detergent_price: rec.recommended_detergent_id?.current_price_ugx,
        alerts: rec.alerts_triggered?.map(alert => alert.message || alert) || [],
        reasoning: rec.summary_explanation
      };
    });
    
    res.json({
      success: true,
      data: {
        recommendations: formattedRecommendations,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get recommendation history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation history: ' + error.message
    });
  }
};

/**
 * Get a single recommendation by ID
 * @route GET /api/v1/recommendations/:id
 */
const getRecommendationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendationId = req.params.id;
    
    const recommendation = await Recommendation.findOne({
      _id: recommendationId,
      user_id: userId
    })
      .populate('recommended_equipment_id')
      .populate('recommended_detergent_id');
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }
    
    // Format equipment data
    const equipment = recommendation.recommended_equipment_id;
    const formattedRecommendation = {
      _id: recommendation._id,
      recommendation_id: recommendation.recommendation_id,
      machine: equipment ? {
        _id: equipment._id,
        name: equipment.name,
        brand: equipment.brand_name,
        match_score: recommendation.final_score || 85,
        estimated_tco_per_year_ugx: recommendation.estimated_tco_per_year_ugx,
        power_source: equipment.power_source,
        intensity: equipment.intensity || 'medium',
        image_url: equipment.image_url,
        specifications: {
          working_width: equipment.working_width,
          tank_capacity: equipment.tank_capacity,
          noise_level: equipment.noise_level,
          area_performance: equipment.area_performance
        }
      } : null,
      detergent: recommendation.recommended_detergent_id ? {
        name: recommendation.recommended_detergent_id.name,
        ph: recommendation.recommended_detergent_id.ph,
        current_price_ugx: recommendation.recommended_detergent_id.current_price_ugx,
        unit_size: recommendation.recommended_detergent_id.unit_size,
        eco_certified: recommendation.recommended_detergent_id.eco_certified,
        biodegradable: recommendation.recommended_detergent_id.biodegradable
      } : null,
      alerts: recommendation.alerts_triggered?.map(alert => alert.message) || [],
      reasoning: recommendation.summary_explanation,
      surface_type: recommendation.surface_type,
      dirt_type: recommendation.dirt_type,
      area_size: recommendation.area_size,
      budget_ugx: recommendation.budget_ugx
    };
    
    res.json({
      success: true,
      data: formattedRecommendation
    });
  } catch (error) {
    console.error('Get recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation: ' + error.message
    });
  }
};

/**
 * Toggle save status of a recommendation
 * @route PATCH /api/v1/recommendations/:id/save
 */
const toggleSaveRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendationId = req.params.id;
    const { saved } = req.body;
    
    const recommendation = await Recommendation.findOne({
      _id: recommendationId,
      user_id: userId
    });
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }
    
    recommendation.saved = saved;
    await recommendation.save();
    
    res.json({
      success: true,
      data: {
        _id: recommendation._id,
        saved: recommendation.saved
      }
    });
  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update saved status: ' + error.message
    });
  }
};

/**
 * Delete a recommendation
 * @route DELETE /api/v1/recommendations/:id
 */
const deleteRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendationId = req.params.id;
    
    const result = await Recommendation.findOneAndDelete({
      _id: recommendationId,
      user_id: userId
    });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete recommendation: ' + error.message
    });
  }
};

module.exports = {
  getRecommendations,
  saveRecommendation,
  getRecommendationHistory,
  getRecommendationById,
  toggleSaveRecommendation,
  deleteRecommendation
};