/**
 * Detergent Service
 * Handles CRUD operations for detergents.
 * Includes image upload support.
 */

import api from './api';

// Helper to get detergent ID
const getDetergentId = (id) => {
  if (!id) return null;
  return id;
};

// ============================================
// PUBLIC READ ROUTES
// ============================================

export const getAllDetergents = (params = {}) => api.get('/detergents', { params });
export const getDetergentById = (id) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required'));
  return api.get(`/detergents/${id}`);
};
export const getDetergentsByPhRange = (min = 0, max = 14) => api.get('/detergents/ph-range', { params: { min, max } });
export const getDetergentsByCategory = (category) => api.get(`/detergents/category/${category}`);

// ============================================
// ADMIN WRITE ROUTES
// ============================================

export const createDetergent = (data) => {
  if (!data.product_name) return Promise.reject(new Error('Product name is required'));
  return api.post('/detergents', data);
};

export const updateDetergent = (id, data) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required for update'));
  return api.put(`/detergents/${id}`, data);
};

export const deleteDetergent = (id) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required for delete'));
  return api.delete(`/detergents/${id}`);
};

// ============================================
// IMAGE MANAGEMENT
// ============================================

export const uploadDetergentImage = (id, file) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required'));
  const fd = new FormData();
  fd.append('image', file);
  return api.post(`/detergents/${id}/image`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateDetergentImageUrl = (id, imageUrl) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required'));
  return api.put(`/detergents/${id}/image-url`, { image_url: imageUrl });
};

export const deleteDetergentImage = (id) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required'));
  return api.delete(`/detergents/${id}/image`);
};