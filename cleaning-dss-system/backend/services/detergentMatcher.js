// backend/services/detergentMatcher.js
const { Detergent } = require('../models/Detergent');
const Compatibility = require('../models/EquipmentDetergentCompatibilty');

/**
 * Find the best detergent for a given machine and user input.
 * Uses the EquipmentDetergentCompatibility table as the primary source.
 * Returns a single detergent document or null.
 */
const findBestDetergent = async (machine, userInput) => {
  const { surface_type, dirt_type, domain, eco_preference } = userInput;
  const surfaceArr = Array.isArray(surface_type) ? surface_type : (surface_type ? [surface_type] : []);
  const dirtArr = Array.isArray(dirt_type) ? dirt_type : (dirt_type ? [dirt_type] : []);

  console.log(`🔎 Finding detergent for machine: ${machine._id} (${machine.brand_name} ${machine.model_name})`);

  // 1. Get compatible detergent IDs from the junction table
  const compatRecords = await Compatibility.find({
    equipment_id: machine._id,
    is_recommended: true, // only recommended ones
  });
  const compatibleIds = compatRecords.map(rec => rec.detergent_id);
  console.log(`   Found ${compatibleIds.length} compatible detergents in junction table`);

  if (compatibleIds.length === 0) {
    console.warn(`   ⚠️ No compatible detergents found for this equipment.`);
    return null;
  }

  // 2. Build query on detergents, restricted to compatible IDs
  let query = {
    _id: { $in: compatibleIds },
    active: true,
  };

  if (machine?.intensity) query.intensity = machine.intensity;
  if (domain) {
    query.domain = { $in: [domain, 'both'] };
  } else {
    query.domain = { $in: ['commercial', 'both'] };
  }

  // 3. Apply user surface/dirt filters if provided
  if (surfaceArr.length > 0) {
    query.surface_compatibility = { $in: surfaceArr };
  }
  if (dirtArr.length > 0) {
    query.dirt_compatibility = { $in: dirtArr };
  }
  if (eco_preference) query.eco_certified = true;

  console.log(`   Query with user filters:`, query);

  let detergents = await Detergent.find(query);

  // 4. Relax query if no matches
  if (detergents.length === 0) {
    console.log(`   No detergents matched user filters. Relaxing query...`);
    const relaxedQuery = {
      _id: { $in: compatibleIds },
      active: true,
    };
    if (machine?.intensity) relaxedQuery.intensity = machine.intensity;
    if (domain) relaxedQuery.domain = { $in: [domain, 'both'] };
    detergents = await Detergent.find(relaxedQuery);
    console.log(`   Found ${detergents.length} after relaxation`);
  }

  // 5. Ultimate fallback: return ANY active detergent (ensures something is shown)
  if (detergents.length === 0) {
    console.warn(`   ⚠️ No detergents even after relaxation. Falling back to generic.`);
    detergents = await Detergent.find({ active: true }).limit(5);
  }

  // 6. Score & sort
  detergents.sort((a, b) => {
    // Prefer eco-certified
    if (a.eco_certified !== b.eco_certified) {
      return (b.eco_certified ? 1 : 0) - (a.eco_certified ? 1 : 0);
    }
    // Prefer lower price
    return (a.current_price_ugx || 0) - (b.current_price_ugx || 0);
  });

  const selected = detergents[0] || null;
  if (selected) {
    console.log(`   ✅ Selected: ${selected.product_name} (${selected.brand_name})`);
  } else {
    console.log(`   ❌ No detergent selected.`);
  }
  return selected;
};

module.exports = { findBestDetergent };