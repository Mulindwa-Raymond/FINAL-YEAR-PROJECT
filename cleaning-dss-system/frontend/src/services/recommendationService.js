// frontend/src/services/recommendationService.js
import api from './api';

/**
 * Get cleaning machine + detergent recommendations
 * @param {Object} scenario - {
 *   surfaceType, dirtType, domain,
 *   usageHoursPerWeek, areaSizeM2, budgetUgx,
 *   powerStability, ecoRequired, noiseSensitive
 * }
 * @returns {Promise} - { intensity, category, recommendations: [...] }
 */
export const getRecommendations = (scenario) => api.post('/recommend', scenario);