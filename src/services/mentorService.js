import api from '../config/axios';

const mentorService = {
  // ───────── Public ─────────
  getAll: async (params = {}) => {
    const response = await api.get('/alumini/mentors', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/alumini/mentors/${id}`);
    return response.data;
  },

  getByAlumni: async (alumniId) => {
    const response = await api.get(`/alumini/mentors/by-alumni/${alumniId}`);
    return response.data;
  },

  // ───────── My profile ─────────
  getMyMentor: async () => {
    const response = await api.get('/alumini/me/mentor');
    return response.data;
  },

  save: async (data) => {
    const response = await api.post('/alumini/me/mentor', data);
    return response.data;
  },

  remove: async () => {
    const response = await api.delete('/alumini/me/mentor');
    return response.data;
  },

  // ───────── Requests ─────────
  requestMentorship: async (mentorId, message = '', whatsapp_number = '') => {
    const response = await api.post(`/alumini/mentors/${mentorId}/request`, { message, whatsapp_number });
    return response.data;
  },

  // Requests received by me as mentor (filter: pending|accepted|rejected)
  getRequests: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/alumini/me/mentor/requests', { params });
    return response.data;
  },

  // Accepted mentees of me as mentor (limit optional)
  getMyMentees: async (limit = null) => {
    const params = limit ? { limit } : {};
    const response = await api.get('/alumini/me/mentor/mentees', { params });
    return response.data;
  },

  // Requests I sent
  getMyApplications: async () => {
    const response = await api.get('/alumini/me/mentor-applications');
    return response.data;
  },

  // Update mentor request status (mentor accepts/rejects)
  updateRequestStatus: async (requestId, status, mentorship_end_date = null) => {
    const payload = { status };
    if (mentorship_end_date) payload.mentorship_end_date = mentorship_end_date;
    const response = await api.put(`/alumini/mentor-requests/${requestId}/status`, payload);
    return response.data;
  },

  // Cancel a request I sent
  cancelRequest: async (requestId) => {
    const response = await api.delete(`/alumini/mentor-requests/${requestId}`);
    return response.data;
  },

  // ───────── Reviews ─────────
  submitReview: async (mentorId, rating, review = '') => {
    const response = await api.post(`/alumini/mentors/${mentorId}/review`, { rating, review });
    return response.data;
  },
};

export default mentorService;
