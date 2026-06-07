/**
 * categoryQuestions.js
 * Dynamic questionnaire configuration for each machine category.
 * Each category has steps with questions, options, and mapping logic.
 * Based strictly on the requirements document.
 */

// ============================================
// QUESTION TYPES
// ============================================
export const QuestionTypes = {
  RANGE: 'range',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  NUMBER: 'number',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
};

// ============================================
// COMMON OPTIONS
// ============================================

// Floor type options
const floorTypeOptions = [
  { value: 'tile', label: 'Ceramic Tile / Vinyl', icon: '🔲' },
  { value: 'concrete', label: 'Concrete / Industrial Floor', icon: '🏭' },
  { value: 'wood', label: 'Hardwood / Laminate', icon: '🪵' },
  { value: 'carpet', label: 'Textile / Carpet', icon: '🧺' },
  { value: 'marble', label: 'Marble / Natural Stone', icon: '💎' },
];

// Floor texture options
const floorTextureOptions = [
  { value: 'smooth', label: 'Smooth (polished concrete, tiles, vinyl)' },
  { value: 'textured', label: 'Textured / Uneven (exposed aggregate, rough concrete)' },
  { value: 'sensitive', label: 'Sensitive (wood, coated floors, epoxy)' },
];

// Environment options
const environmentOptions = [
  { value: 'indoor', label: 'Indoor Only', icon: '🏠' },
  { value: 'outdoor', label: 'Outdoor / Semi-outdoor', icon: '🌳' },
  { value: 'food_grade', label: 'Food‑Grade / Wet Area', icon: '🍽️' },
  { value: 'hazardous', label: 'Hazardous / ATEX Zone', icon: '⚠️' },
];

// Power source options
const powerSourceOptions = [
  { value: 'battery', label: 'Battery (cordless, flexible)', icon: '🔋' },
  { value: 'corded_electric', label: 'Mains / Electric (corded)', icon: '⚡' },
  { value: 'petrol', label: 'Petrol / LPG (outdoor/heavy duty)', icon: '⛽' },
];

// Soil level options
const soilLevelOptions = [
  { value: 'light', label: 'Light dust / dry soil' },
  { value: 'medium', label: 'Wet / greasy contamination' },
  { value: 'heavy', label: 'Heavy soiling (industrial, food processing)' },
];

// Dirt type options for floor scrubber
const floorScrubberDirtOptions = [
  { value: 'grease', label: 'Grease / Oil', icon: '🛢️' },
  { value: 'red laterite soil', label: 'Red Laterite Soil', icon: '🔴' },
  { value: 'heavy soil', label: 'Heavy Soil / Mud', icon: '🌍' },
  { value: 'dust', label: 'Dust / Light Debris', icon: '💨' },
];

// Use case options for pressure washer
const pressureWasherUseCases = [
  { value: 'domestic', label: 'Domestic / Light Commercial' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial / Heavy Duty' },
  { value: 'food_beverage', label: 'Food & Beverage / Hygiene Critical' },
  { value: 'vehicles', label: 'Vehicles & Equipment Washing' },
];

// Pressure levels
const pressureLevels = [
  { value: 'low', label: 'Low (100–150 bar) – Domestic, vehicles' },
  { value: 'medium', label: 'Medium (150–200 bar) – Commercial, food' },
  { value: 'high', label: 'High (200+ bar) – Industrial, heavy duty' },
];

// Surface types for pressure washer
const pressureWasherSurfaces = [
  { value: 'concrete', label: 'Concrete / brick' },
  { value: 'wood', label: 'Wood / decking' },
  { value: 'vehicles', label: 'Vehicles / equipment' },
  { value: 'tiles', label: 'Tiles / painted walls' },
  { value: 'sensitive', label: 'Sensitive / coated surfaces' },
];

// Dirt types for pressure washer
const pressureWasherDirtOptions = [
  { value: 'light_dust', label: 'Light dust / mud' },
  { value: 'grease', label: 'Grease / oil' },
  { value: 'chewing_gum', label: 'Chewing gum / heavy buildup' },
  { value: 'bio_algae', label: 'Bio / algae / mould' },
  { value: 'food_residue', label: 'Food residue / bacteria' },
];

// Debris types for vacuum cleaner
const vacuumDebrisOptions = [
  { value: 'dry_dust', label: 'Dry dust / light debris' },
  { value: 'wet_spills', label: 'Wet spillages' },
  { value: 'dry_wet', label: 'Dry and wet combined' },
  { value: 'fine_dust', label: 'Fine dust / powder' },
  { value: 'large_particles', label: 'Large particles / rubble' },
  { value: 'hazardous_dust', label: 'Hazardous dust (asbestos, silica)' },
  { value: 'food_waste', label: 'Food waste / organic matter' },
];

// Vacuum surface types
const vacuumSurfaceOptions = [
  { value: 'hard_floor', label: 'Hard floor (tiles, concrete, vinyl)' },
  { value: 'carpet', label: 'Carpet / rugs' },
  { value: 'upholstery', label: 'Upholstery / stairs' },
  { value: 'outdoor', label: 'Outdoor / uneven ground' },
  { value: 'machinery', label: 'Machinery / equipment' },
];

// Filtration options
const filtrationOptions = [
  { value: 'standard', label: 'Standard filter (light commercial)' },
  { value: 'hepa_h13', label: 'HEPA H13 (fine dust, allergens)' },
  { value: 'hepa_h14', label: 'HEPA H14 (hazardous, asbestos, silica)' },
  { value: 'absolute', label: 'Absolute filtration (pharmaceutical, cleanroom)' },
];

// Tank capacity options
const tankCapacityOptions = [
  { value: 'small', label: 'Small (<20L) – Light use, easy to carry' },
  { value: 'medium', label: 'Medium (20–50L) – Commercial' },
  { value: 'large', label: 'Large (>50L) – Industrial, less emptying' },
];

// Noise sensitivity options
const noiseSensitivityOptions = [
  { value: 'low', label: 'Low (≤60 dB) – Hospitals, schools, offices' },
  { value: 'medium', label: 'Medium (61–70 dB) – Commercial spaces' },
  { value: 'high', label: 'High (71+ dB) – Warehouses, factories' },
];

// Sweeper use cases
const sweeperUseCases = [
  { value: 'home', label: 'Home / Garden' },
  { value: 'office', label: 'Office or Shop' },
  { value: 'warehouse', label: 'Warehouse or Factory' },
  { value: 'outdoor', label: 'Outdoor / Car Park / Road' },
  { value: 'construction', label: 'Construction Site' },
];

// Sweeper dirt types
const sweeperDirtOptions = [
  { value: 'dust', label: 'Everyday dust and light dirt' },
  { value: 'sand', label: 'Sand and grit' },
  { value: 'leaves', label: 'Leaves and outdoor debris' },
  { value: 'rubble', label: 'Large debris and rubble' },
  { value: 'fine_powder', label: 'Fine powder or dust' },
  { value: 'mixed', label: 'Mixed / wet and dry' },
];

// Sweeper locations
const sweeperLocations = [
  { value: 'indoor_smooth', label: 'Indoors on smooth floor' },
  { value: 'indoor_rough', label: 'Indoors on rough/uneven floor' },
  { value: 'outdoor_smooth', label: 'Outdoors on smooth surface' },
  { value: 'outdoor_rough', label: 'Outdoors on rough/uneven ground' },
];

// Carpet types
const carpetTypeOptions = [
  { value: 'synthetic', label: 'Synthetic carpet (nylon, polyester)' },
  { value: 'natural', label: 'Natural fibre (wool, sisal, jute)' },
  { value: 'delicate', label: 'Delicate / antique rugs' },
  { value: 'upholstery', label: 'Upholstery / fabric seats' },
];

// Carpet dirt types
const carpetDirtOptions = [
  { value: 'light', label: 'Light dust / everyday soiling' },
  { value: 'heavy', label: 'Heavy soiling / deeply embedded dirt' },
  { value: 'stains', label: 'Stains / spills' },
  { value: 'allergens', label: 'Allergens / sanitising needed' },
  { value: 'greasy', label: 'Greasy / oily soiling' },
];

// Window locations
const windowLocations = [
  { value: 'indoor', label: 'Indoor (office partitions, internal glass)' },
  { value: 'outdoor_ground', label: 'Outdoor ground level' },
  { value: 'outdoor_height', label: 'Outdoor at height (multi-storey)' },
  { value: 'mixed', label: 'Mixed' },
];

// Window soiling types
const windowSoilingOptions = [
  { value: 'dust', label: 'Light dust / fingerprints' },
  { value: 'lime_scale', label: 'Limescale / hard water marks' },
  { value: 'grime', label: 'Grime / pollution buildup' },
];

// ============================================
// CATEGORY: FLOOR SCRUBBER
// ============================================
const floorScrubberQuestions = {
  categoryId: 'floor_scrubber',
  steps: [
    {
      id: 'area_size',
      title: 'Area Size',
      description: 'What is the total cleaning area?',
      type: QuestionTypes.RANGE,
      min: 0,
      max: 5000,
      default: 500,
      unit: 'm²',
      required: true,
      mapping: {
        small: { max: 300, intensity: 'light', description: 'small walk-behind' },
        medium: { min: 300, max: 1500, intensity: 'medium', description: 'walk-behind scrubber dryer' },
        large: { min: 1500, intensity: 'heavy', description: 'ride-on scrubber dryer' }
      }
    },
    {
      id: 'floor_type',
      title: 'Floor Type',
      description: 'What type of floor will you be cleaning?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'smooth', label: 'Hard smooth (concrete, tiles, vinyl, marble)' },
        { value: 'textured', label: 'Textured/uneven (exposed aggregate, rough concrete, anti-slip tiles)' },
        { value: 'sensitive', label: 'Sensitive (wood, coated floors, epoxy)' },
      ],
    },
    {
      id: 'environment',
      title: 'Environment / Location',
      description: 'Where will the machine be used?',
      type: QuestionTypes.SELECT,
      required: true,
      options: environmentOptions,
    },
    {
      id: 'power_source',
      title: 'Power Source',
      description: 'What power source is available?',
      type: QuestionTypes.SELECT,
      required: true,
      options: powerSourceOptions,
    },
    {
      id: 'aisle_width',
      title: 'Aisle Width / Space Constraints',
      description: 'What is the narrowest aisle or passage width?',
      type: QuestionTypes.NUMBER,
      placeholder: 'e.g., 90',
      unit: 'cm',
      min: 0,
      max: 500,
      helpText: 'Narrow aisles suggest smaller walk-behind models'
    },
    {
      id: 'soil_level',
      title: 'Soil / Dirt Level',
      description: 'How dirty is the floor?',
      type: QuestionTypes.SELECT,
      required: true,
      options: soilLevelOptions,
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.area_size > 1500) filters.intensity = 'heavy';
    else if (answers.area_size > 300) filters.intensity = 'medium';
    else filters.intensity = 'light';
    
    if (answers.floor_type === 'smooth') filters.floor_texture = 'smooth';
    if (answers.floor_type === 'textured') filters.floor_texture = 'textured';
    if (answers.floor_type === 'sensitive') filters.floor_texture = 'sensitive';
    
    if (answers.environment) filters.environment = answers.environment;
    if (answers.power_source) filters.power_source = answers.power_source;
    if (answers.aisle_width) filters.min_aisle_width_mm = answers.aisle_width * 10;
    if (answers.soil_level) filters.soil_level = answers.soil_level;
    
    return filters;
  },
};

// ============================================
// CATEGORY: PRESSURE WASHER
// ============================================
const pressureWasherQuestions = {
  categoryId: 'pressure_washer',
  steps: [
    {
      id: 'use_case',
      title: 'Use Case',
      description: 'What is the primary application?',
      type: QuestionTypes.SELECT,
      required: true,
      options: pressureWasherUseCases,
    },
    {
      id: 'pressure_required',
      title: 'Pressure & Flow Rate Required',
      description: 'What pressure level do you need?',
      type: QuestionTypes.SELECT,
      required: true,
      options: pressureLevels,
    },
    {
      id: 'dirt_type',
      title: 'Soil / Dirt Type',
      description: 'What type of dirt/contamination?',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: pressureWasherDirtOptions,
    },
    {
      id: 'surface_type',
      title: 'Surface Type',
      description: 'What surface will you be cleaning?',
      type: QuestionTypes.SELECT,
      required: true,
      options: pressureWasherSurfaces,
    },
    {
      id: 'power_source',
      title: 'Power Source',
      type: QuestionTypes.SELECT,
      required: true,
      options: powerSourceOptions,
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.use_case === 'domestic') {
      filters.domain = 'domestic';
      filters.intensity = 'light';
    } else if (answers.use_case === 'commercial') {
      filters.domain = 'commercial';
      filters.intensity = 'medium';
    } else {
      filters.domain = 'industrial';
      filters.intensity = 'heavy';
    }
    
    if (answers.pressure_required === 'low') filters.intensity = 'light';
    if (answers.pressure_required === 'medium') filters.intensity = 'medium';
    if (answers.pressure_required === 'high') filters.intensity = 'heavy';
    
    if (answers.dirt_type?.length) filters.dirt_compatibility = answers.dirt_type;
    if (answers.surface_type) filters.surface_compatibility = [answers.surface_type];
    if (answers.power_source) filters.power_source = answers.power_source;
    
    return filters;
  },
};

// ============================================
// CATEGORY: VACUUM CLEANER
// ============================================
const vacuumCleanerQuestions = {
  categoryId: 'vacuum_cleaner',
  steps: [
    {
      id: 'use_case',
      title: 'Use Case',
      type: QuestionTypes.SELECT,
      required: true,
      options: [
        { value: 'domestic', label: 'Domestic / Light Commercial' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'industrial', label: 'Industrial / Heavy Duty' },
        { value: 'food_beverage', label: 'Food & Beverage / Hygiene Critical' },
        { value: 'construction', label: 'Construction / Demolition' },
        { value: 'hazardous', label: 'Hazardous Materials / ATEX' },
      ],
    },
    {
      id: 'area_size',
      title: 'Area Size',
      type: QuestionTypes.RANGE,
      min: 0,
      max: 5000,
      default: 500,
      unit: 'm²',
      required: true,
    },
    {
      id: 'debris_type',
      title: 'Debris / Soil Type',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: vacuumDebrisOptions,
    },
    {
      id: 'surface_type',
      title: 'Surface Type',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: vacuumSurfaceOptions,
    },
    {
      id: 'filtration',
      title: 'Filtration Requirements',
      type: QuestionTypes.SELECT,
      options: filtrationOptions,
    },
    {
      id: 'tank_capacity',
      title: 'Tank / Capacity Size',
      type: QuestionTypes.SELECT,
      options: tankCapacityOptions,
    },
    {
      id: 'noise_sensitivity',
      title: 'Noise Level Requirement',
      type: QuestionTypes.SELECT,
      options: noiseSensitivityOptions,
    },
    {
      id: 'power_source',
      title: 'Power Source',
      type: QuestionTypes.SELECT,
      required: true,
      options: [
        { value: 'corded_electric', label: 'Mains / Electric corded' },
        { value: 'battery', label: 'Battery / Cordless' },
        { value: 'three_phase', label: 'Three phase (industrial)' },
        { value: 'pneumatic', label: 'Pneumatic / Compressed air (ATEX zones)' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.use_case === 'domestic') {
      filters.domain = 'domestic';
      filters.intensity = 'light';
    } else if (answers.use_case === 'commercial') {
      filters.domain = 'commercial';
      filters.intensity = 'medium';
    } else {
      filters.domain = 'industrial';
      filters.intensity = 'heavy';
    }
    
    if (answers.area_size > 1500) filters.intensity = 'heavy';
    else if (answers.area_size > 300 && filters.intensity !== 'heavy') filters.intensity = 'medium';
    
    if (answers.debris_type?.length) filters.dirt_compatibility = answers.debris_type;
    if (answers.surface_type?.length) filters.surface_compatibility = answers.surface_type;
    if (answers.filtration) filters.filtration_type = answers.filtration;
    if (answers.tank_capacity) filters.tank_capacity = answers.tank_capacity;
    if (answers.noise_sensitivity) filters.noise_sensitivity = answers.noise_sensitivity;
    if (answers.power_source) filters.power_source = answers.power_source;
    
    return filters;
  },
};

// ============================================
// CATEGORY: SWEEPER
// ============================================
const sweeperQuestions = {
  categoryId: 'sweeper',
  steps: [
    {
      id: 'use_case',
      title: 'Use Case',
      type: QuestionTypes.SELECT,
      required: true,
      options: sweeperUseCases,
    },
    {
      id: 'area_size',
      title: 'Surface Area',
      type: QuestionTypes.RANGE,
      min: 0,
      max: 10000,
      default: 1000,
      unit: 'm²',
      required: true,
    },
    {
      id: 'dirt_type',
      title: 'Dirt Type',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: sweeperDirtOptions,
    },
    {
      id: 'location',
      title: 'Where will you be sweeping?',
      type: QuestionTypes.SELECT,
      required: true,
      options: sweeperLocations,
    },
    {
      id: 'operation_mode',
      title: 'How will it be operated?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'walk_behind', label: 'Push / Walk-behind (operator walks)' },
        { value: 'ride_on', label: 'Ride-on (operator sits)' },
        { value: 'both', label: 'No preference / Both' },
      ],
    },
    {
      id: 'special_requirements',
      title: 'Any special requirements?',
      type: QuestionTypes.MULTISELECT,
      options: [
        { value: 'quiet', label: 'Must be quiet' },
        { value: 'emission_free', label: 'Emission-free (indoor air quality)' },
        { value: 'cordless', label: 'Cordless / no power nearby' },
        { value: 'atex', label: 'Hazardous area (dust‑ex rated)' },
        { value: 'none', label: 'No special needs' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.area_size > 5000) filters.intensity = 'heavy';
    else if (answers.area_size > 1000) filters.intensity = 'medium';
    else filters.intensity = 'light';
    
    if (answers.dirt_type?.length) filters.dirt_compatibility = answers.dirt_type;
    if (answers.use_case === 'home') filters.domain = 'domestic';
    else filters.domain = 'industrial';
    
    if (answers.operation_mode === 'walk_behind') filters.machine_subtype = 'walk_behind';
    if (answers.operation_mode === 'ride_on') filters.machine_subtype = 'rider';
    
    if (answers.special_requirements?.includes('quiet')) filters.noise_sensitive = true;
    if (answers.special_requirements?.includes('cordless')) filters.power_source = 'battery';
    
    return filters;
  },
};

// ============================================
// CATEGORY: STEAM CLEANER (3 steps only - no surface type)
// ============================================
const steamCleanerQuestions = {
  categoryId: 'steam_cleaner',
  steps: [
    {
      id: 'use_case',
      title: 'Use Case',
      description: 'What will you mainly use it for?',
      type: QuestionTypes.SELECT,
      required: true,
      options: [
        { value: 'domestic', label: 'Home / Domestic' },
        { value: 'commercial', label: 'Commercial (office, hotel, shop)' },
        { value: 'industrial', label: 'Industrial / Food Production' },
      ],
    },
    {
      id: 'area_size',
      title: 'Area Size',
      description: 'How big is the area?',
      type: QuestionTypes.RANGE,
      min: 0,
      max: 2000,
      default: 200,
      unit: 'm²',
      required: true,
    },
    {
      id: 'function',
      title: 'Function',
      description: 'What do you need the machine to do?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'steam_only', label: 'Steam clean only' },
        { value: 'steam_vacuum', label: 'Steam + vacuum (pick up dirt in one pass)' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.use_case === 'domestic') {
      filters.domain = 'domestic';
      filters.intensity = 'light';
    } else if (answers.use_case === 'commercial') {
      filters.domain = 'commercial';
      filters.intensity = 'medium';
    } else {
      filters.domain = 'industrial';
      filters.intensity = 'heavy';
    }
    
    if (answers.area_size > 500) filters.intensity = 'heavy';
    else if (answers.area_size > 100) filters.intensity = 'medium';
    
    if (answers.function === 'steam_vacuum') filters.special_feature = 'integrated_vacuum';
    
    // Steam cleaners work on all hard surfaces
    filters.surface_compatibility = ['tile', 'vinyl', 'wood', 'glass', 'concrete'];
    
    return filters;
  },
};

// ============================================
// CATEGORY: CARPET CLEANER
// ============================================
const carpetCleanerQuestions = {
  categoryId: 'carpet_cleaner',
  steps: [
    {
      id: 'carpet_type',
      title: 'Surface Type',
      description: 'What is the surface type?',
      type: QuestionTypes.SELECT,
      required: true,
      options: carpetTypeOptions,
    },
    {
      id: 'dirt_type',
      title: 'Dirt Type',
      description: 'What type of dirt?',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: carpetDirtOptions,
    },
    {
      id: 'area_size',
      title: 'Area Size',
      description: 'How big is the area?',
      type: QuestionTypes.RANGE,
      min: 0,
      max: 2000,
      default: 200,
      unit: 'm²',
      required: true,
    },
    {
      id: 'power_source',
      title: 'Power Source',
      type: QuestionTypes.SELECT,
      required: true,
      options: [
        { value: 'battery', label: 'Battery / Cordless' },
        { value: 'corded_electric', label: 'Mains Electric (Corded)' },
        { value: 'any', label: 'No preference' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.area_size > 500) filters.intensity = 'heavy';
    else if (answers.area_size > 100) filters.intensity = 'medium';
    else filters.intensity = 'light';
    
    if (answers.dirt_type?.length) filters.dirt_compatibility = answers.dirt_type;
    if (answers.carpet_type === 'natural') filters.surface_compatibility = ['carpet'];
    if (answers.carpet_type === 'synthetic') filters.surface_compatibility = ['carpet'];
    if (answers.carpet_type === 'upholstery') filters.surface_compatibility = ['upholstery'];
    
    if (answers.power_source && answers.power_source !== 'any') {
      filters.power_source = answers.power_source;
    }
    
    return filters;
  },
};

// ============================================
// CATEGORY: WINDOW CLEANER
// ============================================
const windowCleanerQuestions = {
  categoryId: 'window_cleaner',
  steps: [
    {
      id: 'location',
      title: 'Window Location',
      description: 'Where are the windows?',
      type: QuestionTypes.SELECT,
      required: true,
      options: windowLocations,
    },
    {
      id: 'area_size',
      title: 'Area Size',
      description: 'How big is the area?',
      type: QuestionTypes.RANGE,
      min: 0,
      max: 5000,
      default: 500,
      unit: 'm²',
      required: true,
    },
    {
      id: 'dirt_type',
      title: 'Soiling Type',
      description: 'What type of dirt/soiling?',
      type: QuestionTypes.SELECT,
      required: true,
      options: windowSoilingOptions,
    },
    {
      id: 'power_source',
      title: 'Power Source',
      type: QuestionTypes.SELECT,
      required: true,
      options: [
        { value: 'battery', label: 'Battery / Cordless' },
        { value: 'corded_electric', label: 'Mains Electric (Corded)' },
        { value: 'any', label: 'No preference' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.area_size > 1000) filters.intensity = 'heavy';
    else if (answers.area_size > 200) filters.intensity = 'medium';
    else filters.intensity = 'light';
    
    if (answers.dirt_type) filters.dirt_compatibility = [answers.dirt_type];
    
    if (answers.location === 'outdoor_height') {
      filters.machine_subtype = 'water_fed_pole';
      filters.domain = 'industrial';
    }
    
    if (answers.power_source && answers.power_source !== 'any') {
      filters.power_source = answers.power_source;
    }
    
    return filters;
  },
};

// ============================================
// CATEGORY: SCRUBBER DRIER
// ============================================
const scrubberDrierQuestions = {
  categoryId: 'scrubber_drier',
  steps: [
    {
      id: 'area_size',
      title: 'Area Size',
      type: QuestionTypes.RANGE,
      min: 0,
      max: 10000,
      default: 1000,
      unit: 'm²',
      required: true,
    },
    {
      id: 'floor_type',
      title: 'Floor Type',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: floorTypeOptions,
    },
    {
      id: 'environment',
      title: 'Environment / Location',
      type: QuestionTypes.SELECT,
      required: true,
      options: environmentOptions,
    },
    {
      id: 'power_source',
      title: 'Power Source',
      type: QuestionTypes.SELECT,
      required: true,
      options: powerSourceOptions,
    },
    {
      id: 'soil_level',
      title: 'Soil / Dirt Level',
      type: QuestionTypes.SELECT,
      required: true,
      options: soilLevelOptions,
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    
    if (answers.area_size > 3000) filters.intensity = 'heavy';
    else if (answers.area_size > 500) filters.intensity = 'medium';
    else filters.intensity = 'light';
    
    if (answers.floor_type?.length) filters.surface_compatibility = answers.floor_type;
    if (answers.environment) filters.environment = answers.environment;
    if (answers.power_source) filters.power_source = answers.power_source;
    if (answers.soil_level) filters.soil_level = answers.soil_level;
    
    return filters;
  },
};

// ============================================
// EXPORT ALL CATEGORY QUESTIONS
// ============================================
export const categoryQuestions = {
  floor_scrubber: floorScrubberQuestions,
  pressure_washer: pressureWasherQuestions,
  vacuum_cleaner: vacuumCleanerQuestions,
  sweeper: sweeperQuestions,
  steam_cleaner: steamCleanerQuestions,
  carpet_cleaner: carpetCleanerQuestions,
  window_cleaner: windowCleanerQuestions,
  scrubber_drier: scrubberDrierQuestions,
};

export const getCategoryQuestions = (categoryId) => {
  return categoryQuestions[categoryId] || null;
};

export const getAvailableCategories = () => {
  return Object.keys(categoryQuestions);
};