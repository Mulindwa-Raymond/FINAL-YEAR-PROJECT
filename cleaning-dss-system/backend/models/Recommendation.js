/**
 * Recommendation Model
 * Logs every user query and system output with full reasoning trace.
 * Updated to include explanation facility and category tracking.
 */

const mongoose = require('mongoose');

const reasoningStepSchema = new mongoose.Schema({
  step_number: {
    type: Number,
    required: true
  },
  rule_id: {
    type: String,
    required: true
  },
  rule_text: {
    type: String,
    required: true
  },
  matched_conditions: [{
    condition: String,
    value: mongoose.Schema.Types.Mixed,
    matched: Boolean
  }],
  action_taken: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  certainty: {
    type: Number,
    min: 0,
    max: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const recommendationSchema = new mongoose.Schema({
  recommendation_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Input facts
  area_size: { type: Number, default: null },
  surface_type: { type: String, default: null },
  dirt_type: { type: String, default: null },
  power_stability: { type: String, default: 'stable' },
  budget_ugx: { type: Number, default: 0 },
  eco_preference: { type: Boolean, default: false },
  
  // Category and brand tracking (NEW)
  machine_category: {
    type: String,
    enum: ['floor_scrubber', 'vacuum_cleaner', 'window_cleaner', 'pressure_washer', 
           'steam_cleaner', 'carpet_cleaner', 'sweeper', 'scrubber_drier'],
    default: null
  },
  machine_subtype: { type: String, default: null },
  brand_name: { type: String, default: null },
  
  // Additional user inputs (NEW)
  usage_hours_per_week: { type: Number, default: 0 },
  noise_sensitive: { type: Boolean, default: false },
  floor_texture: { type: String, default: null },
  environment: { type: String, default: null },
  power_source: { type: String, default: null },
  aisle_width: { type: String, default: null },
  soil_level: { type: String, default: null },
  use_case: { type: String, default: null },
  pressure_required: { type: String, default: null },
  filtration: { type: String, default: null },
  tank_capacity: { type: String, default: null },
  noise_sensitivity: { type: String, default: null },
  
  // Complete reasoning trace (Explanation Facility)
  reasoning_trace: [reasoningStepSchema],
  
  // Working memory session reference
  working_memory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkingMemory'
  },
  
  // Final recommendations
  recommended_equipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  recommended_detergent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Detergent'
  },
  alternative_equipment_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }],
  alternative_detergent_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Detergent'
  }],
  
  // TCO and scoring
  estimated_tco_per_year_ugx: { type: Number, default: null },
  final_score: { type: Number, default: null },
  
  // Alerts with explanations
  alerts_triggered: [{
    message: String,
    explanation: String,
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'warning'
    },
    rule_id: String
  }],
  
  // Summary explanation for user
  summary_explanation: {
    type: String,
    default: null
  },
  
  // Saved by user flag
  saved: {
    type: Boolean,
    default: false
  },
  
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
recommendationSchema.index({ user_id: 1, timestamp: -1 });
recommendationSchema.index({ working_memory_id: 1 });
recommendationSchema.index({ recommended_equipment_id: 1 });
recommendationSchema.index({ recommended_detergent_id: 1 });
recommendationSchema.index({ machine_category: 1 });
recommendationSchema.index({ saved: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);