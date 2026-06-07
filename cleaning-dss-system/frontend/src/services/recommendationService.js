/**
 * recommendationService.js
 * Handles recommendation API calls with correct field mapping for backend.
 * Includes both inference engine and history management endpoints.
 */

import api from './api';
  
// ==================== Inference Engine Endpoints ====================

/**
 * Get recommendations from the inference engine
 * @param {Object} scenario - User's cleaning scenario parameters
 * @returns {Promise}
 */
export const getRecommendations = (scenario) => {
  // Build payload with exact field names expected by backend
  const payload = {
    surface_type: scenario.surface_type || scenario.surfaceType || '',
    dirt_type: scenario.dirt_type || scenario.dirtType || '',
    area_size: scenario.area_size || scenario.areaSize || 0,
    power_stability: scenario.power_stability || scenario.powerStability || 'stable',
    budget_ugx: scenario.budget_ugx || scenario.budget || 0,
    eco_preference: scenario.eco_preference ?? scenario.ecoPreference ?? false,
    cleaning_frequency: scenario.cleaning_frequency || scenario.cleaningFrequency || 'weekly',
    machine_category: scenario.machine_category,
    machine_subtype: scenario.machine_subtype,
    brand_name: scenario.brand_name,
    domain: scenario.domain,
    floor_texture: scenario.floor_texture,
    environment: scenario.environment,
    power_source: scenario.power_source,
    aisle_width: scenario.aisle_width,
    soil_level: scenario.soil_level,
    use_case: scenario.use_case,
    pressure_required: scenario.pressure_required,
    filtration: scenario.filtration,
    tank_capacity: scenario.tank_capacity,
    noise_sensitivity: scenario.noise_sensitivity,
    function: scenario.function,
    carpet_type: scenario.carpet_type,
    location: scenario.location,
  };
  
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
      delete payload[key];
    }
  });
  
  console.log('📤 Sending recommendation request:', payload);
  return api.post('/recommend', payload);
};

// ==================== Recommendation History Endpoints ====================

/**
 * Save a recommendation to user's history
 * @param {Object} recommendationData - The recommendation data to save
 * @returns {Promise}
 */
export const saveRecommendationToHistory = (recommendationData) => {
  console.log('💾 Saving recommendation to history:', recommendationData);
  return api.post('/recommendations', recommendationData);
};

/**
 * Get user's recommendation history with pagination
 * @param {Object} params - { page, limit, saved_only, search }
 * @returns {Promise}
 */
export const getRecommendationHistory = (params = {}) => {
  console.log('📋 Fetching recommendation history with params:', params);
  // FIXED: Removed duplicate 'v1/' since api baseURL already includes /api/v1
  return api.get('/recommendations/history', { params });
};

/**
 * Get a single recommendation by ID
 * @param {string} id - Recommendation ID
 * @returns {Promise}
 */
export const getRecommendationById = (id) => {
  if (!id) return Promise.reject(new Error('Recommendation ID is required'));
  console.log('🔍 Fetching recommendation by ID:', id);
  // FIXED: Removed duplicate 'v1/'
  return api.get(`/recommendations/${id}`);
};

/**
 * Toggle save status of a recommendation
 * @param {string} id - Recommendation ID
 * @param {boolean} saved - New saved status
 * @returns {Promise}
 */
export const toggleSaveRecommendation = (id, saved) => {
  if (!id) return Promise.reject(new Error('Recommendation ID is required'));
  console.log('📌 Toggling save status:', { id, saved });
  return api.patch(`/recommendations/${id}/save`, { saved });
};

/**
 * Delete a recommendation
 * @param {string} id - Recommendation ID
 * @returns {Promise}
 */
export const deleteRecommendation = (id) => {
  if (!id) return Promise.reject(new Error('Recommendation ID is required'));
  console.log('🗑️ Deleting recommendation:', id);
  return api.delete(`/recommendations/${id}`);
};

/**
 * Get recommendation statistics for dashboard
 * @returns {Promise}
 */
export const getRecommendationStats = () => {
  console.log('📊 Fetching recommendation stats');
  return api.get('/recommendations/stats');
};

/**
 * Export recommendation as PDF
 * @param {string} id - Recommendation ID
 * @returns {Promise} Blob response
 */
export const exportRecommendationPDF = (id) => {
  if (!id) return Promise.reject(new Error('Recommendation ID is required'));
  console.log('📄 Exporting recommendation as PDF:', id);
  return api.get(`/recommendations/${id}/export`, { responseType: 'blob' });
};

// ==================== Reference Data Endpoints ====================

/**
 * Get available surface types for recommendations
 * @returns {Promise}
 */
export const getSurfaceTypes = () => api.get('/recommendation/surface-types');

/**
 * Get available dirt types for recommendations
 * @returns {Promise}
 */
export const getDirtTypes = () => api.get('/recommendation/dirt-types');

/**
 * Get available power options for recommendations
 * @returns {Promise}
 */
export const getPowerOptions = () => api.get('/recommendation/power-options');