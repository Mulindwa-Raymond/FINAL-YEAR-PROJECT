/**
 * Compatibility Service
 * Handles equipment-detergent compatibility operations.
 */

import api from './api';

// ============================================
// PUBLIC READ ROUTES
// ============================================

export const getAllCompatibilities = (params = {}) => api.get('/compatibility', { params });
export const getCompatibleDetergents = (equipmentId) => api.get(`/compatibility/equipment/${equipmentId}/detergents`);
export const getCompatibleEquipment = (detergentId) => api.get(`/compatibility/detergent/${detergentId}/equipment`);
export const checkCompatibility = (equipmentId, detergentId) => api.get('/compatibility/check', { params: { equipment_id: equipmentId, detergent_id: detergentId } });

// ============================================
// ADMIN WRITE ROUTES
// ============================================

export const createCompatibility = (data) => api.post('/compatibility', data);
export const getCompatibilityById = (id) => api.get(`/compatibility/${id}`);
export const updateCompatibility = (id, data) => api.put(`/compatibility/${id}`, data);
export const deleteCompatibility = (id) => api.delete(`/compatibility/${id}`);