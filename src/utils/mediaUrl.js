// Readable media URLs: /media/<title-slug>-<uuid> instead of /media/<uuid>.
// The slug is cosmetic; the trailing UUID is what the API uses.

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/** Turn a title into a URL-friendly slug (keeps Dari/Pashto/Arabic letters). */
export const slugify = (s) => {
  const out = (s ?? 'media')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // drop punctuation, keep unicode letters/numbers
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return out || 'media';
};

/** Build a readable path for a media item. */
export const mediaPath = (item) => {
  const id = item?.fileId || item?.id || '';
  const title = item?.title || item?.header || item?.name || 'media';
  return `/media/${slugify(title)}-${id}`;
};

/** Extract the real UUID from a route param that may be a readable slug-uuid. */
export const parseMediaId = (param) => {
  if (!param) return param;
  const m = String(param).match(UUID_RE);
  return m ? m[0] : param; // fall back to the whole param (legacy plain-id links)
};
