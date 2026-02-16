import api from '../config/axios';

const alumniService = {
  /**
   * Get current authenticated alumni profile
   * @returns {Promise} API response
   */
  getMe: async () => {
    try {
      const response = await api.get('/alumini/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMe: async (data) => {
    try {
      const response = await api.put('/alumini/me', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await api.post('/alumini/me/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadCoverImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('cover_image', file);

      const response = await api.post('/alumini/me/cover-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createExperience: async (data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post('/alumini/me/experiences', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.post('/alumini/me/experiences', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateExperience: async (id, data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post(`/alumini/me/experiences/${id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.put(`/alumini/me/experiences/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteExperience: async (id) => {
    try {
      const response = await api.delete(`/alumini/me/experiences/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createEducation: async (data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post('/alumini/me/educations', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.post('/alumini/me/educations', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEducation: async (id, data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post(`/alumini/me/educations/${id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.put(`/alumini/me/educations/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteEducation: async (id) => {
    try {
      const response = await api.delete(`/alumini/me/educations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSkill: async (data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post('/alumini/me/skills', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.post('/alumini/me/skills', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSkill: async (id, data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post(`/alumini/me/skills/${id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.put(`/alumini/me/skills/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSkill: async (id) => {
    try {
      const response = await api.delete(`/alumini/me/skills/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAchievement: async (data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post('/alumini/me/achievements', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.post('/alumini/me/achievements', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAchievement: async (id, data, attachmentFile = null) => {
    try {
      if (attachmentFile) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v);
        });
        formData.append('attachment', attachmentFile);
        const response = await api.post(`/alumini/me/achievements/${id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }

      const response = await api.put(`/alumini/me/achievements/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAchievement: async (id) => {
    try {
      const response = await api.delete(`/alumini/me/achievements/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search student by University ID
   * @param {string} universityId - University ID to search
   * @returns {Promise} API response
   */
  searchStudent: async (universityId) => {
    try {
      const response = await api.get(`/alumini/students/search/${universityId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify tazkira number for student
   * @param {string} universityId - University ID
   * @param {string} tazkiraNumber - Tazkira number
   * @returns {Promise} API response
   */
  verifyTazkira: async (universityId, tazkiraNumber) => {
    try {
      const response = await api.post('/alumini/students/verify-tazkira', {
        university_id: universityId,
        tazkira_number: tazkiraNumber
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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
  },

  /**
   * Get available graduation years
   * @returns {Promise} API response
   */
  getGraduationYears: async () => {
    try {
      const response = await api.get('/alumini/graduation-years');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default alumniService;
