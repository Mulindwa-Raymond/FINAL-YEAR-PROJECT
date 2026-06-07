/**
 * ruleController.js
 * Manages knowledge-base rules for the inference engine.
 * Handles rules with antecedents, consequents, certainty factors.
 */

const { Rule } = require('../models/Rule');
const { success, error } = require('../utils/apiResponse');
const AuditLog = require('../models/AuditLog');

/**
 * Get all rules with optional filters
 * GET /api/v1/rules
 */
const getAllRules = async (req, res, next) => {
  try {
    const { category, action_type, active } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (action_type) filter['consequent.actions.type'] = action_type;
    if (active !== undefined) filter.active = active === 'true';
    
    const rules = await Rule.find(filter).sort({ priority: -1, salience: -1 });
    return success(res, rules, 'Rules retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get single rule by ID
 * GET /api/v1/rules/:id
 */
const getRuleById = async (req, res, next) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
      return error(res, 'Rule not found', 404);
    }
    return success(res, rule, 'Rule retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get rules by category
 * GET /api/v1/rules/category/:category
 */
const getRulesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const rules = await Rule.find({ category, active: true }).sort({ priority: -1 });
    return success(res, rules, 'Rules by category retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get rules that match specific conditions (for testing)
 * POST /api/v1/rules/match
 */
const matchRules = async (req, res, next) => {
  try {
    const { facts } = req.body;
    
    if (!facts || !Array.isArray(facts)) {
      return error(res, 'Facts array is required', 400);
    }
    
    const rules = await Rule.find({ active: true });
    
    const matchedRules = [];
    
    for (const rule of rules) {
      let matches = true;
      
      for (const condition of rule.antecedent.conditions) {
        const fact = facts.find(f => f.attribute === condition.attribute);
        if (!fact) {
          matches = false;
          break;
        }
        
        switch (condition.operator) {
          case 'EQ':
            if (fact.value !== condition.value) matches = false;
            break;
          case 'NE':
            if (fact.value === condition.value) matches = false;
            break;
          case 'GT':
            if (fact.value <= condition.value) matches = false;
            break;
          case 'LT':
            if (fact.value >= condition.value) matches = false;
            break;
          default:
            break;
        }
        
        if (!matches) break;
      }
      
      if (matches) {
        matchedRules.push({
          rule_id: rule.rule_id,
          rule_text: rule.rule_text,
          priority: rule.priority,
          certainty_factor: rule.certainty_factor,
          action_type: rule.consequent.actions.map(a => a.type).join(', ')
        });
      }
    }
    
    return success(res, matchedRules, 'Rules matched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Create new rule (admin only)
 * POST /api/v1/rules
 */
const createRule = async (req, res, next) => {
  try {
    const rule = new Rule(req.body);
    await rule.save();
    return success(res, rule, 'Rule created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Update rule (admin only)
 * PUT /api/v1/rules/:id
 */
const updateRule = async (req, res, next) => {
  try {
    const rule = await Rule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!rule) {
      return error(res, 'Rule not found', 404);
    }
    
    return success(res, rule, 'Rule updated');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete rule (soft delete, admin only)
 * DELETE /api/v1/rules/:id
 */
const deleteRule = async (req, res, next) => {
  try {
    const rule = await Rule.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    
    if (!rule) {
      return error(res, 'Rule not found', 404);
    }
    
    return success(res, null, 'Rule deactivated');
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle rule active status (admin only)
 * PATCH /api/v1/rules/:id/toggle
 */
const toggleRule = async (req, res, next) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
      return error(res, 'Rule not found', 404);
    }
    
    rule.active = !rule.active;
    await rule.save();
    
    return success(res, { active: rule.active }, `Rule ${rule.active ? 'activated' : 'deactivated'}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRules,
  getRuleById,
  getRulesByCategory,
  matchRules,
  createRule,
  updateRule,
  deleteRule,
  toggleRule
};