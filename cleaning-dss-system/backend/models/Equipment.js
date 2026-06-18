// backend/models/Equipment.js
const mongoose = require('mongoose');

// ============================================
// ENUMS
// ============================================

const machineCategories = [
  'floor_scrubber',
  'vacuum_cleaner',
  'window_cleaner',
  'pressure_washer',
  'steam_cleaner',
  'carpet_cleaner',
  'sweeper',
  'scrubber_drier',
];

const intensityLevels = ['light', 'medium', 'heavy'];
const domainLevels = ['domestic', 'commercial', 'industrial'];
const environmentTypes = ['indoor', 'outdoor', 'food_grade', 'hazardous', 'any'];
const powerSources = ['corded_electric', 'battery', 'petrol', 'diesel', 'manual'];

const intensityLabels = {
  light: 'Domestic / Residential',
  medium: 'Commercial / Professional',
  heavy: 'Industrial / Heavy-Duty',
};

// ============================================
// BRAND-SPECIFIC SUB-TYPES
// ============================================

const karcherSubTypes = {
  floor_scrubber: ['walk_behind', 'rider', 'robotic', 'micro'],
  vacuum_cleaner: ['wet_dry', 'industrial', 'backpack'],
  pressure_washer: ['electric', 'hot_water', 'petrol'],
  carpet_cleaner: ['portable', 'walk_behind'],
  sweeper: ['walk_behind', 'rider', 'compact'],
  scrubber_drier: ['walk_behind', 'rider', 'compact'],
  steam_cleaner: ['portable', 'continuous_fill'],
  window_cleaner: ['water_fed_pole', 'robotic'],
};

const nilfiskSubTypes = {
  floor_scrubber: ['walk_behind', 'rider', 'compact'],
  vacuum_cleaner: ['industrial', 'wet_dry', 'backpack'],
  pressure_washer: ['electric', 'hot_water', 'petrol'],
  carpet_cleaner: ['portable', 'walk_behind'],
  sweeper: ['walk_behind', 'rider'],
  scrubber_drier: ['walk_behind', 'rider'],
  steam_cleaner: ['steam'],
  window_cleaner: ['water_fed_pole'],
};

const numaticSubTypes = {
  floor_scrubber: ['walk_behind'],
  vacuum_cleaner: ['wet_dry', 'industrial'],
  pressure_washer: ['electric'],
  carpet_cleaner: ['portable', 'walk_behind'],
  sweeper: ['walk_behind'],
  scrubber_drier: ['walk_behind'],
  steam_cleaner: [],
  window_cleaner: [],
};

// ============================================
// SCHEMA DEFINITION
// ============================================

const equipmentSchema = new mongoose.Schema(
  {
    equipment_id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    brand_name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      maxlength: 100,
      enum: ['Kärcher', 'Nilfisk', 'Numatic'],
    },
    model_name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
      maxlength: 100,
    },
    machine_category: {
      type: String,
      required: [true, 'Machine category is required'],
      enum: machineCategories,
    },
    machine_subtype: {
      type: String,
      required: [true, 'Machine sub-type is required'],
      trim: true,
    },
    intensity: {
      type: String,
      enum: intensityLevels,
      required: [true, 'Intensity (light/medium/heavy) is required'],
    },
    domain: {
      type: String,
      enum: domainLevels,
      required: [true, 'Domain (domestic/commercial/industrial) is required'],
      default: 'commercial',
    },
    environment: {
      type: String,
      enum: environmentTypes,
      default: 'any',
    },
    min_aisle_width_mm: {
      type: Number,
      min: 0,
      default: 0,
    },
    weight_kg: {
      type: Number,
      min: 0,
      default: null,
    },
    power_source: {
      type: String,
      required: [true, 'Power source is required'],
      enum: powerSources,
    },
    power_req: {
      kW: { type: Number, min: 0, default: 0 },
      type: { type: String, default: 'AC' },
    },
    motor_type: {
      type: String,
      default: null,
    },
    spare_part_lead_time_days: {
      type: Number,
      min: 0,
      default: 14,
    },
    surface_compatibility: {
      type: [String],
      default: [],
    },
    dirt_compatibility: {
      type: [String],
      default: [],
    },
    current_price_ugx: {
      type: Number,
      min: 0,
      default: null,
    },
    estimated_maintenance_cost_per_year_ugx: {
      type: Number,
      min: 0,
      default: null,
    },
    estimated_running_cost_per_year_ugx: {
      type: Number,
      min: 0,
      default: null,
    },
    image_url: {
      type: String,
      default: null,
      trim: true,
    },
    in_stock: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.equipment_id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ============================================
// VIRTUAL FIELDS
// ============================================

equipmentSchema.virtual('estimated_tco_per_year_ugx').get(function () {
  const price = this.current_price_ugx || 0;
  const maintenance = this.estimated_maintenance_cost_per_year_ugx || 0;
  const running = this.estimated_running_cost_per_year_ugx || 0;
  return Math.round(maintenance + running);
});

// NEW: Operating cost = maintenance + running (excludes purchase price)
equipmentSchema.virtual('estimated_operating_cost_per_year_ugx').get(function () {
  const maintenance = this.estimated_maintenance_cost_per_year_ugx || 0;
  const running = this.estimated_running_cost_per_year_ugx || 0;
  return Math.round(maintenance + running);
});

equipmentSchema.virtual('intensity_label').get(function () {
  return intensityLabels[this.intensity] || this.intensity;
});

// ============================================
// INSTANCE METHODS
// ============================================

equipmentSchema.methods.isValidSubtype = function () {
  let validSubtypes = [];
  switch (this.brand_name) {
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

equipmentSchema.pre('save', function (next) {
  if (!this.isValidSubtype()) {
    return next(
      new Error(
        `Invalid machine_subtype '${this.machine_subtype}' for brand '${this.brand_name}' and category '${this.machine_category}'`
      )
    );
  }
  next();
});

// ============================================
// STATIC METHODS
// ============================================

equipmentSchema.statics.getValidSubtypes = function (brand, category) {
  switch (brand) {
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
  numaticSubTypes,
};