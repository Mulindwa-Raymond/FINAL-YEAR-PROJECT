const { Detergent } = require('../models/Detergent');

const findBestDetergent = async (machine, userInput) => {
  const { surface_type, dirt_type, domain, eco_preference } = userInput;
  const surfaceArr = Array.isArray(surface_type) ? surface_type : (surface_type ? [surface_type] : []);
  const dirtArr = Array.isArray(dirt_type) ? dirt_type : (dirt_type ? [dirt_type] : []);

  let query = { active: true };

  if (machine?.intensity) query.intensity = machine.intensity;

  if (domain) {
    query.domain = { $in: [domain, 'both'] };
  } else {
    query.domain = { $in: ['commercial', 'both'] };
  }

  if (surfaceArr.length > 0) {
    query.surface_compatibility = { $in: surfaceArr };
  }

  if (dirtArr.length > 0) {
    query.dirt_compatibility = { $in: dirtArr };
  }

  if (eco_preference) query.eco_certified = true;

  let detergents = await Detergent.find(query);

  if (detergents.length === 0) {
    const relaxedQuery = { active: true };
    if (machine?.intensity) relaxedQuery.intensity = machine.intensity;
    detergents = await Detergent.find(relaxedQuery);
  }

  if (detergents.length === 0) {
    detergents = await Detergent.find({ active: true }).limit(5);
  }

  detergents.sort((a, b) => {
    if (a.eco_certified !== b.eco_certified) return (b.eco_certified ? 1 : 0) - (a.eco_certified ? 1 : 0);
    return (a.current_price_ugx || 0) - (b.current_price_ugx || 0);
  });

  return detergents[0] || null;
};

module.exports = { findBestDetergent };
