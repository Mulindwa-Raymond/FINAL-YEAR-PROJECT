/**
 * careAgentQuestions.js
 * Dynamic questionnaire for care agent / maintenance product recommendations.
 * Each machine category has tailored questions to recommend protective coatings,
 * sealants, polishes, and other maintenance chemicals.
 */

// ============================================
// QUESTION TYPES
// ============================================
export const QuestionTypes = {
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
};

// ============================================
// COMMON OPTIONS
// ============================================
const floorTypeOptions = [
  { value: 'concrete', label: 'Concrete / Screed', icon: '🏭' },
  { value: 'tiles_vinyl', label: 'Tiles / Vinyl', icon: '🔲' },
  { value: 'epoxy', label: 'Epoxy Coated', icon: '✨' },
  { value: 'asphalt', label: 'Asphalt / Outdoor', icon: '🛣️' },
];

// ============================================
// SWEEPER CARE AGENTS
// ============================================
export const sweeperCareAgentQuestions = {
  categoryId: 'sweeper',
  title: 'Sweeper Care Agents',
  description: 'Protect and maintain your sweeper and floors.',
  steps: [
    {
      id: 'floor_type',
      title: 'What type of floor?',
      type: QuestionTypes.RADIO,
      required: true,
      options: floorTypeOptions,
    },
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'sealer', label: '🛡️ Floor sealer / protector' },
        { value: 'anti_dust', label: '🧹 Anti-dust treatment' },
        { value: 'anti_slip', label: '⚠️ Anti-slip coating' },
        { value: 'polish', label: '✨ Polish / shine restorer' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.floor_type) filters.floor_type = answers.floor_type;
    if (answers.need_type) filters.care_type = answers.need_type;
    return filters;
  },
};

// ============================================
// PRESSURE WASHER CARE AGENTS
// ============================================
export const pressureWasherCareAgentQuestions = {
  categoryId: 'pressure_washer',
  title: 'Pressure Washer Care Agents',
  description: 'Protective treatments for your pressure washer applications.',
  steps: [
    {
      id: 'treatment_target',
      title: 'What are you treating?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'vehicle', label: '🚗 Vehicle / fleet' },
        { value: 'building', label: '🏢 Building facade / walls' },
        { value: 'driveway', label: '🛣️ Driveway / paving' },
        { value: 'machinery', label: '🏭 Machinery / equipment' },
      ],
    },
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'wax', label: '✨ Wax / protective coating' },
        { value: 'anti_graffiti', label: '🎨 Anti-graffiti treatment' },
        { value: 'water_repellent', label: '💧 Water repellent / sealant' },
        { value: 'rust_inhibitor', label: '🔧 Rust inhibitor' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.treatment_target) filters.treatment_target = answers.treatment_target;
    if (answers.need_type) filters.care_type = answers.need_type;
    return filters;
  },
};

// ============================================
// STEAM CLEANER CARE AGENTS
// ============================================
export const steamCleanerCareAgentQuestions = {
  categoryId: 'steam_cleaner',
  title: 'Steam Cleaner Care Agents',
  description: 'Maintenance and care products for your steam cleaner.',
  steps: [
    {
      id: 'surface_type',
      title: 'What type of surface?',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: [
        { value: 'hard_floor', label: 'Hard floor' },
        { value: 'kitchen', label: 'Kitchen surfaces' },
        { value: 'bathroom', label: 'Bathroom / sanitary' },
        { value: 'machinery', label: 'Machinery' },
      ],
    },
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'descaler', label: '🧴 Descaler / limescale preventer' },
        { value: 'protector', label: '🛡️ Surface protector' },
        { value: 'sanitising_spray', label: '🧼 Sanitising maintenance spray' },
        { value: 'machine_descaler', label: '🔧 Machine care / descaler (for the steamer itself)' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.surface_type) filters.surface_compatibility = answers.surface_type;
    if (answers.need_type) filters.care_type = answers.need_type;
    return filters;
  },
};

// ============================================
// CARPET CLEANER CARE AGENTS
// ============================================
export const carpetCleanerCareAgentQuestions = {
  categoryId: 'carpet_cleaner',
  title: 'Carpet Cleaner Care Agents',
  description: 'Protective treatments for carpets and upholstery.',
  steps: [
    {
      id: 'carpet_type',
      title: 'What type of carpet?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'synthetic', label: '🧵 Synthetic' },
        { value: 'natural', label: '🌾 Natural fibre / wool' },
        { value: 'upholstery', label: '🛋️ Upholstery / fabric' },
      ],
    },
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: [
        { value: 'stain_protector', label: '🛡️ Stain protector' },
        { value: 'fabric_conditioner', label: '✨ Fabric conditioner' },
        { value: 'anti_static', label: '⚡ Anti-static treatment' },
        { value: 'odour_neutraliser', label: '🌿 Odour neutraliser' },
        { value: 'moth_protection', label: '🦋 Moth / pest protection (for wool/natural fibre)' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.carpet_type) filters.carpet_type = answers.carpet_type;
    if (answers.need_type) filters.care_type = answers.need_type;
    return filters;
  },
};

// ============================================
// WINDOW CLEANER CARE AGENTS
// ============================================
export const windowCleanerCareAgentQuestions = {
  categoryId: 'window_cleaner',
  title: 'Window Cleaner Care Agents',
  description: 'Protective treatments for glass and frames.',
  steps: [
    {
      id: 'surface_type',
      title: 'What type of surface?',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: [
        { value: 'glass', label: 'Glass / windows' },
        { value: 'frames', label: 'Frames' },
        { value: 'solar', label: 'Solar panels' },
      ],
    },
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'water_repellent', label: '💧 Water repellent / rain treatment' },
        { value: 'uv_protection', label: '☀️ UV protection (solar panels)' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.surface_type) filters.surface_type = answers.surface_type;
    if (answers.need_type) filters.care_type = answers.need_type;
    return filters;
  },
};

// ============================================
// VACUUM CARE AGENTS
// ============================================
export const vacuumCareAgentQuestions = {
  categoryId: 'vacuum_cleaner',
  title: 'Vacuum Care Agents',
  description: 'Maintenance and protective products for your vacuum cleaner.',
  steps: [
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.MULTISELECT,
      required: true,
      options: [
        { value: 'carpet_protector', label: '🧺 Carpet protector (post clean)' },
        { value: 'floor_polish', label: '✨ Hard floor polish / maintainer' },
        { value: 'filter_treatment', label: '🔧 Filter treatment' },
      ],
    },
    {
      id: 'special_requirements',
      title: 'Any special requirements?',
      type: QuestionTypes.MULTISELECT,
      required: false,
      options: [
        { value: 'eco_friendly', label: '🌱 Eco-friendly / biodegradable' },
        { value: 'food_safe', label: '🍽️ Food safe / non-toxic' },
        { value: 'fragrance_free', label: '🌸 Fragrance free' },
        { value: 'concentrated', label: '💧 Concentrated / dilutable' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.need_type) filters.care_type = answers.need_type;
    if (answers.special_requirements) filters.special_requirements = answers.special_requirements;
    return filters;
  },
};

// ============================================
// FLOOR SCRUBBER CARE AGENTS
// ============================================
export const floorScrubberCareAgentQuestions = {
  categoryId: 'floor_scrubber',
  title: 'Floor Scrubber Care Agents',
  description: 'Protective treatments for your floors.',
  steps: [
    {
      id: 'floor_type',
      title: 'What type of floor?',
      type: QuestionTypes.RADIO,
      required: true,
      options: floorTypeOptions,
    },
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'sealer', label: '🛡️ Floor sealer / protector' },
        { value: 'anti_dust', label: '🧹 Anti-dust treatment' },
        { value: 'anti_slip', label: '⚠️ Anti-slip coating' },
        { value: 'polish', label: '✨ Polish / shine restorer' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.floor_type) filters.floor_type = answers.floor_type;
    if (answers.need_type) filters.care_type = answers.need_type;
    return filters;
  },
};

// ============================================
// SCRUBBER DRIER CARE AGENTS
// ============================================
export const scrubberDrierCareAgentQuestions = {
  categoryId: 'scrubber_drier',
  title: 'Scrubber Drier Care Agents',
  description: 'Protective treatments for your floors.',
  steps: [
    {
      id: 'floor_type',
      title: 'What type of floor?',
      type: QuestionTypes.RADIO,
      required: true,
      options: floorTypeOptions,
    },
    {
      id: 'need_type',
      title: 'What do you need?',
      type: QuestionTypes.RADIO,
      required: true,
      options: [
        { value: 'sealer', label: '🛡️ Floor sealer / protector' },
        { value: 'anti_dust', label: '🧹 Anti-dust treatment' },
        { value: 'anti_slip', label: '⚠️ Anti-slip coating' },
        { value: 'polish', label: '✨ Polish / shine restorer' },
      ],
    },
  ],
  mapToFilters: (answers) => {
    const filters = {};
    if (answers.floor_type) filters.floor_type = answers.floor_type;
    if (answers.need_type) filters.care_type = answers.need_type;
    return filters;
  },
};

// ============================================
// EXPORT ALL CARE AGENT QUESTIONS
// ============================================
export const careAgentQuestions = {
  sweeper: sweeperCareAgentQuestions,
  pressure_washer: pressureWasherCareAgentQuestions,
  steam_cleaner: steamCleanerCareAgentQuestions,
  carpet_cleaner: carpetCleanerCareAgentQuestions,
  window_cleaner: windowCleanerCareAgentQuestions,
  vacuum_cleaner: vacuumCareAgentQuestions,
  floor_scrubber: floorScrubberCareAgentQuestions,
  scrubber_drier: scrubberDrierCareAgentQuestions,
};

export const getCareAgentQuestions = (categoryId) => {
  return careAgentQuestions[categoryId] || null;
};

export const getAvailableCareAgentCategories = () => {
  return Object.keys(careAgentQuestions);
};

// ============================================
// SPECIAL REQUIREMENTS OPTIONS (Global)
// ============================================
export const specialRequirementsOptions = [
  { value: 'eco_friendly', label: '🌱 Eco-friendly / biodegradable' },
  { value: 'food_safe', label: '🍽️ Food safe / non-toxic' },
  { value: 'fragrance_free', label: '🌸 Fragrance free' },
  { value: 'concentrated', label: '💧 Concentrated / dilutable' },
  { value: 'no_special', label: 'No special needs' },
];