import React, { useState, useEffect } from 'react';
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
  FiFacebook
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#002759] backdrop-blur-md shadow-lg' 
          : 'bg-transparent !bg-transparent'
      }`}>
        <div className="w-full px-8 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-8 px-4">
              <div className={`flex items-center gap-4 transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-white'
              }`}>
                <div className="w-8 h-8">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">KPU Alumni</h2>
              </div>
              
              <nav className="hidden md:flex items-center gap-9">
                <a href="#" className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded' : 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded'
                }`}>Directory</a>
                <a href="#" className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded' : 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded'
                }`}>Events</a>
                <a href="#" className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded' : 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded'
                }`}>Jobs</a>
                <a href="#" className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded' : 'text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded'
                }`}>Giving</a>
              </nav>
            </div>

            <div className="flex items-center gap-4 px-4">
              <button className={`min-w-[84px] h-10 px-4 text-sm font-bold rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white text-[#002759] hover:bg-[#e6f0fa]' 
                  : 'bg-transparent text-white border border-white hover:bg-white/10'
              }`}>
                Login
              </button>
              <div className={`w-10 h-10 rounded-full border-2 bg-cover bg-center transition-all duration-300 ${
                isScrolled ? 'border-white/30' : 'border-white/50'
              }`} 
                   style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAS9Vwo0qwV7Bxvqk4epDLllUitvUDO63E01kIgsIOquLEbaJkkdpaUsDA0zrN9GEAXw5Ic_ZsM_8NIDR-GKAtvzuTkmXZwod0RC49hxhfrMh4Kw9mKSpFK_yYYSu03f-yFQZPUJSkGY4p6nCOsavUG6DQga8tC8AvQBC6KIaUjgVmucujKJHKDRMbqxkM8moIQOiv8VpET-c9AnlRu3OcT62paaXKQdN4DilRJlH7Pn_p8ZoVoyrmPxH5iydfl4h70P8yrbc84pXEq")'}}>
              </div>
              <button 
                className={`md:hidden transition-colors duration-300 ml-4 ${
                  isScrolled ? 'text-white' : 'text-white'
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#003d7a] animate-slide-up">
              <nav className="flex flex-col gap-4 mb-4">
                <a href="#" className="text-sm font-medium text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded transition-colors">Directory</a>
                <a href="#" className="text-sm font-medium text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded transition-colors">Events</a>
                <a href="#" className="text-sm font-medium text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded transition-colors">Jobs</a>
                <a href="#" className="text-sm font-medium text-white hover:bg-[#0a519b] hover:px-3 hover:py-1 hover:rounded transition-colors">Giving</a>
              </nav>
              <button className="w-full h-10 bg-white text-[#002759] text-sm font-bold rounded-lg hover:bg-[#e6f0fa] transition-all">
                Login
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#002759] text-white py-12 border-t border-[#003d7a]">
        <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 text-white">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                </svg>
              </div>
              <span className="text-xl font-bold">KPU Alumni</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Fostering excellence, community, and lifelong learning for all Kabul Polytechnic University graduates.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-blue-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Alumni Directory</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Job Board</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentorship Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Campus News</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">University</h4>
            <ul className="flex flex-col gap-4 text-blue-100 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About KPU</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Faculties</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Research Labs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Office</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-lg">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiLinkedin className="text-xl text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiMail className="text-xl text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <FiFacebook className="text-xl text-white" />
              </a>
            </div>
            <p className="text-blue-200 text-[10px] mt-8">
              © 2023 Kabul Polytechnic University Alumni Association. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
