/**
 * Rule Service
 * Handles CRUD operations for KB-DSS inference rules.
 */

import api from './api';

// Helper to get rule ID
const getRuleId = (id) => {
  return id?._id || id?.rule_id || id;
};

// ============================================
// PUBLIC READ ROUTES (authenticated users)
// ============================================

export const getAllRules = (params = {}) => api.get('/rules', { params });
export const getRuleById = (id) => {
  if (!id) return Promise.reject(new Error('Rule ID is required'));
  return api.get(`/rules/${id}`);
};
export const getRulesByCategory = (category) => api.get(`/rules/category/${category}`);
export const matchRules = (facts) => api.post('/rules/match', { facts });

// ============================================
// ADMIN WRITE ROUTES
// ============================================

export const createRule = (data) => {
  if (!data.rule_id) return Promise.reject(new Error('Rule ID is required'));
  if (!data.rule_text) return Promise.reject(new Error('Rule text is required'));
  return api.post('/rules', data);
};

export const updateRule = (id, data) => {
  const ruleId = getRuleId(id);
  if (!ruleId) return Promise.reject(new Error('Rule ID is required for update'));
  return api.put(`/rules/${ruleId}`, data);
};

export const deleteRule = (id) => {
  const ruleId = getRuleId(id);
  if (!ruleId) return Promise.reject(new Error('Rule ID is required for delete'));
  return api.delete(`/rules/${ruleId}`);
};

export const toggleRule = (id) => {
  const ruleId = getRuleId(id);
  if (!ruleId) return Promise.reject(new Error('Rule ID is required'));
  return api.patch(`/rules/${ruleId}/toggle`);
};