import api from '../config/axios';

const fundraisingService = {
  getProjects: async () => {
    const res = await api.get('/alumini/fundraising/projects');
    return res.data;
  },

  getProject: async (id) => {
    const res = await api.get(`/alumini/fundraising/projects/${id}`);
    return res.data;
  },

  getTopDonors: async (limit = 4) => {
    const res = await api.get('/alumini/fundraising/top-donors', { params: { limit } });
    return res.data;
  },

  getCompletedDonors: async (params = {}) => {
    const res = await api.get('/alumini/fundraising/completed-donors', { params });
    return res.data;
  },

  donate: async (data) => {
    const res = await api.post('/alumini/fundraising/donate', data);
    return res.data;
  },
};

export default fundraisingService;
