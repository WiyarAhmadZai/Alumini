import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiSearch, FiBookOpen, FiBriefcase, FiLinkedin, FiX, FiUsers, FiAward, FiPlus, FiArrowRight } from 'react-icons/fi';
import alumniService from '../services/alumniService';

const DirectoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ faculty: [], graduationYear: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alumni, setAlumni] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await alumniService.getAll({ status: 'verified' });
        const alumniData = response?.data?.alumni || response?.alumni || [];
        setAlumni(Array.isArray(alumniData) ? alumniData : []);
      } catch (err) {
        setError('Failed to load alumni directory.');
      } finally {
        setLoading(false);
      }
    };
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
    fetchAlumni();
    fetchGraduationYears();
  }, []);

  const filteredAlumni = Array.isArray(alumni) ? alumni.filter(a => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || a.name?.toLowerCase().includes(s) || a.current_job_title?.toLowerCase().includes(s) || a.current_company?.toLowerCase().includes(s) || a.bio?.toLowerCase().includes(s);
    const matchesFaculty = selectedFilters.faculty.length === 0 || selectedFilters.faculty.includes(a.faculty_name);
    const matchesYear = !selectedFilters.graduationYear || String(a.graduation_year) === String(selectedFilters.graduationYear);
    return matchesSearch && matchesFaculty && matchesYear;
  }) : [];

  const faculties = ['Engineering', 'Computer Science', 'Geomatics', 'Electromechanics', 'Architecture', 'Business Administration', 'Law', 'Pharmacy'];
  const handleFacultyChange = (f) => setSelectedFilters(p => ({ ...p, faculty: f === '' ? [] : [f] }));
  const handleYearChange = (y) => setSelectedFilters(p => ({ ...p, graduationYear: y }));
  const resetFilters = () => { setSearchTerm(''); setSelectedFilters({ faculty: [], graduationYear: '' }); };
  const hasActiveFilters = searchTerm || selectedFilters.faculty.length > 0 || selectedFilters.graduationYear;

  // ─── Hero ───
  const HeroSection = ({ isLoading }) => (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 380 }}>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.90)), url("/images/hero-bg.jpg")' }} />
      <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 sm:px-6 text-center text-white" style={{ minHeight: 380 }}>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
          <FiUsers className="text-white/70" />
          <span className="text-white/90 tracking-wide">Alumni Network</span>
        </div>
        {isLoading ? (
          <>
            <div className="h-10 w-72 bg-white/15 rounded-full animate-pulse mb-3" />
            <div className="h-4 w-80 bg-white/10 rounded-full animate-pulse" />
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-3">Alumni Directory</h1>
            <p className="text-base text-white/60 max-w-md mx-auto leading-relaxed font-light mb-8">Discover and connect with distinguished graduates shaping the world.</p>
            {alumni.length > 0 && (
              <div className="flex items-stretch bg-white/8 border border-white/12 rounded-2xl overflow-hidden">
                <div className="px-6 py-3 text-center">
                  <div className="text-2xl font-bold">{alumni.length}+</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Alumni</div>
                </div>
                <div className="w-px bg-white/12" />
                <div className="px-6 py-3 text-center">
                  <div className="text-2xl font-bold">{faculties.length}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Faculties</div>
                </div>
                <div className="w-px bg-white/12" />
                <div className="px-6 py-3 text-center">
                  <div className="text-2xl font-bold">{availableYears.length > 0 ? availableYears.length : '20'}+</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Grad Years</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );

  // ─── Filter (white card, half-overlap) ───
  const FilterBar = () => (
    <section className="relative z-20 -mt-7 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="flex-grow flex items-center bg-gray-50 rounded-lg px-3 py-2 focus-within:ring-2 ring-gray-900/10 transition-all w-full">
            <FiSearch className="text-gray-400 mr-2.5 flex-shrink-0 w-4 h-4" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, company, or role..." className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-gray-900 placeholder-gray-400 text-sm" />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 ml-2"><FiX className="w-3.5 h-3.5" /></button>}
          </div>
          <select value={selectedFilters.faculty[0] || ''} onChange={(e) => handleFacultyChange(e.target.value)} className="px-3 py-2 bg-gray-50 border-none rounded-lg text-sm text-gray-700 focus:ring-2 ring-gray-900/10 cursor-pointer w-full md:w-auto min-w-[140px]">
            <option value="">All Faculties</option>
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={selectedFilters.graduationYear} onChange={(e) => handleYearChange(e.target.value)} className="px-3 py-2 bg-gray-50 border-none rounded-lg text-sm text-gray-700 focus:ring-2 ring-gray-900/10 cursor-pointer w-full md:w-auto min-w-[110px]">
            <option value="">All Years</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="px-5 py-2 text-white text-sm font-semibold rounded-lg transition-colors w-full md:w-auto whitespace-nowrap" style={{ background: '#0f2d8a' }} onMouseEnter={e => e.currentTarget.style.background = '#091d5e'} onMouseLeave={e => e.currentTarget.style.background = '#0f2d8a'}>
            Find Alumni
          </button>
          {hasActiveFilters && <button onClick={resetFilters} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition" title="Reset"><FiX className="w-4 h-4" /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2.5 px-0.5">
          <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Showing <span className="font-semibold text-gray-700">{filteredAlumni.length}</span> of <span className="font-semibold text-gray-700">{alumni.length}</span> alumni
          </span>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 ml-auto">
              {selectedFilters.faculty.map(f => (
                <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full" style={{ background: '#eef1fd', color: '#194ce6' }}>
                  {f} <button onClick={() => handleFacultyChange('')} className="opacity-60 hover:opacity-100"><FiX className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              {selectedFilters.graduationYear && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full" style={{ background: '#eef1fd', color: '#194ce6' }}>
                  {selectedFilters.graduationYear} <button onClick={() => handleYearChange('')} className="opacity-60 hover:opacity-100"><FiX className="w-2.5 h-2.5" /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  // ─── Skeleton ───
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="h-32 bg-gray-200 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <HeroSection isLoading={true} />
        <section className="relative z-20 -mt-7 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow h-9 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-32 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <HeroSection isLoading={false} />
        <FilterBar />
        <div className="min-h-[30vh] flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-xl shadow-sm border border-red-100 p-8 max-w-xs">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3"><FiX className="text-red-500 text-xl" /></div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Something went wrong</h3>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection isLoading={false} />
      <FilterBar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAlumni.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#eef1fd' }}>
              <FiUsers className="text-2xl" style={{ color: '#194ce6' }} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No alumni found</h3>
            <p className="text-gray-400 max-w-xs text-sm">Try different search terms or remove filters.</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="mt-4 px-5 py-2 text-white text-sm font-semibold rounded-lg" style={{ background: '#0f2d8a' }}>Clear filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAlumni.map((alumnus) => (
              <div key={alumnus.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate(`/profile/${alumnus.id}`)}>
                {/* Image — fixed short height */}
                <div className="relative h-36 bg-gray-100">
                  {alumnus.profile_image || alumnus.student_photo ? (
                    <img src={alumnus.profile_image || alumnus.student_photo} alt={alumnus.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #0f2d8a, #194ce6)' }}>
                      {alumnus.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {alumnus.graduation_year && (
                    <span className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ color: '#0f2d8a' }}>
                      {alumnus.graduation_year}
                    </span>
                  )}
                  {alumnus.linkedin_profile && (
                    <a href={alumnus.linkedin_profile} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm p-1 rounded text-blue-700 hover:bg-white transition-colors">
                      <FiLinkedin className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <h3 className="text-xs font-bold text-gray-900 leading-tight line-clamp-1 mb-0.5">{alumnus.name}</h3>
                  {alumnus.current_job_title && (
                    <p className="text-[10px] font-semibold line-clamp-1 mb-0.5" style={{ color: '#194ce6' }}>{alumnus.current_job_title}</p>
                  )}
                  {alumnus.current_company && (
                    <p className="text-[10px] text-gray-400 line-clamp-1 flex items-center gap-0.5">
                      <FiBriefcase className="w-2.5 h-2.5 flex-shrink-0" />{alumnus.current_company}
                    </p>
                  )}
                  {alumnus.faculty_name && (
                    <p className="text-[9px] text-gray-300 mt-1 flex items-center gap-0.5">
                      <FiBookOpen className="w-2 h-2" />{alumnus.faculty_name}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className="font-bold text-[9px] uppercase tracking-wider flex items-center gap-1" style={{ color: '#0f2d8a' }}>
                      View Profile <FiArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Join */}
            <div className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors group h-36" onClick={() => navigate('/register')} style={{ minHeight: 220 }}>
              <div className="text-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-1.5">
                  <FiPlus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <span className="text-gray-400 text-[10px] font-semibold group-hover:text-gray-600 transition-colors">Join Directory</span>
              </div>
            </div>
          </div>
        )}

        {filteredAlumni.length > 0 && (
          <nav className="flex items-center justify-between border-t border-gray-100 pt-5 mt-8">
            <p className="text-xs text-gray-400 hidden sm:block">
              Showing <span className="font-semibold text-gray-700">{filteredAlumni.length}</span> of <span className="font-semibold text-gray-700">{alumni.length}</span>
            </p>
            <div className="flex-1 flex justify-between sm:justify-end gap-2">
              <button className="px-3.5 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40" disabled>Previous</button>
              <button className="px-3.5 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50">Next</button>
            </div>
          </nav>
        )}
      </section>
    </Layout>
  );
};

export default DirectoryPage;
