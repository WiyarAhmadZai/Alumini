import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBell, FiCheck, FiRotateCcw, FiCheckCircle } from 'react-icons/fi';
import Layout from '../components/Layout';
import notificationService from '../services/notificationService';

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

  const hasUnread = items.some((n) => !n.is_read);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8 min-h-[60vh]">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-[#002759] dark:text-white flex items-center gap-2">
            <FiBell /> {L('Notifications', 'خبرتیاوې', 'اعلان‌ها')}
          </h1>
          {hasUnread && (
            <button
              type="button"
              onClick={markAll}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-full bg-gradient-to-r from-[#002759] to-[#0a519b] hover:shadow-md transition-all"
            >
              <FiCheckCircle /> {L('Mark all as read', 'ټول لوستل‌شوي وګڼئ', 'همه را خوانده‌شده علامت بزن')}
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse h-20 rounded-xl bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FiBell className="mx-auto mb-3 text-4xl" />
            <p className="text-sm">{L('No notifications yet.', 'تر اوسه خبرتیا نشته.', 'هنوز اعلانی نیست.')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${!n.is_read ? 'bg-blue-50/60 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              >
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => open(n)}>
                  <div className="flex items-center gap-2">
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    <p dir="auto" className="font-semibold text-gray-900 dark:text-white">{n.title}</p>
                  </div>
                  <p dir="auto" className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-justify">{n.message}</p>
                  {n.type === 'status_change' && n.reason && (
                    <p dir="auto" className="text-xs text-red-600 dark:text-red-400 mt-1 italic">{t('notifications.reason')} {n.reason}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at, L)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setRead(n, !n.is_read); }}
                  title={n.is_read ? L('Mark as unread', 'نالوستی وګڼئ', 'خوانده‌نشده کن') : L('Mark as read', 'لوستل‌شوی وګڼئ', 'خوانده‌شده کن')}
                  className="shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {n.is_read ? <FiRotateCcw size={16} /> : <FiCheck size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
