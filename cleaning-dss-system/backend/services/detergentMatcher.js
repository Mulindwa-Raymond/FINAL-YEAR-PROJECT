// backend/services/detergentMatcher.js
const { Detergent } = require('../models/Detergent');
const Compatibility = require('../models/EquipmentDetergentCompatibilty');

/**
 * Map equipment domain → detergent domain.
 * Equipment uses: 'domestic' | 'commercial' | 'industrial'
 * Detergent uses: 'domestic' | 'industrial' | 'both'
 * 'commercial' has no detergent equivalent, so we map it to 'industrial'.
 */
const toDetergentDomain = (equipmentDomain) => {
  if (!equipmentDomain) return null;
  if (equipmentDomain === 'commercial') return 'industrial';
  return equipmentDomain; // 'domestic' and 'industrial' pass through unchanged
};

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

  // Map domain to detergent vocabulary (fixes 'commercial' → 'industrial' mismatch)
  const detergentDomain = toDetergentDomain(domain || machine.domain);
  console.log(`   Domain mapping: "${domain || machine.domain}" → "${detergentDomain}"`);

  const domainFilter = detergentDomain
    ? { $in: [detergentDomain, 'both'] }
    : { $in: ['industrial', 'both'] };

  // 1. Get compatible detergent IDs from the junction table
  // Guard: machine._id must exist (Mongoose Document _id)
  let compatibleIds = [];
  if (machine._id) {
    const compatRecords = await Compatibility.find({
      equipment_id: machine._id,
      is_recommended: true,
    });
    compatibleIds = compatRecords.map(rec => rec.detergent_id);
    console.log(`   Found ${compatibleIds.length} compatible detergents in junction table`);
  } else {
    console.warn(`   ⚠️ machine._id is missing — skipping junction table lookup`);
  }

  if (compatibleIds.length === 0) {
    console.warn(`   ⚠️ No compatible detergents in junction table for this equipment. Falling back to attribute match.`);
    return findByAttributeMatch(machine, surfaceArr, dirtArr, detergentDomain, eco_preference);
  }

  // 2. Build strict query: junction-table IDs + domain + surface + dirt + eco
  //    Note: intensity is NOT added here — detergent intensity ≠ equipment intensity.
  //    Equipment intensity is a machine-power spec; the detergent's own intensity
  //    describes chemical strength. Over-constraining on this field eliminates valid matches.
  let query = {
    _id: { $in: compatibleIds },
    active: true,
    domain: domainFilter,
  };

  if (surfaceArr.length > 0) {
    query.surface_compatibility = { $in: surfaceArr };
  }
  if (dirtArr.length > 0) {
    query.dirt_compatibility = { $in: dirtArr };
  }
  if (eco_preference) query.eco_certified = true;

  console.log(`   Strict query:`, JSON.stringify(query));
  let detergents = await Detergent.find(query);
  console.log(`   Strict query found: ${detergents.length}`);

  // 3. Relax: drop surface/dirt/eco filters, keep domain + junction IDs
  if (detergents.length === 0) {
    console.log(`   Relaxing (drop surface/dirt/eco)...`);
    detergents = await Detergent.find({
      _id: { $in: compatibleIds },
      active: true,
      domain: domainFilter,
    });
    console.log(`   Relaxed (domain only) found: ${detergents.length}`);
  }

  // 4. Relax further: any active detergent in the junction table (ignore domain)
  if (detergents.length === 0) {
    console.log(`   Relaxing to any active compatible detergent...`);
    detergents = await Detergent.find({ _id: { $in: compatibleIds }, active: true });
    console.log(`   Any-compatible found: ${detergents.length}`);
  }

  // 5. Ultimate fallback: attribute-based match (no junction table constraint)
  if (detergents.length === 0) {
    console.warn(`   ⚠️ Junction table records inactive or domain mismatch. Falling back to attribute match.`);
    return findByAttributeMatch(machine, surfaceArr, dirtArr, detergentDomain, eco_preference);
  }

  return pickBest(detergents);
};

/**
 * Attribute-based fallback when junction table has no usable records.
 * Progressively relaxes domain → surface/dirt → any active detergent.
 * Intensity is intentionally NOT used as a primary filter because equipment
 * intensity (machine power class) does not map 1-to-1 to detergent intensity
 * (chemical strength), causing valid detergents to be incorrectly excluded.
 */
const findByAttributeMatch = async (machine, surfaceArr, dirtArr, detergentDomain, eco_preference) => {
  const domainFilter = detergentDomain
    ? { $in: [detergentDomain, 'both'] }
    : { $in: ['industrial', 'both'] };

  // Pass 1: domain + surface + dirt + eco
  let query = { active: true, domain: domainFilter };
  if (surfaceArr.length > 0) query.surface_compatibility = { $in: surfaceArr };
  if (dirtArr.length > 0) query.dirt_compatibility = { $in: dirtArr };
  if (eco_preference) query.eco_certified = true;

  let detergents = await Detergent.find(query);
  console.log(`   Attribute match (domain+surface+dirt) found: ${detergents.length}`);

  // Pass 2: domain + surface/dirt (drop eco)
  if (detergents.length === 0 && eco_preference) {
    const q2 = { active: true, domain: domainFilter };
    if (surfaceArr.length > 0) q2.surface_compatibility = { $in: surfaceArr };
    if (dirtArr.length > 0) q2.dirt_compatibility = { $in: dirtArr };
    detergents = await Detergent.find(q2);
    console.log(`   Attribute match (domain+surface+dirt, no eco) found: ${detergents.length}`);
  }

  // Pass 3: domain only (drop surface/dirt/eco)
  if (detergents.length === 0) {
    detergents = await Detergent.find({ active: true, domain: domainFilter });
    console.log(`   Attribute match (domain only) found: ${detergents.length}`);
  }

  // Pass 4: absolute last resort — any active detergent
  if (detergents.length === 0) {
    detergents = await Detergent.find({ active: true }).limit(10);
    console.log(`   Last resort (any active) found: ${detergents.length}`);
  }

  return pickBest(detergents);
};

/**
 * Score and pick the best detergent from a list.
 */
const pickBest = (detergents) => {
  if (!detergents || detergents.length === 0) return null;

  detergents.sort((a, b) => {
    // Prefer eco-certified
    if (a.eco_certified !== b.eco_certified) {
      return (b.eco_certified ? 1 : 0) - (a.eco_certified ? 1 : 0);
    }
    // Prefer lower price
    return (a.current_price_ugx || 0) - (b.current_price_ugx || 0);
  });

  const selected = detergents[0];
  console.log(`   ✅ Selected detergent: ${selected.product_name} (${selected.brand_name})`);
  return selected;
};

module.exports = { findBestDetergent };
