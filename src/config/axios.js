import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alumni_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      // Background/idle requests (e.g. the header's 30s notification poll) must
      // NOT tear down the whole session — a single stray 401 while the user is
      // idle would otherwise wipe auth and blank the app. Only clear stored auth
      // for foreground requests the user actually triggered.
      const url = error.config?.url || '';
      const isBackgroundPoll = url.includes('/notifications');
      if (!isBackgroundPoll) {
        // Clear stored auth, but do NOT hard-refresh/redirect here.
        // Login failures also return 401 and should be handled by the calling UI.
        localStorage.removeItem('alumni_token');
        localStorage.removeItem('alumni_user');
        delete api.defaults.headers.common['Authorization'];
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
