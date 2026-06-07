/**
 * specTemplates.js
 * Defines default attribute templates for each (brand + category + intensity) combination.
 * Used to pre-populate Equipment Specifications when creating a new equipment.
 * 
 * Each template contains an array of attribute objects with:
 * - attribute_name: Display name of the specification
 * - attribute_value: Default value (can be edited by user)
 * - unit_of_measure: Unit for the attribute (e.g., mm, L, kg, bar)
 * - required: Whether this attribute is mandatory
 * - description: Help text for the user
 */

// ============================================
// FLOOR SCRUBBER TEMPLATES
// ============================================

const floorScrubberTemplates = {
  // Domestic / Light Duty
  light: {
    walk_behind: [
      { attribute_name: 'working_width', attribute_value: '350', unit_of_measure: 'mm', required: true, description: 'Width of cleaning path' },
      { attribute_name: 'solution_tank_capacity', attribute_value: '10', unit_of_measure: 'L', required: true, description: 'Fresh water/detergent tank' },
      { attribute_name: 'recovery_tank_capacity', attribute_value: '12', unit_of_measure: 'L', required: true, description: 'Dirty water tank' },
      { attribute_name: 'brush_pressure', attribute_value: '25', unit_of_measure: 'g/cm²', required: false, description: 'Downward pressure on brushes' },
      { attribute_name: 'area_performance', attribute_value: '800', unit_of_measure: 'm²/h', required: false, description: 'Maximum cleaning area per hour' },
      { attribute_name: 'noise_level', attribute_value: '65', unit_of_measure: 'dB', required: false, description: 'Sound pressure level' }
    ],
    rider: [
      { attribute_name: 'working_width', attribute_value: '450', unit_of_measure: 'mm', required: true, description: 'Width of cleaning path' },
      { attribute_name: 'solution_tank_capacity', attribute_value: '30', unit_of_measure: 'L', required: true, description: 'Fresh water/detergent tank' },
      { attribute_name: 'recovery_tank_capacity', attribute_value: '35', unit_of_measure: 'L', required: true, description: 'Dirty water tank' },
      { attribute_name: 'brush_pressure', attribute_value: '40', unit_of_measure: 'g/cm²', required: false, description: 'Downward pressure on brushes' },
      { attribute_name: 'max_speed', attribute_value: '4.5', unit_of_measure: 'km/h', required: false, description: 'Maximum travel speed' },
      { attribute_name: 'turning_radius', attribute_value: '1200', unit_of_measure: 'mm', required: false, description: 'Minimum turning circle' }
    ],
    robotic: [
      { attribute_name: 'battery_runtime', attribute_value: '120', unit_of_measure: 'min', required: true, description: 'Runtime on full charge' },
      { attribute_name: 'charging_time', attribute_value: '180', unit_of_measure: 'min', required: true, description: 'Time to fully charge' },
      { attribute_name: 'navigation_type', attribute_value: 'LiDAR', unit_of_measure: null, required: true, description: 'LiDAR / Camera / Magnetic tape' },
      { attribute_name: 'obstacle_detection', attribute_value: 'Yes', unit_of_measure: null, required: false, description: 'Whether obstacle detection is available' },
      { attribute_name: 'coverage_per_charge', attribute_value: '800', unit_of_measure: 'm²', required: false, description: 'Area covered on single charge' }
    ],
    micro: [
      { attribute_name: 'working_width', attribute_value: '280', unit_of_measure: 'mm', required: true, description: 'Width of cleaning path' },
      { attribute_name: 'solution_tank_capacity', attribute_value: '4', unit_of_measure: 'L', required: true, description: 'Fresh water/detergent tank' },
      { attribute_name: 'recovery_tank_capacity', attribute_value: '4.5', unit_of_measure: 'L', required: true, description: 'Dirty water tank' },
      { attribute_name: 'weight', attribute_value: '28', unit_of_measure: 'kg', required: true, description: 'Machine weight' },
      { attribute_name: 'turning_radius', attribute_value: '800', unit_of_measure: 'mm', required: false, description: 'Minimum turning circle' }
    ]
  },
  
  // Commercial / Medium Duty
  medium: {
    walk_behind: [
      { attribute_name: 'working_width', attribute_value: '500', unit_of_measure: 'mm', required: true, description: 'Width of cleaning path' },
      { attribute_name: 'solution_tank_capacity', attribute_value: '40', unit_of_measure: 'L', required: true, description: 'Fresh water/detergent tank' },
      { attribute_name: 'recovery_tank_capacity', attribute_value: '45', unit_of_measure: 'L', required: true, description: 'Dirty water tank' },
      { attribute_name: 'brush_pressure', attribute_value: '60', unit_of_measure: 'g/cm²', required: true, description: 'Downward pressure on brushes' },
      { attribute_name: 'area_performance', attribute_value: '1800', unit_of_measure: 'm²/h', required: true, description: 'Maximum cleaning area per hour' },
      { attribute_name: 'battery_voltage', attribute_value: '24', unit_of_measure: 'V', required: false, description: 'Battery voltage for cordless models' },
      { attribute_name: 'noise_level', attribute_value: '68', unit_of_measure: 'dB', required: false, description: 'Sound pressure level' }
    ],
    rider: [
      { attribute_name: 'working_width', attribute_value: '650', unit_of_measure: 'mm', required: true, description: 'Width of cleaning path' },
      { attribute_name: 'solution_tank_capacity', attribute_value: '70', unit_of_measure: 'L', required: true, description: 'Fresh water/detergent tank' },
      { attribute_name: 'recovery_tank_capacity', attribute_value: '75', unit_of_measure: 'L', required: true, description: 'Dirty water tank' },
      { attribute_name: 'brush_pressure', attribute_value: '80', unit_of_measure: 'g/cm²', required: true, description: 'Downward pressure on brushes' },
      { attribute_name: 'area_performance', attribute_value: '3200', unit_of_measure: 'm²/h', required: true, description: 'Maximum cleaning area per hour' },
      { attribute_name: 'max_speed', attribute_value: '7', unit_of_measure: 'km/h', required: false, description: 'Maximum travel speed' },
      { attribute_name: 'battery_voltage', attribute_value: '36', unit_of_measure: 'V', required: false, description: 'Battery voltage for cordless models' }
    ]
  },
  
  // Industrial / Heavy Duty
  heavy: {
    walk_behind: [
      { attribute_name: 'working_width', attribute_value: '750', unit_of_measure: 'mm', required: true, description: 'Width of cleaning path' },
      { attribute_name: 'solution_tank_capacity', attribute_value: '90', unit_of_measure: 'L', required: true, description: 'Fresh water/detergent tank' },
      { attribute_name: 'recovery_tank_capacity', attribute_value: '95', unit_of_measure: 'L', required: true, description: 'Dirty water tank' },
      { attribute_name: 'brush_pressure', attribute_value: '100', unit_of_measure: 'g/cm²', required: true, description: 'Downward pressure on brushes' },
      { attribute_name: 'area_performance', attribute_value: '4500', unit_of_measure: 'm²/h', required: true, description: 'Maximum cleaning area per hour' },
      { attribute_name: 'battery_voltage', attribute_value: '48', unit_of_measure: 'V', required: true, description: 'Battery voltage for cordless models' },
      { attribute_name: 'max_speed', attribute_value: '8.5', unit_of_measure: 'km/h', required: false, description: 'Maximum travel speed' }
    ],
    rider: [
      { attribute_name: 'working_width', attribute_value: '1000', unit_of_measure: 'mm', required: true, description: 'Width of cleaning path' },
      { attribute_name: 'solution_tank_capacity', attribute_value: '200', unit_of_measure: 'L', required: true, description: 'Fresh water/detergent tank' },
      { attribute_name: 'recovery_tank_capacity', attribute_value: '210', unit_of_measure: 'L', required: true, description: 'Dirty water tank' },
      { attribute_name: 'brush_pressure', attribute_value: '120', unit_of_measure: 'g/cm²', required: true, description: 'Downward pressure on brushes' },
      { attribute_name: 'area_performance', attribute_value: '8000', unit_of_measure: 'm²/h', required: true, description: 'Maximum cleaning area per hour' },
      { attribute_name: 'battery_voltage', attribute_value: '80', unit_of_measure: 'V', required: true, description: 'Battery voltage' },
      { attribute_name: 'max_speed', attribute_value: '10', unit_of_measure: 'km/h', required: false, description: 'Maximum travel speed' },
      { attribute_name: 'turning_radius', attribute_value: '2500', unit_of_measure: 'mm', required: false, description: 'Minimum turning circle' }
    ]
  }
};

// ============================================
// VACUUM CLEANER TEMPLATES
// ============================================

const vacuumCleanerTemplates = {
  light: {
    wet_dry: [
      { attribute_name: 'tank_capacity', attribute_value: '15', unit_of_measure: 'L', required: true, description: 'Total tank capacity' },
      { attribute_name: 'power', attribute_value: '1000', unit_of_measure: 'W', required: true, description: 'Motor power' },
      { attribute_name: 'air_flow', attribute_value: '48', unit_of_measure: 'L/s', required: false, description: 'Air flow rate' },
      { attribute_name: 'vacuum_pressure', attribute_value: '20', unit_of_measure: 'kPa', required: false, description: 'Vacuum pressure' },
      { attribute_name: 'hose_length', attribute_value: '2.5', unit_of_measure: 'm', required: false, description: 'Hose length' },
      { attribute_name: 'noise_level', attribute_value: '72', unit_of_measure: 'dB', required: false, description: 'Sound pressure level' }
    ],
    backpack: [
      { attribute_name: 'weight', attribute_value: '4.5', unit_of_measure: 'kg', required: true, description: 'Machine weight' },
      { attribute_name: 'tank_capacity', attribute_value: '8', unit_of_measure: 'L', required: true, description: 'Dust tank capacity' },
      { attribute_name: 'power', attribute_value: '1200', unit_of_measure: 'W', required: true, description: 'Motor power' },
      { attribute_name: 'hose_length', attribute_value: '1.5', unit_of_measure: 'm', required: false, description: 'Hose length' },
      { attribute_name: 'harness_type', attribute_value: 'Padded', unit_of_measure: null, required: false, description: 'Type of harness' }
    ]
  },
  medium: {
    wet_dry: [
      { attribute_name: 'tank_capacity', attribute_value: '25', unit_of_measure: 'L', required: true, description: 'Total tank capacity' },
      { attribute_name: 'power', attribute_value: '1500', unit_of_measure: 'W', required: true, description: 'Motor power' },
      { attribute_name: 'air_flow', attribute_value: '72', unit_of_measure: 'L/s', required: true, description: 'Air flow rate' },
      { attribute_name: 'vacuum_pressure', attribute_value: '25', unit_of_measure: 'kPa', required: true, description: 'Vacuum pressure' },
      { attribute_name: 'hose_length', attribute_value: '4', unit_of_measure: 'm', required: false, description: 'Hose length' },
      { attribute_name: 'filter_type', attribute_value: 'HEPA', unit_of_measure: null, required: false, description: 'Type of filter' },
      { attribute_name: 'noise_level', attribute_value: '70', unit_of_measure: 'dB', required: false, description: 'Sound pressure level' }
    ],
    industrial: [
      { attribute_name: 'tank_capacity', attribute_value: '50', unit_of_measure: 'L', required: true, description: 'Total tank capacity' },
      { attribute_name: 'power', attribute_value: '2200', unit_of_measure: 'W', required: true, description: 'Motor power' },
      { attribute_name: 'air_flow', attribute_value: '100', unit_of_measure: 'L/s', required: true, description: 'Air flow rate' },
      { attribute_name: 'vacuum_pressure', attribute_value: '30', unit_of_measure: 'kPa', required: true, description: 'Vacuum pressure' },
      { attribute_name: 'dust_class', attribute_value: 'M', unit_of_measure: null, required: true, description: 'Dust class (L/M/H)' },
      { attribute_name: 'filter_cleaning', attribute_value: 'Automatic', unit_of_measure: null, required: false, description: 'Filter cleaning method' }
    ]
  },
  heavy: {
    industrial: [
      { attribute_name: 'tank_capacity', attribute_value: '80', unit_of_measure: 'L', required: true, description: 'Total tank capacity' },
      { attribute_name: 'power', attribute_value: '3000', unit_of_measure: 'W', required: true, description: 'Motor power' },
      { attribute_name: 'air_flow', attribute_value: '150', unit_of_measure: 'L/s', required: true, description: 'Air flow rate' },
      { attribute_name: 'vacuum_pressure', attribute_value: '35', unit_of_measure: 'kPa', required: true, description: 'Vacuum pressure' },
      { attribute_name: 'dust_class', attribute_value: 'H', unit_of_measure: null, required: true, description: 'Dust class for hazardous dust' },
      { attribute_name: 'motor_type', attribute_value: 'Turbo', unit_of_measure: null, required: false, description: 'Single / Double / Turbo' },
      { attribute_name: 'container_type', attribute_value: 'Lift off', unit_of_measure: null, required: false, description: 'Type of container' }
    ]
  }
};

// ============================================
// PRESSURE WASHER TEMPLATES
// ============================================

const pressureWasherTemplates = {
  light: {
    electric: [
      { attribute_name: 'pressure_bar', attribute_value: '110', unit_of_measure: 'bar', required: true, description: 'Maximum pressure' },
      { attribute_name: 'flow_rate', attribute_value: '5.5', unit_of_measure: 'L/min', required: true, description: 'Water flow rate' },
      { attribute_name: 'power', attribute_value: '1500', unit_of_measure: 'W', required: true, description: 'Motor power' },
      { attribute_name: 'hose_length', attribute_value: '6', unit_of_measure: 'm', required: false, description: 'High-pressure hose length' },
      { attribute_name: 'weight', attribute_value: '12', unit_of_measure: 'kg', required: false, description: 'Machine weight' }
    ]
  },
  medium: {
    electric: [
      { attribute_name: 'pressure_bar', attribute_value: '145', unit_of_measure: 'bar', required: true, description: 'Maximum pressure' },
      { attribute_name: 'flow_rate', attribute_value: '7.5', unit_of_measure: 'L/min', required: true, description: 'Water flow rate' },
      { attribute_name: 'power', attribute_value: '2100', unit_of_measure: 'W', required: true, description: 'Motor power' },
      { attribute_name: 'hose_length', attribute_value: '10', unit_of_measure: 'm', required: false, description: 'High-pressure hose length' },
      { attribute_name: 'thermal_protection', attribute_value: 'Yes', unit_of_measure: null, required: false, description: 'Overheating protection' },
      { attribute_name: 'weight', attribute_value: '18', unit_of_measure: 'kg', required: false, description: 'Machine weight' }
    ],
    hot_water: [
      { attribute_name: 'pressure_bar', attribute_value: '150', unit_of_measure: 'bar', required: true, description: 'Maximum pressure' },
      { attribute_name: 'flow_rate', attribute_value: '8', unit_of_measure: 'L/min', required: true, description: 'Water flow rate' },
      { attribute_name: 'temperature_max', attribute_value: '80', unit_of_measure: '°C', required: true, description: 'Maximum water temperature' },
      { attribute_name: 'fuel_type', attribute_value: 'Diesel', unit_of_measure: null, required: true, description: 'Fuel type for heating' },
      { attribute_name: 'fuel_tank_capacity', attribute_value: '15', unit_of_measure: 'L', required: false, description: 'Fuel tank capacity' }
    ]
  },
  heavy: {
    hot_water: [
      { attribute_name: 'pressure_bar', attribute_value: '200', unit_of_measure: 'bar', required: true, description: 'Maximum pressure' },
      { attribute_name: 'flow_rate', attribute_value: '15', unit_of_measure: 'L/min', required: true, description: 'Water flow rate' },
      { attribute_name: 'temperature_max', attribute_value: '155', unit_of_measure: '°C', required: true, description: 'Maximum water temperature' },
      { attribute_name: 'fuel_type', attribute_value: 'Diesel', unit_of_measure: null, required: true, description: 'Fuel type for heating' },
      { attribute_name: 'fuel_tank_capacity', attribute_value: '30', unit_of_measure: 'L', required: true, description: 'Fuel tank capacity' },
      { attribute_name: 'boiler_type', attribute_value: 'Coil', unit_of_measure: null, required: false, description: 'Type of boiler' },
      { attribute_name: 'burner_power', attribute_value: '50', unit_of_measure: 'kW', required: false, description: 'Burner heating power' }
    ],
    petrol: [
      { attribute_name: 'pressure_bar', attribute_value: '180', unit_of_measure: 'bar', required: true, description: 'Maximum pressure' },
      { attribute_name: 'flow_rate', attribute_value: '12', unit_of_measure: 'L/min', required: true, description: 'Water flow rate' },
      { attribute_name: 'engine_power', attribute_value: '6.5', unit_of_measure: 'HP', required: true, description: 'Engine power' },
      { attribute_name: 'engine_type', attribute_value: 'Honda', unit_of_measure: null, required: true, description: 'Engine manufacturer' },
      { attribute_name: 'fuel_tank_capacity', attribute_value: '6', unit_of_measure: 'L', required: false, description: 'Fuel tank capacity' },
      { attribute_name: 'pull_start', attribute_value: 'Yes', unit_of_measure: null, required: false, description: 'Manual pull start' }
    ]
  }
};

// ============================================
// TEMPLATE LOOKUP FUNCTION
// ============================================

/**
 * Get spec template for a given category, intensity, and sub-type
 * @param {string} category - Machine category (floor_scrubber, vacuum_cleaner, etc.)
 * @param {string} intensity - light, medium, or heavy
 * @param {string} subtype - Machine sub-type (walk_behind, rider, etc.)
 * @returns {Array} Array of attribute objects
 */
const getSpecTemplate = (category, intensity, subtype) => {
  // Default empty array if no template found
  let template = [];
  
  switch (category) {
    case 'floor_scrubber':
      template = floorScrubberTemplates[intensity]?.[subtype] || [];
      break;
    case 'vacuum_cleaner':
      template = vacuumCleanerTemplates[intensity]?.[subtype] || [];
      break;
    case 'pressure_washer':
      template = pressureWasherTemplates[intensity]?.[subtype] || [];
      break;
    // Add other categories as needed
    default:
      template = [];
  }
  
  // If no template found for specific subtype, try with generic 'standard'
  if (template.length === 0 && intensity) {
    // Try to get any template for this intensity
    const templates = {
      floor_scrubber: floorScrubberTemplates[intensity],
      vacuum_cleaner: vacuumCleanerTemplates[intensity],
      pressure_washer: pressureWasherTemplates[intensity]
    };
    const intensityTemplates = templates[category];
    if (intensityTemplates) {
      const firstKey = Object.keys(intensityTemplates)[0];
      if (firstKey) {
        template = intensityTemplates[firstKey] || [];
      }
    }
  }
  
  return template;
};

/**
 * Get all available attribute names (for dropdowns)
 * @returns {Array} List of common attribute names
 */
const getCommonAttributes = () => {
  const attributes = new Set();
  
  // Collect all attribute names from all templates
  const allTemplates = [
    ...Object.values(floorScrubberTemplates).flatMap(i => Object.values(i)).flat(),
    ...Object.values(vacuumCleanerTemplates).flatMap(i => Object.values(i)).flat(),
    ...Object.values(pressureWasherTemplates).flatMap(i => Object.values(i)).flat()
  ];
  
  allTemplates.forEach(attr => {
    if (attr.attribute_name) {
      attributes.add(attr.attribute_name);
    }
  });
  
  return Array.from(attributes).sort();
};

module.exports = {
  getSpecTemplate,
  getCommonAttributes,
  floorScrubberTemplates,
  vacuumCleanerTemplates,
  pressureWasherTemplates
};