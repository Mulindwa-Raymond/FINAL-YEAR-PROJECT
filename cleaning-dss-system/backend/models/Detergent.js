/**
 * Detergent Model
 * Represents cleaning chemical products.
 * Updated to include image_url for product images.
 */

const mongoose = require('mongoose');

// Detergent form enum
const detergentForms = [
  'liquid',
  'powder',
  'tablet',
  'gel',
  'foam'
];

// Detergent category enum
const detergentCategories = [
  'alkaline',
  'acidic',
  'neutral',
  'solvent_based',
  'enzymatic',
  'disinfectant',
  'degreaser'
];

const detergentSchema = new mongoose.Schema({
  detergent_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  product_name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  brand_name: {
    type: String,
    trim: true,
    maxlength: 100,
    default: null
  },
  form: {
    type: String,
    required: [true, 'Form is required'],
    enum: detergentForms
  },
  detergent_category: {
    type: String,
    required: [true, 'Detergent category is required'],
    enum: detergentCategories
  },
  ph_value: {
    type: Number,
    required: [true, 'pH value is required'],
    min: 0,
    max: 14
  },
  unit_size: {
    type: Number,
    required: [true, 'Unit size is required'],
    min: 0
  },
  surface_compatibility: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  dirt_compatibility: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  current_price_ugx: {
    type: Number,
    min: 0,
    default: null
  },
  dilution_ratio: {
    type: String,
    trim: true,
    maxlength: 20,
    default: null
  },
  requires_ppe: {
    type: Boolean,
    default: true
  },
  // NEW: Image URL field
  image_url: {
    type: String,
    default: null,
    trim: true,
    description: 'URL to detergent product image (Cloudinary, Imgur, or local upload)'
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.detergent_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
detergentSchema.index({ detergent_category: 1 });
detergentSchema.index({ ph_value: 1 });
detergentSchema.index({ product_name: 1 });
detergentSchema.index({ requires_ppe: 1 });

module.exports = mongoose.model('Detergent', detergentSchema);