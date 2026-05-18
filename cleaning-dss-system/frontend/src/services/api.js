/**
 * API Client
 * Central axios instance with base URL and interceptors.
 * Handles JWT token injection and automatic logout on 401.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: attach JWT token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_APP_TOKEN_KEY || 'token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (unauthorized) and global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid – clear storage and redirect to login
      localStorage.removeItem(import.meta.env.VITE_APP_TOKEN_KEY || 'token');
      localStorage.removeItem(import.meta.env.VITE_APP_USER_KEY || 'user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;