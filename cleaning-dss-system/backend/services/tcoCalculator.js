const TcoMultiplier = require('../models/TcoMultiplier');

/**
 * Calculate 5-year TCO for a given equipment.
 * @param {Object} equipment - Mongoose equipment document.
 * @param {string} powerStability - 'stable' or 'unstable' (may affect power cost factor).
 * @param {number} usageHoursPerYear - Default 2000 hrs/year.
 * @returns {Promise<number>} Total cost in UGX.
 */
const computeTCO = async (equipment, powerStability = 'stable', usageHoursPerYear = 2000) => {
  const multipliers = await TcoMultiplier.findOne();
  if (!multipliers) throw new Error('TCO multipliers not configured. Run seed.');

  // 1. Import duty (if imported – assume all non-local brands are imported)
  const duty = (multipliers.duty_rate_percent || 0) * equipment.price_ugx;

  // 2. Electricity cost over 5 years
  const powerKW = equipment.power_req?.kW || 0;
  const powerCost = powerKW * usageHoursPerYear * 5 * multipliers.local_electricity_rate_ugx_per_kwh;

  // 3. Spare parts risk factor based on lead time
  let spareRisk = multipliers.spare_part_lead_time_risk?.between_7_21d || 1.0;
  if (equipment.spare_part_lead_time_days < 7) spareRisk = multipliers.spare_part_lead_time_risk?.less_than_7d || 0.8;
  if (equipment.spare_part_lead_time_days > 21) spareRisk = multipliers.spare_part_lead_time_risk?.greater_than_21d || 1.5;

  // 4. Maintenance cost (5% of purchase price per year, adjusted by risk)
  const annualMaintenancePercent = multipliers.annual_maintenance_cost_percent || 0.05;
  const maintenance = equipment.price_ugx * annualMaintenancePercent * 5 * spareRisk;

  // 5. Optional: power instability increases maintenance
  const instabilityFactor = (powerStability === 'unstable' && equipment.motor_type === 'brushed DC') ? 1.2 : 1.0;

  const total = equipment.price_ugx + duty + powerCost + maintenance * instabilityFactor;
  return Math.round(total);
};

module.exports = { computeTCO };