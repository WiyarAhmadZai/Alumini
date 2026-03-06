import api from '../config/axios';

const mentorService = {
  /**
   * Get all verified mentors (public)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/alumini/mentors', { params });
    return response.data;
  },

  /**
   * Get the authenticated alumni's mentor profile
   */
  getMyMentor: async () => {
    const response = await api.get('/alumini/me/mentor');
    return response.data;
  },

  /**
   * Create or update mentor profile
   */
  save: async (data) => {
    const response = await api.post('/alumini/me/mentor', data);
    return response.data;
  },

  /**
   * Remove mentor profile
   */
  remove: async () => {
    const response = await api.delete('/alumini/me/mentor');
    return response.data;
  },

  /**
   * Submit a mentorship request to a mentor by mentor id
   */
  requestMentorship: async (mentorId, message = '', whatsapp_number = '') => {
    const response = await api.post(`/alumini/mentors/${mentorId}/request`, { message, whatsapp_number });
    return response.data;
  },

  /**
   * Get all mentorship requests received (for mentors)
   */
  getRequests: async () => {
    const response = await api.get('/alumini/me/mentor/requests');
    return response.data;
  },

  /**
   * Get mentor profile by alumni student ID (public)
   */
  getByAlumni: async (alumniId) => {
    const response = await api.get(`/alumini/mentors/by-alumni/${alumniId}`);
    return response.data;
  },

  /**
   * Get all mentorship requests the current user has submitted
   */
  getMyApplications: async () => {
    const response = await api.get('/alumini/me/mentor-applications');
    return response.data;
  },
};

export default mentorService;
