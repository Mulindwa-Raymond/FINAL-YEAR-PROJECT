/**
 * Determine cleaning intensity based on usage context.
 * @param {Object} params
 * @param {number} params.usageHoursPerWeek - Average hours the machine will be used per week.
 * @param {number} params.areaSizeM2 - Area to clean in square meters.
 * @param {number} params.budgetUgx - Available budget in Ugandan Shillings.
 * @param {string} params.domain - 'domestic' or 'industrial'.
 * @returns {string} 'light', 'medium', or 'heavy'
 */
const matchIntensity = ({ usageHoursPerWeek = 0, areaSizeM2 = 0, budgetUgx = 0, domain = 'domestic' }) => {
  if (domain === 'industrial') return 'heavy';
  if (usageHoursPerWeek > 30 || areaSizeM2 > 1000) return 'heavy';
  if (usageHoursPerWeek > 10 || areaSizeM2 > 200 || budgetUgx > 5_000_000) return 'medium';
  return 'light';
};

module.exports = { matchIntensity };