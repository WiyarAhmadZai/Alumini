import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import {
  FiSearch, FiBookOpen, FiBriefcase, FiLinkedin, FiX, FiUsers, FiAward,
  FiPlus, FiArrowRight, FiGrid, FiList, FiMapPin
} from 'react-icons/fi';
import alumniService from '../services/alumniService';
import authService from '../services/authService';

// ─── Brand palette ──────────────────────────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_DARKER = '#091d5e';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const DirectoryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isLoggedIn = authService.isAuthenticated();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ faculty: '', graduationYear: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alumni, setAlumni] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await alumniService.getAll({ status: 'verified' });
      // Be resilient to different response shapes:
      // { data: { alumni: [...] } } | { alumni: [...] } | { data: [...] } | [...]
      const alumniData =
        response?.data?.alumni ||
        response?.alumni ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);
      setAlumni(Array.isArray(alumniData) ? alumniData : []);
    } catch (e) {
      console.error('Directory: failed to load alumni —', e?.message || e);
      setError(e?.message || t('directory.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const fetchGraduationYears = async () => {
      try {
        const response = await alumniService.getGraduationYears();
        const yearsData = response.data?.data || response.data || [];
        setAvailableYears(Array.isArray(yearsData) ? yearsData : []);
      } catch {
        const currentYear = new Date().getFullYear();
        setAvailableYears(Array.from({ length: 51 }, (_, i) => currentYear - i));
      }
    };
    const fetchFaculties = async () => {
      try {
        const response = await alumniService.getFaculties();
        const facultyData = response?.data || {};
        if (Array.isArray(facultyData)) {
          setFaculties(facultyData);
        } else if (typeof facultyData === 'object') {
          setFaculties(Object.entries(facultyData).map(([id, name]) => ({ id, name })));
        } else {
          setFaculties([]);
        }
      } catch {
        setFaculties([]);
      }
    };
    fetchAlumni();
    fetchGraduationYears();
    fetchFaculties();
  }, [fetchAlumni]);

  const filteredAlumni = Array.isArray(alumni) ? alumni.filter(a => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      a.name?.toLowerCase().includes(s) ||
      a.current_job_title?.toLowerCase().includes(s) ||
      a.current_company?.toLowerCase().includes(s) ||
      a.bio?.toLowerCase().includes(s);
    const matchesFaculty = !selectedFilters.faculty || a.faculty_name === selectedFilters.faculty;
    const matchesYear = !selectedFilters.graduationYear || String(a.graduation_year) === String(selectedFilters.graduationYear);
    return matchesSearch && matchesFaculty && matchesYear;
  }) : [];

  const handleFacultyChange = (f) => setSelectedFilters(p => ({ ...p, faculty: f }));
  const handleYearChange = (y) => setSelectedFilters(p => ({ ...p, graduationYear: y }));
  const resetFilters = () => { setSearchTerm(''); setSelectedFilters({ faculty: '', graduationYear: '' }); };
  const hasActiveFilters = searchTerm || selectedFilters.faculty || selectedFilters.graduationYear;

  // ─── Hero (inline so search input doesn't remount) ───
  const renderHero = (isLoading) => (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 380 }}>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.90)), url("/images/hero-bg.jpg")' }} />
      <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 sm:px-6 text-center text-white" style={{ minHeight: 380 }}>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 mb-4">
          <FiUsers className="text-[10px]" />
          {t('directory.alumniNetwork')}
        </div>
        {isLoading ? (
          <>
            <div className="h-10 w-72 bg-white/15 rounded-full animate-pulse mb-3" />
            <div className="h-4 w-80 bg-white/10 rounded-full animate-pulse" />
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3">{t('directory.title')}</h1>
            <p className="text-base text-white/60 max-w-md mx-auto leading-relaxed font-light mb-8">
              {t('directory.subtitle')}
            </p>
            {alumni.length > 0 && (
              <div className="flex items-stretch bg-white/8 border border-white/12 rounded-2xl overflow-hidden">
                <div className="px-6 py-3 text-center">
                  <div className="text-2xl font-bold">{alumni.length}+</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{t('directory.statAlumni')}</div>
                </div>
                <div className="w-px bg-white/12" />
                <div className="px-6 py-3 text-center">
                  <div className="text-2xl font-bold">{faculties.length || 8}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{t('directory.statFaculties')}</div>
                </div>
                <div className="w-px bg-white/12" />
                <div className="px-6 py-3 text-center">
                  <div className="text-2xl font-bold">{availableYears.length > 0 ? availableYears.length : '20'}+</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{t('directory.statGradYears')}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );

  // ─── Skeleton ───
  const SkeletonGrid = () => (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="h-28 bg-gray-200 animate-pulse" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-2.5 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-2.5 w-48 bg-gray-100 rounded" />
        <div className="h-2.5 w-24 bg-gray-100 rounded" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        {renderHero(true)}
        <section className="relative z-20 -mt-7 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow h-9 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-40 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => <SkeletonGrid key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        {renderHero(false)}
        <div className="min-h-[30vh] flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-xl shadow-sm border border-red-100 p-8 max-w-xs">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiX className="text-red-500 text-xl" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{t('directory.somethingWrong')}</h3>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={fetchAlumni}
              className="mt-4 px-5 py-2 text-white text-sm font-semibold rounded-lg"
              style={{ background: BRAND_DARK }}
            >
              {t('directory.reload')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {renderHero(false)}

      {/* Filter Bar — INLINE so search input never remounts */}
      <section className="relative z-20 -mt-7 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            {/* Search */}
            <div className="flex-grow flex items-center bg-gray-50 rounded-lg px-3 py-2 focus-within:ring-2 transition-all"
              style={{ '--tw-ring-color': BRAND_BORDER }}>
              <FiSearch className="text-gray-400 mr-2.5 flex-shrink-0 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('directory.searchPlaceholder')}
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-gray-900 placeholder-gray-400 text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 ml-2">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Faculty */}
            <select
              value={selectedFilters.faculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              className="px-3 py-2 bg-gray-50 border-none rounded-lg text-sm text-gray-700 focus:ring-2 cursor-pointer w-full md:w-auto md:min-w-[180px]"
              style={{ '--tw-ring-color': BRAND_BORDER }}
            >
              <option value="">{t('directory.allFaculties')}</option>
              {faculties.map(f => <option key={f.id || f.code} value={f.name}>{f.name}</option>)}
            </select>

            {/* Year */}
            <select
              value={selectedFilters.graduationYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="px-3 py-2 bg-gray-50 border-none rounded-lg text-sm text-gray-700 focus:ring-2 cursor-pointer w-full md:w-auto md:min-w-[110px]"
              style={{ '--tw-ring-color': BRAND_BORDER }}
            >
              <option value="">{t('directory.allYears')}</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-gray-500 text-xs font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1"
                title={t('directory.resetFilters')}
              >
                <FiX className="w-3.5 h-3.5" />
                {t('directory.reset')}
              </button>
            )}
          </div>

          {/* Count + chips + view toggle */}
          <div className="flex flex-wrap items-center gap-2 mt-3 px-0.5">
            <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t('directory.showingPrefix')} <span className="font-semibold text-gray-700">{filteredAlumni.length}</span> {t('directory.of')} <span className="font-semibold text-gray-700">{alumni.length}</span> {t('directory.alumniLower')}
            </span>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5">
                {selectedFilters.faculty && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full" style={{ background: BRAND_BG, color: BRAND }}>
                    <FiBookOpen className="w-2.5 h-2.5" /> {selectedFilters.faculty}
                    <button onClick={() => handleFacultyChange('')} className="opacity-60 hover:opacity-100"><FiX className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {selectedFilters.graduationYear && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full" style={{ background: BRAND_BG, color: BRAND }}>
                    <FiAward className="w-2.5 h-2.5" /> {selectedFilters.graduationYear}
                    <button onClick={() => handleYearChange('')} className="opacity-60 hover:opacity-100"><FiX className="w-2.5 h-2.5" /></button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full" style={{ background: BRAND_BG, color: BRAND }}>
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="opacity-60 hover:opacity-100"><FiX className="w-2.5 h-2.5" /></button>
                  </span>
                )}
              </div>
            )}

            {/* View toggle — pushed to right */}
            <div className="ml-auto flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors"
                style={viewMode === 'grid' ? { background: BRAND_DARK, color: '#fff' } : { color: '#6b7280' }}
                onMouseEnter={e => { if (viewMode !== 'grid') e.currentTarget.style.background = '#fff'; }}
                onMouseLeave={e => { if (viewMode !== 'grid') e.currentTarget.style.background = ''; }}>
                <FiGrid className="w-3 h-3" /> {t('directory.grid')}
              </button>
              <button onClick={() => setViewMode('list')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors"
                style={viewMode === 'list' ? { background: BRAND_DARK, color: '#fff' } : { color: '#6b7280' }}
                onMouseEnter={e => { if (viewMode !== 'list') e.currentTarget.style.background = '#fff'; }}
                onMouseLeave={e => { if (viewMode !== 'list') e.currentTarget.style.background = ''; }}>
                <FiList className="w-3 h-3" /> {t('directory.list')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni list/grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAlumni.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: BRAND_BG }}>
              <FiUsers className="text-2xl" style={{ color: BRAND }} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{t('directory.noAlumniFound')}</h3>
            <p className="text-gray-400 max-w-xs text-sm">{t('directory.noAlumniHint')}</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="mt-4 px-5 py-2 text-white text-sm font-semibold rounded-lg" style={{ background: BRAND_DARK }}>
                {t('directory.clearFilters')}
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredAlumni.map((alumnus) => (
              <div key={alumnus.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/profile/${alumnus.id}`)}>
                <div className="relative h-28 bg-gray-100">
                  {alumnus.profile_image || alumnus.student_photo ? (
                    <img src={alumnus.profile_image || alumnus.student_photo} alt={alumnus.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})` }}>
                      {alumnus.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {alumnus.graduation_year && (
                    <span className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ color: BRAND_DARK }}>
                      {alumnus.graduation_year}
                    </span>
                  )}
                  {alumnus.linkedin_profile && (
                    <a href={alumnus.linkedin_profile} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm p-1 rounded text-blue-700 hover:bg-white transition-colors">
                      <FiLinkedin className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-bold text-gray-900 leading-tight line-clamp-1 mb-0.5">{alumnus.name}</h3>
                  {alumnus.current_job_title && (
                    <p className="text-[10px] font-semibold line-clamp-1 mb-0.5" style={{ color: BRAND }}>{alumnus.current_job_title}</p>
                  )}
                  {alumnus.current_company && (
                    <p className="text-[10px] text-gray-400 line-clamp-1 flex items-center gap-0.5">
                      <FiBriefcase className="w-2.5 h-2.5 flex-shrink-0" />{alumnus.current_company}
                    </p>
                  )}
                  {alumnus.faculty_name && (
                    <p className="text-[9px] text-gray-300 mt-1 flex items-center gap-0.5 line-clamp-1">
                      <FiBookOpen className="w-2 h-2 flex-shrink-0" />{alumnus.faculty_name}
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="font-bold text-[9px] uppercase tracking-wider flex items-center gap-1" style={{ color: BRAND_DARK }}>
                      {t('directory.viewProfile')} <FiArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Join card — hidden for logged-in alumni */}
            {!isLoggedIn && (
              <div className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors group"
                style={{ minHeight: 200 }} onClick={() => navigate('/register')}>
                <div className="text-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-1.5">
                    <FiPlus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <span className="text-gray-400 text-[10px] font-semibold group-hover:text-gray-600 transition-colors">{t('directory.joinDirectory')}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // List view
          <div className="flex flex-col gap-2">
            {filteredAlumni.map((alumnus) => (
              <div key={alumnus.id}
                className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer p-3 flex items-center gap-3"
                onClick={() => navigate(`/profile/${alumnus.id}`)}>
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                  {alumnus.profile_image || alumnus.student_photo ? (
                    <img src={alumnus.profile_image || alumnus.student_photo} alt={alumnus.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-base font-bold"
                      style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})` }}>
                      {alumnus.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{alumnus.name}</h3>
                    {alumnus.graduation_year && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: BRAND_BG, color: BRAND_DARK }}>
                        {t('directory.classOf', { year: alumnus.graduation_year })}
                      </span>
                    )}
                  </div>
                  {(alumnus.current_job_title || alumnus.current_company) && (
                    <p className="text-xs font-semibold truncate mt-0.5" style={{ color: BRAND }}>
                      {alumnus.current_job_title}
                      {alumnus.current_job_title && alumnus.current_company && <span className="text-gray-300 mx-1">·</span>}
                      {alumnus.current_company}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {alumnus.faculty_name && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <FiBookOpen className="w-2.5 h-2.5" /> {alumnus.faculty_name}
                      </span>
                    )}
                    {alumnus.location && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <FiMapPin className="w-2.5 h-2.5" /> {alumnus.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {alumnus.linkedin_profile && (
                    <a href={alumnus.linkedin_profile} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                      style={{ background: BRAND_BG, color: BRAND }}>
                      <FiLinkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/profile/${alumnus.id}`); }}
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors"
                    style={{ background: BRAND_DARK, color: '#fff' }}
                    onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
                    onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}>
                    {t('directory.view')} <FiArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredAlumni.length > 0 && (
          <nav className="flex items-center justify-between border-t border-gray-100 pt-5 mt-8">
            <p className="text-xs text-gray-400 hidden sm:block">
              {t('directory.showingPrefix')} <span className="font-semibold text-gray-700">{filteredAlumni.length}</span> {t('directory.of')} <span className="font-semibold text-gray-700">{alumni.length}</span>
            </p>
            <div className="flex-1 flex justify-between sm:justify-end gap-2">
              <button className="px-3.5 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40" disabled>{t('directory.previous')}</button>
              <button className="px-3.5 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50">{t('directory.next')}</button>
            </div>
          </nav>
        )}
      </section>
    </Layout>
  );
};

export default DirectoryPage;
