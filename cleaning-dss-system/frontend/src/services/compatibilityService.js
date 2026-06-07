/**
 * Compatibility Service
 * Handles equipment-detergent compatibility operations.
 */

import api from './api';

// Helper to extract ID from various formats
const extractId = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return item;
  if (typeof item === 'object') {
    return item._id || item.compatibility_id || item.id;
  }
  return null;
};

// ============================================
// PUBLIC READ ROUTES
// ============================================

export const getAllCompatibilities = (params = {}) => api.get('/compatibility', { params });

export const getCompatibilityById = (id) => {
  const compatId = extractId(id);
  if (!compatId) {
    return Promise.reject(new Error('Compatibility ID is required'));
  }
  return api.get(`/compatibility/${compatId}`);
};

export const getCompatibleDetergents = (equipmentId) => api.get(`/compatibility/equipment/${equipmentId}/detergents`);
export const getCompatibleEquipment = (detergentId) => api.get(`/compatibility/detergent/${detergentId}/equipment`);
export const checkCompatibility = (equipmentId, detergentId) => api.get('/compatibility/check', { params: { equipment_id: equipmentId, detergent_id: detergentId } });

// ============================================
// ADMIN WRITE ROUTES
// ============================================

export const createCompatibility = (data) => {
  if (!data.equipment_id) return Promise.reject(new Error('Equipment is required'));
  if (!data.detergent_id) return Promise.reject(new Error('Detergent is required'));
  return api.post('/compatibility', data);
};

export const updateCompatibility = (id, data) => {
  const compatId = extractId(id);
  if (!compatId) return Promise.reject(new Error('Compatibility ID is required for update'));
  return api.put(`/compatibility/${compatId}`, data);
};

export const deleteCompatibility = (id) => {
  const compatId = extractId(id);
  if (!compatId) return Promise.reject(new Error('Compatibility ID is required for delete'));
  return api.delete(`/compatibility/${compatId}`);
};