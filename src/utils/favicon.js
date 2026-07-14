// Swap the browser-tab icon at runtime. Updates the existing <link rel="icon">
// (or creates one) so the admin-configured logo replaces the bundled favicon.
export const setFavicon = (href) => {
  if (!href || typeof document === 'undefined') return;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  // Let the browser infer the type; clearing a stale SVG type avoids it
  // rejecting a PNG/JPG logo.
  link.removeAttribute('type');
  if (link.href !== href) link.href = href;
};
