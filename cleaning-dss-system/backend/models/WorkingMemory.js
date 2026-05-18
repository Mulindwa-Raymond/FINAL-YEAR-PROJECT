/**
 * WorkingMemory Model
 * Stores temporary facts during inference engine execution.
 * Each recommendation session gets its own working memory instance.
 */

const mongoose = require('mongoose');

const factSchema = new mongoose.Schema({
  attribute: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  certainty: {
    type: Number,
    min: 0,
    max: 1,
    default: 1.0
  },
  source: {
    type: String,
    enum: ['user_input', 'database', 'rule_inference', 'default'],
    default: 'user_input'
  },
  rule_id: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const conflictSchema = new mongoose.Schema({
  rule_id: {
    type: String,
    required: true
  },
  resolved_by: {
    type: String,
    default: null
  },
  resolution_method: {
    type: String,
    enum: ['priority', 'specificity', 'recency', 'manual'],
    default: 'priority'
  }
});

const workingMemorySchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Initial facts from user input
  initial_facts: [factSchema],
  
  // Derived facts during inference
  derived_facts: [factSchema],
  
  // Rules that fired during this session
  fired_rules: [{
    rule_id: String,
    rule_text: String,
    certainty: Number,
    explanation: String,
    timestamp: Date
  }],
  
  // Conflict resolution log
  conflicts: [conflictSchema],
  
  // Final recommendations
  recommendations: {
    equipment_ids: [mongoose.Schema.Types.ObjectId],
    detergent_ids: [mongoose.Schema.Types.ObjectId],
    alerts: [String],
    scores: mongoose.Schema.Types.Mixed
  },
  
  // Session status
  status: {
    type: String,
    enum: ['initialized', 'matching', 'firing', 'conflict_resolution', 'completed', 'failed'],
    default: 'initialized'
  },
  
  started_at: {
    type: Date,
    default: Date.now
  },
  
  completed_at: {
    type: Date,
    default: null
  }
});

// Indexes
workingMemorySchema.index({ session_id: 1 });
workingMemorySchema.index({ user_id: 1, started_at: -1 });
workingMemorySchema.index({ status: 1 });

module.exports = mongoose.model('WorkingMemory', workingMemorySchema);