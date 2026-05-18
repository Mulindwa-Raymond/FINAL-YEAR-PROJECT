/**
 * LocalContext Model
 * Contains contextual information about the operational environment in Uganda.
 * Used by the inference engine to adapt recommendations.
 */

const mongoose = require('mongoose');

const localContextSchema = new mongoose.Schema({
  power_stability_zones: {
    type: Map,
    of: String,   // values: 'stable' or 'unstable'
    description: 'Map of location names to power stability status'
  },
  typical_soil_types: [{
    type: String,
    enum: ['red laterite soil', 'black cotton soil', 'dust', 'sandy soil']
  }],
  average_import_delay_days: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

// Singleton pattern (only one context document)
localContextSchema.statics.getDefault = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      power_stability_zones: new Map([['Kampala', 'unstable'], ['Nakasero', 'stable'], ['Industrial Area', 'unstable']]),
      typical_soil_types: ['red laterite soil', 'black cotton soil', 'dust'],
      average_import_delay_days: 30
    });
  }
  return doc;
};

module.exports = mongoose.model('LocalContext', localContextSchema);