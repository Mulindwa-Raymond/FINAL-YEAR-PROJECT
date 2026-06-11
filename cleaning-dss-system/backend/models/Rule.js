/**
 * Rule Model - KB-DSS Enhanced
 * Stores knowledge-base rules with certainty factors, antecedents, consequents,
 * and explanation templates for full transparency.
 */

const mongoose = require('mongoose');

// Condition operators
const operators = ['EQ', 'NE', 'GT', 'LT', 'GTE', 'LTE', 'IN', 'NOT_IN', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];

// Action types
const actionTypes = [
  'recommend_equipment',
  'recommend_detergent',
  'exclude_equipment',
  'exclude_detergent',
  'add_alert',
  'set_fact',
  'modify_score',
  'stop_processing'
];

const ruleSchema = new mongoose.Schema({
  rule_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // ----- Antecedent (IF part) -----
  antecedent: {
    operator: {
      type: String,
      enum: ['AND', 'OR', 'NOT'],
      default: 'AND'
    },
    conditions: [{
      attribute: {
        type: String,
        required: true
      },
      operator: {
        type: String,
        enum: operators,
        required: true
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      }
    }]
  },
  
  // ----- Consequent (THEN part) -----
  consequent: {
    actions: [{
      type: {
        type: String,
        enum: actionTypes,
        required: true
      },
      target: {
        type: String,
        default: null
      },
      parameters: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    }]
  },
  
  // ----- KB-DSS Specific Fields -----
  certainty_factor: {
    type: Number,
    min: 0,
    max: 1,
    default: 1.0,
    description: 'Confidence in this rule (1 = absolute certainty)'
  },
  
  explanation_template: {
    type: String,
    default: null,
    description: 'Human-readable explanation template with placeholders'
  },
  
  priority: {
    type: Number,
    min: 1,
    max: 100,
    default: 50,
    description: 'Higher priority rules fire first'
  },
  
  salience: {
    type: Number,
    default: 0,
    description: 'For conflict resolution (higher = more important)'
  },
  
  // ----- Metadata -----
  category: {
    type: String,
    enum: ['equipment', 'detergent', 'compatibility', 'safety', 'cost', 'environmental'],
    required: true
  },
  
  active: {
    type: Boolean,
    default: true
  },
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  created_at: {
    type: Date,
    default: Date.now
  },
  
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update updated_at on save
ruleSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Indexes
ruleSchema.index({ category: 1, active: 1 });
ruleSchema.index({ priority: -1, salience: -1 });
ruleSchema.index({ 'antecedent.conditions.attribute': 1 });

module.exports = {
  Rule: mongoose.model('Rule', ruleSchema),
  // Export enums for use in other files
  operators,
  actionTypes
}; 