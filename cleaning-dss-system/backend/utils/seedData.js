/**
 * Database Seed Script – Clean Match DSS
 * ========================================
 * Populates the database with:
 * - 81 equipment entries (3 brands x 9 categories x 3 intensities)
 * - 12 detergents (covering all 8 categories)
 * - 13 rules (R01–R10, D01–D03)
 * - TCO multipliers (Uganda context)
 * - Local context (power stability zones, soil types)
 * - Training materials (YouTube videos, PDFs)
 * - Sample recommendation history (optional)
 * - Admin user (configurable via .env)
 *
 * Usage: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const Equipment = require('../models/Equipment');
const Detergent = require('../models/Detergent');
const Rule = require('../models/Rule');
const TcoMultiplier = require('../models/TcoMultiplier');
const LocalContext = require('../models/LocalContext');
const User = require('../models/User');
const Training = require('../models/Training');
const RecommendationHistory = require('../models/RecommendationHistory');
const roles = require('../config/roles');

// ----------------------------------------------------------------------
// 1. Helper: Generate equipment data for all brand/category/intensity combinations
// ----------------------------------------------------------------------
const brands = ['Kärcher', 'Nilfisk', 'Numatic'];

const categories = [
  { name: 'floor_scrubber_industrial', domain: 'industrial', surfaces: ['concrete', 'tile'], dirts: ['grease', 'heavy soil', 'red laterite soil'] },
  { name: 'floor_scrubber_domestic', domain: 'domestic', surfaces: ['tile', 'vinyl', 'wood'], dirts: ['light dust', 'spills', 'dust'] }, // removed 'footprints'
  { name: 'carpet_extractor_industrial', domain: 'industrial', surfaces: ['carpet'], dirts: ['grease', 'organic', 'heavy soil'] },
  { name: 'carpet_extractor_domestic', domain: 'domestic', surfaces: ['carpet'], dirts: ['spills', 'light dust', 'organic'] },
  { name: 'wet_dry_vac_industrial', domain: 'industrial', surfaces: ['concrete', 'tile', 'carpet'], dirts: ['dust', 'spills', 'heavy soil'] },
  { name: 'wet_dry_vac_domestic', domain: 'domestic', surfaces: ['tile', 'vinyl', 'carpet'], dirts: ['dust', 'spills'] },
  { name: 'pressure_washer_industrial', domain: 'industrial', surfaces: ['concrete', 'tile', 'stainless_steel'], dirts: ['grease', 'oil', 'heavy soil'] }, // removed 'brick','metal'
  { name: 'pressure_washer_domestic', domain: 'domestic', surfaces: ['concrete', 'wood', 'glass'], dirts: ['light dust', 'spills'] },
  { name: 'sweeper_industrial', domain: 'industrial', surfaces: ['concrete', 'tile'], dirts: ['dust', 'debris', 'heavy soil'] } // removed 'asphalt'
];

const intensities = ['light', 'medium', 'heavy'];

// Price base (UGX) per domain and intensity
const priceBase = {
  domestic: { light: 500_000, medium: 1_500_000, heavy: 3_000_000 },
  industrial: { light: 2_000_000, medium: 5_000_000, heavy: 15_000_000 }
};

// Brand price multiplier
const brandMultiplier = { Kärcher: 1.2, Nilfisk: 1.1, Numatic: 1.0 };

// Spare part lead time (days) per intensity
const leadTime = { light: 7, medium: 14, heavy: 28 };

// Power (kW) per intensity
const powerKW = { light: 0.5, medium: 1.2, heavy: 2.5 };

// Motor type per intensity
const motorType = { light: 'brushed DC', medium: 'induction', heavy: 'brushless' };

// Noise level (dB) per intensity
const noiseLevel = { light: 65, medium: 70, heavy: 75 };

// Materials per intensity (fixed: 'steel' → 'stainless_steel')
const materials = {
  light: ['plastic', 'aluminum'],
  medium: ['plastic', 'stainless_steel'],
  heavy: ['stainless_steel']
};

// Eco certified only for light domestic
const isEcoCertified = (domain, intensity) => domain === 'domestic' && intensity === 'light';

// Local supplier name
const localSupplier = 'Power Products Uganda Ltd';

// Generate a placeholder image URL for equipment
const getEquipmentImageUrl = (brand, categoryName, intensity) => {
  const slug = `${brand.toLowerCase().replace(/[^a-z]/g, '')}-${categoryName.replace(/_/g, '-')}-${intensity}`;
  return `https://via.placeholder.com/500/0066cc/ffffff?text=${encodeURIComponent(slug)}`;
};

const generateEquipment = () => {
  const equipmentList = [];
  for (const brand of brands) {
    for (const category of categories) {
      for (const intensity of intensities) {
        const domain = category.domain;
        const price = Math.round(priceBase[domain][intensity] * brandMultiplier[brand]);
        const name = `${brand} ${category.name.replace(/_/g, ' ')} - ${intensity.toUpperCase()} Duty`;
        
        equipmentList.push({
          name,
          brand,
          category: category.name,
          intensity,
          domain,
          price_ugx: price,
          spare_part_lead_time_days: leadTime[intensity],
          power_req: { kW: powerKW[intensity], type: powerKW[intensity] > 2 ? 'battery' : 'corded' },
          motor_type: motorType[intensity],
          noise_level_db: noiseLevel[intensity],
          compatible_surfaces: category.surfaces,
          compatible_dirt_types: category.dirts,
          materials: materials[intensity],
          eco_certified: isEcoCertified(domain, intensity),
          in_stock: true,
          local_supplier: localSupplier,
          image_url: getEquipmentImageUrl(brand, category.name, intensity),
          active: true
        });
      }
    }
  }
  return equipmentList;
};

// ----------------------------------------------------------------------
// 2. Detergents data (12 entries covering all categories)
// ----------------------------------------------------------------------
const detergents = [
  // Heavy-duty alkaline (industrial)
  {
    name: 'Kärcher RM 755 Heavy Degreaser',
    brand: 'Kärcher',
    category: 'alkaline_heavy',
    intensity: 'heavy',
    domain: 'industrial',
    ph: 12.5,
    dilution_ratio: '1:50',
    compatible_surfaces: ['concrete', 'tile'],
    incompatible_surfaces: ['marble', 'aluminum'],
    compatible_machine_materials: ['stainless_steel', 'plastic'],
    incompatible_machine_materials: ['aluminum'],
    compatible_dirt_types: ['grease', 'heavy soil', 'red laterite soil', 'oil'],
    eco_certified: false,
    hazard_alerts: ['corrosive'],
    requires_ppe: true,
    price_ugx: 120_000,
    package_size_liters: 5,
    local_supplier: 'Power Products',
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/ff6600/ffffff?text=Karcher+Degreaser',
    active: true
  },
  {
    name: 'Nilfisk Industrial Degreaser',
    brand: 'Nilfisk',
    category: 'alkaline_heavy',
    intensity: 'heavy',
    domain: 'industrial',
    ph: 13.0,
    dilution_ratio: '1:40',
    compatible_surfaces: ['concrete', 'tile'],
    incompatible_surfaces: ['aluminum'],
    compatible_dirt_types: ['grease', 'oil'],
    price_ugx: 135_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/ff6600/ffffff?text=Nilfisk+Degreaser',
    active: true
  },
  // Light neutral cleaner (domestic) – fixed 'footprints' dirt
  {
    name: 'Kärcher Neutral Floor Cleaner',
    brand: 'Kärcher',
    category: 'neutral',
    intensity: 'light',
    domain: 'domestic',
    ph: 7.5,
    dilution_ratio: '1:200',
    compatible_surfaces: ['tile', 'vinyl', 'wood', 'marble'],
    compatible_dirt_types: ['light dust', 'spills'],
    eco_certified: true,
    biodegradable: true,
    price_ugx: 45_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/33cc33/ffffff?text=Karcher+Neutral',
    active: true
  },
  {
    name: 'Nilfisk Eco Floor Cleaner',
    brand: 'Nilfisk',
    category: 'neutral',
    intensity: 'light',
    domain: 'domestic',
    ph: 7.2,
    dilution_ratio: '1:150',
    compatible_surfaces: ['tile', 'vinyl'],
    compatible_dirt_types: ['light dust', 'spills'],
    eco_certified: true,
    price_ugx: 50_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/33cc33/ffffff?text=Nilfisk+Eco',
    active: true
  },
  // Enzymatic carpet cleaner (medium intensity)
  {
    name: 'Numatic EnzyBio Carpet Cleaner',
    brand: 'Numatic',
    category: 'enzymatic',
    intensity: 'medium',
    domain: 'both',
    ph: 8.2,
    dilution_ratio: '1:80',
    compatible_surfaces: ['carpet', 'upholstery'],
    compatible_dirt_types: ['organic'],
    eco_certified: true,
    biodegradable: true,
    price_ugx: 95_000,
    package_size_liters: 4,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/0099cc/ffffff?text=EnzyBio',
    active: true
  },
  // Acidic descaling (industrial heavy) – fixed 'metal' surface
  {
    name: 'Kärcher RM 110 Descaler',
    brand: 'Kärcher',
    category: 'acidic',
    intensity: 'heavy',
    domain: 'industrial',
    ph: 3.0,
    dilution_ratio: '1:20',
    compatible_surfaces: ['concrete', 'stainless_steel'],
    incompatible_surfaces: ['marble', 'aluminum'],
    compatible_dirt_types: ['lime scale', 'rust'],
    hazard_alerts: ['corrosive'],
    price_ugx: 110_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/ff3300/ffffff?text=Descaler',
    active: true
  },
  // Disinfectant (medium intensity, both domains)
  {
    name: 'Nilfisk Disinfectant Concentrate',
    brand: 'Nilfisk',
    category: 'disinfectant',
    intensity: 'medium',
    domain: 'both',
    ph: 7.2,
    dilution_ratio: '1:100',
    compatible_surfaces: ['tile', 'vinyl', 'stainless_steel', 'glass'],
    compatible_dirt_types: ['bacteria', 'viruses', 'fungi'],
    eco_certified: true,
    price_ugx: 75_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/33ccff/ffffff?text=Disinfectant',
    active: true
  },
  // Specialty carpet shampoo (medium intensity)
  {
    name: 'Kärcher Carpet Shampoo',
    brand: 'Kärcher',
    category: 'specialty_carpet',
    intensity: 'medium',
    domain: 'both',
    ph: 9.0,
    dilution_ratio: '1:100',
    compatible_surfaces: ['carpet'],
    compatible_dirt_types: ['grease', 'organic', 'spills'],
    price_ugx: 85_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/9966ff/ffffff?text=Carpet+Shampoo',
    active: true
  },
  // Solvent-based (industrial heavy) – fixed 'metal' surface
  {
    name: 'Numatic Solvent Cleaner',
    brand: 'Numatic',
    category: 'solvent_based',
    intensity: 'heavy',
    domain: 'industrial',
    ph: 7.0,
    dilution_ratio: 'neat',
    compatible_surfaces: ['concrete', 'stainless_steel'],
    compatible_dirt_types: ['oil', 'grease', 'tar'],
    hazard_alerts: ['flammable', 'respiratory hazard'],
    requires_ppe: true,
    price_ugx: 150_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/666666/ffffff?text=Solvent',
    active: true
  },
  // Additional light alkaline (domestic)
  {
    name: 'Kärcher Light Alkaline Cleaner',
    brand: 'Kärcher',
    category: 'alkaline_light',
    intensity: 'light',
    domain: 'domestic',
    ph: 9.5,
    dilution_ratio: '1:100',
    compatible_surfaces: ['tile', 'vinyl'],
    compatible_dirt_types: ['light dust', 'spills'],
    eco_certified: true,
    price_ugx: 40_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/66cc66/ffffff?text=Light+Alkaline',
    active: true
  },
  // Medium alkaline for commercial use
  {
    name: 'Nilfisk Medium Alkaline',
    brand: 'Nilfisk',
    category: 'alkaline_light',
    intensity: 'medium',
    domain: 'both',
    ph: 10.5,
    dilution_ratio: '1:80',
    compatible_surfaces: ['tile', 'concrete'],
    compatible_dirt_types: ['grease', 'heavy soil'],
    price_ugx: 65_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/ffaa33/ffffff?text=Medium+Alkaline',
    active: true
  },
  // Heavy alkaline for industrial (another brand)
  {
    name: 'Numatic Heavy Duty Alkaline',
    brand: 'Numatic',
    category: 'alkaline_heavy',
    intensity: 'heavy',
    domain: 'industrial',
    ph: 12.8,
    dilution_ratio: '1:30',
    compatible_surfaces: ['concrete'],
    compatible_dirt_types: ['heavy soil', 'grease'],
    hazard_alerts: ['corrosive'],
    price_ugx: 125_000,
    package_size_liters: 5,
    in_stock: true,
    image_url: 'https://via.placeholder.com/300/cc3300/ffffff?text=Heavy+Alkaline',
    active: true
  }
];

// ----------------------------------------------------------------------
// 3. Rules (unchanged)
// ----------------------------------------------------------------------
const rules = [
  {
    rule_id: 'R01',
    condition: { surface: 'tile', dirt: 'red laterite soil' },
    action: { type: 'modify_score', factor: 1.5, message: 'High pressure scrubber recommended for red soil on tile.' },
    priority: 10,
    category: 'equipment',
    active: true
  },
  {
    rule_id: 'R02',
    condition: { power_supply_stability: 'unstable', motor_type: 'brushed DC' },
    action: { type: 'add_alert', message: '⚠️ Use a surge protector – unstable power may damage this machine.' },
    priority: 9,
    category: 'equipment',
    active: true
  },
  {
    rule_id: 'R03',
    condition: { 'machine.materials': 'aluminum', 'detergent.ph': { $gt: 12 } },
    action: { type: 'add_alert', message: '⚠️ High alkaline detergent may corrode aluminum parts. Rinse thoroughly.' },
    priority: 8,
    category: 'detergent',
    active: true
  },
  {
    rule_id: 'R04',
    condition: { category: 'floor_scrubber_industrial', spare_part_lead_time_days: { $gt: 21 } },
    action: { type: 'modify_score', factor: 0.6, message: 'Long spare part lead time reduces recommendation score.' },
    priority: 8,
    category: 'equipment',
    active: true
  },
  {
    rule_id: 'R05',
    condition: { environment: 'noise_sensitive', noise_level_db: { $gt: 70 } },
    action: { type: 'exclude', message: 'Machine too noisy for this environment.' },
    priority: 7,
    category: 'equipment',
    active: true
  },
  {
    rule_id: 'R06',
    condition: { imported: true, duty_rate_percent: { $gt: 15 } },
    action: { type: 'modify_score', factor: 0.9, message: 'High import duty increases total cost.' },
    priority: 6,
    category: 'equipment',
    active: true
  },
  {
    rule_id: 'R07',
    condition: { surface: 'vinyl', pad_type: 'steel wire' },
    action: { type: 'add_alert', message: '⚠️ Steel wire pad will damage vinyl surface.' },
    priority: 9,
    category: 'detergent',
    active: true
  },
  {
    rule_id: 'R08',
    condition: { eco_required: true, 'detergent.eco_certified': false },
    action: { type: 'modify_score', factor: 0.5, message: 'Eco‑friendly requirement not met.' },
    priority: 7,
    category: 'detergent',
    active: true
  },
  {
    rule_id: 'R09',
    condition: { concentration_exceeds_recommended: true },
    action: { type: 'add_alert', message: '⚠️ Detergent concentration exceeds safe limit. Dilute further.' },
    priority: 8,
    category: 'detergent',
    active: true
  },
  {
    rule_id: 'R10',
    condition: { budget_tco_ratio: { $gt: 1.2 } },
    action: { type: 'modify_score', factor: 0.8, message: 'TCO exceeds budget by more than 20%.' },
    priority: 5,
    category: 'equipment',
    active: true
  },
  {
    rule_id: 'D01',
    condition: { 'machine.materials': 'aluminum', 'detergent.ph': { $lt: 5 } },
    action: { type: 'add_alert', message: '⚠️ Acidic detergent may corrode aluminum parts.' },
    priority: 8,
    category: 'detergent',
    active: true
  },
  {
    rule_id: 'D02',
    condition: { surface: 'marble', 'detergent.ph': { $lt: 6 } },
    action: { type: 'exclude', message: 'Acidic detergent will etch marble surface.' },
    priority: 10,
    category: 'detergent',
    active: true
  },
  {
    rule_id: 'D03',
    condition: { 'detergent.hazard_alerts': { $in: ['corrosive'] }, requires_ppe: false },
    action: { type: 'add_alert', message: '⚠️ Corrosive detergent – PPE required (gloves, goggles).' },
    priority: 9,
    category: 'detergent',
    active: true
  }
];

// ----------------------------------------------------------------------
// 4. Training materials (unchanged)
// ----------------------------------------------------------------------
const trainings = [
  {
    title: 'How to Use the Kärcher BR 30/4 C Floor Scrubber',
    description: 'Step-by-step video guide for operating the Kärcher BR 30/4 C floor scrubber, including safety checks and maintenance.',
    type: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    url: null,
    machineId: null,
    active: true
  },
  {
    title: 'Cleaning Chemical Safety Guidelines',
    description: 'Learn how to handle detergents safely, understand pH levels, and use PPE correctly.',
    type: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=example2',
    url: null,
    machineId: null,
    active: true
  },
  {
    title: 'Maintenance Schedule for Industrial Floor Scrubbers',
    description: 'PDF guide on daily, weekly, and monthly maintenance tasks.',
    type: 'pdf',
    youtubeUrl: null,
    url: 'https://example.com/maintenance-guide.pdf',
    machineId: null,
    active: true
  },
  {
    title: 'How to Choose the Right Detergent for Your Surface',
    description: 'Short video explaining detergent compatibility with different floor types.',
    type: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=example3',
    url: null,
    machineId: null,
    active: true
  }
];

// ----------------------------------------------------------------------
// 5. Seed execution
// ----------------------------------------------------------------------
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
    await RecommendationHistory.deleteMany();

    // 1. TCO Multipliers
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

    // 2. Local Context
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

    // 3. Equipment
    console.log('🛠️  Generating equipment data (81 items)...');
    const equipmentData = generateEquipment();
    await Equipment.insertMany(equipmentData);
    console.log(`   ✅ Inserted ${equipmentData.length} equipment entries.`);

    // 4. Detergents
    console.log('🧴 Seeding detergents...');
    await Detergent.insertMany(detergents);
    console.log(`   ✅ Inserted ${detergents.length} detergents.`);

    // 5. Rules
    console.log('📜 Seeding rules...');
    await Rule.insertMany(rules);
    console.log(`   ✅ Inserted ${rules.length} rules.`);

    // 6. Training
    console.log('📚 Seeding training materials...');
    await Training.insertMany(trainings);
    console.log(`   ✅ Inserted ${trainings.length} training items.`);

    // 7. Admin user
    console.log('👤 Creating admin user...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@cleanmatch.com',
      password: hashedPassword,
      role: roles.ADMIN,
      is_active: true
    });
    console.log(`   ✅ Admin user created (username: admin, password: ${adminPassword})`);

    // 8. Sample recommendation history
    console.log('📜 Seeding sample recommendation history...');
    const sampleEquipment = await Equipment.findOne({ brand: 'Kärcher', intensity: 'medium' });
    const sampleDetergent = await Detergent.findOne({ category: 'neutral' });
    if (sampleEquipment && sampleDetergent) {
      const sampleHistory = [
        {
          userId: adminUser._id,
          timestamp: new Date(),
          input: {
            surfaceType: 'tile',
            dirtType: 'grease',
            domain: 'industrial',
            usageHoursPerWeek: 20,
            areaSizeM2: 500,
            budgetUgx: 5000000,
            powerStability: 'stable',
            ecoRequired: false,
            noiseSensitive: false
          },
          intensity: 'medium',
          category: 'floor_scrubber_industrial',
          recommendations: [
            {
              machineId: sampleEquipment._id,
              machineName: sampleEquipment.name,
              detergentId: sampleDetergent._id,
              detergentName: sampleDetergent.name,
              tco: 7500000,
              score: 92
            }
          ]
        },
        {
          userId: adminUser._id,
          timestamp: new Date(Date.now() - 86400000),
          input: {
            surfaceType: 'carpet',
            dirtType: 'organic',
            domain: 'domestic',
            usageHoursPerWeek: 5,
            areaSizeM2: 100,
            budgetUgx: 2000000,
            powerStability: 'stable',
            ecoRequired: true,
            noiseSensitive: true
          },
          intensity: 'light',
          category: 'carpet_extractor_domestic',
          recommendations: [
            {
              machineId: sampleEquipment._id,
              machineName: sampleEquipment.name,
              detergentId: sampleDetergent._id,
              detergentName: sampleDetergent.name,
              tco: 2200000,
              score: 88
            }
          ]
        }
      ];
      await RecommendationHistory.insertMany(sampleHistory);
      console.log(`   ✅ Inserted ${sampleHistory.length} sample history entries.`);
    } else {
      console.log('   ⚠️ Could not create sample history – no equipment/detergent found.');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();