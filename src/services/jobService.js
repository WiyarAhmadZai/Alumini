import api from '../config/axios';

const jobService = {
  /**
   * Get all jobs with filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getJobs: async (params = {}) => {
    try {
      const response = await api.get('/alumini/jobs', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific job by ID
   * @param {number} id - Job ID
   * @returns {Promise} API response
   */
  getJobById: async (id) => {
    try {
      const response = await api.get(`/alumini/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Apply for a job
   * @param {number} jobId - Job ID
   * @param {Object} applicationData - Application data
   * @param {File} cvFile - CV file (optional)
   * @returns {Promise} API response
   */
  applyForJob: async (jobId, applicationData, cvFile = null, onUploadProgress = null) => {
    try {
      const formData = new FormData();

      // Add application data
      Object.entries(applicationData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Add CV file if provided
      if (cvFile) {
        formData.append('cv_file', cvFile);
      }

      const response = await api.post(`/alumini/jobs/${jobId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(percent);
          }
        }
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get job statistics
   * @returns {Promise} API response
   */
  getJobStatistics: async () => {
    try {
      const response = await api.get('/alumini/jobs/statistics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get filter options
   * @returns {Promise} API response
   */
  getFilterOptions: async () => {
    try {
      const response = await api.get('/alumini/jobs/filter-options');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's job applications
   * @returns {Promise} API response
   */
  getUserApplications: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get('/alumini/applications-list', {
        params: {
          page: page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove a job application
   * @param {number} applicationId - Application ID
   * @returns {Promise} API response
   */
  removeApplication: async (applicationId) => {
    try {
      const response = await api.delete(`/alumini/jobs/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default jobService;
