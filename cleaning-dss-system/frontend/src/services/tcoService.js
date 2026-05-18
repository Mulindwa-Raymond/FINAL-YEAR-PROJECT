// frontend/src/services/tcoService.js
import api from './api';

// Admin only (TCO multipliers are sensitive configuration)
export const getTcoMultipliers = () => api.get('/tco');
export const updateTcoMultipliers = (data) => api.put('/tco', data);