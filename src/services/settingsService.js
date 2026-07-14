import api from '../config/axios';

const settingsService = {
  // Public site settings + leadership for the alumni frontend.
  get: async () => {
    try {
      // Bust any browser/proxy cache so background refreshes always see the
      // latest admin-saved settings (logo, brand name, footer, contact…).
      const res = await api.get('/alumini/settings', {
        params: { _: Date.now() },
        headers: { 'Cache-Control': 'no-cache' },
      });
      return res.data?.data || null;
    } catch (e) {
      console.error('Settings: failed to load —', e?.message || e);
      return null;
    }
  },
};

export default settingsService;
