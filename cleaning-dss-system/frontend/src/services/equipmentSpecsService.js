/**
 * Equipment Specs Service
 * Handles dynamic equipment specifications.
 */

import api from './api';

// ============================================
// PUBLIC READ ROUTES
// ============================================

export const getSpecsByEquipment = (equipmentId) => {
  if (!equipmentId) return Promise.reject(new Error('Equipment ID is required'));
  return api.get(`/equipment-specs/equipment/${equipmentId}`);
};

export const getSpecsByCategory = (category) => {
  if (!category) return Promise.reject(new Error('Category is required'));
  return api.get(`/equipment-specs/category/${category}`);
};

export const getCommonAttributes = () => api.get('/equipment-specs/attributes');

// ============================================
// ADMIN WRITE ROUTES
// ============================================

/**
 * Create a new specification for an equipment
 * @param {Object} data - { equipment_id, attribute_name, attribute_value, unit_of_measure }
 * @returns {Promise}
 */
export const createSpec = (data) => {
  // Validate required fields
  if (!data.equipment_id) return Promise.reject(new Error('Equipment ID is required'));
  if (!data.attribute_name) return Promise.reject(new Error('Attribute name is required'));
  if (!data.attribute_value) return Promise.reject(new Error('Attribute value is required'));
  return api.post('/equipment-specs', data);
};

/**
 * Update a specification by its ID
 * @param {string} id - Specification ID
 * @param {Object} data - { attribute_value, unit_of_measure }
 * @returns {Promise}
 */
export const updateSpec = (id, data) => {
  if (!id) return Promise.reject(new Error('Specification ID is required'));
  if (!data.attribute_value) return Promise.reject(new Error('Attribute value is required'));
  return api.put(`/equipment-specs/${id}`, data);
};

/**
 * Delete a single specification by its ID
 * @param {string} id - Specification ID
 * @returns {Promise}
 */
export const deleteSpec = (id) => {
  if (!id) return Promise.reject(new Error('Specification ID is required'));
  return api.delete(`/equipment-specs/${id}`);
};

/**
 * Delete all specifications for a given equipment
 * This is useful when replacing all specs during an update.
 * @param {string} equipmentId - Equipment ID
 * @returns {Promise}
 */
export const deleteSpecsByEquipment = (equipmentId) => {
  if (!equipmentId) return Promise.reject(new Error('Equipment ID is required'));
  // This endpoint must be implemented on the backend:
  // DELETE /equipment-specs/equipment/:equipmentId
  return api.delete(`/equipment-specs/equipment/${equipmentId}`);
};