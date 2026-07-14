import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import contentService from '../services/contentService';

/**
 * Fetches the admin's per-text content overrides and merges them on top of the
 * site's built-in translations, for every language. So any string an admin edits
 * in the panel (identified by its i18n key) shows up across the site. Refreshes
 * when the tab regains focus, so edits appear without a hard reload.
 */
export default function ContentOverrides() {
  const { i18n } = useTranslation();

  useEffect(() => {
    let active = true;

    const apply = (overrides) => {
      let changed = false;
      Object.entries(overrides || {}).forEach(([key, val]) => {
        if (!val) return;
        ['en', 'ps', 'da'].forEach((lng) => {
          if (val[lng] != null && val[lng] !== '') {
            i18n.addResource(lng, 'translation', key, val[lng]);
            changed = true;
          }
        });
      });
      // Nudge react-i18next consumers to re-render with the merged values.
      if (changed) i18n.emit('languageChanged', i18n.language);
    };

    const load = () => contentService.get().then((o) => { if (active) apply(o); });
    load();

    const onFocus = () => { if (document.visibilityState !== 'hidden') load(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      active = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [i18n]);

  return null;
}
