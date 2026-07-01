import api from '../config/axios';

const heroService = {
  // Public per-page hero sections (banner text + slider images).
  get: async () => {
    try {
      const res = await api.get('/alumini/hero-sections');
      return res.data?.data || {};
    } catch (e) {
      console.error('Hero: failed to load —', e?.message || e);
      return {};
    }
  },
};

export default heroService;
