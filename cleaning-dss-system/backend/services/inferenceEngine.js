/**
 * InferenceEngine Service
 * Implements forward chaining inference engine for KB-DSS.
 * Features:
 * - Pattern matching (Rete-inspired)
 * - Conflict resolution (priority + salience + recency)
 * - Certainty factor propagation
 * - Explanation generation
 * - Working memory management
 */

const Rule = require('../models/Rule');
const WorkingMemory = require('../models/WorkingMemory');

class InferenceEngine {
  constructor(sessionId = null) {
    this.rules = [];
    this.agenda = [];        // Rules ready to fire
    this.firedRules = new Set();
    this.sessionId = sessionId;
    this.workingMemory = null;
    this.explanations = [];
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
        this.workingMemory.recommendations.equipment_ids.push(action.target);
        // Add derived fact
        this.workingMemory.derived_facts.push({
          attribute: 'recommended_equipment',
          value: action.target,
          certainty: rule.certainty_factor,
          source: 'rule_inference',
          rule_id: rule.rule_id
        });
        break;
        
      case 'recommend_detergent':
        this.workingMemory.recommendations.detergent_ids.push(action.target);
        this.workingMemory.derived_facts.push({
          attribute: 'recommended_detergent',
          value: action.target,
          certainty: rule.certainty_factor,
          source: 'rule_inference',
          rule_id: rule.rule_id
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
          rule_id: rule.rule_id
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
          rule_id: rule.rule_id
        });
        break;
        
      case 'stop_processing':
        this.workingMemory.status = 'completed';
        break;
    }
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
    
    // Check for conflicts (multiple rules recommending different things)
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
   * Generate final recommendations from working memory
   */
  generateRecommendations() {
    const equipmentIds = this.workingMemory.recommendations.equipment_ids || [];
    const detergentIds = this.workingMemory.recommendations.detergent_ids || [];
    const alerts = this.workingMemory.recommendations.alerts || [];
    const scores = this.workingMemory.recommendations.scores || {};
    
    // Apply score modifications from working memory
    const scoredEquipment = equipmentIds.map(id => ({
      equipment_id: id,
      score: scores[id] || 0
    }));
    
    scoredEquipment.sort((a, b) => b.score - a.score);
    
    return {
      primary_equipment_id: scoredEquipment[0]?.equipment_id || null,
      alternative_equipment_ids: scoredEquipment.slice(1, 4).map(e => e.equipment_id),
      primary_detergent_id: detergentIds[0] || null,
      alternative_detergent_ids: detergentIds.slice(1, 3),
      alerts,
      reasoningTrace: this.explanations
    };
  }
}

module.exports = InferenceEngine;