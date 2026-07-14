import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Map the current route to a hero "page" key (matches the admin's hero sections).
const PATH_PAGE = {
  '/': 'home', '/about': 'about', '/contact': 'contact', '/directory': 'directory',
  '/donors': 'donors', '/legal': 'legal', '/privacy': 'privacy', '/terms': 'terms',
  '/guidelines': 'guidelines', '/events': 'events', '/jobs': 'jobs',
  '/mentorship': 'mentorship', '/media-center': 'media-center',
};
const pageFromPath = (p) => PATH_PAGE[p] || p.split('/').filter(Boolean)[0] || 'home';

// The i18n key holding a hero part's default text (for pre-filling the hero form).
const heroKey = (page, field) => {
  if (field === 'images') return null;
  if (page === 'home') {
    if (field === 'title') return 'home.heroSlide1Title';
    if (field === 'subtitle') return 'home.heroSlide1Subtitle';
    return null;
  }
  return `${page}.hero.${field}`;
};

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

/**
 * Live-preview edit bridge (active only inside the admin iframe with ?heroEdit=1).
 *  • Clicking inside the hero banner → reports which hero part (badge/title/
 *    subtitle/image) + its default text, so the admin opens the hero editor.
 *  • Clicking any other translated text on the page → looks up that text's i18n
 *    key (reverse index) and reports it, so the admin opens the content editor.
 * Together this makes the whole page editable in English/Pashto/Dari.
 */
export default function HeroEditBridge() {
  const { i18n } = useTranslation();

  useEffect(() => {
    let edit = false;
    try {
      edit = window.self !== window.top &&
        new URLSearchParams(window.location.search).get('heroEdit') === '1';
    } catch { edit = false; }
    if (!edit) return undefined;

    const curLang = () => {
      const l = (i18n.language || 'en').toLowerCase();
      if (l.startsWith('ps')) return 'ps';
      if (l.startsWith('da') || l.startsWith('fa')) return 'da';
      return 'en';
    };
    const tv = (lng, key) => {
      try { const v = i18n.getFixedT(lng)(key); return v && v !== key ? v : ''; }
      catch { return ''; }
    };

    // ── Reverse index: displayed text → i18n key (current language) ──
    let valueToKey = {};
    const buildIndex = () => {
      valueToKey = {};
      const bundle = i18n.getResourceBundle(i18n.language, 'translation') || {};
      const walk = (obj, prefix) => {
        Object.entries(obj).forEach(([k, v]) => {
          const key = prefix ? `${prefix}.${k}` : k;
          if (typeof v === 'string') {
            const n = norm(v);
            if (n && !(n in valueToKey)) valueToKey[n] = key;
          } else if (v && typeof v === 'object') {
            walk(v, key);
          }
        });
      };
      walk(bundle, '');
    };
    buildIndex();
    i18n.on('languageChanged', buildIndex);

    const keyForElement = (el, stop) => {
      let node = el;
      for (let i = 0; i < 4 && node && node !== stop; i += 1, node = node.parentElement) {
        const key = valueToKey[norm(node.textContent)];
        if (key) return key;
      }
      return null;
    };

    // Which hero part was clicked.
    const fieldOf = (start, hero) => {
      let node = start;
      while (node && node !== hero) {
        const tag = node.tagName;
        if (tag === 'H1' || tag === 'H2') return 'title';
        if (tag === 'P') return 'subtitle';
        const cls = typeof node.className === 'string' ? node.className : (node.className?.baseVal || '');
        if (/rounded-full/.test(cls) && tag !== 'BUTTON' && tag !== 'A') return 'badge';
        node = node.parentElement;
      }
      return 'images';
    };
    const valuesForHero = (page, field) => {
      const key = heroKey(page, field);
      if (!key) return null;
      const values = { en: tv('en', key), ps: tv('ps', key), da: tv('da', key) };
      return values.en || values.ps || values.da ? values : null;
    };

    const onClick = (e) => {
      // Let real form controls (and anything opted out) work normally.
      if (e.target.closest('input, select, textarea, [data-no-edit]')) return;
      const heroSection = [...document.querySelectorAll('section')]
        .find((s) => s.getBoundingClientRect().height >= 150);
      const page = pageFromPath(window.location.pathname);

      // 1) Inside the hero banner → hero editor.
      if (heroSection && heroSection.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        const field = fieldOf(e.target, heroSection);
        window.parent.postMessage(
          { type: 'kpu-hero-click', page, field, values: valuesForHero(page, field), text: norm(e.target.textContent).slice(0, 600), lang: curLang() },
          '*'
        );
        return;
      }

      // 2) Any other translated text → content editor.
      const key = keyForElement(e.target, document.body);
      if (!key) {
        window.parent.postMessage({ type: 'kpu-content-notfound' }, '*');
        return; // let the click behave normally (it's not editable text)
      }
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage(
        { type: 'kpu-content-click', key, values: { en: tv('en', key), ps: tv('ps', key), da: tv('da', key) }, lang: curLang() },
        '*'
      );
    };

    document.addEventListener('click', onClick, true); // capture phase

    // Hover cue: hero banner + any text element highlights as editable.
    const style = document.createElement('style');
    style.textContent =
      'section:first-of-type:hover { cursor: pointer; box-shadow: inset 0 0 0 2px rgba(37,99,235,.55); }' +
      'h1:hover,h2:hover,h3:hover,h4:hover,h5:hover,h6:hover,p:hover,a:hover,li:hover,button:hover,label:hover,span:hover {' +
      '  outline: 1px dashed rgba(37,99,235,.55); outline-offset: 2px; cursor: pointer; }';
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('click', onClick, true);
      i18n.off('languageChanged', buildIndex);
      style.remove();
    };
  }, [i18n]);

  return null;
}
