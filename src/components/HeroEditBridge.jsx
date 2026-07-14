import { useEffect } from 'react';

// Map the current route to a hero "page" key (matches the admin's hero sections).
const PATH_PAGE = {
  '/': 'home', '/about': 'about', '/contact': 'contact', '/directory': 'directory',
  '/donors': 'donors', '/legal': 'legal', '/privacy': 'privacy', '/terms': 'terms',
  '/guidelines': 'guidelines', '/events': 'events', '/jobs': 'jobs',
  '/mentorship': 'mentorship', '/media-center': 'media-center',
};
const pageFromPath = (p) => PATH_PAGE[p] || p.split('/').filter(Boolean)[0] || 'home';

/**
 * When the Alumni site is embedded in the admin's live preview (?heroEdit=1),
 * this makes the hero of the current page clickable: a click anywhere in the
 * first (hero) section reports the page to the admin (postMessage), which opens
 * that page's hero editor. Mounted once at the app root, so it works on every
 * page — including Home, which builds its own hero without <HeroBackground>.
 */
export default function HeroEditBridge() {
  useEffect(() => {
    let edit = false;
    try {
      edit = window.self !== window.top &&
        new URLSearchParams(window.location.search).get('heroEdit') === '1';
    } catch {
      edit = false;
    }
    if (!edit) return undefined;

    // Work out which hero part was clicked, so the admin opens only that field's
    // editor: the <h1>/<h2> is the title, a <p> the subtitle, a small rounded
    // pill the badge, and anything else (the background) the slider images.
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

    const onClick = (e) => {
      const section = e.target.closest('section');
      if (!section) return;
      // The hero is the first reasonably-tall section on the page.
      const hero = [...document.querySelectorAll('section')]
        .find((s) => s.getBoundingClientRect().height >= 150);
      if (section !== hero) return;
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage(
        {
          type: 'kpu-hero-click',
          page: pageFromPath(window.location.pathname),
          field: fieldOf(e.target, hero),
        },
        '*'
      );
    };

    // Capture phase so we intercept the click before the hero's own links.
    document.addEventListener('click', onClick, true);

    // Visual affordance: highlight the hero on hover so the admin knows it's clickable.
    const style = document.createElement('style');
    style.textContent =
      'body > *, #root { }' +
      'section:first-of-type { position: relative; }' +
      'section:first-of-type::after {' +
      '  content: "\\270E  Click to edit this hero"; position: absolute; top: 12px;' +
      '  left: 50%; transform: translateX(-50%); z-index: 60; pointer-events: none;' +
      '  background: rgba(37,99,235,.92); color: #fff; font: 600 12px/1 system-ui, sans-serif;' +
      '  padding: 7px 12px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,.35);' +
      '  opacity: 0; transition: opacity .15s; }' +
      'section:first-of-type:hover::after { opacity: 1; }' +
      'section:first-of-type:hover { outline: 2px dashed rgba(37,99,235,.8); outline-offset: -2px; cursor: pointer; }';
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('click', onClick, true);
      style.remove();
    };
  }, []);

  return null;
}
