import api from '../config/axios';

// Per-text content overrides for the whole site (admin edits, keyed by i18n key).
const contentService = {
  get: async () => {
    try {
      const res = await api.get('/alumini/content');
      return res.data?.data || {};
    } catch (e) {
      console.error('Content overrides: failed to load —', e?.message || e);
      return {};
    }
  },
};

export default contentService;
