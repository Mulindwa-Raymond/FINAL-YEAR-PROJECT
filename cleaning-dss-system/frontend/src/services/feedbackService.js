/**
 * feedbackService.js
 * 
 * Handles API calls for user feedback on recommendations.
 */

import api from './api';

/**
 * Submit feedback for a recommendation
 * @param {Object} data - { recommendation_id, rating, comment }
 * @returns {Promise} API response
 */
export const submitFeedback = (data) => api.post('/feedback', data);

/**
 * Get feedback for a specific recommendation
 * @param {string} recommendationId - UUID of the recommendation
 * @returns {Promise} API response
 */
export const getFeedbackByRecommendation = (recommendationId) => 
  api.get(`/feedback/recommendation/${recommendationId}`);

/**
 * Get all feedback (admin only)
 * @param {Object} params - Pagination and filters
 * @returns {Promise} API response
 */
export const getAllFeedback = (params = {}) => api.get('/admin/feedback', { params });