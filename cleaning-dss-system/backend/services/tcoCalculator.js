const TcoMultiplier = require('../models/TcoMultiplier');

/**
 * Calculate 1-year TCO for a given equipment.
 * @param {Object} equipment - Mongoose equipment document.
 * @param {string} powerStability - 'stable' or 'unstable' (may affect power cost factor).
 * @param {number} usageHoursPerYear - Default 2000 hrs/year.
 * @returns {Promise<number>} Total cost in UGX.
 */
const computeTCO = async (equipment, powerStability = 'stable', usageHoursPerYear = 2000) => {
  const multipliers = await TcoMultiplier.findOne();
  if (!multipliers) throw new Error('TCO multipliers not configured. Run seed.');

  // 1. Maintenance cost (annual maintenance cost, adjusted by spare parts risk)
  let spareRisk = multipliers.spare_part_lead_time_risk?.between_7_21d || 1.0;
  if (equipment.spare_part_lead_time_days < 7) spareRisk = multipliers.spare_part_lead_time_risk?.less_than_7d || 0.8;
  if (equipment.spare_part_lead_time_days > 21) spareRisk = multipliers.spare_part_lead_time_risk?.greater_than_21d || 1.5;

  const annualMaintenance = equipment.estimated_maintenance_cost_per_year_ugx || 0;
  const maintenance = annualMaintenance * spareRisk;

  // 2. Annual running cost
  const annualRunning = equipment.estimated_running_cost_per_year_ugx || 0;
  const runningCost = annualRunning;

  // 3. Optional: power instability increases maintenance
  const instabilityFactor = (powerStability === 'unstable' && equipment.motor_type === 'brushed DC') ? 1.2 : 1.0;

  // TCO = Maintenance + Running Cost (1 year, excluding purchase price)
  const total = (maintenance * instabilityFactor) + runningCost;
  return Math.round(total);
};

module.exports = { computeTCO };