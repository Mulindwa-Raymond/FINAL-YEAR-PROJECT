/**
 * constants.js
 * Central location for all enumerations, static lists, and configuration constants.
 * Used across both admin and user portals, and backend validation.
 */

// ============================================
// EQUIPMENT CONSTANTS
// ============================================

// Machine categories (8 main types)
export const machineCategories = [
  'floor_scrubber',
  'vacuum_cleaner',
  'window_cleaner',
  'pressure_washer',
  'steam_cleaner',
  'carpet_cleaner',
  'sweeper',
  'scrubber_drier'
];

// User-friendly category labels
export const machineCategoryLabels = {
  floor_scrubber: 'Floor Scrubbers',
  vacuum_cleaner: 'Vacuum Cleaners',
  window_cleaner: 'Window Cleaners',
  pressure_washer: 'Pressure Washers',
  steam_cleaner: 'Steam Cleaners',
  carpet_cleaner: 'Carpet Cleaners',
  sweeper: 'Sweepers',
  scrubber_drier: 'Scrubber Driers'
};

// Intensity levels
export const intensityLevels = ['light', 'medium', 'heavy'];

// User-friendly intensity labels
export const intensityLabels = {
  light: 'Domestic / Residential',
  medium: 'Commercial / Professional',
  heavy: 'Industrial / Heavy-Duty'
};

// Intensity descriptions for tooltips
export const intensityDescriptions = {
  light: 'For occasional use (weekly or less). Ideal for homes and small apartments.',
  medium: 'For regular use (2-6 hours/day). Ideal for offices, hotels, and restaurants.',
  heavy: 'For continuous use (>6 hours/day). Ideal for factories, warehouses, and construction sites.'
};

// Power sources
export const powerSources = [
  'corded_electric',
  'battery',
  'petrol',
  'diesel',
  'manual'
];

// User-friendly power source labels
export const powerSourceLabels = {
  corded_electric: 'Corded Electric',
  battery: 'Battery Powered',
  petrol: 'Petrol Engine',
  diesel: 'Diesel Engine',
  manual: 'Manual'
};

// Equipment brands
export const equipmentBrands = ['Kärcher', 'Nilfisk', 'Numatic', 'Tennant', 'Hako', 'IPC', 'Fimap'];

// ============================================
// BRAND-SPECIFIC SUB-TYPES
// ============================================

// Kärcher sub-types with user-friendly labels
export const karcherSubTypes = {
  floor_scrubber: {
    values: ['walk_behind', 'rider', 'robotic', 'micro'],
    labels: {
      walk_behind: 'Walk-Behind Scrubber',
      rider: 'Rider Scrubber',
      robotic: 'Robotic Scrubber',
      micro: 'Micro Scrubber'
    }
  },
  vacuum_cleaner: {
    values: ['wet_dry', 'industrial', 'backpack'],
    labels: {
      wet_dry: 'Wet & Dry Vacuum',
      industrial: 'Industrial Vacuum',
      backpack: 'Backpack Vacuum'
    }
  },
  pressure_washer: {
    values: ['electric', 'hot_water', 'petrol'],
    labels: {
      electric: 'Electric Pressure Washer',
      hot_water: 'Hot Water Pressure Washer',
      petrol: 'Petrol Pressure Washer'
    }
  },
  carpet_cleaner: {
    values: ['portable', 'walk_behind'],
    labels: {
      portable: 'Portable Spot Cleaner',
      walk_behind: 'Walk-Behind Extractor'
    }
  },
  sweeper: {
    values: ['walk_behind', 'rider', 'compact'],
    labels: {
      walk_behind: 'Walk-Behind Sweeper',
      rider: 'Rider Sweeper',
      compact: 'Compact Sweeper'
    }
  },
  scrubber_drier: {
    values: ['walk_behind', 'rider', 'compact'],
    labels: {
      walk_behind: 'Walk-Behind Scrubber Drier',
      rider: 'Rider Scrubber Drier',
      compact: 'Compact Scrubber Drier'
    }
  },
  steam_cleaner: {
    values: ['portable', 'continuous_fill'],
    labels: {
      portable: 'Portable Steam Cleaner',
      continuous_fill: 'Continuous Fill Steam Cleaner'
    }
  },
  window_cleaner: {
    values: ['water_fed_pole', 'robotic'],
    labels: {
      water_fed_pole: 'Water-Fed Pole System',
      robotic: 'Robotic Window Cleaner'
    }
  }
};

// Nilfisk sub-types
export const nilfiskSubTypes = {
  floor_scrubber: {
    values: ['walk_behind', 'rider', 'compact'],
    labels: {
      walk_behind: 'Walk-Behind Scrubber',
      rider: 'Rider Scrubber',
      compact: 'Compact Scrubber'
    }
  },
  vacuum_cleaner: {
    values: ['industrial', 'wet_dry', 'backpack'],
    labels: {
      industrial: 'Industrial Vacuum',
      wet_dry: 'Wet & Dry Vacuum',
      backpack: 'Backpack Vacuum'
    }
  },
  pressure_washer: {
    values: ['electric', 'hot_water', 'petrol'],
    labels: {
      electric: 'Electric Pressure Washer',
      hot_water: 'Hot Water Pressure Washer',
      petrol: 'Petrol Pressure Washer'
    }
  },
  carpet_cleaner: {
    values: ['portable', 'walk_behind'],
    labels: {
      portable: 'Portable Spot Cleaner',
      walk_behind: 'Walk-Behind Extractor'
    }
  },
  sweeper: {
    values: ['walk_behind', 'rider'],
    labels: {
      walk_behind: 'Walk-Behind Sweeper',
      rider: 'Rider Sweeper'
    }
  },
  scrubber_drier: {
    values: ['walk_behind', 'rider'],
    labels: {
      walk_behind: 'Walk-Behind Scrubber Drier',
      rider: 'Rider Scrubber Drier'
    }
  },
  steam_cleaner: {
    values: ['steam'],
    labels: {
      steam: 'Steam Cleaner'
    }
  },
  window_cleaner: {
    values: ['water_fed_pole'],
    labels: {
      water_fed_pole: 'Water-Fed Pole System'
    }
  }
};

// Numatic sub-types
export const numaticSubTypes = {
  floor_scrubber: {
    values: ['walk_behind'],
    labels: {
      walk_behind: 'Walk-Behind Scrubber'
    }
  },
  vacuum_cleaner: {
    values: ['wet_dry', 'industrial'],
    labels: {
      wet_dry: 'Wet & Dry Vacuum',
      industrial: 'Industrial Vacuum'
    }
  },
  pressure_washer: {
    values: ['electric'],
    labels: {
      electric: 'Electric Pressure Washer'
    }
  },
  carpet_cleaner: {
    values: ['portable', 'walk_behind'],
    labels: {
      portable: 'Portable Spot Cleaner',
      walk_behind: 'Walk-Behind Extractor'
    }
  },
  sweeper: {
    values: ['walk_behind'],
    labels: {
      walk_behind: 'Walk-Behind Sweeper'
    }
  },
  scrubber_drier: {
    values: ['walk_behind'],
    labels: {
      walk_behind: 'Walk-Behind Scrubber Drier'
    }
  },
  steam_cleaner: {
    values: [],
    labels: {}
  },
  window_cleaner: {
    values: [],
    labels: {}
  }
};

/**
 * Helper function to get valid sub-types for a brand and category
 * @param {string} brand - Brand name (Kärcher, Nilfisk, Numatic)
 * @param {string} category - Machine category
 * @returns {Array} Array of valid sub-type strings
 */
export const getValidSubtypes = (brand, category) => {
  switch(brand) {
    case 'Kärcher':
      return karcherSubTypes[category]?.values || [];
    case 'Nilfisk':
      return nilfiskSubTypes[category]?.values || [];
    case 'Numatic':
      return numaticSubTypes[category]?.values || [];
    default:
      return [];
  }
};

/**
 * Helper function to get user-friendly sub-type label
 * @param {string} brand - Brand name
 * @param {string} category - Machine category
 * @param {string} subtype - Sub-type value (e.g., 'walk_behind')
 * @returns {string} Human-readable label
 */
export const getSubtypeLabel = (brand, category, subtype) => {
  let subtypes;
  switch(brand) {
    case 'Kärcher':
      subtypes = karcherSubTypes[category];
      break;
    case 'Nilfisk':
      subtypes = nilfiskSubTypes[category];
      break;
    case 'Numatic':
      subtypes = numaticSubTypes[category];
      break;
    default:
      return subtype;
  }
  return subtypes?.labels?.[subtype] || subtype.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// ============================================
// DETERGENT CONSTANTS
// ============================================

export const detergentForms = ['liquid', 'powder', 'tablet', 'gel', 'foam'];
export const detergentCategories = [
  'alkaline',
  'acidic',
  'neutral',
  'solvent_based',
  'enzymatic',
  'disinfectant',
  'degreaser'
];
export const detergentBrands = ['Kärcher', 'Nilfisk', 'Numatic', 'Diversey', '3M', 'Ecolab', 'Tennant'];

// ============================================
// SURFACE & DIRT TYPES
// ============================================

export const surfaceTypes = [
  'tile',
  'concrete',
  'vinyl',
  'wood',
  'marble',
  'carpet',
  'glass',
  'stainless_steel'
];

export const dirtTypes = [
  'grease',
  'red laterite soil',
  'dust',
  'oil',
  'organic',
  'heavy soil',
  'light dust',
  'spills',
  'lime scale',
  'rust'
];

// ============================================
// RULE CONSTANTS
// ============================================

export const actionTypes = [
  'recommend_equipment',
  'recommend_detergent',
  'recommend_both',
  'flag_alert',
  'exclude_equipment',
  'exclude_detergent'
];

export const ruleCategories = ['equipment', 'detergent', 'compatibility', 'safety', 'cost', 'environmental'];

// ============================================
// USER CONSTANTS
// ============================================

export const userRoles = {
  STANDARD: 'standard',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// ============================================
// RECOMMENDATION CONSTANTS
// ============================================

export const powerStabilities = ['stable', 'unstable'];
export const cleaningFrequencies = ['daily', 'weekly', 'monthly'];

// ============================================
// PAGINATION & UPLOAD CONSTANTS
// ============================================

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;
export const MAX_UPLOAD_SIZE_MB = 10;
export const ALLOWED_UPLOAD_FORMATS = ['csv', 'json'];
export const ALLOWED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
export const MAX_IMAGE_SIZE_MB = 5;

// ============================================
// RECOMMENDATION LIMITS
// ============================================

export const MAX_RECOMMENDATIONS = 3;
export const DEFAULT_USAGE_HOURS_PER_YEAR = 2000;

// ============================================
// ENVIRONMENT & FILTRATION CONSTANTS (NEW)
// ============================================

/**
 * Environment types where equipment can be used
 * Used in Equipment model and questionnaire filtering
 */
export const environmentTypes = ['indoor', 'outdoor', 'food_grade', 'hazardous', 'any'];

/**
 * User-friendly environment labels
 */
export const environmentLabels = {
  indoor: 'Indoor Only',
  outdoor: 'Outdoor / Semi-outdoor',
  food_grade: 'Food‑Grade / Wet Area',
  hazardous: 'Hazardous / ATEX Zone',
  any: 'Any Environment'
};

/**
 * Filtration types for vacuums (HEPA levels)
 */
export const filtrationTypes = ['standard', 'HEPA_H13', 'HEPA_H14', 'absolute'];

/**
 * User-friendly filtration labels
 */
export const filtrationLabels = {
  standard: 'Standard Filter',
  HEPA_H13: 'HEPA H13 (Fine dust, allergens)',
  HEPA_H14: 'HEPA H14 (Hazardous dust, asbestos, silica)',
  absolute: 'Absolute Filtration (Pharmaceutical, cleanroom)'
};

/**
 * Brush types for floor scrubbers
 */
export const brushTypes = ['disc', 'cylindrical', 'both'];

/**
 * User-friendly brush type labels
 */
export const brushLabels = {
  disc: 'Disc Brush',
  cylindrical: 'Cylindrical Brush',
  both: 'Both (Interchangeable)'
};

/**
 * Soil levels for cleaning intensity
 */
export const soilLevels = ['light', 'medium', 'heavy'];

/**
 * User-friendly soil level labels
 */
export const soilLevelLabels = {
  light: 'Light dust / dry soil',
  medium: 'Wet / greasy contamination',
  heavy: 'Heavy soiling (industrial, food processing)'
};

/**
 * Noise sensitivity options
 */
export const noiseSensitivity = [
  { value: 'low', label: 'Low (≤60 dB)', description: 'Hospitals, schools, offices, night cleaning' },
  { value: 'medium', label: 'Medium (61–70 dB)', description: 'Commercial spaces, retail, hotels' },
  { value: 'high', label: 'High (71+ dB)', description: 'Warehouses, factories, outdoor areas' }
];

/**
 * Tank capacity categories
 */
export const tankCapacityCategories = {
  small: { min: 0, max: 20, label: 'Small (<20L)' },
  medium: { min: 20, max: 50, label: 'Medium (20–50L)' },
  large: { min: 50, max: Infinity, label: 'Large (>50L)' }
};

// ============================================
// SURFACE TEXTURE TYPES (NEW)
// ============================================

export const surfaceTextureTypes = ['smooth', 'textured', 'sensitive'];

export const surfaceTextureLabels = {
  smooth: 'Smooth (polished concrete, tiles, vinyl)',
  textured: 'Textured / Uneven (exposed aggregate, rough concrete, anti-slip tiles)',
  sensitive: 'Sensitive (wood, coated floors, epoxy)'
};

// ============================================
// USE CASE TYPES (NEW)
// ============================================

export const useCaseTypes = {
  domestic: { label: 'Domestic / Home', icon: '🏠' },
  commercial: { label: 'Commercial / Office', icon: '🏢' },
  industrial: { label: 'Industrial / Warehouse', icon: '🏭' },
  food_beverage: { label: 'Food & Beverage', icon: '🍽️' },
  healthcare: { label: 'Healthcare / Hygiene Critical', icon: '🏥' },
  construction: { label: 'Construction / Demolition', icon: '🚧' },
  hazardous: { label: 'Hazardous / ATEX', icon: '⚠️' }
};

// ============================================
// HELPER FUNCTIONS FOR MAPPING
// ============================================

/**
 * Get user-friendly label for environment type
 * @param {string} environment - Environment value
 * @returns {string} Human-readable label
 */
export const getEnvironmentLabel = (environment) => {
  return environmentLabels[environment] || environment;
};

/**
 * Get user-friendly label for filtration type
 * @param {string} filtration - Filtration value
 * @returns {string} Human-readable label
 */
export const getFiltrationLabel = (filtration) => {
  return filtrationLabels[filtration] || filtration;
};

/**
 * Get user-friendly label for brush type
 * @param {string} brushType - Brush type value
 * @returns {string} Human-readable label
 */
export const getBrushLabel = (brushType) => {
  return brushLabels[brushType] || brushType;
};

/**
 * Get user-friendly label for soil level
 * @param {string} soilLevel - Soil level value
 * @returns {string} Human-readable label
 */
export const getSoilLevelLabel = (soilLevel) => {
  return soilLevelLabels[soilLevel] || soilLevel;
};

/**
 * Map area size to recommended intensity
 * @param {number} areaSize - Area in square meters
 * @returns {string} 'light', 'medium', or 'heavy'
 */
export const mapAreaToIntensity = (areaSize) => {
  if (areaSize > 1500) return 'heavy';
  if (areaSize > 300) return 'medium';
  return 'light';
};

/**
 * Map cleaning frequency to intensity
 * @param {string} frequency - 'daily', 'weekly', 'monthly'
 * @returns {string} 'light', 'medium', or 'heavy'
 */
export const mapFrequencyToIntensity = (frequency) => {
  if (frequency === 'daily') return 'heavy';
  if (frequency === 'weekly') return 'medium';
  return 'light';
};