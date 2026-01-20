import axios from 'axios';
import { API_CONFIG } from '@config/config';
import { auth } from '@config/firebase';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data.message || 'Server error';
      console.error('API Error:', message);
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
);

// API endpoints
export const apiService = {
  // Helmet endpoints
  helmets: {
    getAll: () => api.get('/api/helmets'),
    getById: (helmetId) => api.get(`/api/helmets/${helmetId}`),
    create: (data) => api.post('/api/helmets', data),
    update: (helmetId, data) => api.put(`/api/helmets/${helmetId}`, data),
    delete: (helmetId) => api.delete(`/api/helmets/${helmetId}`),
    getTelemetry: (helmetId, params) => api.get(`/api/helmets/${helmetId}/telemetry`, { params }),
  },

  // Voice endpoints
  voice: {
    send: (data) => api.post('/api/voice/send', data),
    getMessages: (helmetId) => api.get(`/api/voice/messages/${helmetId}`),
    markAsPlayed: (voiceId) => api.put(`/api/voice/${voiceId}/played`),
  },

  // Alert endpoints
  alerts: {
    getAll: (params) => api.get('/api/alerts', { params }),
    acknowledge: (alertId) => api.put(`/api/alerts/${alertId}/acknowledge`),
    acknowledgeAll: () => api.put('/api/alerts/acknowledge-all'),
  },

  // User endpoints
  users: {
    getProfile: () => api.get('/api/users/profile'),
    updateProfile: (data) => api.put('/api/users/profile', data),
  },

  // System endpoints
  system: {
    getStats: () => api.get('/api/system/stats'),
    getHealth: () => api.get('/api/system/health'),
  }
};

export default api;
