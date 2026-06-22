/**
 * seedEquipmentCosts.js
 *
 * Reads equipment.json from the project root and updates
 * current_price_ugx, estimated_maintenance_cost_per_year_ugx, and
 * estimated_running_cost_per_year_ugx for every matching MongoDB record.
 *
 * USAGE (run from your project root):
 *   node scripts/seedEquipmentCosts.js
 *   node scripts/seedEquipmentCosts.js --overwrite       <- re-seeds records that already have prices
 *   node scripts/seedEquipmentCosts.js --dry-run         <- preview changes without writing to DB
 *   node scripts/seedEquipmentCosts.js --file=data/prices.json   <- use a different JSON file
 *
 * REQUIREMENTS:
 *   - MONGO_URI must be set in your .env or environment
 *   - npm install dotenv mongoose   (both are already in your project)
 */

'use strict';

const path    = require('path');
const fs      = require('fs');
const mongoose = require('mongoose');

// Load .env from project root (cleaning-dss-system/.env or parent .env)
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config(); // fall back to CWD
}

// ─── CLI flags ────────────────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const OVERWRITE = args.includes('--overwrite');
const DRY_RUN   = args.includes('--dry-run');
const fileArg   = args.find(a => a.startsWith('--file='));
const JSON_FILE = fileArg
  ? path.resolve(process.cwd(), fileArg.replace('--file=', ''))
  : path.resolve(__dirname, '..', 'equipment.json');

// ─── Minimal Equipment schema (only the fields we need) ──────────────────────
// We define a lean schema here so the script does not need to import the full
// Equipment model (which has brand-specific subtype validation in pre-save hooks
// that would reject perfectly valid records when only cost fields are touched).
const equipmentSchema = new mongoose.Schema({}, { strict: false });
const Equipment = mongoose.model('Equipment', equipmentSchema, 'equipments');

// ─── Main ────────────────────────────────────────────────────────────────────
(async () => {
  // 1. Validate environment
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('❌  MONGO_URI is not set. Add it to your .env file or export it before running.');
    process.exit(1);
  }

  // 2. Validate JSON file
  if (!fs.existsSync(JSON_FILE)) {
    console.error(`❌  JSON file not found at: ${JSON_FILE}`);
    console.error('    Make sure equipment.json exists in your project root, or pass --file=<path>');
    process.exit(1);
  }

  let equipmentData;
  try {
    equipmentData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  } catch (e) {
    console.error(`❌  Failed to parse JSON: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(equipmentData) || equipmentData.length === 0) {
    console.error('❌  JSON file must contain a non-empty array of equipment objects.');
    process.exit(1);
  }

  console.log(`\n🚀  Clean Match — Equipment Cost Seeder`);
  console.log(`    File      : ${JSON_FILE}`);
  console.log(`    Entries   : ${equipmentData.length}`);
  console.log(`    Overwrite : ${OVERWRITE}`);
  console.log(`    Dry run   : ${DRY_RUN}`);
  console.log(`    DB        : ${MONGO_URI.replace(/:\/\/[^@]+@/, '://<credentials>@')}\n`);

  // 3. Connect to MongoDB
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅  Connected to MongoDB\n');
  } catch (e) {
    console.error(`❌  Could not connect to MongoDB: ${e.message}`);
    process.exit(1);
  }

  // 4. Process each entry
  const results = { updated: 0, skipped: 0, notFound: 0, errors: [] };

  for (const entry of equipmentData) {
    const label = `${entry.brand_name || '?'} ${entry.model_name || '?'}`;

    // Validate required fields
    if (!entry.brand_name || !entry.model_name) {
      results.errors.push(`Missing brand_name or model_name: ${JSON.stringify(entry)}`);
      console.warn(`  ⚠️  Skipping entry — missing brand_name or model_name`);
      continue;
    }

    // Find matching record (case-insensitive)
    const existing = await Equipment.findOne({
      brand_name: { $regex: new RegExp(`^${escapeRegex(entry.brand_name)}$`, 'i') },
      model_name: { $regex: new RegExp(`^${escapeRegex(entry.model_name)}$`,  'i') },
    }).lean();

    if (!existing) {
      results.notFound++;
      results.errors.push(`Not found in DB: ${label}`);
      console.warn(`  ❓  Not found: ${label}`);
      continue;
    }

    // Decide whether to update
    const hasExistingCosts =
      (existing.current_price_ugx > 0) ||
      (existing.estimated_maintenance_cost_per_year_ugx > 0) ||
      (existing.estimated_running_cost_per_year_ugx > 0);

    if (hasExistingCosts && !OVERWRITE) {
      results.skipped++;
      console.log(`  ⏭️  Skipped (already has costs): ${label}`);
      continue;
    }

    // Build the update payload — only write fields that the JSON entry supplies
    const update = {};
    if (entry.current_price_ugx != null)
      update.current_price_ugx = entry.current_price_ugx;
    if (entry.estimated_maintenance_cost_per_year_ugx != null)
      update.estimated_maintenance_cost_per_year_ugx = entry.estimated_maintenance_cost_per_year_ugx;
    if (entry.estimated_running_cost_per_year_ugx != null)
      update.estimated_running_cost_per_year_ugx = entry.estimated_running_cost_per_year_ugx;

    if (Object.keys(update).length === 0) {
      results.skipped++;
      console.log(`  ⏭️  Skipped (no cost fields in JSON entry): ${label}`);
      continue;
    }

    // Log what will change
    const oldPrice = fmt(existing.current_price_ugx);
    const newPrice = fmt(update.current_price_ugx ?? existing.current_price_ugx);
    console.log(`  ✏️  ${label}`);
    console.log(`       Price      : ${oldPrice}  →  ${newPrice}`);
    console.log(`       Maintenance: ${fmt(existing.estimated_maintenance_cost_per_year_ugx)}  →  ${fmt(update.estimated_maintenance_cost_per_year_ugx ?? existing.estimated_maintenance_cost_per_year_ugx)}`);
    console.log(`       Running    : ${fmt(existing.estimated_running_cost_per_year_ugx)}  →  ${fmt(update.estimated_running_cost_per_year_ugx ?? existing.estimated_running_cost_per_year_ugx)}`);

    if (!DRY_RUN) {
      await Equipment.updateOne({ _id: existing._id }, { $set: update });
    }

    results.updated++;
  }

  // 5. Summary
  console.log('\n──────────────────────────────────────────');
  console.log(`  ✅  Updated  : ${results.updated}`);
  console.log(`  ⏭️  Skipped  : ${results.skipped}`);
  console.log(`  ❓  Not found: ${results.notFound}`);
  if (results.errors.length) {
    console.log(`\n  ⚠️  Issues (${results.errors.length}):`);
    results.errors.forEach(e => console.log(`     • ${e}`));
  }
  if (DRY_RUN) {
    console.log('\n  ℹ️  DRY RUN — no changes were written to the database.');
  }
  console.log('──────────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
})();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fmt(value) {
  if (value == null) return 'null';
  return `UGX ${Number(value).toLocaleString('en-UG')}`;
}
