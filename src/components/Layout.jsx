import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
import notificationService from '../services/notificationService';
import { AuthContext } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { resolveHeroImage } from './ui/HeroBackground';
import LanguageSwitcher from './LanguageSwitcher';
import {
  FiArrowRight,
  FiMapPin,
  FiVideo,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiMail,
  FiLinkedin,
  FiFacebook,
  FiUser,
  FiBell,
  FiGrid,
  FiBriefcase,
  FiCalendar,
  FiMessageSquare,
  FiLogOut,
  FiChevronDown,
  FiUsers,
  FiInfo,
  FiFolder,
  FiImage,
  FiHeart
} from 'react-icons/fi';

// Build a usable avatar URL from a stored profile_image (relative /storage path
// works from any host via the Vite proxy), falling back to a generated avatar.
const avatarUrl = (user, size = 40) => {
  const img = user?.profile_image;
  if (img) {
    if (/^https?:\/\//.test(img)) {
      const m = img.match(/\/storage\/.*/);
      return m ? m[0] : img;
    }
    return img.startsWith('/storage') ? img : `/storage/${img}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=002759&color=ffffff&size=${size}`;
};
const fallbackAvatar = (user, size = 40) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=002759&color=ffffff&size=${size}`;

const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
};

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { settings, pick } = useSettings();
  const { user } = useContext(AuthContext);
  const brandName = pick(settings.brand_name) || t('common.brand');
  const brandTagline = pick(settings.tagline) || t('common.tagline');
  const brandLogo = resolveHeroImage(settings.logo) || '/logo_kpu.png';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const sidebarRef = useRef(null);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect and scroll to top on route change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, [location.pathname]);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isMenuOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isUserMenuOpen]);

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Fetch notifications
  const fetchUnreadCount = useCallback(async () => {
    if (!authService.isAuthenticated()) return;
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data?.count || 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    // Only poll while the tab is actually visible — a hidden/idle tab shouldn't
    // keep hitting the API in the background. Resume + refresh when it returns.
    let interval = null;
    const start = () => { if (!interval) interval = setInterval(fetchUnreadCount, 30000); };
    const stop = () => { if (interval) { clearInterval(interval); interval = null; } };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { fetchUnreadCount(); start(); }
      else stop();
    };
    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => { stop(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [fetchUnreadCount, isAuthenticated]);

  const handleOpenNotifications = async () => {
    setNotifOpen(prev => !prev);
    if (!notifOpen) {
      try {
        const res = await notificationService.getAll();
        setNotifications(res.data?.data || []);
        if (unreadCount > 0) {
          await notificationService.markAllRead();
          setUnreadCount(0);
        }
      } catch {}
    }
  };

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
      setIsUserMenuOpen(false);
      navigate('/login');
    }
  };

  // Handle menu item click
  const handleMenuClick = (e) => {
    // Don't prevent default for Link components, only for regular anchors
    if (e && e.target.tagName !== 'A') {
      e.preventDefault();
    }
    setIsMenuOpen(false);
  };

  // Single source of truth for the primary navigation (desktop + mobile).
  const navItems = [
    { to: '/directory', label: t('nav.directory'), icon: FiFolder, isActive: (p) => p === '/directory' },
    { to: '/about', label: t('nav.about'), icon: FiInfo, isActive: (p) => p === '/about' },
    { to: '/contact', label: t('nav.contact'), icon: FiMail, isActive: (p) => p === '/contact' },
    { to: '/jobs', label: t('nav.career'), icon: FiBriefcase, isActive: (p) => p === '/jobs' },
    { to: '/mentorship', label: t('nav.mentorship'), icon: FiUsers, isActive: (p) => p === '/mentorship' },
    { to: '/events', label: t('nav.events'), icon: FiCalendar, isActive: (p) => p === '/events' },
    { to: '/media-center', label: t('nav.media'), icon: FiImage, auth: true, isActive: (p) => p.startsWith('/media') },
    { to: '/legal', label: t('nav.giving'), icon: FiHeart, isActive: (p) => ['/legal', '/privacy', '/terms', '/guidelines'].includes(p) },
  ].filter((item) => !item.auth || isAuthenticated);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display">
      {/* Header — transparent at the top (over the hero), gaining a solid
          glass background + shadow once the user scrolls. */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#002759]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] border-b border-white/10'
          : 'bg-transparent'
      }`}>
        <div className={`w-full px-4 sm:px-6 lg:px-12 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-3 xl:gap-6 min-w-0">
              <div className={`flex items-center gap-2 sm:gap-4 transition-all duration-300 ${
                isScrolled ? 'text-white' : 'text-white'
              }`}>
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={brandLogo}
                      alt="KPU University"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-bold text-white text-sm sm:text-base truncate">
                      {brandName}
                    </div>
                    <div className="hidden xl:block text-xs text-white/80 truncate">
                      {brandTagline}
                    </div>
                  </div>
                </Link>
              </div>
              
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = item.isActive(location.pathname);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`relative whitespace-nowrap text-[13px] xl:text-sm font-medium px-3 xl:px-3.5 py-2 rounded-full transition-all duration-200 ${
                        active
                          ? 'text-white bg-white/15 shadow-inner'
                          : 'text-white/75 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                      <span
                        className={`pointer-events-none absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-300 transition-opacity duration-200 ${
                          active ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSwitcher className="hidden sm:flex" />
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className={`min-w-[60px] sm:min-w-[84px] h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-white to-blue-50 text-[#002759] hover:from-blue-50 hover:to-white hover:shadow-xl' 
                      : 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 hover:border-white/50'
                  }`}
                >
                  {t('common.login')}
                </Link>
              )}

              {isAuthenticated && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleOpenNotifications}
                    className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-white/90 hover:bg-white/10 transition-all"
                  >
                    <FiBell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('notifications.title')}</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-gray-500">{t('notifications.empty')}</div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                setNotifOpen(false);
                                if (n.type === 'event_registration' && n.reason) {
                                  navigate(`/events/${n.reason}`);
                                } else if (n.type === 'event_registration') {
                                  navigate('/events');
                                } else if (n.type?.startsWith('mentor_request') || n.type === 'mentor_review') {
                                  navigate('/profile');
                                } else if (n.type === 'mentor_profile_created' && n.reason) {
                                  navigate(`/mentorship/${n.reason}`);
                                } else {
                                  navigate('/profile');
                                }
                              }}
                              className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            >
                              <div className="flex items-start gap-2">
                                <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                  n.type === 'event_registration' ? 'bg-blue-500'
                                  : n.type === 'status_change' && n.title?.includes('Approved') ? 'bg-green-500'
                                  : n.type === 'status_change' && n.title?.includes('Rejected') ? 'bg-red-500'
                                  : 'bg-yellow-500'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{n.title}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                  {n.reason && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 italic">{t('notifications.reason')} {n.reason}</p>
                                  )}
                                  <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated && (
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isScrolled ? 'bg-gradient-to-br from-white/20 to-white/10 border-white/40 hover:from-white/30 hover:to-white/20' : 'bg-white/10 border-white/40 hover:bg-white/20'
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <img
                      src={avatarUrl(user, 40)}
                      alt="User Profile"
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                      onError={(e) => { e.target.src = fallbackAvatar(user, 40); }}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute top-full end-0 mt-3 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden z-[100] animate-fade-in origin-top">
                      {/* User header */}
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#002759] to-[#194ce6] text-white">
                        <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/40 flex-shrink-0 bg-white/10">
                          <img
                            src={avatarUrl(user, 64)}
                            alt={user?.name || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = fallbackAvatar(user, 64); }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-blue-100 uppercase tracking-wide">{t('userMenu.signedInAs')}</p>
                          <p className="text-sm font-bold truncate">{user?.name || 'Alumni'}</p>
                          {user?.email && <p className="text-[11px] text-blue-100 truncate">{user.email}</p>}
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#194ce6]/5 hover:text-[#002759] transition-colors">
                          <FiGrid className="text-[#194ce6]" /> {t('userMenu.dashboard')}
                        </Link>
                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#194ce6]/5 hover:text-[#002759] transition-colors">
                          <FiUser className="text-[#194ce6]" /> {t('userMenu.myProfile')}
                        </Link>
                        <Link to="/applications" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#194ce6]/5 hover:text-[#002759] transition-colors">
                          <FiBriefcase className="text-[#194ce6]" /> {t('userMenu.myApplications')}
                        </Link>
                        <Link to="/events/registered" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#194ce6]/5 hover:text-[#002759] transition-colors">
                          <FiCalendar className="text-[#194ce6]" /> {t('userMenu.myEvents')}
                        </Link>
                        <Link to="/messages" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#194ce6]/5 hover:text-[#002759] transition-colors">
                          <FiMessageSquare className="text-[#194ce6]" /> {t('userMenu.myMessages')}
                        </Link>
                      </div>

                      <div className="border-t border-gray-100">
                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                          <FiLogOut /> {t('userMenu.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button 
                className={`lg:hidden transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transform hover:scale-105 ${
                  isScrolled ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX size={16} className="sm:w-5 sm:h-5" /> : <FiMenu size={16} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Sidebar Menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden animate-fade-in"
                onClick={() => setIsMenuOpen(false)}
              ></div>
              
              {/* Sidebar */}
              <aside
                ref={sidebarRef}
                className="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-[#002759] shadow-2xl z-[9999] lg:hidden flex flex-col animate-slide-in-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={brandLogo} alt="KPU University" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{brandName}</div>
                      <div className="text-xs text-white/70 truncate">{brandTagline}</div>
                    </div>
                  </Link>
                  <button
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Signed-in user card */}
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={handleMenuClick}
                    className="flex items-center gap-3 mx-4 mt-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex-shrink-0"
                  >
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
                      <img
                        src={avatarUrl(user, 44)}
                        alt={user?.name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = fallbackAvatar(user, 44); }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{user?.name || t('common.account')}</p>
                      <p className="text-blue-200/80 text-xs truncate">{user?.email || t('common.manageProfile')}</p>
                    </div>
                  </Link>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">{t('nav.menu', 'Menu')}</p>
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const active = item.isActive(location.pathname);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={handleMenuClick}
                          className={`flex items-center gap-3 px-3 py-3 text-[15px] font-medium rounded-xl transition-colors ${
                            active ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Icon size={18} className={active ? 'text-blue-300' : 'text-white/60'} />
                          <span className="flex-1 truncate">{item.label}</span>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />}
                        </Link>
                      );
                    })}
                    {isAuthenticated && (
                      <Link
                        to="/dashboard"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-3 py-3 text-[15px] font-medium rounded-xl transition-colors ${
                          location.pathname === '/dashboard' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <FiGrid size={18} className={location.pathname === '/dashboard' ? 'text-blue-300' : 'text-white/60'} />
                        <span className="flex-1 truncate">{t('userMenu.dashboard')}</span>
                      </Link>
                    )}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 flex-shrink-0 space-y-3">
                  <div className="flex justify-center">
                    <LanguageSwitcher />
                  </div>
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                      className="w-full h-11 flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      <FiLogOut size={16} /> {t('userMenu.logout')}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={handleMenuClick}
                      className="w-full h-11 flex items-center justify-center gap-2 bg-white text-[#002759] text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <FiUser size={16} /> {t('common.login')}
                    </Link>
                  )}
                </div>
              </aside>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#002759] text-white py-8 sm:py-10 md:py-12 border-t border-[#003d7a]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  src={brandLogo}
                  alt="KPU University"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-white text-sm sm:text-base truncate">
                  {brandName}
                </div>
                <div className="text-xs text-blue-100 truncate">
                  {brandTagline}
                </div>
              </div>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              {pick(settings.footer_about) || t('footer.about')}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">{t('footer.quickLinks')}</h4>
            <ul className="flex flex-col gap-2 sm:gap-4 text-blue-100 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('nav.alumniDirectory')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.jobBoard')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.mentorshipProgram')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.campusNews')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">{t('footer.university')}</h4>
            <ul className="flex flex-col gap-2 sm:gap-4 text-blue-100 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('nav.aboutKpu')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.faculties')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.researchLabs')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.contactOffice')}</a></li>
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">{t('footer.followUs')}</h4>
            <div className="flex gap-3 sm:gap-4">
              <a href={settings.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiLinkedin className="text-sm sm:text-xl text-white" />
              </a>
              <a href={settings.contact_email ? `mailto:${settings.contact_email}` : '#'} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiMail className="text-sm sm:text-xl text-white" />
              </a>
              <a href={settings.facebook_url || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiFacebook className="text-sm sm:text-xl text-white" />
              </a>
            </div>
            <div className="mt-6 sm:mt-8 space-y-2">
              <div className="flex flex-col gap-2">
                <a href="/privacy" className="text-blue-200 text-[9px] sm:text-[10px] hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
                <a href="/terms" className="text-blue-200 text-[9px] sm:text-[10px] hover:text-white transition-colors">{t('footer.termsOfService')}</a>
                <a href="/guidelines" className="text-blue-200 text-[9px] sm:text-[10px] hover:text-white transition-colors">{t('footer.eventGuidelines')}</a>
              </div>
              <p className="text-blue-200 text-[9px] sm:text-[10px] pt-2 border-t border-white/20">
                {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
