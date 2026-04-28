import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ApplyModal from '../components/job/ApplyModal';
import {
  FiSearch, FiMapPin, FiClock, FiDollarSign, FiChevronLeft, FiChevronRight,
  FiBriefcase, FiX, FiLoader, FiGrid, FiList, FiCheck, FiArrowRight, FiFilter
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

// ─── Brand palette ──────────────────────────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_DARKER = '#091d5e';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const JobBoard = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobType: { fullTime: false, contract: false, remote: false },
    industry: { construction: false, softwareEngineering: false, energy: false },
    experienceLevel: 'all'
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer

  const debounceRef = useRef(null);

  // Build params from current state
  const buildParams = () => {
    const params = { page: currentPage, per_page: recordsPerPage };
    if (searchTerm) params.search = searchTerm;
    if (location) params.location = location;

    const activeJobTypes = Object.entries(filters.jobType).filter(([, v]) => v).map(([k]) => k);
    if (activeJobTypes.length) {
      params.job_type = {};
      activeJobTypes.forEach(t => { params.job_type[t] = true; });
    }
    const activeIndustries = Object.entries(filters.industry).filter(([, v]) => v).map(([k]) => k);
    if (activeIndustries.length) {
      params.industry = {};
      activeIndustries.forEach(i => { params.industry[i] = true; });
    }
    if (filters.experienceLevel && filters.experienceLevel !== 'all') {
      params.experience_level = filters.experienceLevel;
    }
    return params;
  };

  // Fetch jobs — uses current state via closure
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { default: jobService } = await import('../services/jobService');
      const response = await jobService.getJobs(buildParams());
      if (response.status === 'success') {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Live debounced search: triggers on any input/filter change ──
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchJobs();
    }, 350);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, location, filters, currentPage, recordsPerPage]);

  // Fetch user's applied job IDs
  useEffect(() => {
    const fetchApplied = async () => {
      if (!user || !isAuthenticated()) return;
      try {
        const { default: jobService } = await import('../services/jobService');
        const res = await jobService.getUserApplications(1, 100);
        const apps = res?.data?.applications || [];
        setAppliedJobIds(apps.map(a => a.job_id));
      } catch {}
    };
    fetchApplied();
  }, [user]);

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: category === 'experienceLevel' ? value : { ...prev[category], [value]: !prev[category][value] }
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      jobType: { fullTime: false, contract: false, remote: false },
      industry: { construction: false, softwareEngineering: false, energy: false },
      experienceLevel: 'all'
    });
    setSearchTerm('');
    setLocation('');
    setCurrentPage(1);
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated()) { window.location.href = '/login'; return; }
    if (appliedJobIds.includes(job.id)) {
      Swal.fire({ icon: 'info', title: 'Already Applied', text: 'You have already applied for this job.', confirmButtonColor: BRAND });
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleApplicationSuccess = () => {
    if (selectedJob) setAppliedJobIds(prev => [...prev, selectedJob.id]);
    Swal.fire({
      icon: 'success', title: 'Application Submitted!',
      text: 'Your job application has been submitted successfully.',
      confirmButtonColor: BRAND, confirmButtonText: 'Great!',
      timer: 3000, timerProgressBar: true
    });
  };

  const hasActiveFilters = searchTerm || location ||
    Object.values(filters.jobType).some(Boolean) ||
    Object.values(filters.industry).some(Boolean) ||
    (filters.experienceLevel && filters.experienceLevel !== 'all');

  // ─── Job Type chip — uses branded palette only ───
  const TypeChip = ({ type }) => {
    const isPrimary = type === 'Full-time';
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={isPrimary
          ? { background: BRAND_DARK, color: '#fff' }
          : { background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }
        }
      >
        {type}
      </span>
    );
  };

  // ─── Filter Panel content (used in sidebar and mobile drawer) ───
  const FilterPanel = () => (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: BRAND_DARK }}>Job Type</h3>
        <div className="flex flex-col gap-1.5">
          {[
            { key: 'fullTime', label: 'Full-time' },
            { key: 'contract', label: 'Contract' },
            { key: 'remote', label: 'Remote' },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer p-1.5 rounded-md hover:bg-gray-50 transition-colors">
              <input type="checkbox"
                checked={filters.jobType[opt.key]}
                onChange={() => handleFilterChange('jobType', opt.key)}
                className="w-3.5 h-3.5 rounded border-gray-300"
                style={{ accentColor: BRAND }}
              />
              <span className="font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: BRAND_DARK }}>Industry</h3>
        <div className="flex flex-col gap-1.5">
          {[
            { key: 'construction', label: 'Construction' },
            { key: 'softwareEngineering', label: 'Software Engineering' },
            { key: 'energy', label: 'Energy' },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer p-1.5 rounded-md hover:bg-gray-50 transition-colors">
              <input type="checkbox"
                checked={filters.industry[opt.key]}
                onChange={() => handleFilterChange('industry', opt.key)}
                className="w-3.5 h-3.5 rounded border-gray-300"
                style={{ accentColor: BRAND }}
              />
              <span className="font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: BRAND_DARK }}>Experience Level</h3>
        <select
          value={filters.experienceLevel}
          onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white text-gray-700 text-xs focus:ring-2 focus:border-transparent p-2.5 transition-all"
          style={{ '--tw-ring-color': BRAND_BORDER }}
        >
          <option value="all">All Levels</option>
          <option value="entry">Entry Level</option>
          <option value="intermediate">Intermediate</option>
          <option value="senior">Senior Level</option>
          <option value="director">Director / Lead</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button onClick={resetFilters}
          className="w-full text-xs font-semibold py-2.5 rounded-lg border transition-colors"
          style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
          Reset All Filters
        </button>
      )}
    </div>
  );

  // ─── Job Card — List view (full row) ───
  const ListCard = ({ job }) => {
    const applied = appliedJobIds.includes(job.id);
    return (
      <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden group">
        <div className="p-5 flex flex-col md:flex-row gap-5 items-start">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: BRAND_BG }}>
            <FiBriefcase className="text-lg" style={{ color: BRAND }} />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link to={`/job/${job.id}`} className="text-base font-bold text-gray-900 hover:underline transition-colors line-clamp-1"
                onMouseEnter={e => e.currentTarget.style.color = BRAND}
                onMouseLeave={e => e.currentTarget.style.color = ''}>
                {job.title}
              </Link>
              {job.type && <TypeChip type={job.type} />}
              {job.posted_by_alumnus && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }}>
                  <FiCheck className="text-[10px]" /> Alumnus
                </span>
              )}
            </div>
            <p className="text-sm font-semibold mb-2" style={{ color: BRAND_DARK }}>{job.company}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-2">
              {job.location && (
                <span className="flex items-center gap-1"><FiMapPin className="text-gray-400" />{job.location}</span>
              )}
              {(job.posted_time_ago || job.created_at) && (
                <span className="flex items-center gap-1"><FiClock className="text-gray-400" />{job.posted_time_ago || 'Recently'}</span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1"><FiDollarSign className="text-gray-400" />{job.salary}</span>
              )}
            </div>
            {job.description && (
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>
            )}
          </div>
          <div className="flex md:flex-col gap-2 w-full md:w-auto">
            {applied ? (
              <button disabled className="flex-1 md:w-28 bg-gray-100 text-gray-500 text-xs font-bold py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5">
                <FiCheck className="text-xs" /> Applied
              </button>
            ) : (
              <button onClick={() => handleApplyClick(job)}
                className="flex-1 md:w-28 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                style={{ background: BRAND_DARK }}
                onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
                onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}>
                Apply Now
              </button>
            )}
            <Link to={`/job/${job.id}`}
              className="flex-1 md:w-28 text-xs font-bold py-2 rounded-lg text-center transition-colors border"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // ─── Job Card — Grid view (compact) ───
  const GridCard = ({ job }) => {
    const applied = appliedJobIds.includes(job.id);
    return (
      <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden flex flex-col">
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: BRAND_BG }}>
              <FiBriefcase className="text-base" style={{ color: BRAND }} />
            </div>
            {job.type && <TypeChip type={job.type} />}
          </div>
          <Link to={`/job/${job.id}`} className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1 hover:underline"
            onMouseEnter={e => e.currentTarget.style.color = BRAND}
            onMouseLeave={e => e.currentTarget.style.color = ''}>
            {job.title}
          </Link>
          <p className="text-xs font-semibold mb-3 line-clamp-1" style={{ color: BRAND_DARK }}>{job.company}</p>

          <div className="flex flex-col gap-1.5 text-[11px] text-gray-500 mb-3">
            {job.location && (
              <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3 flex-shrink-0" /><span className="line-clamp-1">{job.location}</span></span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1"><FiDollarSign className="w-3 h-3 flex-shrink-0" />{job.salary}</span>
            )}
            <span className="flex items-center gap-1"><FiClock className="w-3 h-3 flex-shrink-0" />{job.posted_time_ago || 'Recently'}</span>
          </div>

          {job.posted_by_alumnus && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full self-start mb-3"
              style={{ background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }}>
              <FiCheck className="text-[10px]" /> Alumnus
            </span>
          )}

          <div className="mt-auto flex gap-1.5 pt-2 border-t border-gray-100">
            {applied ? (
              <button disabled className="flex-1 bg-gray-100 text-gray-500 text-[11px] font-bold py-2 rounded-md cursor-not-allowed flex items-center justify-center gap-1">
                <FiCheck className="text-[10px]" /> Applied
              </button>
            ) : (
              <button onClick={() => handleApplyClick(job)}
                className="flex-1 text-white text-[11px] font-bold py-2 rounded-md transition-colors"
                style={{ background: BRAND_DARK }}
                onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
                onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}>
                Apply
              </button>
            )}
            <Link to={`/job/${job.id}`}
              className="px-3 text-[11px] font-bold rounded-md text-center transition-colors border flex items-center"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              <FiArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // ─── Skeleton ───
  const ListSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex gap-5">
        <div className="w-12 h-12 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

  const GridSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-gray-200 mb-3" />
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-gray-100 rounded mb-3" />
      <div className="space-y-1.5 mb-3">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="h-7 w-full bg-gray-200 rounded" />
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero — dark overlay with branded accent */}
        <section className="relative w-full h-64 sm:h-72 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")'
            }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 mb-4">
              <FiBriefcase className="text-[10px]" />
              KPU Alumni Job Board
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3 max-w-3xl">
              Find Your Next Opportunity
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light">
              Discover careers posted by fellow alumni and trusted employers.
            </p>
          </div>
        </section>

        {/* Search bar — overlaps hero */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-7 relative z-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-3 py-2 focus-within:ring-2 transition-all"
                style={{ '--tw-ring-color': BRAND_BORDER }}>
                <FiSearch className="text-gray-400 mr-2.5 flex-shrink-0 w-4 h-4" />
                <input
                  className="w-full border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                  placeholder="Job title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                {searchTerm && (
                  <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                    className="text-gray-400 hover:text-gray-600 ml-2"><FiX className="w-3.5 h-3.5" /></button>
                )}
                {loading && searchTerm && <FiLoader className="animate-spin text-gray-400 ml-1 w-3.5 h-3.5" />}
              </div>
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 md:w-56 focus-within:ring-2 transition-all"
                style={{ '--tw-ring-color': BRAND_BORDER }}>
                <FiMapPin className="text-gray-400 mr-2.5 flex-shrink-0 w-4 h-4" />
                <input
                  className="w-full border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setCurrentPage(1); }}
                />
                {location && (
                  <button onClick={() => { setLocation(''); setCurrentPage(1); }}
                    className="text-gray-400 hover:text-gray-600 ml-2"><FiX className="w-3.5 h-3.5" /></button>
                )}
              </div>
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors"
                style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
                <FiFilter className="w-3.5 h-3.5" /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900">Filters</h2>
                  {hasActiveFilters && (
                    <button onClick={resetFilters} className="text-[11px] font-semibold hover:underline" style={{ color: BRAND }}>
                      Clear
                    </button>
                  )}
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile filter drawer */}
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Filters</h2>
                    <button onClick={() => setFiltersOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <FilterPanel />
                  <button onClick={() => setFiltersOpen(false)}
                    className="w-full mt-4 text-white text-sm font-semibold py-2.5 rounded-lg"
                    style={{ background: BRAND_DARK }}>
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Toolbar — count + view toggle */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <p className="text-xs text-gray-500">
                  {pagination?.total ? (
                    <>Showing <span className="font-semibold text-gray-900">{jobs.length}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> jobs</>
                  ) : 'Loading…'}
                </p>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
                  <button onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={viewMode === 'list' ? { background: BRAND_DARK } : {}}>
                    <FiList className="w-3.5 h-3.5" /> List
                  </button>
                  <button onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'grid' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={viewMode === 'grid' ? { background: BRAND_DARK } : {}}>
                    <FiGrid className="w-3.5 h-3.5" /> Grid
                  </button>
                </div>
              </div>

              {/* Job listings */}
              {loading && jobs.length === 0 ? (
                viewMode === 'list' ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => <ListSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => <GridSkeleton key={i} />)}
                  </div>
                )
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: BRAND_BG }}>
                    <FiBriefcase className="text-2xl" style={{ color: BRAND }} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">No jobs found</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">Try adjusting your search or removing some filters.</p>
                  {hasActiveFilters && (
                    <button onClick={resetFilters}
                      className="mt-4 px-5 py-2 text-white text-xs font-semibold rounded-lg"
                      style={{ background: BRAND_DARK }}>
                      Reset filters
                    </button>
                  )}
                </div>
              ) : viewMode === 'list' ? (
                <div className="flex flex-col gap-3">
                  {jobs.map(job => <ListCard key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {jobs.map(job => <GridCard key={job.id} job={job} />)}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.total > 0 && (
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">
                      Showing <span className="font-semibold text-gray-900">{pagination.total}</span> jobs
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-gray-500">Per page:</span>
                      <select
                        value={recordsPerPage}
                        onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="border border-gray-200 rounded-md px-2 py-1 text-[11px] text-gray-700 focus:outline-none">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={pagination.current_page === 1 || loading}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
                      <FiChevronLeft className="text-sm" />
                    </button>
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={loading}
                        className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-semibold transition-colors ${
                          page === pagination.current_page ? 'text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                        style={page === pagination.current_page ? { background: BRAND_DARK } : {}}>
                        {page}
                      </button>
                    ))}
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={pagination.current_page === pagination.last_page || loading}
                      onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}>
                      <FiChevronRight className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={selectedJob}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </Layout>
  );
};

export default JobBoard;
