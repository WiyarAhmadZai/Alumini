import api from '../config/axios';

const authService = {
  /**
   * Login alumni
   * @param {Object} credentials - Login credentials
   * @returns {Promise} API response
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/alumini/login', credentials);
      
      if (response.data.data?.token) {
        // Store token and user data
        localStorage.setItem('alumni_token', response.data.data.token);
        localStorage.setItem('alumni_user', JSON.stringify(response.data.data.alumni));
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout alumni
   * @returns {Promise} API response
   */
  logout: async () => {
    try {
      const response = await api.post('/alumini/logout');
      
      // Clear local storage
      localStorage.removeItem('alumni_token');
      localStorage.removeItem('alumni_user');
      
      // Clear authorization header
      delete api.defaults.headers.common['Authorization'];
      
      return response.data;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('alumni_token');
      localStorage.removeItem('alumni_user');
      delete api.defaults.headers.common['Authorization'];
      
      throw error;
    }
  },

  /**
   * Get current user
   * @returns {Promise} API response with user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/alumini/me');
      return response.data.data;
    } catch (error) {
      // If API call fails, try to get from localStorage as fallback
      const user = localStorage.getItem('alumni_user');
      return user ? JSON.parse(user) : null;
    }
  },

  /**
   * Get auth token
   * @returns {string|null} Token or null
   */
  getToken: () => {
    return localStorage.getItem('alumni_token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('alumni_token');
    const user = localStorage.getItem('alumni_user');
    return !!(token && user);
  },

  /**
   * Initialize auth from local storage
   */
  initializeAuth: () => {
    const token = localStorage.getItem('alumni_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

// Initialize auth on service import
authService.initializeAuth();

export default authService;
