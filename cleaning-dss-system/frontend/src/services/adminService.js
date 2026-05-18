/**
 * Admin Service
 * All functions require admin role (backend enforced).
 * Handles: user management, metrics, audit, feedback, training, history.
 */

import api from './api';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate user ID before making requests
 * @param {string} userId - User ID to validate
 * @param {string} operation - Operation name for error message
 * @throws {Error} If userId is invalid
 */
const validateUserId = (userId, operation) => {
  if (!userId) {
    throw new Error(`User ID is required for ${operation}`);
  }
  return true;
};

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * Get all users (paginated)
 * @param {Object} params - { page, limit, role, is_active, search }
 * @returns {Promise}
 */
export const getAllUsers = (params = {}) => api.get('/admin/users', { params });

/**
 * Create a new user (super_admin only)
 * @param {Object} userData - { username, email, password, role, organization }
 * @returns {Promise}
 */
export const createUser = (userData) => {
  // Validate required fields
  if (!userData.username) {
    return Promise.reject(new Error('Username is required'));
  }
  if (!userData.email) {
    return Promise.reject(new Error('Email is required'));
  }
  if (!userData.password) {
    return Promise.reject(new Error('Password is required for new users'));
  }
  return api.post('/admin/users', userData);
};

/**
 * Update a user (super_admin only)
 * @param {string} userId - User ID (supports both _id and user_id format)
 * @param {Object} data - { role, is_active, username, email, organization, password }
 * @returns {Promise}
 */
export const updateUser = (userId, data) => {
  validateUserId(userId, 'updateUser');
  return api.put(`/admin/users/${userId}`, data);
};

/**
 * Delete a user (soft delete, super_admin only)
 * @param {string} userId - User ID (supports both _id and user_id format)
 * @returns {Promise}
 */
export const deleteUser = (userId) => {
  validateUserId(userId, 'deleteUser');
  return api.delete(`/admin/users/${userId}`);
};

/**
 * Get current user's own profile
 * @returns {Promise}
 */
export const getMyProfile = () => api.get('/admin/me');

/**
 * Update current user's own profile
 * @param {Object} data - { username, email, currentPassword, newPassword }
 * @returns {Promise}
 */
export const updateMyProfile = (data) => api.put('/admin/me', data);

// ============================================
// SYSTEM METRICS & AUDIT
// ============================================

/**
 * Get system metrics
 * @param {string} date - ISO date string (optional)
 * @returns {Promise}
 */
export const getSystemMetrics = (date = null) => {
  const params = date ? { date } : {};
  return api.get('/admin/metrics', { params });
};

/**
 * Get audit logs
 * @param {Object} params - { adminId, action, limit, page, startDate, endDate }
 * @returns {Promise}
 */
export const getAuditLogs = (params = {}) => api.get('/admin/audit', { params });

// ============================================
// FEEDBACK MANAGEMENT
// ============================================

/**
 * Get all feedback (admin only)
 * @param {Object} params - { page, limit, rating, startDate, endDate }
 * @returns {Promise}
 */
export const getAllFeedback = (params = {}) => api.get('/admin/feedback', { params });

/**
 * Get feedback statistics
 * @returns {Promise}
 */
export const getFeedbackStats = () => api.get('/admin/feedback/stats');

// ============================================
// BULK UPLOAD
// ============================================

/**
 * Upload equipment via CSV/JSON
 * @param {File} file - CSV or JSON file
 * @param {string} format - 'csv' or 'json'
 * @returns {Promise}
 */
export const uploadEquipment = (file, format = 'csv') => {
  if (!file) {
    return Promise.reject(new Error('No file provided'));
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('format', format);
  return api.post('/admin/upload/equipment', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Upload detergents via CSV/JSON
 * @param {File} file - CSV or JSON file
 * @param {string} format - 'csv' or 'json'
 * @returns {Promise}
 */
export const uploadDetergents = (file, format = 'csv') => {
  if (!file) {
    return Promise.reject(new Error('No file provided'));
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('format', format);
  return api.post('/admin/upload/detergents', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Upload rules via CSV/JSON
 * @param {File} file - CSV or JSON file
 * @param {string} format - 'csv' or 'json'
 * @returns {Promise}
 */
export const uploadRules = (file, format = 'csv') => {
  if (!file) {
    return Promise.reject(new Error('No file provided'));
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('format', format);
  return api.post('/admin/upload/rules', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ============================================
// DATABASE EXPORT/IMPORT
// ============================================

/**
 * Export entire database as JSON
 * @returns {Promise} Blob response
 */
export const exportDatabase = () => api.get('/admin/export', { responseType: 'blob' });

/**
 * Import database from JSON backup
 * @param {File} file - JSON backup file
 * @returns {Promise}
 */
export const importDatabase = (file) => {
  if (!file) {
    return Promise.reject(new Error('No backup file provided'));
  }
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/admin/import', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ============================================
// TRAINING MANAGEMENT
// ============================================

/**
 * Get all training materials
 * @param {Object} params - { page, limit, search, type, active }
 * @returns {Promise}
 */
export const getAllTrainings = (params = {}) => api.get('/admin/trainings', { params });

/**
 * Get training by ID
 * @param {string} id - Training ID
 * @returns {Promise}
 */
export const getTrainingById = (id) => {
  if (!id) {
    return Promise.reject(new Error('Training ID is required'));
  }
  return api.get(`/admin/trainings/${id}`);
};

/**
 * Create new training material
 * @param {Object} data - Training data
 * @returns {Promise}
 */
export const createTraining = (data) => api.post('/admin/trainings', data);

/**
 * Update training material
 * @param {string} id - Training ID
 * @param {Object} data - Updated training data
 * @returns {Promise}
 */
export const updateTraining = (id, data) => {
  if (!id) {
    return Promise.reject(new Error('Training ID is required'));
  }
  return api.put(`/admin/trainings/${id}`, data);
};

/**
 * Delete training material (soft delete)
 * @param {string} id - Training ID
 * @returns {Promise}
 */
export const deleteTraining = (id) => {
  if (!id) {
    return Promise.reject(new Error('Training ID is required'));
  }
  return api.delete(`/admin/trainings/${id}`);
};

// ============================================
// RECOMMENDATION HISTORY
// ============================================

/**
 * Get recommendation history (admin only)
 * @param {Object} params - { page, limit, userId, startDate, endDate }
 * @returns {Promise}
 */
export const getRecommendationHistory = (params = {}) => api.get('/admin/history', { params });