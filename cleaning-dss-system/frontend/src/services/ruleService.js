/**
 * Rule Service
 * Handles CRUD operations for KB-DSS inference rules.
 */

import api from './api';

// ============================================
// PUBLIC READ ROUTES (authenticated users)
// ============================================

export const getAllRules = (params = {}) => api.get('/rules', { params });
export const getRuleById = (id) => api.get(`/rules/${id}`);
export const getRulesByCategory = (category) => api.get(`/rules/category/${category}`);
export const matchRules = (facts) => api.post('/rules/match', { facts });

// ============================================
// ADMIN WRITE ROUTES
// ============================================

export const createRule = (data) => api.post('/rules', data);
export const updateRule = (id, data) => api.put(`/rules/${id}`, data);
export const deleteRule = (id) => api.delete(`/rules/${id}`);
export const toggleRule = (id) => api.patch(`/rules/${id}/toggle`);