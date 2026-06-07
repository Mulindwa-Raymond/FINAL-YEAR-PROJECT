/**
 * Authentication Service
 * All functions return promises.
 * Handles login, registration, profile, and password change.
 */

import api from './api';

// Storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Helper to set auth token in localStorage
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    // Set default auth header for all axios requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Get stored token
 */
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Get stored user
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} { token, user }
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data.data || response.data;
    
    if (token) {
      setAuthToken(token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - { username, email, password, companyName, role }
 * @returns {Promise} { token, user }
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get current authenticated user's profile
 * @returns {Promise} user object
 */
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response;
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Change password
 * @param {Object} data - { currentPassword, newPassword }
 * @returns {Promise}
 */
export const changePassword = async (data) => {
  try {
    const response = await api.put('/auth/change-password', data);
    return response;
  } catch (error) {
    console.error('Change password error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getStoredToken();
  return !!token;
};

/**
 * Update stored user
 */
export const updateStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};