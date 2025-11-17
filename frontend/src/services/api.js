import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me')
};

export const progressAPI = {
  getLatest: (projectId) => api.get(`/progress/latest/${projectId}`),
  getHistory: (projectId, params = {}) => api.get(`/progress/history/${projectId}`, { params }),
  getStats: (projectId) => api.get(`/progress/stats/${projectId}`),
  getOverview: () => api.get('/progress/overview'),
  getChartData: (projectId, params = {}) => api.get(`/progress/chart/${projectId}`, { params })
};

export default api;

