/**
 * Check compatibility and return alerts if any.
 * @param {Object} detergent - Mongoose detergent document.
 * @param {Object} machine - Mongoose equipment document.
 * @param {string} surfaceType - e.g., 'tile', 'concrete', 'marble'.
 * @returns {Object} { compatible: boolean, alerts: string[] }
 */
const checkCompatibility = (detergent, machine, surfaceType) => {
  const alerts = [];

  // 1. Surface compatibility
  if (detergent.incompatible_surfaces?.includes(surfaceType)) {
    alerts.push(`Detergent ${detergent.product_name} is incompatible with ${surfaceType}.`);
    return { compatible: false, alerts };
  }
  if (!detergent.surface_compatibility?.includes(surfaceType) && detergent.surface_compatibility?.length) {
    alerts.push(`Detergent ${detergent.product_name} has not been tested on ${surfaceType}. Use with caution.`);
    // Not a hard block, but alert
  }

  // 2. Machine material incompatibility
  if (machine.materials && detergent.incompatible_machine_materials) {
    const badMaterial = machine.materials.find(mat => detergent.incompatible_machine_materials.includes(mat));
    if (badMaterial) {
      alerts.push(`⚠️ Detergent ${detergent.product_name} may damage machine parts made of ${badMaterial}.`);
      return { compatible: false, alerts };
    }
  }

  // 3. pH vs machine material corrosion risk
  if (detergent.ph_value >= 12 && machine.materials?.includes('aluminum')) {
    alerts.push('High alkaline detergent (pH >12) can corrode aluminum components. Rinse thoroughly after use.');
  }
  if (detergent.ph_value <= 3 && machine.materials?.includes('stainless_steel')) {
    alerts.push('Acidic detergent may cause pitting on stainless steel. Neutralise after cleaning.');
  }

  return { compatible: alerts.length === 0 || alerts.every(a => !a.includes('incompatible')), alerts };
};

/**
 * Find best matching detergent for a given machine and user input.
 * @param {Array} detergents - List of detergent documents.
 * @param {Object} machine - Equipment document.
 * @param {string} dirtType - e.g., 'grease', 'red laterite soil'.
 * @param {string} surfaceType
 * @param {boolean} ecoRequired
 * @returns {Object|null} { detergent, compatibility, alerts }
 */
const findBestDetergent = (detergents, machine, dirtType, surfaceType, ecoRequired = false) => {
  let candidates = detergents.filter(d => 
    d.active && 
    (d.domain === machine.domain || d.domain === 'both') &&
    d.intensity === machine.intensity &&
    (d.dirt_compatibility?.includes(dirtType) || !d.dirt_compatibility?.length) &&
    (!ecoRequired || d.eco_certified === true)
  );

  // Score each candidate
  const scored = candidates.map(d => {
    const { compatible, alerts } = checkCompatibility(d, machine, surfaceType);
    if (!compatible) return null;
    let score = 100;
    if (alerts.length) score -= 20; // penalty for alerts
    if (d.eco_certified) score += 10;
    // lower price is better
    const pricePerLiter = d.current_price_ugx / (d.unit_size || 1);
    score -= pricePerLiter / 10000; // arbitrary normalisation
    return { detergent: d, compatibility: { compatible, alerts }, score };
  }).filter(s => s !== null);

  if (scored.length === 0) return null;
  scored.sort((a,b) => b.score - a.score);
  return scored[0];
};

module.exports = { checkCompatibility, findBestDetergent };