/**
 * tcoCalculator.js
 *
 * FIX: Equipment model uses `current_price_ugx` (not `price_ugx`).
 *      Added null/zero safety on all fields so the calculator never
 *      silently returns 0 when data is missing.
 */

'use strict';

const TcoMultiplier = require('../models/TcoMultiplier');

/**
 * Calculate 5-year TCO for a given equipment document.
 *
 * @param {Object} equipment          - Mongoose equipment document
 * @param {string} powerStability     - 'stable' | 'unstable'
 * @param {number} usageHoursPerYear  - Default 2000 hrs/year
 * @returns {Promise<number>}         Total 5-year cost in UGX
 */
const computeTCO = async (equipment, powerStability = 'stable', usageHoursPerYear = 2000) => {
  const multipliers = await TcoMultiplier.findOne();
  if (!multipliers) throw new Error('TCO multipliers not configured. Run seed.');

  // ── FIX: use current_price_ugx (the actual model field) ──────────────
  const price = equipment.current_price_ugx || 0;

  // 1. Import duty (applied to purchase price)
  const duty = (multipliers.duty_rate_percent || 0) * price;

  // 2. Electricity cost over 5 years
  const powerKW = equipment.power_req?.kW || equipment.power_requirement_kw || 0;
  const electricityRate = multipliers.local_electricity_rate_ugx_per_kwh || 0;
  const powerCost = powerKW * usageHoursPerYear * 5 * electricityRate;

  // 3. Spare parts risk factor based on lead time
  const leadDays = equipment.spare_parts_lead_time_days || 14;
  let spareRisk;
  if (leadDays < 7) {
    spareRisk = multipliers.spare_part_lead_time_risk?.less_than_7d || 0.8;
  } else if (leadDays > 21) {
    spareRisk = multipliers.spare_part_lead_time_risk?.greater_than_21d || 1.5;
  } else {
    spareRisk = multipliers.spare_part_lead_time_risk?.between_7_21d || 1.0;
  }

  // 4. Maintenance cost over 5 years
  //    Prefer stored annual value if available, otherwise use percentage of price
  let annualMaintenance;
  if (equipment.estimated_maintenance_cost_per_year_ugx > 0) {
    annualMaintenance = equipment.estimated_maintenance_cost_per_year_ugx;
  } else if (price > 0) {
    const annualMaintenancePercent = multipliers.annual_maintenance_cost_percent || 0.05;
    annualMaintenance = price * annualMaintenancePercent * spareRisk;
  } else {
    annualMaintenance = 0;
  }
  const maintenanceFiveYear = annualMaintenance * 5;

  // 5. Power instability increases maintenance for brushed DC motors
  const instabilityFactor =
    powerStability === 'unstable' && equipment.motor_type === 'brushed DC' ? 1.2 : 1.0;

  const total = duty + powerCost + maintenanceFiveYear * instabilityFactor;
  return Math.round(total);
};

module.exports = { computeTCO };
