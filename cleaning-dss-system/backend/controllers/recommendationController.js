/**
 * recommendationController.js
 * Handles POST /api/v1/recommend
 * Uses KB-DSS inference engine to generate recommendations with explanations.
 */

const Equipment = require('../models/Equipment');
const Detergent = require('../models/Detergent');
const Recommendation = require('../models/RecommendationHistory');
const InferenceEngine = require('../services/inferenceEngine');
const explanationService = require('../services/explanationService');
const { success, error } = require('../utils/apiResponse');

/**
 * Main recommendation endpoint using KB-DSS inference engine
 */
const getRecommendations = async (req, res, next) => {
  try {
    const {
      surface_type,
      dirt_type,
      area_size,
      power_stability,
      budget_ugx,
      eco_preference,
      cleaning_frequency
    } = req.body;

    // 1. Validate required fields
    if (!surface_type || !dirt_type) {
      return error(res, 'Missing required fields: surface_type, dirt_type', 400);
    }

    // 2. Initialize inference engine
    const engine = new InferenceEngine();
    
    // 3. Prepare user input facts
    const userInput = {
      surface_type,
      dirt_type,
      area_size: area_size || 0,
      power_stability: power_stability || 'stable',
      budget_ugx: budget_ugx || 0,
      eco_preference: eco_preference || false,
      cleaning_frequency: cleaning_frequency || 'weekly'
    };
    
    // 4. Initialize working memory
    await engine.initialize(req.user.id, userInput);
    
    // 5. Run inference engine (forward chaining)
    const result = await engine.run();
    
    // 6. Generate final recommendations
    const recommendations = engine.generateRecommendations();
    
    // 7. Fetch full equipment and detergent details
    let primaryEquipment = null;
    let primaryDetergent = null;
    let alternativeEquipment = [];
    let alternativeDetergents = [];
    
    if (recommendations.primary_equipment_id) {
      primaryEquipment = await Equipment.findById(recommendations.primary_equipment_id);
    }
    
    if (recommendations.primary_detergent_id) {
      primaryDetergent = await Detergent.findById(recommendations.primary_detergent_id);
    }
    
    if (recommendations.alternative_equipment_ids && recommendations.alternative_equipment_ids.length > 0) {
      alternativeEquipment = await Equipment.find({
        _id: { $in: recommendations.alternative_equipment_ids }
      });
    }
    
    if (recommendations.alternative_detergent_ids && recommendations.alternative_detergent_ids.length > 0) {
      alternativeDetergents = await Detergent.find({
        _id: { $in: recommendations.alternative_detergent_ids }
      });
    }
    
    // 8. Generate summary explanation
    const summaryExplanation = explanationService.generateSummary(
      result.reasoningTrace,
      recommendations
    );
    
    // 9. Save recommendation to database with full reasoning trace
    const savedRecommendation = new Recommendation({
      user_id: req.user.id,
      area_size: area_size,
      surface_type,
      dirt_type,
      power_stability,
      budget_ugx,
      eco_preference,
      reasoning_trace: result.reasoningTrace,
      working_memory_id: result.workingMemory._id,
      recommended_equipment_id: recommendations.primary_equipment_id,
      recommended_detergent_id: recommendations.primary_detergent_id,
      alternative_equipment_ids: recommendations.alternative_equipment_ids,
      alternative_detergent_ids: recommendations.alternative_detergent_ids,
      estimated_tco_per_year_ugx: primaryEquipment?.estimated_tco_per_year_ugx || null,
      final_score: recommendations.scores?.[recommendations.primary_equipment_id] || null,
      alerts_triggered: recommendations.alerts.map(alert => ({
        message: alert,
        explanation: `Rule triggered: ${alert}`,
        severity: 'warning'
      })),
      summary_explanation: summaryExplanation
    });
    
    await savedRecommendation.save();
    
    // 10. Return response with explanation
    return success(res, {
      recommendation_id: savedRecommendation.recommendation_id,
      reasoning_stats: {
        rules_fired: result.firedRulesCount,
        iterations: result.iterations,
        reasoning_steps: result.reasoningTrace.length
      },
      recommendation: {
        equipment: primaryEquipment ? {
          id: primaryEquipment.equipment_id || primaryEquipment._id,
          name: `${primaryEquipment.brand_name} ${primaryEquipment.model_name}`,
          brand: primaryEquipment.brand_name,
          model: primaryEquipment.model_name,
          category: primaryEquipment.machine_category,
          power_source: primaryEquipment.power_source,
          weight_kg: primaryEquipment.weight_kg,
          price_ugx: primaryEquipment.current_price_ugx,
          maintenance_cost_per_year: primaryEquipment.estimated_maintenance_cost_per_year_ugx,
          running_cost_per_year: primaryEquipment.estimated_running_cost_per_year_ugx,
          tco_per_year: primaryEquipment.estimated_tco_per_year_ugx,
          surface_compatibility: primaryEquipment.surface_compatibility,
          dirt_compatibility: primaryEquipment.dirt_compatibility
        } : null,
        detergent: primaryDetergent ? {
          id: primaryDetergent.detergent_id || primaryDetergent._id,
          name: primaryDetergent.product_name,
          brand: primaryDetergent.brand_name,
          category: primaryDetergent.detergent_category,
          form: primaryDetergent.form,
          ph_value: primaryDetergent.ph_value,
          dilution_ratio: primaryDetergent.dilution_ratio,
          requires_ppe: primaryDetergent.requires_ppe,
          price_ugx: primaryDetergent.current_price_ugx,
          unit_size: primaryDetergent.unit_size
        } : null,
        alternatives: {
          equipment: alternativeEquipment.map(e => ({
            id: e.equipment_id || e._id,
            name: `${e.brand_name} ${e.model_name}`,
            score: recommendations.scores?.[e._id] || 0
          })),
          detergents: alternativeDetergents.map(d => ({
            id: d.detergent_id || d._id,
            name: d.product_name
          }))
        },
        alerts: recommendations.alerts,
        final_score: savedRecommendation.final_score
      },
      explanation: {
        summary: summaryExplanation,
        detailed: explanationService.generateDetailed(result.reasoningTrace),
        natural_language: explanationService.generateNaturalLanguage(result.reasoningTrace, userInput)
      }
    }, 'Recommendations generated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecommendations };