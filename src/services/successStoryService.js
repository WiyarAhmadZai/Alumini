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
};

export default successStoryService;
