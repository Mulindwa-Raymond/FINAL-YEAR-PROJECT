/**
 * constants.js
 * Central location for all enumerations, static lists, and configuration constants.
 */

// ============================================
// EQUIPMENT CONSTANTS
// ============================================

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

export const powerSources = [
  'corded_electric',
  'battery',
  'petrol',
  'diesel',
  'manual'
];

export const equipmentBrands = ['Kärcher', 'Nilfisk', 'Numatic', 'Tennant', 'Hako', 'IPC', 'Fimap'];

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