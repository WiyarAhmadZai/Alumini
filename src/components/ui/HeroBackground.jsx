import { useState, useEffect } from 'react';
import { useHero } from '../../contexts/HeroContext';

// Backend uploads are served under /storage. We return a RELATIVE /storage
// path so the browser fetches it from the current origin and Vite's dev proxy
// (see vite.config.js) forwards it to the backend. Using a relative path keeps
// images working no matter which host the app is opened from (localhost, LAN
// IP like 172.16.x.x, etc.) — a hardcoded http://localhost:8000 would break for
// any visitor not sitting on the backend machine. Local assets (e.g. /kpu1.jpg)
// live in this site's public folder and are used as-is.
export const resolveHeroImage = (src) => {
  if (!src) return '';
  if (/^https?:\/\//.test(src)) {
    // Normalize an absolute backend URL down to its /storage path.
    const m = src.match(/\/storage\/.*/);
    return m ? m[0] : src;
  }
  if (src.startsWith('/storage')) return src;
  if (src.startsWith('storage/')) return `/${src}`;
  return src;
};

/**
 * Dynamic hero background. Renders the admin-managed images for `page`
 * (auto-rotating slider when there is more than one), falling back to
 * `fallbackImage` until/unless the admin configures images.
 */
const HeroBackground = ({
  page,
  fallbackImage,
  overlay = 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.85) 100%)',
  className = 'absolute inset-0 bg-cover bg-center bg-no-repeat',
}) => {
  const { images } = useHero(page);
  const list = images.length ? images : (fallbackImage ? [fallbackImage] : []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
    if (list.length <= 1) return undefined;
    const timer = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  if (!list.length) return null;

  return (
    <>
      {list.map((img, i) => (
        <div
          key={i}
          className={`${className} transition-opacity duration-1000 ease-in-out`}
          style={{
            backgroundImage: `${overlay}, url("${resolveHeroImage(img)}")`,
            opacity: i === idx ? 1 : 0,
          }}
        />
      ))}
    </>
  );
};

export default HeroBackground;
