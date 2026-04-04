import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getRecommendations = (data) => api.post('/recommendations', data);

export default api;
