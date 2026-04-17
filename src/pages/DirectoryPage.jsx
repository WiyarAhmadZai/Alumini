import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiSearch, FiBookOpen, FiBriefcase, FiUser, FiMapPin, FiLinkedin, FiExternalLink, FiX, FiUsers, FiAward, FiGlobe, FiPlus, FiArrowRight } from 'react-icons/fi';
import alumniService from '../services/alumniService';

const DirectoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [expandedFilters, setExpandedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    faculty: [],
    graduationYear: '',
    degreeType: [],
    industry: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alumni, setAlumni] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await alumniService.getAll({ status: 'verified' });
        // API returns: { response_code, status, message, data: { alumni: Array, pagination: {...} } }
        const alumniData = response?.data?.alumni || response?.alumni || [];
        setAlumni(Array.isArray(alumniData) ? alumniData : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load alumni directory.');
      } finally {
        setLoading(false);
      }
    };

    const fetchGraduationYears = async () => {
      try {
        const response = await alumniService.getGraduationYears();
        // Handle different response structures
        const yearsData = response.data?.data || response.data || [];
        setAvailableYears(Array.isArray(yearsData) ? yearsData : []);
      } catch (err) {
        console.error('Failed to load graduation years:', err);
        // Set default years as fallback
        const currentYear = new Date().getFullYear();
        const defaultYears = [];
        for (let year = currentYear; year >= currentYear - 50; year--) {
          defaultYears.push(year);
        }
        setAvailableYears(defaultYears);
      }
    };

    fetchAlumni();
    fetchGraduationYears();
  }, []);

  const filteredAlumni = Array.isArray(alumni) ? alumni.filter(alumnus => {
    const matchesSearch = !searchTerm ||
      alumnus.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.current_job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.current_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.bio?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = selectedFilters.faculty.length === 0 || selectedFilters.faculty.includes(alumnus.faculty_name);
    const matchesYear = !selectedFilters.graduationYear || String(alumnus.graduation_year) === String(selectedFilters.graduationYear);

    return matchesSearch && matchesFaculty && matchesYear;
  }) : [];

  const faculties = [
    'Engineering',
    'Computer Science',
    'Geomatics',
    'Electromechanics',
    'Architecture',
    'Business Administration',
    'Law',
    'Pharmacy'
  ];

  const handleFacultyChange = (faculty) => {
    setSelectedFilters(prev => ({
      ...prev,
      faculty: faculty === '' ? [] : [faculty]
    }));
  };

  const handleYearChange = (year) => {
    setSelectedFilters(prev => ({
      ...prev,
      graduationYear: year
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilters({ faculty: [], graduationYear: '', degreeType: [], industry: [] });
    setExpandedFilters([]);
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) newSet.delete(cardId);
      else newSet.add(cardId);
      return newSet;
    });
  };

  const hasActiveFilters = searchTerm || selectedFilters.faculty.length > 0 || selectedFilters.graduationYear;

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse -mt-12 mb-4 border-4 border-white shadow-md" />
          <div className="h-5 w-36 bg-gray-200 rounded-full animate-pulse mb-2" />
          <div className="h-4 w-28 bg-gray-100 rounded-full animate-pulse mb-1" />
          <div className="h-3 w-32 bg-gray-100 rounded-full animate-pulse mb-4" />
        </div>
        <div className="flex justify-center gap-2 mb-6">
          <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );

  const HeroSection = ({ isLoading }) => (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 360 }}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.82) 100%), url("/images/hero-bg.jpg")'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 sm:px-6 text-center text-white" style={{ minHeight: 360 }}>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <FiUsers className="text-white/70" />
          <span className="text-white/90 tracking-wide">Alumni Network</span>
        </div>

        {isLoading ? (
          <>
            <div className="h-12 w-80 bg-white/15 rounded-full animate-pulse mb-4" />
            <div className="h-5 w-96 bg-white/10 rounded-full animate-pulse" />
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
              Alumni Directory
            </h1>
            <p className="text-lg text-white/70 max-w-lg mx-auto leading-relaxed font-light mb-10">
              Discover and connect with distinguished graduates shaping the world.
            </p>

            {alumni.length > 0 && (
              <div className="flex items-stretch bg-white/10 border border-white/15 rounded-2xl overflow-hidden">
                <div className="px-8 py-4 text-center">
                  <div className="text-3xl font-bold">{alumni.length}+</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest mt-0.5">Alumni</div>
                </div>
                <div className="w-px bg-white/15" />
                <div className="px-8 py-4 text-center">
                  <div className="text-3xl font-bold">{faculties.length}</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest mt-0.5">Faculties</div>
                </div>
                <div className="w-px bg-white/15" />
                <div className="px-8 py-4 text-center">
                  <div className="text-3xl font-bold">{availableYears.length > 0 ? availableYears.length : '20'}+</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest mt-0.5">Grad Years</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );

  if (loading) {
    return (
      <Layout>
        <HeroSection isLoading={true} />

        <div className="max-w-6xl mx-auto w-full px-6 -mt-10 pb-12 relative z-20">
          {/* Filter skeleton */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 h-12 bg-gray-100 rounded-xl animate-pulse" />
              <div className="md:col-span-3 h-12 bg-gray-100 rounded-xl animate-pulse" />
              <div className="md:col-span-2 h-12 bg-gray-100 rounded-xl animate-pulse" />
              <div className="md:col-span-2 h-12 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <HeroSection isLoading={false} />
        <div className="min-h-[40vh] flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-2xl shadow-sm border border-red-100 p-10 max-w-sm">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiX className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection isLoading={false} />

      {/* Filter Bar — overlaps hero */}
      <section className="relative z-20 -mt-10 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

            {/* Search */}
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Network</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, company, or role..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            {/* Faculty */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Faculty</label>
              <select
                value={selectedFilters.faculty[0] || ''}
                onChange={(e) => handleFacultyChange(e.target.value)}
                className="w-full py-2.5 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 appearance-none cursor-pointer transition-all"
              >
                <option value="">All Faculties</option>
                {faculties.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Year */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Grad Year</label>
              <select
                value={selectedFilters.graduationYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full py-2.5 px-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 appearance-none cursor-pointer transition-all"
              >
                <option value="">All Years</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={() => {}}
                className="flex-1 py-2.5 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
                style={{ background: '#194ce6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0f2d8a'}
                onMouseLeave={e => e.currentTarget.style.background = '#194ce6'}
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Reset Filters"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Count + active filters */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full mr-2" style={{ background: '#22c55e' }} />
              Showing <span className="font-semibold text-gray-800 mx-1">{filteredAlumni.length}</span> of <span className="font-semibold text-gray-800 mx-1">{alumni.length}</span> alumni profiles
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 ml-auto">
                {selectedFilters.faculty.map(f => (
                  <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border"
                    style={{ background: '#eef1fd', color: '#194ce6', borderColor: '#c5ccf7' }}>
                    <FiBookOpen className="text-xs" /> {f}
                    <button onClick={() => handleFacultyChange('')} className="ml-0.5 opacity-60 hover:opacity-100"><FiX className="text-xs" /></button>
                  </span>
                ))}
                {selectedFilters.graduationYear && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border"
                    style={{ background: '#eef1fd', color: '#194ce6', borderColor: '#c5ccf7' }}>
                    <FiAward className="text-xs" /> Class of {selectedFilters.graduationYear}
                    <button onClick={() => handleYearChange('')} className="ml-0.5 opacity-60 hover:opacity-100"><FiX className="text-xs" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Alumni Directory Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {filteredAlumni.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border"
              style={{ background: '#eef1fd', borderColor: '#c5ccf7' }}>
              <FiUsers className="text-3xl" style={{ color: '#194ce6' }} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No alumni found</h3>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">Try different search terms or remove filters to explore our full alumni network.</p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
                style={{ background: '#194ce6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0f2d8a'}
                onMouseLeave={e => e.currentTarget.style.background = '#194ce6'}
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlumni.map((alumnus) => (
              <article
                key={alumnus.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl flex flex-col h-full overflow-hidden transition-all duration-300"
                style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Cover gradient */}
                <div className="h-24 flex-shrink-0">
                  {alumnus.cover_image ? (
                    <img src={alumnus.cover_image} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: 'linear-gradient(to right, #0f2d8a, #194ce6)' }}
                    />
                  )}
                </div>

                {/* Card body */}
                <div className="px-6 pb-6 flex-grow flex flex-col">
                  {/* Avatar */}
                  <div className="relative -mt-12 mb-4 text-center">
                    {alumnus.profile_image || alumnus.student_photo ? (
                      <img
                        src={alumnus.profile_image || alumnus.student_photo}
                        alt={alumnus.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto object-cover"
                      />
                    ) : (
                      <div
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto flex items-center justify-center text-white text-3xl font-bold"
                        style={{ background: 'linear-gradient(135deg, #0f2d8a, #194ce6)' }}
                      >
                        {alumnus.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{alumnus.name}</h3>

                    {alumnus.current_job_title && (
                      <p className="text-sm font-medium mb-2" style={{ color: '#194ce6' }}>
                        {alumnus.current_job_title}
                      </p>
                    )}

                    {alumnus.current_company && (
                      <p className="text-xs text-gray-400 mb-4 font-medium flex items-center justify-center gap-1">
                        <FiBriefcase className="w-3.5 h-3.5" />
                        {alumnus.current_company}
                      </p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {alumnus.faculty_name && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1">
                          <FiBookOpen className="w-3 h-3" />
                          {alumnus.faculty_name}
                        </span>
                      )}
                      {alumnus.graduation_year && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full flex items-center"
                          style={{ background: '#eef1fd', color: '#194ce6' }}>
                          Class of {alumnus.graduation_year}
                        </span>
                      )}
                    </div>

                    {/* Bio */}
                    {alumnus.bio && (
                      <p className="text-sm text-gray-500 italic mb-6" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        "{alumnus.bio}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => navigate(`/profile/${alumnus.id}`)}
                      className="flex-grow flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-colors group"
                      style={{ background: '#0f2d8a' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#091d5e'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0f2d8a'}
                    >
                      View Full Profile
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    {alumnus.linkedin_profile && (
                      <a
                        href={alumnus.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn Profile"
                        className="p-3 rounded-xl transition-colors flex items-center justify-center"
                        style={{ background: '#eef1fd', color: '#194ce6' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#dce3fb'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#eef1fd'; }}
                      >
                        <FiLinkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {/* Join Directory Placeholder */}
            <article
              className="flex items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group"
              onClick={() => navigate('/signup')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FiPlus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" style={{ transition: 'color 0.3s' }} />
                </div>
                <span className="text-gray-600 font-semibold group-hover:text-blue-600 transition-colors">Join Directory</span>
              </div>
            </article>
          </div>
        )}

        {/* Pagination */}
        {filteredAlumni.length > 0 && (
          <nav className="flex items-center justify-between border-t border-gray-200 pt-8 mt-16">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAlumni.length}</span> of <span className="font-medium">{alumni.length}</span> results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                disabled
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </main>
    </Layout>
  );
};

export default DirectoryPage;
