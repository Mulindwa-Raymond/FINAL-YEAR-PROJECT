const Detergent = require('../models/Detergent');

const findBestDetergent = async (machine, userInput) => {
  const { surfaceType, dirtType, domain, ecoRequired } = userInput;
  let query = {
    active: true,
    domain: { $in: [domain, 'both'] },
    intensity: machine.intensity,
    compatible_surfaces: surfaceType,
    compatible_dirt_types: dirtType,
    in_stock: true
  };
  if (ecoRequired) query.eco_certified = true;
  // Incompatible machine materials exclusion
  if (machine.materials && machine.materials.length) {
    query.incompatible_machine_materials = { $nin: machine.materials };
  }
  let detergents = await Detergent.find(query);
  // Simple ranking: prefer eco, then lower price
  detergents.sort((a,b) => {
    if (a.eco_certified !== b.eco_certified) return b.eco_certified - a.eco_certified;
    return (a.price_ugx || 0) - (b.price_ugx || 0);
  });
  return detergents[0] || null;
};

module.exports = { findBestDetergent };