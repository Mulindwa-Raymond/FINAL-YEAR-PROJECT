/**
 * Detergent Service
 * Handles CRUD operations for detergents.
 * Includes image upload support.
 */

import api from './api';

// ============================================
// PUBLIC READ ROUTES
// ============================================

/**
 * Get all detergents with optional filters
 * @param {Object} params - { detergent_category, form, min_ph, max_ph, requires_ppe }
 * @returns {Promise}
 */
export const getAllDetergents = (params = {}) => api.get('/detergents', { params });

/**
 * Get single detergent by ID
 * @param {string} id - Detergent ID
 * @returns {Promise}
 */
export const getDetergentById = (id) => api.get(`/detergents/${id}`);

/**
 * Get detergents by pH range
 * @param {number} min - Minimum pH
 * @param {number} max - Maximum pH
 * @returns {Promise}
 */
export const getDetergentsByPhRange = (min = 0, max = 14) => 
  api.get('/detergents/ph-range', { params: { min, max } });

/**
 * Get detergents by category
 * @param {string} category - Detergent category
 * @returns {Promise}
 */
export const getDetergentsByCategory = (category) => 
  api.get(`/detergents/category/${category}`);

// ============================================
// ADMIN WRITE ROUTES
// ============================================

export const createDetergent = (data) => api.post('/detergents', data);
export const updateDetergent = (id, data) => api.put(`/detergents/${id}`, data);
export const deleteDetergent = (id) => api.delete(`/detergents/${id}`);

// ============================================
// IMAGE MANAGEMENT
// ============================================

/**
 * Upload detergent image (file upload)
 * @param {string} id - Detergent ID
 * @param {File} file - Image file
 * @returns {Promise}
 */
export const uploadDetergentImage = (id, file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post(`/detergents/${id}/image`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Update detergent image URL (direct URL)
 * @param {string} id - Detergent ID
 * @param {string} imageUrl - Image URL
 * @returns {Promise}
 */
export const updateDetergentImageUrl = (id, imageUrl) => 
  api.put(`/detergents/${id}/image-url`, { image_url: imageUrl });

/**
 * Delete detergent image
 * @param {string} id - Detergent ID
 * @returns {Promise}
 */
export const deleteDetergentImage = (id) => api.delete(`/detergents/${id}/image`);