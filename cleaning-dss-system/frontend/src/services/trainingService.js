/**
 * trainingService.js
 * User-facing service for fetching training materials.
 * Uses the public endpoint (no authentication required).
 */

import api from './api';

/**
 * Get all active training materials (public)
 * @param {Object} params - { search, type, page, limit }
 * @returns {Promise}
 */
export const getActiveTrainings = (params = {}) => {
  return api.get('/training/public', { params });
};

/**
 * Get a single training by ID (public)
 * @param {string} id - Training ID
 * @returns {Promise}
 */
export const getTrainingByIdPublic = (id) => {
  if (!id) return Promise.reject(new Error('Training ID is required'));
  return api.get(`/training/public/${id}`);
};