import api from '../config/axios';

const settingsService = {
  // Public site settings + leadership for the alumni frontend.
  get: async () => {
    try {
      const res = await api.get('/alumini/settings');
      return res.data?.data || null;
    } catch (e) {
      console.error('Settings: failed to load —', e?.message || e);
      return null;
    }
  },
};

export default settingsService;
