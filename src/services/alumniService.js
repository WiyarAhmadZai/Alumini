import api from '../config/axios';

const alumniService = {
  /**
   * Register a verified alumni (MIS integration)
   * @param {Object} alumniData - Verified alumni registration data
   * @returns {Promise} API response
   */
  registerVerifiedAlumni: async (alumniData) => {
    try {
      const response = await api.post('/alumini/register', alumniData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all verified alumni
   * @returns {Promise} API response
   */
  getAll: async () => {
    try {
      const response = await api.get('/alumini');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get specific alumni by ID
   * @param {number} id - Alumni ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/alumini/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update alumni profile
   * @param {number} id - Alumni ID
   * @param {Object} data - Profile data
   * @returns {Promise} API response
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`/alumini/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search alumni by query
   * @param {string} query - Search query
   * @returns {Promise} API response
   */
  search: async (query) => {
    try {
      const response = await api.get(`/alumini/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default alumniService;
