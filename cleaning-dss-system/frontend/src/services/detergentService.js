/**
 * Detergent Service
 * Handles CRUD operations for detergents.
 * Includes image upload support.
 */

import api from './api';
import { createCacheKey, getCachedData, setCachedData, clearCacheByPrefix } from './cacheService';

const cacheTTL = 300; // seconds

// Helper to get detergent ID
const getDetergentId = (id) => {
  if (!id) return null;
  return id;
};

const getDetergentListCacheKey = (params) => createCacheKey('detergent_list', params);
const getDetergentDetailCacheKey = (id) => createCacheKey('detergent_detail', id);

// ============================================
// PUBLIC READ ROUTES
// ============================================

export const getAllDetergents = (params = {}) => {
  const cacheKey = getDetergentListCacheKey(params);
  const cached = getCachedData(cacheKey);
  if (cached) {
    return Promise.resolve({ data: cached });
  }
  return api.get('/detergents', { params }).then((res) => {
    setCachedData(cacheKey, res.data, cacheTTL);
    return res;
  });
};

export const getDetergentById = (id) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required'));
  const cacheKey = getDetergentDetailCacheKey(id);
  const cached = getCachedData(cacheKey);
  if (cached) {
    return Promise.resolve({ data: cached });
  }
  return api.get(`/detergents/${id}`).then((res) => {
    setCachedData(cacheKey, res.data, cacheTTL);
    return res;
  });
};
export const getDetergentsByPhRange = (min = 0, max = 14) => api.get('/detergents/ph-range', { params: { min, max } });
export const getDetergentsByCategory = (category) => api.get(`/detergents/category/${category}`);

// ============================================
// ADMIN WRITE ROUTES 
// ============================================

export const createDetergent = (data) => {
  if (!data.product_name) return Promise.reject(new Error('Product name is required'));
  return api.post('/detergents', data).then((res) => {
    clearCacheByPrefix('detergent');
    return res;
  });
};

export const updateDetergent = (id, data) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required for update'));
  return api.put(`/detergents/${id}`, data).then((res) => {
    clearCacheByPrefix('detergent');
    return res;
  });
};

export const deleteDetergent = (id) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required for delete'));
  return api.delete(`/detergents/${id}`).then((res) => {
    clearCacheByPrefix('detergent');
    return res;
  });
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
  }).then((res) => {
    clearCacheByPrefix('detergent');
    return res;
  });
};

export const updateDetergentImageUrl = (id, imageUrl) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required'));
  return api.put(`/detergents/${id}/image-url`, { image_url: imageUrl }).then((res) => {
    clearCacheByPrefix('detergent');
    return res;
  });
};

export const deleteDetergentImage = (id) => {
  if (!id) return Promise.reject(new Error('Detergent ID is required'));
  return api.delete(`/detergents/${id}/image`).then((res) => {
    clearCacheByPrefix('detergent');
    return res;
  });
};