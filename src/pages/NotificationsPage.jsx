import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiBell, FiCheck, FiRotateCcw, FiCheckCircle, FiCalendar, FiUsers,
  FiStar, FiXCircle, FiInbox, FiPaperclip, FiEye, FiExternalLink, FiDownload, FiX, FiFileText,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import notificationService from '../services/notificationService';

const BRAND = '#002759';

// Relative "time ago" in the current language.
const timeAgo = (dateStr, L) => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return L('just now', 'همدا اوس', 'همین حالا');
  const m = Math.floor(diff / 60);
  if (m < 60) return L(`${m}m ago`, `${m} دقیقې مخکې`, `${m} دقیقه پیش`);
  const h = Math.floor(m / 60);
  if (h < 24) return L(`${h}h ago`, `${h} ساعته مخکې`, `${h} ساعت پیش`);
  const d = Math.floor(h / 24);
  return L(`${d}d ago`, `${d} ورځې مخکې`, `${d} روز پیش`);
};

// Icon + accent color for each notification type.
const visualFor = (n) => {
  const t = n.type || '';
  if (t === 'event_registration') return { Icon: FiCalendar, bg: '#eef1fd', fg: '#194ce6' };
  if (t === 'status_change' && n.title?.includes('Approved')) return { Icon: FiCheckCircle, bg: '#dcfce7', fg: '#16a34a' };
  if (t === 'status_change' && n.title?.includes('Rejected')) return { Icon: FiXCircle, bg: '#fee2e2', fg: '#dc2626' };
  if (t.startsWith('mentor') || t === 'mentor_review') return { Icon: FiUsers, bg: '#f3e8ff', fg: '#9333ea' };
  if (t.startsWith('success_story')) return { Icon: FiStar, bg: '#fef3c7', fg: '#d97706' };
  return { Icon: FiBell, bg: '#eef1fd', fg: BRAND };
};

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const L = (en, ps, da) => {
    const l = (i18n.language || '').toLowerCase();
    if (l.startsWith('ps')) return ps;
    if (l.startsWith('da') || l.startsWith('fa')) return da;
    return en;
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // { url, name, type }

  const load = () => {
    setLoading(true);
    notificationService.getAll()
      .then((r) => setItems(r.data?.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  // Where a notification leads (reason is only an internal id here).
  const notifTarget = (n) => {
    if (n.type === 'event_registration' && n.reason) return `/events/${n.reason}`;
    if (n.type === 'event_registration') return '/events';
    if (n.type?.startsWith('mentor_request') || n.type === 'mentor_review') return '/profile';
    if (n.type === 'mentor_profile_created' && n.reason) return `/mentorship/${n.reason}`;
    if (n.type === 'success_story_review') return '/profile?tab=story';
    if (n.type === 'admin_broadcast') return '/notifications';
    return '/profile';
  };

  const setRead = async (n, read) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: read } : x)));
    try { read ? await notificationService.markRead(n.id) : await notificationService.markUnread(n.id); } catch { /* ignore */ }
  };
  const markAll = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    try { await notificationService.markAllRead(); } catch { /* ignore */ }
  };
  const open = (n) => { setRead(n, true); navigate(notifTarget(n)); };

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <Layout>
      {/* ─── Short hero (gives the navbar its dark backdrop + page title) ─── */}
      <section className="relative w-full h-56 sm:h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              `linear-gradient(rgba(0,10,40,0.82) 0%, rgba(0,20,70,0.92) 100%), url("/kpu2.jpg")`,
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
          <div className="text-white max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] bg-white/10 border border-white/20 mb-3">
              <FiBell size={12} /> {L('Your inbox', 'ستاسو صندوق', 'صندوق شما')}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-2">
              {L('Notifications', 'خبرتیاوې', 'اعلان‌ها')}
            </h1>
            <p className="text-sm sm:text-base text-white/75">
              {unreadCount > 0
                ? L(`You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`,
                    `تاسو ${unreadCount} نالوستې خبرتیا لرئ`,
                    `شما ${unreadCount} اعلان خوانده‌نشده دارید`)
                : L('You are all caught up', 'ټول لوستل‌شوي دي', 'همه را خوانده‌اید')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Content (overlaps the hero) ─── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-20 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FiInbox style={{ color: BRAND }} />
              {L('All notifications', 'ټولې خبرتیاوې', 'همه اعلان‌ها')}
            </h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white px-4 py-2 rounded-full bg-gradient-to-r from-[#002759] to-[#0a519b] hover:shadow-md transition-all"
              >
                <FiCheckCircle /> {L('Mark all as read', 'ټول لوستل‌شوي وګڼئ', 'همه را خوانده‌شده')}
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ background: '#eef1fd', color: BRAND }}>
                <FiBell className="text-2xl" />
              </div>
              <p className="text-sm font-semibold text-gray-700">{L('No notifications yet.', 'تر اوسه خبرتیا نشته.', 'هنوز اعلانی نیست.')}</p>
              <p className="text-xs text-gray-400 mt-1">
                {L("We'll let you know when something happens.", 'کله چې څه پیښ شي، خبر به مو کړو.', 'وقتی اتفاقی بیفتد به شما اطلاع می‌دهیم.')}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((n) => {
                const { Icon, bg, fg } = visualFor(n);
                return (
                  <div
                    key={n.id}
                    className={`group flex items-start gap-3 sm:gap-4 rounded-2xl border p-3.5 sm:p-4 transition-all hover:shadow-md ${
                      !n.is_read
                        ? 'bg-blue-50/40 border-blue-200'
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: bg, color: fg }}>
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => open(n)}>
                      <div className="flex items-center gap-2">
                        <p dir="auto" className="font-bold text-sm sm:text-[15px] text-gray-900 truncate">{n.title}</p>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                      <p dir="auto" className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed text-justify line-clamp-3">{n.message}</p>
                      {n.type === 'status_change' && n.reason && (
                        <p dir="auto" className="text-xs text-red-600 mt-1 italic">{t('notifications.reason')} {n.reason}</p>
                      )}

                      {/* Attachment — preview here, open in a new tab, or download */}
                      {n.attachment_url && (
                        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                          {(n.attachment_type || '').startsWith('image/') ? (
                            <img
                              src={n.attachment_url}
                              alt={n.attachment_name || ''}
                              onClick={() => setPreview({ url: n.attachment_url, name: n.attachment_name, type: n.attachment_type })}
                              className="max-h-40 rounded-lg border border-gray-200 cursor-zoom-in object-cover"
                            />
                          ) : (
                            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 max-w-sm">
                              <FiFileText className="text-blue-600 shrink-0" />
                              <span className="text-xs text-gray-700 truncate flex-1">{n.attachment_name || L('Attachment', 'ضمیمه', 'ضمیمه')}</span>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => setPreview({ url: n.attachment_url, name: n.attachment_name, type: n.attachment_type })}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <FiEye size={12} /> {L('Preview', 'مخکتنه', 'پیش‌نمایش')}
                            </button>
                            <a
                              href={n.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              <FiExternalLink size={12} /> {L('Open in new tab', 'په نوي ټب کې', 'در تب جدید')}
                            </a>
                            <a
                              href={n.attachment_url}
                              download={n.attachment_name || true}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              <FiDownload size={12} /> {L('Download', 'ډاونلوډ', 'دانلود')}
                            </a>
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-gray-400 mt-1.5">{timeAgo(n.created_at, L)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setRead(n, !n.is_read); }}
                      title={n.is_read ? L('Mark as unread', 'نالوستی وګڼئ', 'خوانده‌نشده کن') : L('Mark as read', 'لوستل‌شوی وګڼئ', 'خوانده‌شده کن')}
                      className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition"
                    >
                      {n.is_read ? <FiRotateCcw size={16} /> : <FiCheck size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Same-tab preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                <FiPaperclip /> {preview.name || L('Attachment', 'ضمیمه', 'ضمیمه')}
              </h3>
              <div className="flex items-center gap-2">
                <a href={preview.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <FiExternalLink size={13} /> {L('New tab', 'نوی ټب', 'تب جدید')}
                </a>
                <a href={preview.url} download={preview.name || true}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  <FiDownload size={13} /> {L('Download', 'ډاونلوډ', 'دانلود')}
                </a>
                <button type="button" onClick={() => setPreview(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiX size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-gray-100 overflow-auto flex items-center justify-center">
              {(preview.type || '').startsWith('image/') ? (
                <img src={preview.url} alt={preview.name || ''} className="max-w-full max-h-[75vh] object-contain" />
              ) : (preview.type || '').includes('pdf') ? (
                <iframe src={preview.url} title={preview.name || 'preview'} className="w-full h-[75vh] border-0" />
              ) : (
                <div className="text-center p-10">
                  <FiFileText className="mx-auto text-5xl text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">{L('Preview is not available for this file type.', 'د دې ډول فایل لپاره مخکتنه شتون نلري.', 'پیش‌نمایش برای این نوع فایل موجود نیست.')}</p>
                  <p className="text-xs text-gray-400 mt-1">{L('Use Open in new tab or Download.', 'په نوي ټب کې پرانیزئ یا یې ډاونلوډ کړئ.', 'از «تب جدید» یا «دانلود» استفاده کنید.')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
