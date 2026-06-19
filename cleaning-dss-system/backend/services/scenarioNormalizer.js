const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const normalizePowerSource = (value) => {
  if (!value || value === 'any') return null;
  return value;
};

// Map user‑friendly surface names to database‑exact strings
const surfaceMapping = {
  tile: 'tile',
  tiles: 'tile',
  ceramic: 'tile',
  vinyl: 'vinyl',
  concrete: 'concrete',
  wood: 'wood',
  hardwood: 'wood',
  marble: 'marble',
  natural_stone: 'marble',
  carpet: 'carpet',
  glass: 'glass',
  stainless_steel: 'stainless_steel',
  steel: 'stainless_steel',
  // Add more as needed
};

// Map user‑friendly dirt names to database‑exact strings
const dirtMapping = {
  grease: 'grease',
  oil: 'oil',
  red_laterite_soil: 'red laterite soil',
  laterite: 'red laterite soil',
  dust: 'dust',
  light_dust: 'light dust',
  heavy_soil: 'heavy soil',
  organic: 'organic',
  spills: 'spills',
  lime_scale: 'lime scale',
  rust: 'rust',
  // Add more as needed
};

// Normalize a single value using a mapping object
const normalizeValue = (value, mapping) => {
  if (!value) return value;
  const lower = value.toLowerCase().trim();
  return mapping[lower] || value;
};

// Normalize an array of values using a mapping
const normalizeArray = (arr, mapping) => {
  if (!arr) return [];
  return arr.map(v => normalizeValue(v, mapping)).filter(Boolean);
};

const deriveUseCase = (useCase) => {
  if (!useCase) return {};
  const lower = useCase.toLowerCase();
  if (['domestic', 'home'].includes(lower)) {
    return { domain: 'domestic', intensity: 'light' };
  }
  if (['commercial', 'office', 'retail', 'hospitality'].includes(lower)) {
    return { domain: 'commercial', intensity: 'medium' };
  }
  if (['food_beverage', 'construction', 'hazardous', 'industrial', 'warehouse', 'outdoor', 'vehicles'].includes(lower)) {
    return { domain: 'industrial', intensity: 'heavy' };
  }
  return {};
};

const derivePressureIntensity = (pressureRequired) => {
  if (!pressureRequired) return null;
  const lower = pressureRequired.toLowerCase();
  if (lower === 'low') return 'light';
  if (lower === 'medium') return 'medium';
  if (lower === 'high') return 'heavy';
  return null;
};

const normalizeAisleWidthMm = (scenario) => {
  if (scenario.min_aisle_width_mm) return Number(scenario.min_aisle_width_mm);
  if (scenario.aisle_width) return Number(scenario.aisle_width) * 10; // assume cm to mm
  return null;
};

/**
 * Normalize the user scenario to a consistent format for the inference engine.
 * Applies mapping to ensure surface/dirt types match database values.
 */
const normalizeScenario = (raw = {}) => {
  const useCaseDefaults = deriveUseCase(raw.use_case);
  const pressureIntensity = derivePressureIntensity(raw.pressure_required);

  // Normalize surfaces and dirts using the mappings
  const rawSurfaces = toArray(raw.surface_type).concat(toArray(raw.surface_compatibility)).concat(toArray(raw.floor_type));
  const surfaces = unique(normalizeArray(rawSurfaces, surfaceMapping));

  const rawSoils = toArray(raw.dirt_type).concat(toArray(raw.dirt_compatibility)).concat(toArray(raw.debris_type)).concat(toArray(raw.soil_type));
  const soils = unique(normalizeArray(rawSoils, dirtMapping));

  return {
    ...raw,
    domain: raw.domain || useCaseDefaults.domain || null,
    intensity: pressureIntensity || raw.intensity || useCaseDefaults.intensity || null,
    surfaces,
    soils,
    budget_ugx: Number(raw.budget_ugx || raw.budget || 0),
    min_aisle_width_mm: normalizeAisleWidthMm(raw),
    power_source: normalizePowerSource(raw.power_source),
    power_available_kw: raw.power_available_kw ? Number(raw.power_available_kw) : null,
    // Also pass through other fields as is, but ensure surface_type and dirt_type are overridden with normalized version for backward compatibility
    surface_type: surfaces.length > 0 ? surfaces[0] : null,
    dirt_type: soils.length > 0 ? soils[0] : null,
  };
};

module.exports = { normalizeScenario };