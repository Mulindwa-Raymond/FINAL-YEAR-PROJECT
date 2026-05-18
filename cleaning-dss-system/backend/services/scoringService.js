/**
 * Compute final score for a machine candidate.
 * @param {Object} machine - Equipment document (with temporary .score property).
 * @param {number} baseScore - Initial score (e.g., 100).
 * @param {Array} modifications - List of { factor, reason } from rules.
 * @param {number} tco - Computed TCO value.
 * @param {number} maxBudget - User's budget (UGX).
 * @returns {number} Final score 0-100.
 */
const computeFinalScore = (machine, baseScore, modifications, tco, maxBudget = null) => {
  let score = baseScore;
  // Apply multiplicative modifications
  for (const mod of modifications) {
    score *= mod.factor;
  }
  // Penalty if TCO exceeds budget
  if (maxBudget && tco > maxBudget) {
    const excessRatio = Math.min(1, (tco - maxBudget) / maxBudget);
    score *= (1 - excessRatio * 0.5); // up to 50% penalty
  }
  // Normalise to 0-100
  score = Math.min(100, Math.max(0, score));
  return Math.round(score);
};

module.exports = { computeFinalScore };