/**
 * InferenceEngine Service
 * Implements forward chaining inference engine for KB-DSS.
 * Features:
 * - Pattern matching (Rete-inspired)
 * - Conflict resolution (priority + salience + recency)
 * - Certainty factor propagation
 * - Explanation generation
 * - Working memory management
 * - Category-specific filtering
 */

const { Rule } = require('../models/Rule');
const WorkingMemory = require('../models/WorkingMemory');
const { Equipment } = require('../models/Equipment');

class InferenceEngine {
  constructor(sessionId = null) {
    this.rules = [];
    this.agenda = [];        // Rules ready to fire
    this.firedRules = new Set();
    this.sessionId = sessionId;
    this.workingMemory = null;
    this.explanations = [];
    this.equipmentCache = new Map(); // Cache for equipment lookups
  }

  /**
   * Initialize engine with user input
   */
  async initialize(userId, userInput, sessionId = null) {
    // Load active rules from database
    this.rules = await Rule.find({ active: true }).sort({ priority: -1, salience: -1 });
    
    // Create or load working memory
    if (sessionId) {
      this.workingMemory = await WorkingMemory.findOne({ session_id: sessionId });
      if (!this.workingMemory) {
        throw new Error(`Working memory session ${sessionId} not found`);
      }
    } else {
      this.workingMemory = new WorkingMemory({
        user_id: userId,
        initial_facts: this._convertInputToFacts(userInput),
        status: 'initialized'
      });
      await this.workingMemory.save();
    }
    
    this.sessionId = this.workingMemory.session_id;
    
    return this.workingMemory;
  }

  /**
   * Convert user input to facts
   */
  _convertInputToFacts(userInput) {
    const facts = [];
    for (const [key, value] of Object.entries(userInput)) {
      if (value !== undefined && value !== null && value !== '') {
        facts.push({
          attribute: key,
          value: value,
          certainty: 1.0,
          source: 'user_input'
        });
      }
    }
    return facts;
  }

  /**
   * Get all current facts (initial + derived)
   */
  getAllFacts() {
    const initial = this.workingMemory.initial_facts || [];
    const derived = this.workingMemory.derived_facts || [];
    return [...initial, ...derived];
  }

  /**
   * Get fact by attribute name
   */
  getFact(attribute) {
    const facts = this.getAllFacts();
    return facts.find(f => f.attribute === attribute);
  }

  /**
   * Evaluate a condition against current facts
   */
  evaluateCondition(condition, facts) {
    const fact = facts.find(f => f.attribute === condition.attribute);
    if (!fact) return false;
    
    const factValue = fact.value;
    const expectedValue = condition.value;
    const operator = condition.operator;
    
    switch (operator) {
      case 'EQ': return factValue === expectedValue;
      case 'NE': return factValue !== expectedValue;
      case 'GT': return factValue > expectedValue;
      case 'LT': return factValue < expectedValue;
      case 'GTE': return factValue >= expectedValue;
      case 'LTE': return factValue <= expectedValue;
      case 'IN': return Array.isArray(expectedValue) && expectedValue.includes(factValue);
      case 'NOT_IN': return Array.isArray(expectedValue) && !expectedValue.includes(factValue);
      case 'CONTAINS': 
        return Array.isArray(factValue) && factValue.includes(expectedValue);
      case 'STARTS_WITH':
        return typeof factValue === 'string' && factValue.startsWith(expectedValue);
      case 'ENDS_WITH':
        return typeof factValue === 'string' && factValue.endsWith(expectedValue);
      default: return false;
    }
  }

  /**
   * Evaluate a rule's antecedent against current facts
   */
  evaluateAntecedent(antecedent, facts) {
    if (!antecedent.conditions || antecedent.conditions.length === 0) {
      return true; // No conditions = always true
    }
    
    const results = antecedent.conditions.map(cond => this.evaluateCondition(cond, facts));
    
    switch (antecedent.operator) {
      case 'AND': return results.every(r => r === true);
      case 'OR': return results.some(r => r === true);
      case 'NOT': return !results.some(r => r === true);
      default: return results.every(r => r === true);
    }
  }

  /**
   * Match phase: find all rules whose antecedents match current facts
   */
  match() {
    const facts = this.getAllFacts();
    const newMatches = [];
    
    for (const rule of this.rules) {
      // Skip already fired rules
      if (this.firedRules.has(rule.rule_id)) continue;
      
      const matches = this.evaluateAntecedent(rule.antecedent, facts);
      if (matches) {
        newMatches.push(rule);
      }
    }
    
    // Add to agenda (avoid duplicates)
    for (const rule of newMatches) {
      if (!this.agenda.find(r => r.rule_id === rule.rule_id)) {
        this.agenda.push(rule);
      }
    }
    
    // Sort agenda by priority and salience
    this.agenda.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      if (a.salience !== b.salience) return b.salience - a.salience;
      return 0;
    });
  }

  /**
   * Execute a rule's consequent actions
   */
  async executeRule(rule, stepNumber) {
    const facts = this.getAllFacts();
    const explanation = this._generateExplanation(rule, facts);
    
    // Track fired rule
    this.firedRules.add(rule.rule_id);
    this.workingMemory.fired_rules.push({
      rule_id: rule.rule_id,
      rule_text: rule.rule_text || rule.explanation_template,
      certainty: rule.certainty_factor,
      explanation: explanation,
      timestamp: new Date()
    });
    
    // Execute each action
    for (const action of rule.consequent.actions) {
      await this._executeAction(action, rule, stepNumber);
    }
    
    // Add to reasoning trace
    this.explanations.push({
      step_number: stepNumber,
      rule_id: rule.rule_id,
      rule_text: rule.rule_text || rule.explanation_template,
      matched_conditions: rule.antecedent.conditions.map(cond => ({
        condition: `${cond.attribute} ${cond.operator} ${JSON.stringify(cond.value)}`,
        value: facts.find(f => f.attribute === cond.attribute)?.value,
        matched: true
      })),
      action_taken: rule.consequent.actions.map(a => a.type).join(', '),
      explanation: explanation,
      certainty: rule.certainty_factor
    });
  }

  /**
   * Generate human-readable explanation for a rule
   */
  _generateExplanation(rule, facts) {
    if (rule.explanation_template) {
      // Replace placeholders with actual values
      let explanation = rule.explanation_template;
      for (const cond of rule.antecedent.conditions) {
        const fact = facts.find(f => f.attribute === cond.attribute);
        if (fact) {
          explanation = explanation.replace(`{${cond.attribute}}`, fact.value);
        }
      }
      return explanation;
    }
    
    // Default explanation
    const conditions = rule.antecedent.conditions.map(cond => {
      const fact = facts.find(f => f.attribute === cond.attribute);
      return `${cond.attribute} = ${fact?.value || cond.value}`;
    }).join(` ${rule.antecedent.operator} `);
    
    const actions = rule.consequent.actions.map(a => a.type.replace(/_/g, ' ')).join(' and ');
    
    return `Because ${conditions}, we ${actions}.`;
  }

  /**
   * Execute a single action
   */
  async _executeAction(action, rule, stepNumber) {
    switch (action.type) {
      case 'recommend_equipment':
        // Add to working memory
        if (action.target && !this.workingMemory.recommendations.equipment_ids.includes(action.target)) {
          this.workingMemory.recommendations.equipment_ids.push(action.target);
        }
        // Add derived fact
        this.workingMemory.derived_facts.push({
          attribute: 'recommended_equipment',
          value: action.target,
          certainty: rule.certainty_factor,
          source: 'rule_inference',
          rule_id: rule.rule_id,
          timestamp: new Date()
        });
        break;
        
      case 'recommend_detergent':
        if (action.target && !this.workingMemory.recommendations.detergent_ids.includes(action.target)) {
          this.workingMemory.recommendations.detergent_ids.push(action.target);
        }
        this.workingMemory.derived_facts.push({
          attribute: 'recommended_detergent',
          value: action.target,
          certainty: rule.certainty_factor,
          source: 'rule_inference',
          rule_id: rule.rule_id,
          timestamp: new Date()
        });
        break;
        
      case 'add_alert':
        this.workingMemory.recommendations.alerts.push(action.parameters.message || 'Alert triggered');
        break;
        
      case 'set_fact':
        this.workingMemory.derived_facts.push({
          attribute: action.parameters.attribute,
          value: action.parameters.value,
          certainty: rule.certainty_factor * (action.parameters.certainty || 1),
          source: 'rule_inference',
          rule_id: rule.rule_id,
          timestamp: new Date()
        });
        break;
        
      case 'modify_score':
        if (!this.workingMemory.recommendations.scores) {
          this.workingMemory.recommendations.scores = {};
        }
        const currentScore = this.workingMemory.recommendations.scores[action.target] || 0;
        this.workingMemory.recommendations.scores[action.target] = currentScore + (action.parameters.factor || 0);
        break;
        
      case 'exclude_equipment':
      case 'exclude_detergent':
        this.workingMemory.derived_facts.push({
          attribute: action.type === 'exclude_equipment' ? 'excluded_equipment' : 'excluded_detergent',
          value: action.target,
          certainty: rule.certainty_factor,
          source: 'rule_inference',
          rule_id: rule.rule_id,
          timestamp: new Date()
        });
        break;
        
      case 'stop_processing':
        this.workingMemory.status = 'completed';
        break;
    }
    
    await this.workingMemory.save();
  }

  /**
   * Conflict resolution: handle conflicts when multiple rules are applicable
   */
  async resolveConflicts() {
    // Group agenda by what they recommend/exclude
    const conflicts = [];
    const recommendations = new Map();
    
    for (const rule of this.agenda) {
      for (const action of rule.consequent.actions) {
        if (action.type === 'recommend_equipment' && action.target) {
          if (!recommendations.has(action.target)) {
            recommendations.set(action.target, []);
          }
          recommendations.get(action.target).push(rule);
        }
      }
    }
    
    // Check for conflicts (multiple rules recommending the same thing)
    for (const [target, rules] of recommendations) {
      if (rules.length > 1) {
        // Conflict: multiple rules want to recommend the same thing
        // Resolve by highest priority
        const bestRule = rules.sort((a, b) => b.priority - a.priority)[0];
        conflicts.push({
          rule_id: bestRule.rule_id,
          resolved_by: bestRule.rule_id,
          resolution_method: 'priority'
        });
        
        // Remove other rules from agenda
        this.agenda = this.agenda.filter(r => r.rule_id === bestRule.rule_id || !rules.includes(r));
      }
    }
    
    this.workingMemory.conflicts = conflicts;
    await this.workingMemory.save();
  }

  /**
   * Select next rule to fire (conflict resolution already handled)
   */
  select() {
    if (this.agenda.length === 0) return null;
    return this.agenda.shift(); // Already sorted by priority
  }

  /**
   * Get category from user input
   */
  getTargetCategory() {
    const facts = this.getAllFacts();
    const categoryFact = facts.find(f => f.attribute === 'machine_category');
    return categoryFact?.value;
  }

  /**
   * Run the inference engine (forward chaining)
   */
  async run(maxIterations = 100) {
    this.workingMemory.status = 'matching';
    await this.workingMemory.save();
    
    let iteration = 0;
    let ruleFired = true;
    
    while (ruleFired && iteration < maxIterations) {
      iteration++;
      
      // Match phase
      this.match();
      
      // Conflict resolution
      await this.resolveConflicts();
      
      // Select phase
      const rule = this.select();
      
      if (!rule) {
        ruleFired = false;
        break;
      }
      
      // Act phase
      this.workingMemory.status = 'firing';
      await this.workingMemory.save();
      
      await this.executeRule(rule, iteration);
      await this.workingMemory.save();
    }
    
    this.workingMemory.status = 'completed';
    this.workingMemory.completed_at = new Date();
    await this.workingMemory.save();
    
    return {
      workingMemory: this.workingMemory,
      reasoningTrace: this.explanations,
      firedRulesCount: this.firedRules.size,
      iterations: iteration
    };
  }

  /**
   * Derive intensity from area_size fact
   */
  _deriveIntensityFromArea(areaSize, category) {
    const area = parseFloat(areaSize) || 0;
    if (category === 'sweeper') {
      if (area > 5000) return 'heavy';
      if (area > 1000) return 'medium';
      return 'light';
    }
    if (category === 'scrubber_drier') {
      if (area > 3000) return 'heavy';
      if (area > 500) return 'medium';
      return 'light';
    }
    if (area > 1500) return 'heavy';
    if (area > 300) return 'medium';
    return 'light';
  }

  /**
   * Generate final recommendations from working memory with category filtering and equipment details.
   * Falls back to direct DB query when rules don't recommend specific equipment IDs.
   */
  async generateRecommendations() {
    const equipmentIds = this.workingMemory.recommendations.equipment_ids || [];
    const detergentIds = this.workingMemory.recommendations.detergent_ids || [];
    const alerts = this.workingMemory.recommendations.alerts || [];
    const scores = this.workingMemory.recommendations.scores || {};
    
    const targetCategory = this.getTargetCategory();
    const facts = this.getAllFacts();
    
    const getValue = (attr) => facts.find(f => f.attribute === attr)?.value;
    const surfaceTypeValue = getValue('surface_type');
    const dirtTypeValue = getValue('dirt_type');
    const areaSize = getValue('area_size');
    const powerSource = getValue('power_source');
    const environment = getValue('environment');
    const domain = getValue('domain');
    const soilLevel = getValue('soil_level');
    const useCase = getValue('use_case');
    
    const surfaceArr = Array.isArray(surfaceTypeValue) ? surfaceTypeValue : (surfaceTypeValue ? [surfaceTypeValue] : []);
    const dirtArr = Array.isArray(dirtTypeValue) ? dirtTypeValue : (dirtTypeValue ? [dirtTypeValue] : []);
    
    console.log(`🎯 Generating recommendations for category: ${targetCategory}`);
    console.log(`📊 Surface: ${surfaceArr.join(',')}, Dirt: ${dirtArr.join(',')}, Area: ${areaSize}`);
    
    let validEquipmentIds = [...equipmentIds];
    
    if (validEquipmentIds.length > 0) {
      const equipmentList = await Equipment.find({ _id: { $in: validEquipmentIds } });
      for (const eq of equipmentList) {
        this.equipmentCache.set(eq._id.toString(), eq);
      }
      if (targetCategory) {
        validEquipmentIds = equipmentList
          .filter(eq => eq.machine_category === targetCategory)
          .map(eq => eq._id.toString());
      }
    }

    if (validEquipmentIds.length === 0) {
      console.log(`🔄 No rules matched equipment — running direct DB query fallback`);
      
      const dbQuery = { active: true, in_stock: true };
      
      if (targetCategory) dbQuery.machine_category = targetCategory;

      let derivedIntensity = null;
      if (useCase === 'domestic') derivedIntensity = 'light';
      else if (useCase === 'commercial') derivedIntensity = 'medium';
      else if (useCase === 'industrial' || useCase === 'food_beverage' || useCase === 'construction' || useCase === 'hazardous') derivedIntensity = 'heavy';
      
      if (!derivedIntensity && areaSize) {
        derivedIntensity = this._deriveIntensityFromArea(areaSize, targetCategory);
      }
      
      if (derivedIntensity) dbQuery.intensity = derivedIntensity;
      
      if (environment && environment !== 'any') dbQuery.environment = { $in: [environment, 'any'] };
      
      if (powerSource && powerSource !== 'any') dbQuery.power_source = powerSource;
      
      let fallbackEquipment = await Equipment.find(dbQuery).limit(30);
      
      if (fallbackEquipment.length === 0 && targetCategory) {
        const relaxed = { active: true, in_stock: true, machine_category: targetCategory };
        fallbackEquipment = await Equipment.find(relaxed).limit(30);
      }
      
      if (fallbackEquipment.length === 0 && targetCategory) {
        fallbackEquipment = await Equipment.find({ machine_category: targetCategory }).limit(30);
      }
      
      for (const eq of fallbackEquipment) {
        const id = eq._id.toString();
        this.equipmentCache.set(id, eq);
        validEquipmentIds.push(id);
      }
      
      console.log(`🔍 DB fallback returned ${validEquipmentIds.length} equipment`);
    }
    
    const scoredEquipment = validEquipmentIds.map(id => ({
      equipment_id: id,
      score: scores[id] || 50
    }));
    
    for (const item of scoredEquipment) {
      const eq = this.equipmentCache.get(item.equipment_id);
      if (!eq) continue;

      for (const sv of surfaceArr) {
        if (eq.surface_compatibility?.includes(sv)) item.score += 15;
      }
      for (const dv of dirtArr) {
        if (eq.dirt_compatibility?.includes(dv)) item.score += 15;
      }
      if (eq.in_stock) item.score += 5;
      
      if (soilLevel === 'light' && eq.intensity === 'light') item.score += 10;
      if (soilLevel === 'medium' && eq.intensity === 'medium') item.score += 10;
      if (soilLevel === 'heavy' && eq.intensity === 'heavy') item.score += 10;
      
      if (domain && eq.domain === domain) item.score += 8;
      if (environment && (eq.environment === environment || eq.environment === 'any')) item.score += 5;
      if (powerSource && eq.power_source === powerSource) item.score += 8;
    }
    
    scoredEquipment.sort((a, b) => b.score - a.score);
    
    const maxScore = scoredEquipment[0]?.score || 100;
    for (const item of scoredEquipment) {
      item.match_score = Math.min(100, Math.round((item.score / Math.max(maxScore, 1)) * 100));
    }
    
    const selectedEquipment = [];
    const brandsSeen = new Set();
    
    for (const item of scoredEquipment) {
      const eq = this.equipmentCache.get(item.equipment_id);
      if (eq && !brandsSeen.has(eq.brand_name)) {
        brandsSeen.add(eq.brand_name);
        selectedEquipment.push(item);
        if (selectedEquipment.length >= 3) break;
      }
    }
    
    if (selectedEquipment.length < 3) {
      for (const item of scoredEquipment) {
        if (!selectedEquipment.find(s => s.equipment_id === item.equipment_id)) {
          selectedEquipment.push(item);
          if (selectedEquipment.length >= 3) break;
        }
      }
    }
    
    let primaryEquipmentTCO = null;
    if (selectedEquipment[0]?.equipment_id) {
      const primaryEq = this.equipmentCache.get(selectedEquipment[0].equipment_id);
      if (primaryEq) primaryEquipmentTCO = primaryEq.estimated_tco_per_year_ugx;
    }
    
    const matchScores = {};
    for (const item of scoredEquipment) {
      matchScores[item.equipment_id] = item.match_score;
    }
    
    console.log(`✅ Final recommendations: ${selectedEquipment.length} equipment selected`);
    
    return {
      primary_equipment_id: selectedEquipment[0]?.equipment_id || null,
      alternative_equipment_ids: selectedEquipment.slice(1).map(e => e.equipment_id),
      primary_detergent_id: detergentIds[0] || null,
      alternative_detergent_ids: detergentIds.slice(1, 3),
      alerts,
      scores: matchScores,
      reasoningTrace: this.explanations,
      tco_primary: primaryEquipmentTCO
    };
  }
}

module.exports = InferenceEngine;