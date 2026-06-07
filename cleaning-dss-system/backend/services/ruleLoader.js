const { Rule } = require('../models/Rule');

let cachedRules = { equipment: [], detergent: [] };
let lastLoad = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Load rules from DB and split by category.
 */
const loadRules = async () => {
  const rules = await Rule.find({ active: true }).lean();
  cachedRules = {
    equipment: rules.filter(r => r.category === 'equipment'),
    detergent: rules.filter(r => r.category === 'detergent')
  };
  lastLoad = Date.now();
};

/**
 * Get cached rules (refresh if stale).
 * @returns {Promise<Object>} { equipment: [], detergent: [] }
 */
const getRules = async () => {
  if (!lastLoad || (Date.now() - lastLoad) > CACHE_TTL_MS) {
    await loadRules();
  }
  return cachedRules;
};

// Initial load on module import
loadRules().catch(err => console.error('Failed to load rules:', err));

module.exports = { getRules, loadRules };