/**
 * TCO Service
 * Handles global TCO multiplier settings.
 */

import api from './api';

export const getTcoMultipliers = () => api.get('/tco');
export const updateTcoMultipliers = (data) => api.put('/tco', data);