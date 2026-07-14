import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import settingsService from '../services/settingsService';
import { resolveHeroImage } from '../components/ui/HeroBackground';
import { setFavicon } from '../utils/favicon';

const SettingsContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  // Safe default so components can call useSettings() even outside the provider.
  return ctx || { settings: {}, chancellor: null, board: [], loaded: false, refresh: () => {}, pick: (v, f = '') => (typeof v === 'object' && v ? (v.en || f) : (v ?? f)) };
};

export const SettingsProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState({});
  const [chancellor, setChancellor] = useState(null);
  const [board, setBoard] = useState([]);
  const [loaded, setLoaded] = useState(false);
  // Only apply the admin-configured default language on the very first load, so
  // later background refreshes never yank the language out from under the user.
  const firstLoad = useRef(true);

  // Fetch the latest site settings + leadership from the shared backend. Called
  // on mount and again whenever the tab regains focus / on a light poll, so any
  // field changed in the admin (logo, brand name, footer, contact, socials…)
  // shows up on the public site automatically — no manual reload needed.
  const refresh = useCallback(async () => {
    const data = await settingsService.get();
    if (!data) return;
    setSettings(data.settings || {});
    setChancellor(data.chancellor || null);
    setBoard(data.board || []);
    // Keep the browser-tab icon in sync with the configured alumni logo.
    const logoUrl = resolveHeroImage(data.settings?.logo);
    if (logoUrl) setFavicon(logoUrl);
    if (firstLoad.current) {
      firstLoad.current = false;
      // Apply the admin-configured default language ONLY if the user hasn't
      // already chosen one (stored choice always wins).
      const stored = localStorage.getItem('alumni-language');
      const def = data.settings?.alumni_default_language || data.settings?.default_language;
      if (!stored && def && ['en', 'ps', 'da'].includes(def) && i18n.language !== def) {
        i18n.changeLanguage(def);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    const load = () => refresh().finally(() => { if (active) setLoaded(true); });
    load();

    // Re-fetch when the tab becomes visible again (e.g. the admin edits settings
    // in another tab, then switches back here) and poll gently while visible.
    let interval = null;
    const start = () => { if (!interval) interval = setInterval(load, 30000); };
    const stop = () => { if (interval) { clearInterval(interval); interval = null; } };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { load(); start(); }
      else stop();
    };
    if (document.visibilityState === 'visible') start();
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      active = false;
      stop();
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang = i18n.language;
  // Resolve a value that may be a translatable object {en,ps,da} or a scalar.
  const pick = (val, fallback = '') => {
    if (val == null) return fallback;
    if (typeof val === 'object') return val[lang] || val.en || val.ps || val.da || fallback;
    return val;
  };

  return (
    <SettingsContext.Provider value={{ settings, chancellor, board, loaded, refresh, pick }}>
      {children}
    </SettingsContext.Provider>
  );
};
