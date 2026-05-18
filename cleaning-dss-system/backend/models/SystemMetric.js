/**
 * SystemMetric Model
 * Collects daily statistics about system usage:
 * - Number of recommendation requests
 * - Average response time
 * - Most used categories and intensities
 * - Active users count
 */

const mongoose = require('mongoose');

const systemMetricSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    default: () => new Date().setHours(0, 0, 0, 0)
  },
  totalRecommendations: {
    type: Number,
    default: 0,
    min: 0
  },
  averageResponseTimeMs: {
    type: Number,
    default: 0,
    min: 0
  },
  topCategories: [{
    category: {
      type: String,
      enum: [
        'floor_scrubber_industrial', 'floor_scrubber_domestic',
        'carpet_extractor_industrial', 'carpet_extractor_domestic',
        'wet_dry_vac_industrial', 'wet_dry_vac_domestic',
        'pressure_washer_industrial', 'pressure_washer_domestic',
        'sweeper_industrial'
      ]
    },
    count: { type: Number, default: 0 }
  }],
  topIntensities: [{
    intensity: { type: String, enum: ['light', 'medium', 'heavy'] },
    count: { type: Number, default: 0 }
  }],
  activeUsers: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Static method to increment daily count
systemMetricSchema.statics.incrementRecommendations = async function(increment = 1) {
  const today = new Date().setHours(0, 0, 0, 0);
  return this.findOneAndUpdate(
    { date: today },
    { $inc: { totalRecommendations: increment } },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('SystemMetric', systemMetricSchema);