/**
 * Equipment Model
 * Represents cleaning machines with common attributes.
 * 
 * Classification:
 * - intensity: light (Domestic), medium (Commercial), heavy (Industrial)
 * - domain: domestic, commercial, industrial (usage context)
 * - machine_category: floor_scrubber, vacuum_cleaner, etc.
 * - machine_subtype: Walk-Behind, Rider, Robotic, etc. (brand-specific)
 * 
 * TCO Calculation:
 * - estimated_tco_per_year_ugx = current_price_ugx + estimated_maintenance_cost_per_year_ugx + estimated_running_cost_per_year_ugx
 */

const mongoose = require('mongoose');

// ============================================
// ENUMS
// ============================================

// Machine categories (8 main types)
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

// Intensity levels (usage classification)
const intensityLevels = ['light', 'medium', 'heavy'];

// Domain levels (usage context)
const domainLevels = ['domestic', 'commercial', 'industrial'];

// Environment types (where the machine can be used)
const environmentTypes = [
  'indoor',
  'outdoor',
  'food_grade',
  'hazardous',
  'any'
];

// Intensity labels (user-friendly)
const intensityLabels = {
  light: 'Domestic / Residential',
  medium: 'Commercial / Professional',
  heavy: 'Industrial / Heavy-Duty'
};

// Power sources
const powerSources = [
  'corded_electric',
  'battery',
  'petrol',
  'diesel',
  'manual'
];

// ============================================
// BRAND-SPECIFIC SUB-TYPES
// ============================================

// Kärcher sub-types per category
const karcherSubTypes = {
  floor_scrubber: ['walk_behind', 'rider', 'robotic', 'micro'],
  vacuum_cleaner: ['wet_dry', 'industrial', 'backpack'],
  pressure_washer: ['electric', 'hot_water', 'petrol'],
  carpet_cleaner: ['portable', 'walk_behind'],
  sweeper: ['walk_behind', 'rider', 'compact'],
  scrubber_drier: ['walk_behind', 'rider', 'compact'],
  steam_cleaner: ['portable', 'continuous_fill'],
  window_cleaner: ['water_fed_pole', 'robotic']
};

// Nilfisk sub-types per category
const nilfiskSubTypes = {
  floor_scrubber: ['walk_behind', 'rider', 'compact'],
  vacuum_cleaner: ['industrial', 'wet_dry', 'backpack'],
  pressure_washer: ['electric', 'hot_water', 'petrol'],
  carpet_cleaner: ['portable', 'walk_behind'],
  sweeper: ['walk_behind', 'rider'],
  scrubber_drier: ['walk_behind', 'rider'],
  steam_cleaner: ['steam'],
  window_cleaner: ['water_fed_pole']
};

// Numatic sub-types per category
const numaticSubTypes = {
  floor_scrubber: ['walk_behind'],
  vacuum_cleaner: ['wet_dry', 'industrial'],
  pressure_washer: ['electric'],
  carpet_cleaner: ['portable', 'walk_behind'],
  sweeper: ['walk_behind'],
  scrubber_drier: ['walk_behind'],
  steam_cleaner: [],
  window_cleaner: []
};

// ============================================
// SCHEMA DEFINITION
// ============================================

const equipmentSchema = new mongoose.Schema({
  equipment_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    unique: true
  },
  
  // ----- Basic Identification -----
  brand_name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: 100,
    enum: ['Kärcher', 'Nilfisk', 'Numatic']
  },
  model_name: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true,
    maxlength: 100
  },
  
  // ----- Classification -----
  machine_category: {
    type: String,
    required: [true, 'Machine category is required'],
    enum: machineCategories
  },
  machine_subtype: {
    type: String,
    required: [true, 'Machine sub-type is required'],
    trim: true,
    description: 'Brand-specific sub-type (e.g., walk_behind, rider, robotic)'
  },
  intensity: {
    type: String,
    enum: intensityLevels,
    required: [true, 'Intensity (light/medium/heavy) is required'],
    description: 'light=Domestic, medium=Commercial, heavy=Industrial'
  },
  domain: {
    type: String,
    enum: domainLevels,
    required: [true, 'Domain (domestic/commercial/industrial) is required'],
    default: 'commercial',
    description: 'Usage domain: domestic, commercial, or industrial'
  },
  
  // ===== NEW FIELDS FOR ENHANCED FILTERING =====
  environment: {
    type: String,
    enum: environmentTypes,
    default: 'any',
    description: 'Where the machine can be used (indoor, outdoor, food_grade, hazardous, any)'
  },
  min_aisle_width_mm: {
    type: Number,
    min: 0,
    default: 0,
    description: 'Minimum aisle width required in millimeters'
  },
  
  // ----- Physical Specifications -----
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
  
  // ----- Power & Motor Specifications (for TCO calculation) -----
  power_req: {
    kW: {
      type: Number,
      min: 0,
      default: 0,
      description: 'Power requirement in kilowatts'
    },
    type: {
      type: String,
      default: 'AC',
      description: 'Power type: AC or DC'
    }
  },
  motor_type: {
    type: String,
    default: null,
    description: 'Motor type: brushed DC, brushless DC, induction, etc.'
  },
  spare_part_lead_time_days: {
    type: Number,
    min: 0,
    default: 14,
    description: 'Expected lead time for spare parts in days'
  },
  
  // ----- Compatibility (JSON arrays for flexibility) -----
  surface_compatibility: {
    type: [String],
    default: [],
    description: 'Array of compatible floor/surface types'
  },
  dirt_compatibility: {
    type: [String],
    default: [],
    description: 'Array of compatible dirt/soil types'
  },
  
  // ----- Cost Fields (for TCO calculation) -----
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
  
  // ----- Media -----
  image_url: {
    type: String,
    default: null,
    trim: true,
    description: 'URL to equipment image (Cloudinary, Imgur, or local upload)'
  },
  
  // ----- Status -----
  in_stock: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.equipment_id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// ============================================
// VIRTUAL FIELDS
// ============================================

/**
 * Virtual field for estimated TCO per year
 * Calculated as: Purchase Price + Maintenance + Running Costs
 */
equipmentSchema.virtual('estimated_tco_per_year_ugx').get(function() {
  const price = this.current_price_ugx || 0;
  const maintenance = this.estimated_maintenance_cost_per_year_ugx || 0;
  const running = this.estimated_running_cost_per_year_ugx || 0;
  return Math.round(price + maintenance + running);
});

/**
 * Virtual for user-friendly intensity label
 */
equipmentSchema.virtual('intensity_label').get(function() {
  return intensityLabels[this.intensity] || this.intensity;
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Validate that machine_subtype is valid for the given brand and category
 */
equipmentSchema.methods.isValidSubtype = function() {
  let validSubtypes = [];
  switch(this.brand_name) {
    case 'Kärcher':
      validSubtypes = karcherSubTypes[this.machine_category] || [];
      break;
    case 'Nilfisk':
      validSubtypes = nilfiskSubTypes[this.machine_category] || [];
      break;
    case 'Numatic':
      validSubtypes = numaticSubTypes[this.machine_category] || [];
      break;
    default:
      return false;
  }
  return validSubtypes.includes(this.machine_subtype);
};

// ============================================
// PRE-SAVE VALIDATION
// ============================================

equipmentSchema.pre('save', function(next) {
  // Validate that machine_subtype is valid for the brand/category
  if (!this.isValidSubtype()) {
    return next(new Error(`Invalid machine_subtype '${this.machine_subtype}' for brand '${this.brand_name}' and category '${this.machine_category}'`));
  }
  next();
});

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get valid sub-types for a given brand and category
 * @param {string} brand - Brand name (Kärcher, Nilfisk, Numatic)
 * @param {string} category - Machine category
 * @returns {Array} Array of valid sub-type strings
 */
equipmentSchema.statics.getValidSubtypes = function(brand, category) {
  switch(brand) {
    case 'Kärcher':
      return karcherSubTypes[category] || [];
    case 'Nilfisk':
      return nilfiskSubTypes[category] || [];
    case 'Numatic':
      return numaticSubTypes[category] || [];
    default:
      return [];
  }
};

// ============================================
// INDEXES
// ============================================

equipmentSchema.index({ brand_name: 1, machine_category: 1, machine_subtype: 1 });
equipmentSchema.index({ intensity: 1 });
equipmentSchema.index({ domain: 1 });
equipmentSchema.index({ environment: 1 });
equipmentSchema.index({ min_aisle_width_mm: 1 });
equipmentSchema.index({ machine_category: 1 });
equipmentSchema.index({ power_source: 1 });
equipmentSchema.index({ current_price_ugx: 1 });
equipmentSchema.index({ active: 1, in_stock: 1 });

// ============================================
// EXPORT
// ============================================

module.exports = {
  Equipment: mongoose.model('Equipment', equipmentSchema),
  // Export enums for use in other files
  machineCategories,
  intensityLevels,
  domainLevels,
  environmentTypes,
  intensityLabels,
  powerSources,
  karcherSubTypes,
  nilfiskSubTypes,
  numaticSubTypes
};