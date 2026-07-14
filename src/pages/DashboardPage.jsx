import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiBriefcase, FiCalendar, FiUsers, FiMessageSquare, FiArrowRight,
  FiSearch, FiUser, FiGrid, FiChevronRight, FiBell
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/authService';
import jobService from '../services/jobService';
import eventService from '../services/eventService';
import mentorService from '../services/mentorService';
import messageService from '../services/messageService';
import notificationService from '../services/notificationService';

const API_ORIGIN = 'http://localhost:8001';

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [appsTotal, setAppsTotal] = useState(0);
  const [events, setEvents] = useState([]);
  const [mentorApps, setMentorApps] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgTotal, setMsgTotal] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    let active = true;
    (async () => {
      const results = await Promise.allSettled([
        jobService.getUserApplications(1, 5),
        eventService.getMyRegistrations(),
        mentorService.getMyApplications(),
        messageService.getUserMessages(1, 5, '', 'all'),
        notificationService.getUnreadCount(),
      ]);
      if (!active) return;
      const [appsR, evtR, menR, msgR, notR] = results;

      if (appsR.status === 'fulfilled') {
        setApplications(appsR.value?.data?.applications || []);
        setAppsTotal(appsR.value?.data?.pagination?.total ?? (appsR.value?.data?.applications?.length || 0));
      }
      if (evtR.status === 'fulfilled') {
        const regs = (evtR.value?.data || []).filter((r) => r.status !== 'cancelled');
        setEvents(regs);
      }
      if (menR.status === 'fulfilled') setMentorApps(menR.value?.data || []);
      if (msgR.status === 'fulfilled') {
        setMessages(msgR.value?.data?.messages || []);
        setMsgTotal(msgR.value?.data?.pagination?.total ?? (msgR.value?.data?.messages?.length || 0));
      }
      if (notR.status === 'fulfilled') setUnread(notR.value?.data?.count || 0);

      setLoading(false);
    })();
    return () => { active = false; };
  }, [navigate]);

  const locale = i18n.language === 'en' ? 'en-US' : i18n.language === 'da' ? 'fa-AF' : 'fa-AF';
  const fmtDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return String(d).slice(0, 10);
    }
  };

  const avatar = user?.profile_image
    ? (user.profile_image.startsWith('http') ? user.profile_image : `${API_ORIGIN}/storage/${user.profile_image}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ffffff&color=002759&size=96`;

  // Profile completeness
  const fields = ['bio', 'current_job_title', 'current_company', 'location', 'linkedin_profile', 'profile_image'];
  const filled = fields.filter((f) => user?.[f]).length;
  const completeness = Math.round((filled / fields.length) * 100);

  const statusColor = (s) => {
    const map = {
      pending: 'bg-amber-100 text-amber-700',
      reviewed: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-indigo-100 text-indigo-700',
      rejected: 'bg-red-100 text-red-700',
      hired: 'bg-green-100 text-green-700',
      accepted: 'bg-green-100 text-green-700',
      registered: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-green-100 text-green-700',
    };
    return map[s] || 'bg-gray-100 text-gray-600';
  };
  const statusLabel = (s) => t(`dashboard.status.${s}`, { defaultValue: s });

  const stats = [
    { key: 'applications', icon: FiBriefcase, value: appsTotal, label: t('dashboard.stats.applications'), to: '/applications', grad: 'from-[#194ce6] to-[#0a2d8f]' },
    { key: 'events', icon: FiCalendar, value: events.length, label: t('dashboard.stats.events'), to: '/events/registered', grad: 'from-emerald-500 to-emerald-700' },
    { key: 'mentorship', icon: FiUsers, value: mentorApps.length, label: t('dashboard.stats.mentorship'), to: '/mentorship', grad: 'from-fuchsia-500 to-purple-700' },
    { key: 'messages', icon: FiMessageSquare, value: msgTotal, label: t('dashboard.stats.messages'), to: '/messages', grad: 'from-amber-500 to-orange-600', sub: unread > 0 ? t('dashboard.stats.unread', { count: unread }) : null },
  ];

  const quickActions = [
    { icon: FiSearch, label: t('dashboard.quickActions.findJobs'), to: '/jobs' },
    { icon: FiCalendar, label: t('dashboard.quickActions.browseEvents'), to: '/events' },
    { icon: FiUsers, label: t('dashboard.quickActions.findMentor'), to: '/mentorship' },
    { icon: FiUser, label: t('dashboard.quickActions.editProfile'), to: '/profile' },
    { icon: FiGrid, label: t('dashboard.quickActions.directory'), to: '/directory' },
    { icon: FiMessageSquare, label: t('dashboard.quickActions.messages'), to: '/messages' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#f6f6f8]">
        {/* Hero */}
        <div className="relative pt-24 sm:pt-28 pb-20 bg-gradient-to-br from-[#002759] via-[#0a2d8f] to-[#194ce6] overflow-hidden">
          <div className="absolute inset-0 opacity-10"
               style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl flex-shrink-0">
                <img src={avatar} alt={user?.name || 'User'} className="w-full h-full object-cover"
                     onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ffffff&color=002759&size=96`; }} />
              </div>
              <div className="min-w-0">
                <p className="text-blue-200 text-sm">{t('dashboard.welcome')}</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white truncate">
                  {user?.name || 'Alumni'} 👋
                </h1>
                <p className="text-blue-100 text-sm mt-1 hidden sm:block">{t('dashboard.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats — overlapping the hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {stats.map((s) => (
              <Link key={s.key} to={s.to}
                    className="group bg-white rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white shadow-md mb-3`}>
                  <s.icon size={20} />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#002759]">
                  {loading ? '—' : s.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">{s.label}</div>
                {s.sub && <div className="text-[11px] text-red-500 font-semibold mt-1">{s.sub}</div>}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent applications */}
            <SectionCard title={t('dashboard.recent.applications')} icon={FiBriefcase} to="/applications" viewAll={t('dashboard.recent.viewAll')}>
              {applications.length === 0 ? (
                <Empty text={t('dashboard.recent.emptyApplications')} />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {applications.slice(0, 5).map((a) => (
                    <li key={a.id} className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 rounded-lg bg-[#194ce6]/10 text-[#194ce6] flex items-center justify-center flex-shrink-0">
                        <FiBriefcase />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{a.job?.title || '—'}</p>
                        <p className="text-xs text-gray-500 truncate">{a.job?.company} · {t('dashboard.recent.appliedOn', { date: fmtDate(a.created_at || a.applied_at) })}</p>
                      </div>
                      {a.status && <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor(a.status)}`}>{statusLabel(a.status)}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            {/* Upcoming events */}
            <SectionCard title={t('dashboard.recent.events')} icon={FiCalendar} to="/events/registered" viewAll={t('dashboard.recent.viewAll')}>
              {events.length === 0 ? (
                <Empty text={t('dashboard.recent.emptyEvents')} />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {events.slice(0, 5).map((reg, idx) => {
                    const ev = reg.event || reg;
                    return (
                      <li key={ev.id || idx} className="flex items-center gap-3 py-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <FiCalendar />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">{ev.title || '—'}</p>
                          <p className="text-xs text-gray-500 truncate">{t('dashboard.recent.on', { date: fmtDate(ev.start_date) })}</p>
                        </div>
                        {reg.status && <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor(reg.status)}`}>{statusLabel(reg.status)}</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </SectionCard>

            {/* Recent messages */}
            <SectionCard title={t('dashboard.recent.messages')} icon={FiMessageSquare} to="/messages" viewAll={t('dashboard.recent.viewAll')}>
              {messages.length === 0 ? (
                <Empty text={t('dashboard.recent.emptyMessages')} />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {messages.slice(0, 5).map((m, idx) => (
                    <li key={m.id || idx} className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <FiMessageSquare />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{m.subject || m.name || '—'}</p>
                        <p className="text-xs text-gray-500 truncate">{t('dashboard.recent.on', { date: fmtDate(m.created_at) })}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Profile completeness */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-[#002759] mb-1">{t('dashboard.completeness.title')}</h3>
              <p className="text-xs text-gray-500 mb-4">{t('dashboard.completeness.subtitle')}</p>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#194ce6" strokeWidth="3.5"
                            strokeDasharray={`${completeness}, 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-[#002759]">{completeness}%</span>
                </div>
                <div className="min-w-0">
                  {completeness >= 100 ? (
                    <p className="text-sm font-semibold text-emerald-600">{t('dashboard.completeness.complete')}</p>
                  ) : (
                    <Link to="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-[#194ce6] hover:underline">
                      {t('dashboard.completeness.action')} <FiArrowRight className="rtl:rotate-180" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="text-sm font-bold text-[#002759] mb-4">{t('dashboard.quickActions.title')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((q, i) => (
                  <Link key={i} to={q.to}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#f6f6f8] hover:bg-[#194ce6]/10 text-gray-700 hover:text-[#002759] transition-colors text-center">
                    <q.icon className="text-[#194ce6]" size={20} />
                    <span className="text-xs font-semibold leading-tight">{q.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SectionCard = ({ title, icon: Icon, to, viewAll, children }) => (
  <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-2">
      <h3 className="flex items-center gap-2 text-sm font-bold text-[#002759]">
        <Icon className="text-[#194ce6]" /> {title}
      </h3>
      <Link to={to} className="flex items-center gap-1 text-xs font-semibold text-[#194ce6] hover:underline">
        {viewAll} <FiChevronRight className="rtl:rotate-180" />
      </Link>
    </div>
    {children}
  </div>
);

const Empty = ({ text }) => (
  <div className="py-8 text-center">
    <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
      <FiBell />
    </div>
    <p className="text-sm text-gray-400">{text}</p>
  </div>
);

export default DashboardPage;
