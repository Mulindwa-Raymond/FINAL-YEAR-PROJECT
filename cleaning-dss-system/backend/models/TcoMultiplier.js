/**
 * TcoMultiplier Model
 * Holds local economic factors for TCO calculation:
 * - Electricity rate (UGX/kWh)
 * - Import duty rate (%)
 * - Spare part lead time risk factors
 * - Annual maintenance percentage
 */

const mongoose = require('mongoose');

const tcoMultiplierSchema = new mongoose.Schema({
  local_electricity_rate_ugx_per_kwh: {
    type: Number,
    required: [true, 'Electricity rate is required'],
    min: 0
  },
  duty_rate_percent: {
    type: Number,
    required: [true, 'Duty rate percentage is required'],
    min: 0,
    max: 1
  },
  spare_part_lead_time_risk: {
    less_than_7d: { type: Number, default: 0.8 },
    between_7_21d: { type: Number, default: 1.0 },
    greater_than_21d: { type: Number, default: 1.5 }
  },
  annual_maintenance_cost_percent: {
    type: Number,
    default: 0.05,
    min: 0,
    max: 1
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Only one document should exist (singleton)
tcoMultiplierSchema.statics.getDefault = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      local_electricity_rate_ugx_per_kwh: 780,
      duty_rate_percent: 0.22,
      spare_part_lead_time_risk: { less_than_7d: 0.8, between_7_21d: 1.0, greater_than_21d: 1.5 },
      annual_maintenance_cost_percent: 0.05
    });
  }
  return doc;
};

module.exports = mongoose.model('TcoMultiplier', tcoMultiplierSchema);