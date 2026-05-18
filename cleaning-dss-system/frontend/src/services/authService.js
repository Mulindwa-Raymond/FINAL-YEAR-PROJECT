/**
 * Authentication Service
 * All functions return promises.
 * Handles login, registration, profile, and password change.
 */

import api from './api';

/**
 * Login user
 * @param {Object} credentials - { username, email, password } (username or email)
 * @returns {Promise} { token, user }
 */
export const login = (credentials) => api.post('/auth/login', credentials);

/**
 * Register new user
 * @param {Object} userData - { username, email, password, organization }
 * @returns {Promise} { token, user }
 */
export const register = (userData) => api.post('/auth/register', userData);

/**
 * Get current authenticated user's profile
 * @returns {Promise} user object
 */
export const getMe = () => api.get('/auth/me');

/**
 * Change password
 * @param {Object} data - { currentPassword, newPassword }
 * @returns {Promise}
 */
export const changePassword = (data) => api.put('/auth/change-password', data);