/**
 * Resolve a notification's title/message in the reader's language.
 *
 * The backend stores finished English sentences in `title`/`message` (they are
 * also used for e-mail and the admin activity log), and, for system-generated
 * notifications, a `meta` descriptor saying how to rebuild that text:
 *
 *   meta = { title_key, message_key, params }
 *
 * Two deliberate fallbacks to the stored English:
 *
 *  - No key. Broadcasts, donation e-mails and success-story feedback carry text
 *    an administrator typed. Translating those would put words in their mouth,
 *    so they are shown exactly as written — a `meta` may set only `title_key`
 *    when the title is ours but the body is theirs.
 *  - Rows written before `meta` existed simply have none.
 */
export function notificationText(n, t) {
  const meta = n?.meta || {};
  const params = meta.params || {};

  const resolve = (key, stored) =>
    key ? t(`notifications.items.${key}`, { ...params, defaultValue: stored }) : stored;

  return {
    title: resolve(meta.title_key, n?.title),
    message: resolve(meta.message_key, n?.message),
  };
}
