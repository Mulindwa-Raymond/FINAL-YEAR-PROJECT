// frontend/src/services/metricsService.js
import api from './api';

// Public metrics (any authenticated user)
export const getDailyMetrics = () => api.get('/metrics/daily');
export const getTrends = () => api.get('/metrics/trends');