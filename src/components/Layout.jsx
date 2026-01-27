import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  FiUser
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

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
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle menu item click
  const handleMenuClick = (e) => {
    // Don't prevent default for Link components, only for regular anchors
    if (e && e.target.tagName !== 'A') {
      e.preventDefault();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#002759]/95 backdrop-blur-xl shadow-2xl' 
          : 'bg-transparent !bg-transparent'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-12 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              <div className={`flex items-center gap-2 sm:gap-4 transition-all duration-300 ${
                isScrolled ? 'text-white' : 'text-white'
              }`}>
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src="/logo_kpu.png"
                      alt="KPU University"
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-bold text-white text-sm sm:text-base truncate">
                      KPU University
                    </div>
                    <div className="text-xs text-white/80 truncate">
                      Excellence in Education
                    </div>
                  </div>
                </Link>
              </div>
              
              <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
                <Link 
                  to="/directory" 
                  className={`text-xs sm:text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg relative group ${
                    location.pathname === '/directory' 
                      ? 'text-white bg-white/20' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Directory
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform -translate-x-1/2 transition-all duration-300 ${
                    location.pathname === '/directory' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link 
                  to="/jobs" 
                  className={`text-xs sm:text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg relative group ${
                    location.pathname === '/jobs' 
                      ? 'text-white bg-white/20' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Career
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform -translate-x-1/2 transition-all duration-300 ${
                    location.pathname === '/jobs' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link 
                  to="/mentorship" 
                  className={`text-xs sm:text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg relative group ${
                    location.pathname === '/mentorship' 
                      ? 'text-white bg-white/20' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Mentorship
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform -translate-x-1/2 transition-all duration-300 ${
                    location.pathname === '/mentorship' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link 
                  to="/events" 
                  className={`text-xs sm:text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg relative group ${
                    location.pathname === '/events' 
                      ? 'text-white bg-white/20' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Events
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform -translate-x-1/2 transition-all duration-300 ${
                    location.pathname === '/events' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link 
                  to="/legal" 
                  className={`text-xs sm:text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg relative group ${
                    location.pathname === '/legal' || location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/guidelines'
                      ? 'text-white bg-white/20' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Giving & Impact
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform -translate-x-1/2 transition-all duration-300 ${
                    location.pathname === '/legal' || location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/guidelines' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                to="/login"
                className={`min-w-[60px] sm:min-w-[84px] h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-white to-blue-50 text-[#002759] hover:from-blue-50 hover:to-white hover:shadow-xl' 
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 hover:border-white/50'
                }`}
              >
                Login
              </Link>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hidden sm:flex ${
                isScrolled ? 'bg-gradient-to-br from-white/20 to-white/10 border-white/40 hover:from-white/30 hover:to-white/20' : 'bg-white/10 border-white/40 hover:bg-white/20'
              }`}>
                <FiUser className="text-white text-sm sm:text-lg" />
              </div>
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
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] lg:hidden animate-fade-in"></div>
              
              {/* Sidebar */}
              <div 
                ref={sidebarRef}
                className="mobile-menu-sidebar fixed top-0 right-0 h-screen w-72 sm:w-80 bg-[#002759] shadow-2xl border-l-4 border-gray-900 z-[99999] lg:hidden transform transition-all duration-300 ease-in-out animate-slide-in-left"
                style={{ 
                  backgroundColor: '#002759 !important',
                  backgroundImage: 'linear-gradient(to bottom, #002759, #002759) !important',
                  isolation: 'isolate',
                  position: 'fixed',
                  top: '0',
                  right: '0',
                  height: '100vh !important',
                  maxHeight: '100vh !important',
                  background: '#002759 !important',
                  backgroundClip: 'padding-box',
                  WebkitBackgroundClip: 'padding-box'
                }}
              >
                <div className="flex flex-col h-screen bg-[#002759] relative"
                   style={{
                     position: 'relative',
                     zIndex: 1,
                     height: '100vh !important',
                     maxHeight: '100vh !important',
                     backgroundColor: '#002759 !important',
                     background: '#002759 !important'
                   }}
                >
                  {/* Background protection overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor: '#002759',
                      zIndex: -1,
                      background: '#002759'
                    }}
                  />
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#003d7a]">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src="/logo_kpu.png"
                          alt="KPU University"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-bold text-white text-sm truncate">
                          KPU University
                        </div>
                        <div className="text-xs text-white/80 truncate">
                          Excellence in Education
                        </div>
                      </div>
                    </div>
                    <button 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                  
                  {/* Navigation Menu */}
                  <nav className="flex-1 p-4">
                    <div className="flex flex-col gap-2">
                      <Link 
                        to="/directory"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/directory' 
                            ? 'bg-white/20 text-white' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        Directory
                      </Link>
                      <Link 
                        to="/jobs"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/jobs' 
                            ? 'bg-white/20 text-white' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        Career
                      </Link>
                      <Link 
                        to="/mentorship"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/mentorship' 
                            ? 'bg-white/20 text-white' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        Mentorship
                      </Link>
                      <Link 
                        to="/events"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/events' 
                            ? 'bg-white/20 text-white' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        Events
                      </Link>
                      <Link 
                        to="/legal"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/legal' || location.pathname === '/privacy' || location.pathname === '/terms' || location.pathname === '/guidelines'
                            ? 'bg-white/20 text-white' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        Giving & Impact
                      </Link>
                    </div>
                  </nav>
                  
                  {/* Sidebar Footer */}
                  <div className="p-4 border-t border-[#003d7a]">
                    <Link 
                      to="/login"
                      onClick={handleMenuClick}
                      className="w-full h-12 bg-white text-[#002759] text-sm font-bold rounded-lg hover:bg-gray-100 transition-all mb-3 flex items-center justify-center"
                    >
                      Login
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-xl border-2 border-white/40 flex items-center justify-center">
                        <FiUser className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Account</p>
                        <p className="text-blue-200 text-xs">Manage profile</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#003d7a]/30">
                      <Link 
                        to="/directory"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/directory' 
                            ? 'bg-white/20' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        <span className="text-lg opacity-70">📁</span>
                        Alumni Directory
                      </Link>
                      <Link 
                        to="/jobs"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/jobs' 
                            ? 'bg-white/20' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        <span className="text-lg opacity-70">💼</span>
                        Career Opportunities
                      </Link>
                      <Link 
                        to="/mentorship"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/mentorship' 
                            ? 'bg-white/20' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        <span className="text-lg opacity-70">🤝</span>
                        Mentorship Hub
                      </Link>
                      <Link 
                        to="/events"
                        onClick={handleMenuClick}
                        className={`flex items-center gap-3 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                          location.pathname === '/events' 
                            ? 'bg-white/20' 
                            : 'hover:bg-[#0a519b]'
                        }`}
                      >
                        <span className="text-lg opacity-70">📅</span>
                        Events Calendar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo_kpu.png"
                  alt="KPU University"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-white text-sm sm:text-base truncate">
                  KPU University
                </div>
                <div className="text-xs text-blue-100 truncate">
                  Excellence in Education
                </div>
              </div>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Fostering excellence, community, and lifelong learning for all Kabul Polytechnic University graduates.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">Quick Links</h4>
            <ul className="flex flex-col gap-2 sm:gap-4 text-blue-100 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Alumni Directory</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Job Board</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentorship Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Campus News</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">University</h4>
            <ul className="flex flex-col gap-2 sm:gap-4 text-blue-100 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About KPU</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Faculties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Research Labs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Office</a></li>
            </ul>
          </div>
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">Follow Us</h4>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiLinkedin className="text-sm sm:text-xl text-white" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiMail className="text-sm sm:text-xl text-white" />
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiFacebook className="text-sm sm:text-xl text-white" />
              </a>
            </div>
            <div className="mt-6 sm:mt-8 space-y-2">
              <div className="flex flex-col gap-2">
                <a href="/privacy" className="text-blue-200 text-[9px] sm:text-[10px] hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-blue-200 text-[9px] sm:text-[10px] hover:text-white transition-colors">Terms of Service</a>
                <a href="/guidelines" className="text-blue-200 text-[9px] sm:text-[10px] hover:text-white transition-colors">Event Guidelines</a>
              </div>
              <p className="text-blue-200 text-[9px] sm:text-[10px] pt-2 border-t border-white/20">
                © 2023 Kabul Polytechnic University Alumni Association. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
