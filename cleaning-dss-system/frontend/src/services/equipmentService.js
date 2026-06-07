/**
 * Equipment Service
 * Handles CRUD operations for cleaning machines.
 * Includes image upload support.
 */

import api from './api';

// Helper to get equipment ID (handles both _id and equipment_id)
const getEquipmentId = (id) => {
  if (!id) return null;
  return id;
};

// ============================================
// PUBLIC READ ROUTES
// ============================================

/**
 * Get all equipment with optional filters
 * @param {Object} params - { machine_category, power_source, brand_name, min_price, max_price, page, limit, search }
 * @returns {Promise}
 */
export const getAllEquipment = (params = {}) => api.get('/equipment', { params });

/**
 * Get single equipment by ID
 * @param {string} id - Equipment ID (supports _id or equipment_id)
 * @returns {Promise}
 */
export const getEquipmentById = (id) => {
  if (!id) return Promise.reject(new Error('Equipment ID is required'));
  return api.get(`/equipment/${id}`);
};

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
export const createEquipment = (data) => {
  // Validate required fields
  if (!data.brand_name) return Promise.reject(new Error('Brand name is required'));
  if (!data.model_name) return Promise.reject(new Error('Model name is required'));
  if (!data.machine_category) return Promise.reject(new Error('Machine category is required'));
  if (!data.machine_subtype) return Promise.reject(new Error('Machine sub-type is required'));
  if (!data.intensity) return Promise.reject(new Error('Intensity is required'));
  if (!data.domain) return Promise.reject(new Error('Domain is required'));
  return api.post('/equipment', data);
};

/**
 * Update equipment (admin only)
 * @param {string} id - Equipment ID
 * @param {Object} data - Equipment data to update
 * @returns {Promise}
 */
export const updateEquipment = (id, data) => {
  if (!id) return Promise.reject(new Error('Equipment ID is required for update'));
  return api.put(`/equipment/${id}`, data);
};

/**
 * Delete equipment (admin only)
 * @param {string} id - Equipment ID
 * @returns {Promise}
 */
export const deleteEquipment = (id) => {
  if (!id) return Promise.reject(new Error('Equipment ID is required for delete'));
  return api.delete(`/equipment/${id}`);
};

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
  if (!id) return Promise.reject(new Error('Equipment ID is required'));
  if (!file) return Promise.reject(new Error('Image file is required'));
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
export const updateEquipmentImageUrl = (id, imageUrl) => {
  if (!id) return Promise.reject(new Error('Equipment ID is required'));
  if (!imageUrl) return Promise.reject(new Error('Image URL is required'));
  return api.put(`/equipment/${id}/image-url`, { image_url: imageUrl });
};

/**
 * Delete equipment image
 * @param {string} id - Equipment ID
 * @returns {Promise}
 */
export const deleteEquipmentImage = (id) => {
  if (!id) return Promise.reject(new Error('Equipment ID is required'));
  return api.delete(`/equipment/${id}/image`);
};