import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import heroService from '../services/heroService';

const HeroContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useHeroData = () => useContext(HeroContext) || { heroes: {}, loaded: false };

export const HeroProvider = ({ children }) => {
  const [heroes, setHeroes] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () => heroService.get()
      .then((d) => { if (active) setHeroes(d || {}); })
      .finally(() => { if (active) setLoaded(true); });
    load();
    // Refresh when the tab regains focus / becomes visible so hero images and
    // text edited in the admin appear without a hard reload.
    const onFocus = () => { if (document.visibilityState !== 'hidden') load(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  return <HeroContext.Provider value={{ heroes, loaded }}>{children}</HeroContext.Provider>;
};

// Resolve one page's hero for the active language. Translatable fields are
// {en,ps,da} objects; empty values let the caller fall back to static i18n copy.
// eslint-disable-next-line react-refresh/only-export-components
export const useHero = (page) => {
  const { i18n } = useTranslation();
  const { heroes } = useHeroData();
  const lang = i18n.language;

  const pick = (val) => {
    if (val == null) return '';
    if (typeof val === 'object') return val[lang] || val.en || val.ps || val.da || '';
    return val;
  };

  const h = heroes[page] || {};
  return {
    badge: pick(h.badge),
    title: pick(h.title),
    subtitle: pick(h.subtitle),
    images: Array.isArray(h.images) ? h.images : [],
  };
};
