/**
 * Equipment Service
 * Handles CRUD operations for cleaning machines.
 * Includes image upload support.
 */

import api from './api';

// ============================================
// PUBLIC READ ROUTES
// ============================================

/**
 * Get all equipment with optional filters
 * @param {Object} params - { machine_category, power_source, brand_name, min_price, max_price }
 * @returns {Promise}
 */
export const getAllEquipment = (params = {}) => api.get('/equipment', { params });

/**
 * Get single equipment by ID
 * @param {string} id - Equipment ID
 * @returns {Promise}
 */
export const getEquipmentById = (id) => api.get(`/equipment/${id}`);

/**
 * Get distinct machine categories
 * @returns {Promise}
 */
export const getMachineCategories = () => api.get('/equipment/categories');

/**
 * Get equipment by category with specs
 * @param {string} category - Machine category
 * @returns {Promise}
 */
export const getEquipmentByCategory = (category) => api.get(`/equipment/category/${category}`);

// ============================================
// ADMIN WRITE ROUTES
// ============================================

/**
 * Create new equipment (admin only)
 * @param {Object} data - Equipment data with new fields
 * @returns {Promise}
 */
export const createEquipment = (data) => api.post('/equipment', data);

/**
 * Update equipment (admin only)
 * @param {string} id - Equipment ID
 * @param {Object} data - Equipment data to update
 * @returns {Promise}
 */
export const updateEquipment = (id, data) => api.put(`/equipment/${id}`, data);

/**
 * Delete equipment (admin only)
 * @param {string} id - Equipment ID
 * @returns {Promise}
 */
export const deleteEquipment = (id) => api.delete(`/equipment/${id}`);

// ============================================
// IMAGE MANAGEMENT
// ============================================

/**
 * Upload equipment image (file upload)
 * @param {string} id - Equipment ID
 * @param {File} file - Image file
 * @returns {Promise}
 */
export const uploadEquipmentImage = (id, file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post(`/equipment/${id}/image`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Update equipment image URL (direct URL)
 * @param {string} id - Equipment ID
 * @param {string} imageUrl - Image URL
 * @returns {Promise}
 */
export const updateEquipmentImageUrl = (id, imageUrl) => 
  api.put(`/equipment/${id}/image-url`, { image_url: imageUrl });

/**
 * Delete equipment image
 * @param {string} id - Equipment ID
 * @returns {Promise}
 */
export const deleteEquipmentImage = (id) => api.delete(`/equipment/${id}/image`);