/**
 * Detergent Model
 * Represents cleaning chemical products.
 * All fields required by frontend and inference engine are present.
 */

const mongoose = require('mongoose');

// Enums (exported separately for other files)
const detergentForms = ['liquid', 'powder', 'tablet', 'gel', 'foam'];
const detergentCategories = [
  'alkaline', 'acidic', 'neutral', 'solvent_based',
  'enzymatic', 'disinfectant', 'degreaser'
];
const intensityLevels = ['light', 'medium', 'heavy'];
const detergentDomains = ['domestic', 'industrial', 'both'];

const detergentSchema = new mongoose.Schema(
  {
    detergent_id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    product_name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 100,
    },
    brand_name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    form: {
      type: String,
      required: [true, 'Form is required'],
      enum: detergentForms,
    },
    detergent_category: {
      type: String,
      required: [true, 'Detergent category is required'],
      enum: detergentCategories,
    },
    intensity: {
      type: String,
      enum: intensityLevels,
      required: [true, 'Intensity (light/medium/heavy) is required'],
      default: 'medium',
    },
    domain: {
      type: String,
      enum: detergentDomains,
      required: [true, 'Domain (domestic/industrial/both) is required'],
      default: 'both',
    },
    ph_value: {
      type: Number,
      required: [true, 'pH value is required'],
      min: 0,
      max: 14,
    },
    unit_size: {
      type: Number,
      required: [true, 'Unit size is required'],
      min: 0,
    },
    surface_compatibility: { type: [String], default: [] },
    dirt_compatibility: { type: [String], default: [] },
    current_price_ugx: { type: Number, min: 0, default: null },
    dilution_ratio: { type: String, trim: true, maxlength: 20, default: null },
    requires_ppe: { type: Boolean, default: true },
    eco_certified: { type: Boolean, default: false },
    biodegradable: { type: Boolean, default: false },
    hazard_alerts: { type: [String], default: [] },
    local_supplier: { type: String, default: null },
    image_url: { type: String, default: null, trim: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.detergent_id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

detergentSchema.index({ detergent_category: 1 });
detergentSchema.index({ intensity: 1 });
detergentSchema.index({ domain: 1 });

module.exports = {
  Detergent: mongoose.model('Detergent', detergentSchema),
  // Export enums for use in other files
  detergentForms,
  detergentCategories,
  intensityLevels,
  detergentDomains
};