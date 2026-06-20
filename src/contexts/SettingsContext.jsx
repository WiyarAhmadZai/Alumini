import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import settingsService from '../services/settingsService';

const SettingsContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  // Safe default so components can call useSettings() even outside the provider.
  return ctx || { settings: {}, chancellor: null, board: [], loaded: false, pick: (v, f = '') => (typeof v === 'object' && v ? (v.en || f) : (v ?? f)) };
};

export const SettingsProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState({});
  const [chancellor, setChancellor] = useState(null);
  const [board, setBoard] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    settingsService.get().then((data) => {
      if (!active || !data) return;
      setSettings(data.settings || {});
      setChancellor(data.chancellor || null);
      setBoard(data.board || []);
      // Apply the admin-configured default language ONLY if the user hasn't
      // already chosen one (stored choice always wins).
      const stored = localStorage.getItem('alumni-language');
      const def = data.settings?.default_language;
      if (!stored && def && ['en', 'ps', 'da'].includes(def) && i18n.language !== def) {
        i18n.changeLanguage(def);
      }
    }).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
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
    <SettingsContext.Provider value={{ settings, chancellor, board, loaded, pick }}>
      {children}
    </SettingsContext.Provider>
  );
};
