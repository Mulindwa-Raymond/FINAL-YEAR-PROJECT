/**
 * constants.js
 * Central location for all enumerations, static lists, and configuration constants.
 * Used across both admin and user portals, and backend validation.
 */

// ============================================
// EQUIPMENT CONSTANTS
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

// User-friendly category labels
const machineCategoryLabels = {
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
const intensityLevels = ['light', 'medium', 'heavy'];

// User-friendly intensity labels
const intensityLabels = {
  light: 'Domestic / Residential',
  medium: 'Commercial / Professional',
  heavy: 'Industrial / Heavy-Duty'
};

// Intensity descriptions for tooltips
const intensityDescriptions = {
  light: 'For occasional use (weekly or less). Ideal for homes and small apartments.',
  medium: 'For regular use (2-6 hours/day). Ideal for offices, hotels, and restaurants.',
  heavy: 'For continuous use (>6 hours/day). Ideal for factories, warehouses, and construction sites.'
};

// Power sources
const powerSources = [
  'corded_electric',
  'battery',
  'petrol',
  'diesel',
  'manual'
];

// User-friendly power source labels
const powerSourceLabels = {
  corded_electric: 'Corded Electric',
  battery: 'Battery Powered',
  petrol: 'Petrol Engine',
  diesel: 'Diesel Engine',
  manual: 'Manual'
};

// Equipment brands
const equipmentBrands = ['Kärcher', 'Nilfisk', 'Numatic'];

// ============================================
// BRAND-SPECIFIC SUB-TYPES
// ============================================

// Kärcher sub-types with user-friendly labels
const karcherSubTypes = {
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
const nilfiskSubTypes = {
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
const numaticSubTypes = {
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

// Helper function to get valid sub-types for a brand and category
const getValidSubtypes = (brand, category) => {
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

// Helper function to get sub-type label
const getSubtypeLabel = (brand, category, subtype) => {
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

const detergentForms = ['liquid', 'powder', 'tablet', 'gel', 'foam'];
const detergentCategories = [
  'alkaline',
  'acidic',
  'neutral',
  'solvent_based',
  'enzymatic',
  'disinfectant',
  'degreaser'
];
const detergentBrands = ['Kärcher', 'Nilfisk', 'Numatic', 'Diversey', '3M', 'Ecolab', 'Tennant'];

// ============================================
// SURFACE & DIRT TYPES
// ============================================

const surfaceTypes = [
  'tile',
  'concrete',
  'vinyl',
  'wood',
  'marble',
  'carpet',
  'glass',
  'stainless_steel'
];

const dirtTypes = [
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

const actionTypes = [
  'recommend_equipment',
  'recommend_detergent',
  'recommend_both',
  'flag_alert',
  'exclude_equipment',
  'exclude_detergent'
];

const ruleCategories = ['equipment', 'detergent', 'compatibility', 'safety', 'cost', 'environmental'];

// ============================================
// USER CONSTANTS
// ============================================

const userRoles = {
  STANDARD: 'standard',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// ============================================
// RECOMMENDATION CONSTANTS
// ============================================

const powerStabilities = ['stable', 'unstable'];
const cleaningFrequencies = ['daily', 'weekly', 'monthly'];

// ============================================
// PAGINATION & UPLOAD CONSTANTS
// ============================================

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;
const MAX_UPLOAD_SIZE_MB = 10;
const ALLOWED_UPLOAD_FORMATS = ['csv', 'json'];
const ALLOWED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
const MAX_IMAGE_SIZE_MB = 5;

// ============================================
// RECOMMENDATION LIMITS
// ============================================

const MAX_RECOMMENDATIONS = 3;
const DEFAULT_USAGE_HOURS_PER_YEAR = 2000;

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Equipment
  machineCategories,
  machineCategoryLabels,
  intensityLevels,
  intensityLabels,
  intensityDescriptions,
  powerSources,
  powerSourceLabels,
  equipmentBrands,
  
  // Sub-types
  karcherSubTypes,
  nilfiskSubTypes,
  numaticSubTypes,
  getValidSubtypes,
  getSubtypeLabel,
  
  // Detergent
  detergentForms,
  detergentCategories,
  detergentBrands,
  
  // Surface & Dirt
  surfaceTypes,
  dirtTypes,
  
  // Rules
  actionTypes,
  ruleCategories,
  
  // User
  userRoles,
  
  // Recommendation
  powerStabilities,
  cleaningFrequencies,
  
  // Pagination & Upload
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE,
  MAX_UPLOAD_SIZE_MB,
  ALLOWED_UPLOAD_FORMATS,
  ALLOWED_IMAGE_FORMATS,
  MAX_IMAGE_SIZE_MB,
  
  // Limits
  MAX_RECOMMENDATIONS,
  DEFAULT_USAGE_HOURS_PER_YEAR
};