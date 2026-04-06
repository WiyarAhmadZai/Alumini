import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiSearch, FiBookOpen, FiBriefcase, FiUser, FiMapPin, FiLinkedin, FiExternalLink, FiX, FiUsers, FiAward, FiGlobe } from 'react-icons/fi';
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      <div className="px-6 pt-10 pb-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-18 h-18 rounded-full bg-gray-200 animate-pulse mb-1" style={{ width: 72, height: 72 }} />
          <div className="h-5 w-36 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-4 w-28 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="mt-5 h-10 bg-gray-200 rounded-xl animate-pulse" />
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

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-4 pb-12">
          {/* Filter skeleton */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-12 bg-gray-100 rounded-xl animate-pulse ${i === 0 ? 'md:col-span-2' : ''}`} />
              ))}
            </div>
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-4 pb-16">

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100/80 p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">

            {/* Search — wider */}
            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, company, or job title…"
                  className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            {/* Faculty */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Faculty</label>
              <div className="relative">
                <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={selectedFilters.faculty[0] || ''}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 appearance-none cursor-pointer transition-all"
                >
                  <option value="">All Faculties</option>
                  {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* Year */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Year</label>
              <select
                value={selectedFilters.graduationYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 appearance-none cursor-pointer transition-all"
              >
                <option value="">All Years</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Clear button */}
            <div className="md:col-span-1 flex items-end">
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="w-full py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-600"
                title="Clear filters"
              >
                <FiX className="mx-auto" />
              </button>
            </div>
          </div>

          {/* Footer row: count + active chips */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filteredAlumni.length}</span>
              <span className="text-gray-400"> of </span>
              <span className="font-semibold text-gray-800">{alumni.length}</span>
              <span className="text-gray-400"> alumni</span>
            </p>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
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

        {/* Alumni Grid */}
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
                onMouseEnter={e => e.currentTarget.style.background = '#1340c4'}
                onMouseLeave={e => e.currentTarget.style.background = '#194ce6'}
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumnus) => {
              const isExpanded = expandedCards.has(alumnus.id);
              return (
                <div
                  key={alumnus.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Cover */}
                  <div className="relative flex-shrink-0 h-32">
                    {alumnus.cover_image ? (
                      <img src={alumnus.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: 'linear-gradient(135deg, #0f2d8a 0%, #194ce6 100%)' }}
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />

                    {/* Avatar */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 z-10">
                      {alumnus.profile_image || alumnus.student_photo ? (
                        <img
                          src={alumnus.profile_image || alumnus.student_photo}
                          alt={alumnus.name}
                          className="w-20 h-20 rounded-full border-[3px] border-white object-cover shadow-lg"
                        />
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold"
                          style={{ background: 'linear-gradient(135deg, #0f2d8a, #194ce6)' }}
                        >
                          {alumnus.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-5 pt-14 pb-5 flex-1 flex flex-col">
                    {/* Name & title */}
                    <div className="text-center mb-3">
                      <h3 className="text-base font-bold text-gray-900 leading-snug">
                        {alumnus.name}
                      </h3>
                      {alumnus.current_job_title && (
                        <p className="text-sm text-gray-500 mt-0.5">{alumnus.current_job_title}</p>
                      )}
                      {alumnus.current_company && (
                        <p className="text-sm font-semibold mt-0.5 flex items-center justify-center gap-1" style={{ color: '#194ce6' }}>
                          <FiBriefcase className="text-xs" style={{ color: '#194ce6' }} />
                          {alumnus.current_company}
                        </p>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                      {alumnus.faculty_name && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border"
                          style={{ background: '#eef1fd', color: '#194ce6', borderColor: '#c5ccf7' }}>
                          <FiBookOpen className="text-[10px]" />
                          {alumnus.faculty_name}
                        </span>
                      )}
                      {alumnus.graduation_year && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border"
                          style={{ background: '#eef1fd', color: '#194ce6', borderColor: '#c5ccf7' }}>
                          <FiAward className="text-[10px]" />
                          Class of {alumnus.graduation_year}
                        </span>
                      )}
                    </div>

                    {/* Bio */}
                    {alumnus.bio && (
                      <p className="text-xs text-gray-400 text-center leading-relaxed mb-4">
                        {isExpanded || alumnus.bio.length <= 110
                          ? alumnus.bio
                          : `${alumnus.bio.substring(0, 110)}…`}
                        {alumnus.bio.length > 110 && (
                          <button
                            onClick={() => toggleCardExpansion(alumnus.id)}
                            className="font-semibold ml-1 transition-colors" style={{ color: '#194ce6' }}
                          >
                            {isExpanded ? 'less' : 'more'}
                          </button>
                        )}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => navigate(`/profile/${alumnus.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
                        style={{ background: '#194ce6' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1340c4'}
                        onMouseLeave={e => e.currentTarget.style.background = '#194ce6'}
                      >
                        <FiExternalLink className="text-xs" />
                        View Profile
                      </button>
                      {alumnus.linkedin_profile && (
                        <a
                          href={alumnus.linkedin_profile}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn"
                          className="flex items-center justify-center w-11 rounded-xl text-white transition-colors"
                          style={{ background: '#0077b5' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#005f91'}
                          onMouseLeave={e => e.currentTarget.style.background = '#0077b5'}
                        >
                          <FiLinkedin className="text-base" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DirectoryPage;
