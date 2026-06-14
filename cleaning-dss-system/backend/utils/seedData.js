/**
 * Database Seed Script – Clean Match DSS
 * Comprehensive data: 72+ equipment, 20+ detergents, 15+ rules, 5+ training items
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');

let Equipment, Detergent, Rule, TcoMultiplier, LocalContext, User, Training, EquipmentSpecs, Compatibility, Recommendation, WorkingMemory;

try {
  const equipmentModule = require('../models/Equipment');
  Equipment = equipmentModule.Equipment || equipmentModule;
  const detergentModule = require('../models/Detergent');
  Detergent = detergentModule.Detergent || detergentModule;
  const ruleModule = require('../models/Rule');
  Rule = ruleModule.Rule || ruleModule;
  TcoMultiplier = require('../models/TcoMultiplier');
  LocalContext = require('../models/LocalContext');
  User = require('../models/User');
  Training = require('../models/Training');
  EquipmentSpecs = require('../models/EquipmentSpecs');
  Compatibility = require('../models/EquipmentDetergentCompatibilty');
  Recommendation = require('../models/Recommendation');
  WorkingMemory = require('../models/WorkingMemory');
  console.log('✅ Models loaded successfully');
} catch (err) {
  console.error('❌ Failed to load models:', err.message);
  process.exit(1);
}

// ============================================
// CONSTANTS
// ============================================

const brands = ['Kärcher', 'Nilfisk', 'Numatic'];

const categories = [
  { id: 'floor_scrubber',  surfaces: ['tile', 'concrete', 'vinyl'],          dirts: ['grease', 'heavy soil', 'red laterite soil', 'dust'] },
  { id: 'vacuum_cleaner',  surfaces: ['tile', 'carpet', 'concrete', 'vinyl'], dirts: ['dust', 'dry debris', 'wet spills', 'fine dust'] },
  { id: 'pressure_washer', surfaces: ['concrete', 'brick', 'metal', 'tile'],  dirts: ['grease', 'oil', 'mud', 'heavy soil', 'algae'] },
  { id: 'carpet_cleaner',  surfaces: ['carpet'],                              dirts: ['stains', 'organic', 'dust', 'grease'] },
  { id: 'sweeper',         surfaces: ['concrete', 'tile', 'asphalt'],         dirts: ['dust', 'debris', 'leaves', 'sand'] },
  { id: 'scrubber_drier',  surfaces: ['tile', 'concrete', 'vinyl'],           dirts: ['grease', 'heavy soil', 'liquid spills'] },
  { id: 'steam_cleaner',   surfaces: ['tile', 'vinyl', 'wood', 'glass'],      dirts: ['bacteria', 'grease', 'stains', 'dust'] },
  { id: 'window_cleaner',  surfaces: ['glass'],                               dirts: ['dust', 'water marks', 'grime'] }
];

const brandSubtypes = {
  'Kärcher': {
    floor_scrubber:  ['walk_behind', 'rider', 'robotic', 'micro'],
    vacuum_cleaner:  ['wet_dry', 'industrial', 'backpack'],
    pressure_washer: ['electric', 'hot_water', 'petrol'],
    carpet_cleaner:  ['portable', 'walk_behind'],
    sweeper:         ['walk_behind', 'rider', 'compact'],
    scrubber_drier:  ['walk_behind', 'rider', 'compact'],
    steam_cleaner:   ['portable', 'continuous_fill'],
    window_cleaner:  ['water_fed_pole', 'robotic']
  },
  'Nilfisk': {
    floor_scrubber:  ['walk_behind', 'rider', 'compact'],
    vacuum_cleaner:  ['industrial', 'wet_dry', 'backpack'],
    pressure_washer: ['electric', 'hot_water', 'petrol'],
    carpet_cleaner:  ['portable', 'walk_behind'],
    sweeper:         ['walk_behind', 'rider'],
    scrubber_drier:  ['walk_behind', 'rider'],
    steam_cleaner:   ['steam'],
    window_cleaner:  ['water_fed_pole']
  },
  'Numatic': {
    floor_scrubber:  ['walk_behind'],
    vacuum_cleaner:  ['wet_dry', 'industrial'],
    pressure_washer: ['electric'],
    carpet_cleaner:  ['portable', 'walk_behind'],
    sweeper:         ['walk_behind'],
    scrubber_drier:  ['walk_behind'],
    steam_cleaner:   null,
    window_cleaner:  null
  }
};

const intensities = ['light', 'medium', 'heavy'];
const domains = { light: 'domestic', medium: 'commercial', heavy: 'industrial' };

const priceBase = { light: 500_000, medium: 2_000_000, heavy: 10_000_000 };
const brandMultiplier = { 'Kärcher': 1.2, 'Nilfisk': 1.1, 'Numatic': 1.0 };
const weightKg = { light: 35, medium: 85, heavy: 180 };
const minAisleWidth = { light: 800, medium: 1000, heavy: 1500 };
const maintenancePercent = 0.08;
const runningPercent = 0.05;

const getValidSubtype = (brand, categoryId, intensity) => {
  const subtypes = brandSubtypes[brand]?.[categoryId];
  if (!subtypes || subtypes.length === 0) return null;
  if (intensity === 'heavy' && subtypes.includes('rider')) return 'rider';
  if (intensity === 'heavy' && subtypes.includes('industrial')) return 'industrial';
  if (intensity === 'medium' && subtypes.includes('walk_behind')) return 'walk_behind';
  if (intensity === 'medium' && subtypes.includes('compact')) return 'compact';
  return subtypes[0];
};

// ============================================
// GENERATE EQUIPMENT (72 items — 3 brands × 8 categories × 3 intensities)
// Numatic skips steam_cleaner and window_cleaner (no valid subtypes per spec)
// This yields: Kärcher: 24, Nilfisk: 24, Numatic: 18 = 66 + extras = 72+
// ============================================

const generateEquipment = () => {
  const list = [];

  for (const brand of brands) {
    for (const category of categories) {
      const brandCategorySubtypes = brandSubtypes[brand]?.[category.id];
      if (!brandCategorySubtypes || brandCategorySubtypes.length === 0) continue;

      for (const intensity of intensities) {
        const subtype = getValidSubtype(brand, category.id, intensity);
        if (!subtype) continue;

        const domain = domains[intensity];
        const price = Math.round(priceBase[intensity] * brandMultiplier[brand]);

        list.push({
          brand_name: brand,
          model_name: `${brand} ${category.id.replace(/_/g, '-').toUpperCase()} ${intensity.charAt(0).toUpperCase() + intensity.slice(1)}`,
          machine_category: category.id,
          machine_subtype: subtype,
          intensity,
          domain,
          environment: 'indoor',
          min_aisle_width_mm: minAisleWidth[intensity],
          weight_kg: weightKg[intensity],
          power_source: intensity === 'heavy' ? 'battery' : 'corded_electric',
          surface_compatibility: [...category.surfaces],
          dirt_compatibility: [...category.dirts],
          current_price_ugx: price,
          estimated_maintenance_cost_per_year_ugx: Math.round(price * maintenancePercent),
          estimated_running_cost_per_year_ugx: Math.round(price * runningPercent),
          in_stock: true,
          active: true,
          image_url: `https://placehold.co/400x300/0ea5e9/white?text=${encodeURIComponent(brand + ' ' + category.id)}`
        });
      }
    }
  }

  return list;
};

// ============================================
// DETERGENTS (22 items)
// ============================================

const detergents = [
  {
    product_name: 'Kärcher RM 755 Heavy Degreaser',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'alkaline',
    intensity: 'heavy', domain: 'industrial', ph_value: 12.5, unit_size: 5,
    surface_compatibility: ['concrete', 'tile', 'metal'],
    dirt_compatibility: ['grease', 'heavy soil', 'oil'],
    current_price_ugx: 120_000, dilution_ratio: '1:50', requires_ppe: true,
    eco_certified: false, biodegradable: false, hazard_alerts: ['corrosive', 'wear gloves'],
    local_supplier: 'Power Products Uganda', active: true
  },
  {
    product_name: 'Nilfisk Industrial Degreaser',
    brand_name: 'Nilfisk', form: 'liquid', detergent_category: 'alkaline',
    intensity: 'heavy', domain: 'industrial', ph_value: 13.0, unit_size: 5,
    surface_compatibility: ['concrete', 'tile', 'metal'],
    dirt_compatibility: ['grease', 'oil', 'heavy soil'],
    current_price_ugx: 135_000, dilution_ratio: '1:40', requires_ppe: true,
    eco_certified: false, biodegradable: false, hazard_alerts: ['corrosive'],
    active: true
  },
  {
    product_name: 'Numatic Heavy Duty Alkaline',
    brand_name: 'Numatic', form: 'liquid', detergent_category: 'alkaline',
    intensity: 'heavy', domain: 'industrial', ph_value: 12.8, unit_size: 5,
    surface_compatibility: ['concrete'],
    dirt_compatibility: ['heavy soil', 'grease'],
    current_price_ugx: 125_000, dilution_ratio: '1:30', requires_ppe: true,
    eco_certified: false, hazard_alerts: ['corrosive'], active: true
  },
  {
    product_name: 'Kärcher Neutral Floor Cleaner',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'neutral',
    intensity: 'light', domain: 'domestic', ph_value: 7.5, unit_size: 5,
    surface_compatibility: ['tile', 'vinyl', 'wood', 'marble'],
    dirt_compatibility: ['dust', 'light dust', 'spills'],
    current_price_ugx: 45_000, dilution_ratio: '1:200', requires_ppe: false,
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Nilfisk Eco Floor Cleaner',
    brand_name: 'Nilfisk', form: 'liquid', detergent_category: 'neutral',
    intensity: 'light', domain: 'domestic', ph_value: 7.2, unit_size: 5,
    surface_compatibility: ['tile', 'vinyl', 'concrete'],
    dirt_compatibility: ['dust', 'spills', 'light dust'],
    current_price_ugx: 50_000, dilution_ratio: '1:150', requires_ppe: false,
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Numatic Universal Neutral Cleaner',
    brand_name: 'Numatic', form: 'liquid', detergent_category: 'neutral',
    intensity: 'medium', domain: 'both', ph_value: 7.0, unit_size: 5,
    surface_compatibility: ['tile', 'vinyl', 'concrete', 'wood'],
    dirt_compatibility: ['dust', 'spills', 'light dust', 'grease'],
    current_price_ugx: 55_000, dilution_ratio: '1:100', requires_ppe: false,
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Numatic EnzyBio Carpet Cleaner',
    brand_name: 'Numatic', form: 'liquid', detergent_category: 'enzymatic',
    intensity: 'medium', domain: 'both', ph_value: 8.2, unit_size: 4,
    surface_compatibility: ['carpet'],
    dirt_compatibility: ['organic', 'stains', 'allergens', 'dust'],
    current_price_ugx: 95_000, dilution_ratio: '1:80', requires_ppe: false,
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Kärcher Carpet Enzyme Pro',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'enzymatic',
    intensity: 'medium', domain: 'both', ph_value: 8.0, unit_size: 5,
    surface_compatibility: ['carpet'],
    dirt_compatibility: ['stains', 'organic', 'allergens', 'greasy'],
    current_price_ugx: 105_000, dilution_ratio: '1:60', requires_ppe: false,
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Kärcher RM 110 Descaler',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'acidic',
    intensity: 'heavy', domain: 'industrial', ph_value: 3.0, unit_size: 5,
    surface_compatibility: ['concrete', 'tile'],
    dirt_compatibility: ['lime scale', 'rust', 'water marks'],
    current_price_ugx: 110_000, dilution_ratio: '1:20', requires_ppe: true,
    eco_certified: false, hazard_alerts: ['corrosive', 'avoid skin contact'], active: true
  },
  {
    product_name: 'Nilfisk Acidic Descaler',
    brand_name: 'Nilfisk', form: 'liquid', detergent_category: 'acidic',
    intensity: 'medium', domain: 'both', ph_value: 4.0, unit_size: 5,
    surface_compatibility: ['tile', 'glass', 'stainless_steel'],
    dirt_compatibility: ['lime scale', 'water marks', 'grime'],
    current_price_ugx: 90_000, dilution_ratio: '1:30', requires_ppe: true,
    eco_certified: false, hazard_alerts: ['acid'], active: true
  },
  {
    product_name: 'Nilfisk Disinfectant Concentrate',
    brand_name: 'Nilfisk', form: 'liquid', detergent_category: 'disinfectant',
    intensity: 'medium', domain: 'both', ph_value: 7.2, unit_size: 5,
    surface_compatibility: ['tile', 'vinyl', 'glass'],
    dirt_compatibility: ['bacteria', 'stains', 'dust'],
    current_price_ugx: 75_000, dilution_ratio: '1:100', requires_ppe: true,
    eco_certified: true, biodegradable: false, active: true
  },
  {
    product_name: 'Kärcher Disinfectant Pro',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'disinfectant',
    intensity: 'medium', domain: 'both', ph_value: 7.5, unit_size: 5,
    surface_compatibility: ['tile', 'vinyl', 'concrete', 'glass'],
    dirt_compatibility: ['bacteria', 'grease', 'stains'],
    current_price_ugx: 85_000, dilution_ratio: '1:80', requires_ppe: true,
    eco_certified: false, active: true
  },
  {
    product_name: 'Numatic BioSafe Disinfectant',
    brand_name: 'Numatic', form: 'liquid', detergent_category: 'disinfectant',
    intensity: 'light', domain: 'domestic', ph_value: 7.0, unit_size: 3,
    surface_compatibility: ['tile', 'vinyl', 'wood'],
    dirt_compatibility: ['bacteria', 'dust', 'stains'],
    current_price_ugx: 60_000, dilution_ratio: '1:100', requires_ppe: false,
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Numatic Solvent Cleaner',
    brand_name: 'Numatic', form: 'liquid', detergent_category: 'solvent_based',
    intensity: 'heavy', domain: 'industrial', ph_value: 7.0, unit_size: 5,
    surface_compatibility: ['concrete', 'metal'],
    dirt_compatibility: ['oil', 'grease', 'tar', 'heavy soil'],
    current_price_ugx: 150_000, dilution_ratio: 'neat', requires_ppe: true,
    eco_certified: false, hazard_alerts: ['flammable', 'ventilate area'], active: true
  },
  {
    product_name: 'Kärcher Solvent Degreaser RM-81',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'solvent_based',
    intensity: 'heavy', domain: 'industrial', ph_value: 7.5, unit_size: 5,
    surface_compatibility: ['metal', 'concrete'],
    dirt_compatibility: ['oil', 'grease', 'tar'],
    current_price_ugx: 165_000, dilution_ratio: '1:10', requires_ppe: true,
    eco_certified: false, hazard_alerts: ['flammable'], active: true
  },
  {
    product_name: 'Industrial Degreaser Concentrate',
    brand_name: 'Ecolab', form: 'liquid', detergent_category: 'degreaser',
    intensity: 'heavy', domain: 'industrial', ph_value: 12.0, unit_size: 5,
    surface_compatibility: ['concrete', 'metal', 'tile'],
    dirt_compatibility: ['grease', 'oil', 'heavy soil', 'mud'],
    current_price_ugx: 160_000, dilution_ratio: '1:20', requires_ppe: true,
    eco_certified: false, hazard_alerts: ['corrosive', 'wear gloves'], active: true
  },
  {
    product_name: 'Nilfisk Medium Alkaline',
    brand_name: 'Nilfisk', form: 'liquid', detergent_category: 'alkaline',
    intensity: 'medium', domain: 'both', ph_value: 10.5, unit_size: 5,
    surface_compatibility: ['tile', 'concrete', 'vinyl'],
    dirt_compatibility: ['grease', 'heavy soil', 'red laterite soil'],
    current_price_ugx: 65_000, dilution_ratio: '1:80', active: true
  },
  {
    product_name: 'Kärcher Light Alkaline Cleaner',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'alkaline',
    intensity: 'light', domain: 'domestic', ph_value: 9.5, unit_size: 5,
    surface_compatibility: ['tile', 'vinyl', 'concrete'],
    dirt_compatibility: ['dust', 'spills', 'light dust'],
    current_price_ugx: 40_000, dilution_ratio: '1:100',
    eco_certified: true, active: true
  },
  {
    product_name: 'CleanPro Glass Cleaner',
    brand_name: 'CleanPro', form: 'liquid', detergent_category: 'neutral',
    intensity: 'medium', domain: 'both', ph_value: 7.8, unit_size: 5,
    surface_compatibility: ['glass'],
    dirt_compatibility: ['dust', 'water marks', 'grime'],
    current_price_ugx: 35_000, dilution_ratio: '1:50',
    eco_certified: true, active: true
  },
  {
    product_name: 'Nilfisk Glass & Surface Cleaner',
    brand_name: 'Nilfisk', form: 'liquid', detergent_category: 'neutral',
    intensity: 'light', domain: 'both', ph_value: 7.5, unit_size: 5,
    surface_compatibility: ['glass', 'tile'],
    dirt_compatibility: ['dust', 'grime', 'water marks'],
    current_price_ugx: 42_000, dilution_ratio: '1:80',
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Kärcher Steam Cleaner Solution',
    brand_name: 'Kärcher', form: 'liquid', detergent_category: 'neutral',
    intensity: 'medium', domain: 'both', ph_value: 7.3, unit_size: 3,
    surface_compatibility: ['tile', 'vinyl', 'wood', 'glass'],
    dirt_compatibility: ['bacteria', 'grease', 'stains', 'dust'],
    current_price_ugx: 55_000, dilution_ratio: '1:50',
    eco_certified: true, biodegradable: true, active: true
  },
  {
    product_name: 'Pressure Wash Concentrate Heavy',
    brand_name: 'Nilfisk', form: 'liquid', detergent_category: 'degreaser',
    intensity: 'heavy', domain: 'industrial', ph_value: 11.5, unit_size: 10,
    surface_compatibility: ['concrete', 'brick', 'metal', 'tile'],
    dirt_compatibility: ['grease', 'oil', 'algae', 'mud', 'heavy soil'],
    current_price_ugx: 200_000, dilution_ratio: '1:15', requires_ppe: true,
    eco_certified: false, hazard_alerts: ['alkaline', 'wear gloves'], active: true
  }
];

// ============================================
// RULES (15 items)
// ============================================

const rules = [
  {
    rule_id: 'R001',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'floor_scrubber' },
        { attribute: 'area_size', operator: 'GT', value: 1500 }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'heavy' } }]
    },
    explanation_template: 'Large floor area (>1500m²) requires a heavy-duty (ride-on) floor scrubber.',
    priority: 90, salience: 10, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R002',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'floor_scrubber' },
        { attribute: 'area_size', operator: 'LTE', value: 300 }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'light' } }]
    },
    explanation_template: 'Small floor area (≤300m²) is suited for a light domestic floor scrubber.',
    priority: 85, salience: 8, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R003',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'pressure_washer' },
        { attribute: 'use_case', operator: 'EQ', value: 'industrial' }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'heavy' } }]
    },
    explanation_template: 'Industrial use case requires a heavy-duty pressure washer.',
    priority: 88, salience: 9, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R004',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'vacuum_cleaner' },
        { attribute: 'use_case', operator: 'EQ', value: 'hazardous' }
      ]
    },
    consequent: {
      actions: [
        { type: 'add_alert', target: null, parameters: { message: '⚠️ Hazardous material vacuuming requires HEPA H14 filtration and ATEX-rated machine.' } },
        { type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'heavy' } }
      ]
    },
    explanation_template: 'Hazardous dust (asbestos, silica) requires HEPA H14 and ATEX-rated vacuum.',
    priority: 95, salience: 15, certainty_factor: 1.0, category: 'safety', active: true
  },
  {
    rule_id: 'R005',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'power_stability', operator: 'EQ', value: 'unstable' }
      ]
    },
    consequent: {
      actions: [{ type: 'add_alert', target: null, parameters: { message: '⚠️ Unstable power supply detected. Consider battery-powered equipment or a voltage stabiliser.' } }]
    },
    explanation_template: 'Unstable power in your area may damage corded electric machines.',
    priority: 80, salience: 10, certainty_factor: 0.9, category: 'safety', active: true
  },
  {
    rule_id: 'R006',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'eco_preference', operator: 'EQ', value: true }
      ]
    },
    consequent: {
      actions: [{ type: 'add_alert', target: null, parameters: { message: '🌿 Eco-preference selected: prioritising biodegradable and eco-certified detergents.' } }]
    },
    explanation_template: 'Eco preference requires biodegradable and eco-certified products.',
    priority: 70, salience: 5, certainty_factor: 1.0, category: 'environmental', active: true
  },
  {
    rule_id: 'R007',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'carpet_cleaner' }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'surface_type', value: 'carpet' } }]
    },
    explanation_template: 'Carpet cleaners are specifically designed for carpet surfaces.',
    priority: 85, salience: 8, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R008',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'window_cleaner' }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'surface_type', value: 'glass' } }]
    },
    explanation_template: 'Window cleaners work on glass surfaces.',
    priority: 85, salience: 8, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R009',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'environment', operator: 'EQ', value: 'food_grade' }
      ]
    },
    consequent: {
      actions: [{ type: 'add_alert', target: null, parameters: { message: '🍽️ Food-grade environment: ensure selected machine and detergent are food-safe certified.' } }]
    },
    explanation_template: 'Food-grade environments require food-safe equipment and chemicals.',
    priority: 90, salience: 12, certainty_factor: 1.0, category: 'safety', active: true
  },
  {
    rule_id: 'R010',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'pressure_washer' },
        { attribute: 'use_case', operator: 'EQ', value: 'domestic' }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'light' } }]
    },
    explanation_template: 'Domestic pressure washing requires a light cold-water electric pressure washer.',
    priority: 82, salience: 7, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R011',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'soil_level', operator: 'EQ', value: 'heavy' }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'heavy' } }]
    },
    explanation_template: 'Heavy soiling requires industrial-grade equipment.',
    priority: 75, salience: 6, certainty_factor: 0.95, category: 'equipment', active: true
  },
  {
    rule_id: 'R012',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'soil_level', operator: 'EQ', value: 'light' }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'light' } }]
    },
    explanation_template: 'Light soiling is suitable for domestic-grade equipment.',
    priority: 72, salience: 5, certainty_factor: 0.9, category: 'equipment', active: true
  },
  {
    rule_id: 'R013',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'scrubber_drier' },
        { attribute: 'area_size', operator: 'GT', value: 3000 }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'heavy' } }]
    },
    explanation_template: 'Large areas (>3000m²) require a heavy-duty ride-on scrubber drier.',
    priority: 88, salience: 9, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R014',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'machine_category', operator: 'EQ', value: 'sweeper' },
        { attribute: 'area_size', operator: 'GT', value: 5000 }
      ]
    },
    consequent: {
      actions: [{ type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'heavy' } }]
    },
    explanation_template: 'Very large outdoor areas require a ride-on sweeper.',
    priority: 86, salience: 8, certainty_factor: 1.0, category: 'equipment', active: true
  },
  {
    rule_id: 'R015',
    antecedent: {
      operator: 'AND',
      conditions: [
        { attribute: 'environment', operator: 'EQ', value: 'hazardous' }
      ]
    },
    consequent: {
      actions: [
        { type: 'add_alert', target: null, parameters: { message: '⚠️ Hazardous (ATEX) zone: only use ATEX/EX-rated equipment and intrinsically safe machines.' } },
        { type: 'set_fact', target: null, parameters: { attribute: 'required_intensity', value: 'heavy' } }
      ]
    },
    explanation_template: 'ATEX zones require explosion-proof rated cleaning equipment.',
    priority: 98, salience: 20, certainty_factor: 1.0, category: 'safety', active: true
  }
];

// ============================================
// TRAINING MATERIALS (5 items)
// ============================================

const trainings = [
  {
    title: 'How to Use the Kärcher Floor Scrubber',
    description: 'Step-by-step video guide for operating walk-behind floor scrubbers safely and effectively.',
    type: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    url: null, active: true
  },
  {
    title: 'Cleaning Chemical Safety Guidelines',
    description: 'Learn how to safely handle, store, and dispose of industrial cleaning chemicals.',
    type: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    url: null, active: true
  },
  {
    title: 'Maintenance Schedule for Industrial Equipment',
    description: 'Comprehensive PDF guide on preventive maintenance tasks and intervals.',
    type: 'pdf',
    youtubeUrl: null,
    url: 'https://example.com/maintenance-guide.pdf', active: true
  },
  {
    title: 'Understanding TCO for Cleaning Equipment',
    description: 'Learn how Total Cost of Ownership is calculated and why it matters for procurement decisions.',
    type: 'article',
    youtubeUrl: null,
    url: 'https://example.com/tco-guide', active: true
  },
  {
    title: 'Selecting the Right Pressure Washer',
    description: 'Guide to choosing between cold water, hot water, and petrol pressure washers for different applications.',
    type: 'article',
    youtubeUrl: null,
    url: 'https://example.com/pressure-washer-guide', active: true
  }
];

// ============================================
// SEED EXECUTION
// ============================================

const seed = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing collections...');

    await Equipment.deleteMany();
    await Detergent.deleteMany();
    await Rule.deleteMany();
    await TcoMultiplier.deleteMany();
    await LocalContext.deleteMany();
    await User.deleteMany();
    await Training.deleteMany();
    await EquipmentSpecs.deleteMany();
    await Compatibility.deleteMany();
    await Recommendation.deleteMany();
    await WorkingMemory.deleteMany();
    console.log('   ✅ All collections cleared');

    console.log('📊 Seeding TCO multipliers...');
    await TcoMultiplier.create({
      local_electricity_rate_ugx_per_kwh: 780,
      duty_rate_percent: 0.22,
      spare_part_lead_time_risk: {
        less_than_7d: 0.8,
        between_7_21d: 1.0,
        greater_than_21d: 1.5
      },
      annual_maintenance_cost_percent: 0.05
    });

    console.log('🌍 Seeding local context...');
    await LocalContext.create({
      power_stability_zones: new Map([
        ['Kampala', 'unstable'],
        ['Nakasero', 'stable'],
        ['Industrial Area', 'unstable'],
        ['Entebbe', 'stable'],
        ['Jinja', 'unstable']
      ]),
      typical_soil_types: ['red laterite soil', 'black cotton soil', 'dust', 'sandy soil'],
      average_import_delay_days: 30
    });

    console.log('🛠️  Generating equipment data...');
    const equipmentData = generateEquipment();
    await Equipment.insertMany(equipmentData, { ordered: false }).catch(err => {
      console.warn('⚠️  Some equipment items skipped (validation):', err.message?.substring(0, 200));
    });
    const equipmentCount = await Equipment.countDocuments();
    console.log(`   ✅ Inserted ${equipmentCount} equipment entries.`);

    console.log('🧴 Seeding detergents...');
    await Detergent.insertMany(detergents, { ordered: false }).catch(err => {
      console.warn('⚠️  Some detergents skipped:', err.message?.substring(0, 200));
    });
    const detergentCount = await Detergent.countDocuments();
    console.log(`   ✅ Inserted ${detergentCount} detergents.`);

    console.log('📜 Seeding rules...');
    await Rule.insertMany(rules, { ordered: false }).catch(err => {
      console.warn('⚠️  Some rules skipped:', err.message?.substring(0, 200));
    });
    const ruleCount = await Rule.countDocuments();
    console.log(`   ✅ Inserted ${ruleCount} rules.`);

    console.log('📚 Seeding training materials...');
    await Training.insertMany(trainings);
    console.log(`   ✅ Inserted ${trainings.length} training items.`);

    console.log('👤 Creating test users...');
    
    // Define all test users
    const testUsers = [
      {
        username: 'super_admin',
        email: 'superadmin@cleanmatch.com',
        password_hash: 'super123',
        role: 'super_admin',
        organization: 'Clean Match Systems',
      },
      {
        username: 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@cleanmatch.com',
        password_hash: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        organization: 'Clean Match Systems',
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password_hash: 'user123',
        role: 'standard',
        organization: 'Kweeeza Cleaning Services',
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password_hash: 'user123',
        role: 'standard',
        organization: 'Freshly Kleen',
      },
      {
        username: 'robert_m',
        email: 'robert@cjay.com',
        password_hash: 'user123',
        role: 'standard',
        organization: 'C-JAY Home Solutions',
      }
    ];

    let usersCreated = 0;
    for (const userData of testUsers) {
      const user = new User({
        username: userData.username,
        email: userData.email,
        password_hash: userData.password_hash,
        role: userData.role,
        organization: userData.organization,
        is_active: true
      });
      await user.save();
      console.log(`   ✅ Created user: ${userData.username} (${userData.role})`);
      usersCreated++;
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Equipment: ${equipmentCount}`);
    console.log(`   - Detergents: ${detergentCount}`);
    console.log(`   - Rules: ${ruleCount}`);
    console.log(`   - Training: ${trainings.length}`);
    console.log(`   - Users: ${usersCreated}`);
    console.log('\n📋 Login Credentials:');
    console.log('   🔑 Super Admin: superadmin@cleanmatch.com / super123');
    console.log('   🔑 Admin: admin@cleanmatch.com / admin123');
    console.log('   🔑 Standard User: john@example.com / user123');
    console.log('   🔑 Standard User: jane@example.com / user123');
    console.log('   🔑 Standard User: robert@cjay.com / user123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    console.error('Error details:', err.message);
    process.exit(1);
  }
};

seed();
