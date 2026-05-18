/**
 * Equipment Model
 * Represents cleaning machines with common attributes.
 * Updated to include image_url for product images.
 */

const mongoose = require('mongoose');

// Machine category enum
const machineCategories = [
  'floor_scrubber',
  'vacuum_cleaner',
  'window_cleaner',
  'pressure_washer',
  'steam_cleaner',
  'carpet_cleaner',
  'sweeper',
  'scrubber_drier'
];

// Power source enum
const powerSources = [
  'corded_electric',
  'battery',
  'petrol',
  'diesel',
  'manual'
];

const equipmentSchema = new mongoose.Schema({
  equipment_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  brand_name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: 100
  },
  model_name: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true,
    maxlength: 100
  },
  machine_category: {
    type: String,
    required: [true, 'Machine category is required'],
    enum: machineCategories
  },
  weight_kg: {
    type: Number,
    min: 0,
    default: null
  },
  power_source: {
    type: String,
    required: [true, 'Power source is required'],
    enum: powerSources
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
  estimated_maintenance_cost_per_year_ugx: {
    type: Number,
    min: 0,
    default: null
  },
  estimated_running_cost_per_year_ugx: {
    type: Number,
    min: 0,
    default: null
  },
  // NEW: Image URL field
  image_url: {
    type: String,
    default: null,
    trim: true,
    description: 'URL to equipment image (Cloudinary, Imgur, or local upload)'
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.equipment_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Virtual for total yearly TCO
equipmentSchema.virtual('estimated_tco_per_year_ugx').get(function() {
  const maintenance = this.estimated_maintenance_cost_per_year_ugx || 0;
  const running = this.estimated_running_cost_per_year_ugx || 0;
  const priceAmortized = this.current_price_ugx ? this.current_price_ugx / 5 : 0;
  return Math.round(priceAmortized + maintenance + running);
});

// Indexes
equipmentSchema.index({ machine_category: 1 });
equipmentSchema.index({ power_source: 1 });
equipmentSchema.index({ brand_name: 1, model_name: 1 });
equipmentSchema.index({ current_price_ugx: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);