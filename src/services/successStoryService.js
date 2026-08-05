import api from '../config/axios';

// Alumni success stories: read the featured ones (home page) and submit your own.
const successStoryService = {
  getFeatured: async () => {
    try {
      const res = await api.get('/alumini/success-stories');
      return res.data?.data || [];
    } catch (e) {
      console.error('Success stories: failed to load —', e?.message || e);
      return [];
    }
  },
  submit: async (quote) => {
    const res = await api.post('/alumini/success-stories', { quote });
    return res.data;
  },
  // My own story (with status + admin message), for the profile page.
  getMine: async () => {
    try {
      const res = await api.get('/alumini/success-stories/mine');
      return res.data?.data || null;
    } catch {
      return null;
    }
  },
  // Edit my own story (sends it back to review).
  updateMine: async (quote) => {
    const res = await api.put('/alumini/success-stories/mine', { quote });
    return res.data;
  },
};

export default successStoryService;
