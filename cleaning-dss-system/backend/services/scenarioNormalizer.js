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

const deriveUseCase = (useCase) => {
  switch (useCase) {
    case 'domestic':
    case 'home':
      return { domain: 'domestic', intensity: 'light' };
    case 'commercial':
    case 'office':
      return { domain: 'commercial', intensity: 'medium' };
    case 'food_beverage':
    case 'construction':
    case 'hazardous':
    case 'industrial':
    case 'warehouse':
    case 'outdoor':
    case 'vehicles':
      return { domain: 'industrial', intensity: 'heavy' };
    default:
      return {};
  }
};

const derivePressureIntensity = (pressureRequired) => {
  if (pressureRequired === 'low') return 'light';
  if (pressureRequired === 'medium') return 'medium';
  if (pressureRequired === 'high') return 'heavy';
  return null;
};

const normalizeAisleWidthMm = (scenario) => {
  if (scenario.min_aisle_width_mm) return Number(scenario.min_aisle_width_mm);
  if (scenario.aisle_width) return Number(scenario.aisle_width) * 10;
  return null;
};

const normalizeScenario = (raw = {}) => {
  const useCaseDefaults = deriveUseCase(raw.use_case);
  const pressureIntensity = derivePressureIntensity(raw.pressure_required);

  const surfaces = unique([
    ...toArray(raw.surface_type),
    ...toArray(raw.surface_compatibility),
    ...toArray(raw.floor_type),
  ]);

  const soils = unique([
    ...toArray(raw.dirt_type),
    ...toArray(raw.dirt_compatibility),
    ...toArray(raw.debris_type),
    ...toArray(raw.soil_type),
  ]);

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
  };
};

module.exports = { normalizeScenario };
