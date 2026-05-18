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
    alerts.push(`Detergent ${detergent.name} is incompatible with ${surfaceType}.`);
    return { compatible: false, alerts };
  }
  if (!detergent.compatible_surfaces?.includes(surfaceType) && detergent.compatible_surfaces?.length) {
    alerts.push(`Detergent ${detergent.name} has not been tested on ${surfaceType}. Use with caution.`);
    // Not a hard block, but alert
  }

  // 2. Machine material incompatibility
  if (machine.materials && detergent.incompatible_machine_materials) {
    const badMaterial = machine.materials.find(mat => detergent.incompatible_machine_materials.includes(mat));
    if (badMaterial) {
      alerts.push(`⚠️ Detergent ${detergent.name} may damage machine parts made of ${badMaterial}.`);
      return { compatible: false, alerts };
    }
  }

  // 3. pH vs machine material corrosion risk
  if (detergent.ph >= 12 && machine.materials?.includes('aluminum')) {
    alerts.push('High alkaline detergent (pH >12) can corrode aluminum components. Rinse thoroughly after use.');
  }
  if (detergent.ph <= 3 && machine.materials?.includes('stainless_steel')) {
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
    d.active && d.in_stock &&
    (d.domain === machine.domain || d.domain === 'both') &&
    d.intensity === machine.intensity &&
    (d.compatible_dirt_types?.includes(dirtType) || !d.compatible_dirt_types?.length) &&
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
    const pricePerLiter = d.price_ugx / (d.package_size_liters || 1);
    score -= pricePerLiter / 10000; // arbitrary normalisation
    return { detergent: d, compatibility: { compatible, alerts }, score };
  }).filter(s => s !== null);

  if (scored.length === 0) return null;
  scored.sort((a,b) => b.score - a.score);
  return scored[0];
};

module.exports = { checkCompatibility, findBestDetergent };