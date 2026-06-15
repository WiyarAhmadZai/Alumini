import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import {
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiSearch,
  FiX,
  FiStar,
  FiEye,
  FiFilter,
  FiList,
  FiGrid,
  FiCheck,
  FiArrowRight,
  FiAward,
  FiUsers,
  FiBriefcase,
  FiLayers,
  FiTrendingUp,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import mentorService from '../services/mentorService';
import authService from '../services/authService';

// ─── Brand palette (matches Job Board) ──────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_DARKER = '#091d5e';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const FACULTY_OPTIONS = [
  { key: 'Civil Engineering',         label: 'Civil Engineering' },
  { key: 'Computer Science',          label: 'Computer Science' },
  { key: 'Electromechanics',          label: 'Electromechanics' },
  { key: 'Geomatics & Cadastre',      label: 'Geomatics & Cadastre' },
  { key: 'Architecture',              label: 'Architecture' },
  { key: 'Chemical Technology',       label: 'Chemical Technology' },
  { key: 'Geology & Mines',           label: 'Geology & Mines' },
  { key: 'Environmental Engineering', label: 'Environmental Engineering' },
];

const EXPERTISE_OPTIONS = ['Structural', 'Hydraulics', 'AI/ML', 'Project Mgmt', 'GIS', 'Python', 'Machine Learning'];

const MentorshipPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [requestingId, setRequestingId] = useState(null);

  const [selectedFaculty, setSelectedFaculty] = useState({});
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer
  const debounceRef = useRef(null);

  // Debounce: update searchQuery 400ms after user stops typing
  const handleSearchChange = (value) => {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value.trim());
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  // Get current logged-in user ID to detect own card
  const storedUser = localStorage.getItem('alumni_user');
  const currentUserId = storedUser ? JSON.parse(storedUser)?.id : null;

  // My applications: map of mentor_id → { status, rejection_count, can_request_again }
  const [myApplicationMap, setMyApplicationMap] = useState({});
  // Whether the logged-in user is themselves a mentor (mentors can't apply for mentorship)
  const [iAmMentor, setIAmMentor] = useState(false);

  const fetchMyApplications = async () => {
    if (!authService.isAuthenticated()) return;
    try {
      const res = await mentorService.getMyApplications();
      // Backend already returns ONE record per mentor (most recent)
      const map = {};
      (res.data || []).forEach(a => {
        map[a.mentor_id] = {
          id: a.id,
          status: a.status,
          rejection_count: a.rejection_count || 0,
          can_request_again: a.can_request_again || false,
        };
      });
      setMyApplicationMap(map);
    } catch {}
  };

  useEffect(() => {
    fetchMyApplications();
    if (authService.isAuthenticated()) {
      mentorService.getMyMentor()
        .then(res => setIAmMentor(!!res?.data))
        .catch(() => setIAmMentor(false));
    }
  }, []);

  const [requestModalMentor, setRequestModalMentor] = useState(null);

  const handleCancelRequest = async (requestId, mentor) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: t('mentorship.cancel.title'),
      text: t('mentorship.cancel.confirm', { name: mentor.name }),
      showCancelButton: true,
      confirmButtonText: t('mentorship.cancel.yes'),
      confirmButtonColor: '#dc2626',
      cancelButtonText: t('mentorship.cancel.no'),
    });
    if (!confirm.isConfirmed) return;
    try {
      await mentorService.cancelRequest(requestId);
      setMyApplicationMap(prev => {
        const copy = { ...prev };
        delete copy[mentor.id];
        return copy;
      });
      Swal.fire({ icon: 'success', title: t('mentorship.cancel.cancelled'), timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: t('mentorship.common.error'), text: err.response?.data?.message || t('mentorship.cancel.failed') });
    }
  };

  const openRequestModal = (mentor) => {
    if (!authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: t('mentorship.login.title'),
        text: t('mentorship.login.requestText'),
        confirmButtonText: t('mentorship.login.goToLogin'),
        confirmButtonColor: '#002759',
      }).then(r => { if (r.isConfirmed) navigate('/login'); });
      return;
    }
    if (iAmMentor) {
      Swal.fire({
        icon: 'info',
        title: t('mentorship.mentorBlock.title'),
        text: t('mentorship.mentorBlock.text'),
        confirmButtonColor: '#002759',
      });
      return;
    }
    setRequestModalMentor(mentor);
  };

  const submitRequest = async ({ message, whatsapp_number }) => {
    if (!requestModalMentor) return;
    const mentor = requestModalMentor;
    setRequestingId(mentor.id);
    try {
      await mentorService.requestMentorship(mentor.id, message, whatsapp_number);
      // Refetch to get the new request id (needed for cancel)
      await fetchMyApplications();
      setRequestModalMentor(null);
      Swal.fire({
        icon: 'success',
        title: t('mentorship.request.sentTitle'),
        text: t('mentorship.request.sentText', { name: mentor.name }),
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      const data = err.response?.data || {};
      setRequestModalMentor(null);
      if (data.status === 'already_requested') {
        setMyApplicationMap(prev => ({
          ...prev,
          [mentor.id]: { status: 'pending', rejection_count: prev[mentor.id]?.rejection_count || 0, can_request_again: false },
        }));
        Swal.fire({ icon: 'info', title: t('mentorship.request.alreadyTitle'), text: data.message });
      } else if (data.status === 'cooldown') {
        setMyApplicationMap(prev => ({
          ...prev,
          [mentor.id]: { status: 'rejected', rejection_count: data.rejection_count || 3, can_request_again: false },
        }));
        Swal.fire({ icon: 'warning', title: t('mentorship.request.cooldownTitle'), text: data.message });
      } else {
        Swal.fire({ icon: 'error', title: t('mentorship.common.error'), text: data.message || t('mentorship.request.failed') });
      }
    } finally {
      setRequestingId(null);
    }
  };

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };

      if (searchQuery) params.q = searchQuery;

      const activeFaculties = Object.entries(selectedFaculty)
        .filter(([, v]) => v)
        .map(([k]) => k);
      // Send first active faculty (backend only supports single-value filter)
      if (activeFaculties.length > 0) params.faculty = activeFaculties[0];

      if (selectedExpertise.length > 0) params.expertise = selectedExpertise[0];

      const minYears = { 'all': null, '5-10': 5, '10-15': 10, '15+': 15 }[experienceLevel];
      if (minYears) params.years_of_experience = minYears;

      const res = await mentorService.getAll(params);
      setMentors(res.data?.mentors || []);
      setPagination(res.data?.pagination || { current_page: 1, last_page: 1, total: 0 });
    } catch {
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedFaculty, experienceLevel, selectedExpertise]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const handleFacultyChange = (faculty) => {
    setSelectedFaculty(prev => ({ ...prev, [faculty]: !prev[faculty] }));
    setPage(1);
  };

  const handleExpertiseToggle = (expertise) => {
    setSelectedExpertise(prev =>
      prev.includes(expertise) ? prev.filter(e => e !== expertise) : [...prev, expertise]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedFaculty({});
    setExperienceLevel('all');
    setSelectedExpertise([]);
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    Object.values(selectedFaculty).some(Boolean) ||
    selectedExpertise.length > 0 ||
    (experienceLevel && experienceLevel !== 'all');

  // ─── Section header helper ───
  const FilterSection = ({ icon: Icon, title, count, children }) => (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3" style={{ color: BRAND }} />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-700">{title}</h3>
        </div>
        {count > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold text-white"
            style={{ background: BRAND }}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );

  // ─── Pill toggle row ───
  const PillToggle = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-3 py-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-between border"
      style={active
        ? { background: BRAND_DARK, color: '#fff', borderColor: BRAND_DARK }
        : { background: '#fff', color: '#374151', borderColor: '#e5e7eb' }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = BRAND_BORDER; e.currentTarget.style.background = BRAND_BG; e.currentTarget.style.color = BRAND; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#374151'; } }}
    >
      <span className="text-left">{label}</span>
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center transition-all flex-shrink-0 ml-2"
        style={active ? { background: '#fff' } : { border: '1.5px solid #d1d5db' }}
      >
        {active && <FiCheck className="w-2.5 h-2.5" style={{ color: BRAND_DARK }} />}
      </span>
    </button>
  );

  // ─── Filter panel (sidebar + mobile drawer) ───
  const FilterPanel = () => {
    const facultyCount = Object.values(selectedFaculty).filter(Boolean).length;
    const expertiseCount = selectedExpertise.length;
    const expCount = experienceLevel !== 'all' ? 1 : 0;
    const totalCount = facultyCount + expertiseCount + expCount + (searchQuery ? 1 : 0);

    return (
      <div className="flex flex-col gap-5">
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: BRAND_BG }}>
            <span className="text-[11px] font-semibold" style={{ color: BRAND_DARK }}>
              {t('mentorship.filters.activeCount', { count: totalCount })}
            </span>
            <button onClick={resetFilters} className="text-[11px] font-bold hover:underline" style={{ color: BRAND }}>
              {t('mentorship.filters.clearAll')}
            </button>
          </div>
        )}

        <FilterSection icon={FiBriefcase} title={t('mentorship.filters.faculty')} count={facultyCount}>
          <div className="flex flex-col gap-1.5">
            {FACULTY_OPTIONS.map(({ key, label }) => (
              <PillToggle
                key={key}
                label={t(`mentorship.faculties.${key}`, { defaultValue: label })}
                active={!!selectedFaculty[key]}
                onClick={() => handleFacultyChange(key)}
              />
            ))}
          </div>
        </FilterSection>

        <div className="h-px bg-gray-100" />

        <FilterSection icon={FiTrendingUp} title={t('mentorship.filters.experience')} count={expCount}>
          <div className="flex flex-col gap-1.5">
            {[
              { key: 'all', label: t('mentorship.filters.expAll') },
              { key: '5-10', label: t('mentorship.filters.exp5') },
              { key: '10-15', label: t('mentorship.filters.exp10') },
              { key: '15+', label: t('mentorship.filters.exp15') },
            ].map(opt => (
              <PillToggle
                key={opt.key}
                label={opt.label}
                active={experienceLevel === opt.key}
                onClick={() => { setExperienceLevel(opt.key); setPage(1); }}
              />
            ))}
          </div>
        </FilterSection>

        <div className="h-px bg-gray-100" />

        <FilterSection icon={FiLayers} title={t('mentorship.filters.expertise')} count={expertiseCount}>
          <div className="flex flex-col gap-1.5">
            {EXPERTISE_OPTIONS.map(expertise => (
              <PillToggle
                key={expertise}
                label={t(`mentorship.expertise.${expertise}`, { defaultValue: expertise })}
                active={selectedExpertise.includes(expertise)}
                onClick={() => handleExpertiseToggle(expertise)}
              />
            ))}
          </div>
        </FilterSection>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full text-[11px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            style={{ background: BRAND_DARK, color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
            onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}
          >
            <FiX className="w-3 h-3" />
            {t('mentorship.filters.resetAll')}
          </button>
        )}
      </div>
    );
  };

  // ─── Skeletons ───
  const ListSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex gap-5">
        <div className="w-14 h-14 rounded-xl bg-gray-200" />
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
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="h-8 w-full bg-gray-200 rounded" />
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero — dark overlay with branded accent */}
        <section className="relative w-full h-64 sm:h-72 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
            }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 mb-4">
              <FiAward className="text-[10px]" />
              {t('mentorship.list.heroBadge')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3 max-w-3xl">
              {t('mentorship.list.heroTitle')}
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light">
              {t('mentorship.list.heroSubtitle')}
            </p>
          </div>
        </section>

        {/* Search bar — overlaps hero */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-7 relative z-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div
                className="flex-1 flex items-center bg-gray-50 rounded-lg px-3 py-2 focus-within:ring-2 transition-all"
                style={{ '--tw-ring-color': BRAND_BORDER }}
              >
                <FiSearch className="text-gray-400 mr-2.5 flex-shrink-0 w-4 h-4" />
                <input
                  className="w-full border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                  placeholder={t('mentorship.list.searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchInput && (
                  <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600 ml-2">
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors"
                style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}
              >
                <FiFilter className="w-3.5 h-3.5" /> {t('mentorship.filters.title')}
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BRAND_BG }}>
                    <FiFilter className="w-3.5 h-3.5" style={{ color: BRAND }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700">{t('mentorship.filters.title')}</h2>
                    <p className="text-[10px] text-gray-400">{t('mentorship.filters.subtitle')}</p>
                  </div>
                </div>
                <div className="p-5">
                  <FilterPanel />
                </div>
              </div>
            </aside>

            {/* Mobile filter drawer */}
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">{t('mentorship.filters.title')}</h2>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <FilterPanel />
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-full mt-4 text-white text-sm font-semibold py-2.5 rounded-lg"
                    style={{ background: BRAND_DARK }}
                  >
                    {t('common.apply')}
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Toolbar — count + view toggle */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <p className="text-xs text-gray-500">
                  {loading ? t('mentorship.list.loading') : (
                    <>{t('mentorship.list.showingPrefix')} <span className="font-semibold text-gray-900">{mentors.length}</span> {t('mentorship.list.showingOf')} <span className="font-semibold text-gray-900">{pagination.total}</span> {t('mentorship.list.mentorsLabel')}</>
                  )}
                </p>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={viewMode === 'list' ? { background: BRAND_DARK } : {}}
                  >
                    <FiList className="w-3.5 h-3.5" /> {t('mentorship.list.viewList')}
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'grid' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={viewMode === 'grid' ? { background: BRAND_DARK } : {}}
                  >
                    <FiGrid className="w-3.5 h-3.5" /> {t('mentorship.list.viewGrid')}
                  </button>
                </div>
              </div>

              {/* Mentor listings */}
              {loading ? (
                viewMode === 'list' ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => <ListSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => <GridSkeleton key={i} />)}
                  </div>
                )
              ) : mentors.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: BRAND_BG }}>
                    <FiUser className="text-2xl" style={{ color: BRAND }} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{t('mentorship.list.emptyTitle')}</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">{t('mentorship.list.emptyText')}</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-5 py-2 text-white text-xs font-semibold rounded-lg"
                    style={{ background: BRAND_DARK }}
                  >
                    {t('mentorship.list.resetFilters')}
                  </button>
                </div>
              ) : viewMode === 'list' ? (
                <div className="flex flex-col gap-3">
                  {mentors.map(mentor => (
                    <MentorCard
                      key={mentor.id}
                      view="list"
                      mentor={mentor}
                      onRequest={openRequestModal}
                      onCancel={handleCancelRequest}
                      requesting={requestingId === mentor.id}
                      navigate={navigate}
                      currentUserId={currentUserId}
                      application={myApplicationMap[mentor.id] || null}
                      iAmMentor={iAmMentor}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {mentors.map(mentor => (
                    <MentorCard
                      key={mentor.id}
                      view="grid"
                      mentor={mentor}
                      onRequest={openRequestModal}
                      onCancel={handleCancelRequest}
                      requesting={requestingId === mentor.id}
                      navigate={navigate}
                      currentUserId={currentUserId}
                      application={myApplicationMap[mentor.id] || null}
                      iAmMentor={iAmMentor}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && mentors.length > 0 && pagination.total > 0 && (
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">
                    {t('mentorship.list.showingPrefix')} <span className="font-semibold text-gray-900">{pagination.total}</span> {t('mentorship.list.mentorsLabel')}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={pagination.current_page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      <FiChevronLeft className="text-sm" />
                    </button>
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-semibold transition-colors ${
                          p === pagination.current_page ? 'text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                        style={p === pagination.current_page ? { background: BRAND_DARK } : {}}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                    >
                      <FiChevronRight className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Mentorship Modal */}
      <RequestMentorshipModal
        mentor={requestModalMentor}
        open={!!requestModalMentor}
        loading={!!requestingId}
        onClose={() => setRequestModalMentor(null)}
        onSubmit={submitRequest}
      />
    </Layout>
  );
};

// ─────────── Request Mentorship Modal ───────────
const PHONE_REGEX = /^[+\d][\d\s\-()]{6,29}$/;

const RequestMentorshipModal = ({ mentor, open, loading, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setMessage(''); setWhatsapp(''); setError(''); }
  }, [open]);

  const handleSend = () => {
    if (whatsapp && !PHONE_REGEX.test(whatsapp.trim())) {
      setError(t('mentorship.modal.phoneError'));
      return;
    }
    setError('');
    onSubmit({ message, whatsapp_number: whatsapp });
  };

  if (!open || !mentor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: '#002759' }}>
          <div className="flex items-center gap-3 min-w-0">
            {mentor.profile_image ? (
              <img src={mentor.profile_image} alt="" className="w-11 h-11 rounded-lg object-cover border-2 border-white/20 flex-shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold flex-shrink-0">
                {mentor.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">{t('mentorship.modal.requestTitle')}</p>
              <h3 className="text-base font-bold text-white truncate">{mentor.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 flex-shrink-0">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('mentorship.modal.whatsappLabel')} <span className="text-gray-400 font-normal">{t('mentorship.modal.optional')}</span>
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value); if (error) setError(''); }}
              placeholder="+93 700 000 000"
              className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-1 transition ${
                error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#002759] focus:ring-[#002759]'
              }`}
            />
            {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t('mentorship.modal.introLabel')}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder={t('mentorship.modal.introPlaceholder')}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#002759] focus:ring-1 focus:ring-[#002759] transition resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{message.length}/500</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-60"
            style={{ backgroundColor: '#002759' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#0a519b')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#002759')}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>{t('mentorship.modal.sendRequest')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MentorCard = ({ view = 'grid', mentor, onRequest, onCancel, requesting, navigate, currentUserId, application, iAmMentor }) => {
  const { t } = useTranslation();
  const applicationStatus = application?.status || null;
  const canRequestAgain = application?.can_request_again || false;
  const rejectionCount = application?.rejection_count || 0;
  const applicationId = application?.id || null;
  const profileImg = mentor.profile_image;
  const isOwnCard = currentUserId && String(currentUserId) === String(mentor.alumni_student_id);
  const avg = Number(mentor.reviews_avg || 0);
  const reviewsCount = mentor.reviews_count || 0;

  const goToDetail = () => navigate(`/mentorship/${mentor.id}`);

  const Avatar = ({ size }) => (
    profileImg ? (
      <img
        src={profileImg}
        alt={mentor.name}
        className={`${size} rounded-xl object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition`}
        style={{ border: `2px solid ${BRAND_BORDER}` }}
        onClick={goToDetail}
      />
    ) : (
      <div
        className={`${size} rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 cursor-pointer hover:opacity-90 transition`}
        style={{ background: BRAND_DARK }}
        onClick={goToDetail}
      >
        {mentor.name?.charAt(0)?.toUpperCase()}
      </div>
    )
  );

  const Rating = () => (
    reviewsCount > 0 ? (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map(n => (
            <FiStar key={n} size={11} className={n <= Math.round(avg) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
          ))}
        </div>
        <span className="text-xs font-bold text-gray-700">{avg.toFixed(1)}</span>
        <span className="text-[10px] text-gray-400">({reviewsCount})</span>
      </div>
    ) : (
      <span className="text-[11px] text-gray-400">{t('mentorship.card.noReviews')}</span>
    )
  );

  // Primary action button — shared between list & grid
  const ActionButton = ({ small }) => {
    const base = small
      ? 'flex-1 text-[11px] font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-1'
      : 'flex-1 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5';
    if (isOwnCard) {
      return (
        <button onClick={() => navigate('/profile')} className={`${base} bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200`}>
          {t('mentorship.card.editProfile')}
        </button>
      );
    }
    if (iAmMentor && (!applicationStatus || (applicationStatus === 'rejected' && canRequestAgain))) {
      return (
        <button disabled title={t('mentorship.card.mentorsCannotApplyTitle')} className={`${base} bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed`}>
          {t('mentorship.card.mentorsCantApply')}
        </button>
      );
    }
    if (applicationStatus === 'accepted') {
      return (
        <button disabled className={`${base} bg-green-50 text-green-700 border border-green-200`}>
          <FiCheck className="text-[11px]" /> {t('mentorship.status.accepted')}
        </button>
      );
    }
    if (applicationStatus === 'pending') {
      return (
        <div className="flex-1 flex gap-1">
          <button disabled className={`${base} bg-amber-50 text-amber-700 border border-amber-200`}>
            {t('mentorship.status.pending')}
          </button>
          <button
            onClick={() => applicationId && onCancel && onCancel(applicationId, mentor)}
            title={t('mentorship.card.cancelRequestTitle')}
            className="px-3 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center"
          >
            <FiX size={14} />
          </button>
        </div>
      );
    }
    if (applicationStatus === 'rejected' && !canRequestAgain) {
      return (
        <button disabled title={t('mentorship.card.cooldownTitle')} className={`${base} bg-red-50 text-red-700 border border-red-200`}>
          {t('mentorship.card.rejectedCount', { count: rejectionCount })}
        </button>
      );
    }
    return (
      <button
        onClick={() => onRequest(mentor)}
        disabled={requesting}
        className={`${base} text-white disabled:opacity-60`}
        style={{ background: BRAND_DARK }}
        onMouseEnter={(e) => !requesting && (e.currentTarget.style.background = BRAND_DARKER)}
        onMouseLeave={(e) => !requesting && (e.currentTarget.style.background = BRAND_DARK)}
      >
        {requesting ? t('mentorship.card.sending') : (applicationStatus === 'rejected' ? t('mentorship.card.requestAgainCount', { count: rejectionCount }) : t('mentorship.card.requestMentorship'))}
      </button>
    );
  };

  const expertise = mentor.expertise || [];

  // ─── LIST VIEW (full row) ───
  if (view === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row gap-5 items-start">
          <Avatar size="w-14 h-14" />
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <button onClick={goToDetail} className="text-base font-bold text-gray-900 hover:underline transition-colors line-clamp-1"
                onMouseEnter={e => e.currentTarget.style.color = BRAND}
                onMouseLeave={e => e.currentTarget.style.color = ''}>
                {mentor.name}
              </button>
              {mentor.graduation_year && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }}>
                  <FiCheck className="text-[10px]" /> {t('mentorship.card.classOf', { year: mentor.graduation_year })}
                </span>
              )}
            </div>
            {mentor.title && <p className="text-sm font-semibold" style={{ color: BRAND_DARK }}>{mentor.title}</p>}
            {mentor.company && <p className="text-xs text-gray-500 mb-1.5">{t('mentorship.card.atCompany', { company: mentor.company })}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-2">
              <Rating />
              {mentor.years_of_experience ? (
                <span className="flex items-center gap-1"><FiTrendingUp className="text-gray-400" />{t('mentorship.card.yrsExp', { count: mentor.years_of_experience })}</span>
              ) : null}
              {mentor.mentored_count > 0 && (
                <span className="flex items-center gap-1"><FiUsers className="text-gray-400" />{t('mentorship.card.mentoredCount', { count: mentor.mentored_count })}</span>
              )}
            </div>
            {mentor.bio && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{mentor.bio}</p>}
            {expertise.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {expertise.slice(0, 4).map(skill => (
                  <span key={skill} className="px-2 py-0.5 text-[10px] font-bold rounded"
                    style={{ background: BRAND_BG, color: BRAND }}>{skill}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex md:flex-col gap-2 w-full md:w-36">
            <ActionButton />
            <button onClick={goToDetail}
              className="flex-1 text-xs font-bold py-2 rounded-lg text-center transition-colors border flex items-center justify-center gap-1.5"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              <FiEye className="text-xs" /> {t('mentorship.card.view')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── GRID VIEW (compact card) ───
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex gap-3 mb-3">
          <Avatar size="w-14 h-14" />
          <div className="flex-1 min-w-0">
            <button onClick={goToDetail} className="text-sm font-bold text-gray-900 line-clamp-1 hover:underline text-left"
              onMouseEnter={e => e.currentTarget.style.color = BRAND}
              onMouseLeave={e => e.currentTarget.style.color = ''}>
              {mentor.name}
            </button>
            {mentor.title && <p className="text-xs font-semibold line-clamp-1" style={{ color: BRAND_DARK }}>{mentor.title}</p>}
            {mentor.company && <p className="text-[11px] text-gray-500 line-clamp-1">{t('mentorship.card.atCompany', { company: mentor.company })}</p>}
            <div className="mt-1"><Rating /></div>
          </div>
        </div>

        {mentor.bio && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{mentor.bio}</p>}

        <div className="flex items-center gap-4 py-2.5 border-y border-gray-100 mb-3 text-[11px]">
          {mentor.years_of_experience ? (
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">{t('mentorship.card.experienceLabel')}</span>
              <span className="font-bold text-gray-700">{t('mentorship.card.yrs', { count: mentor.years_of_experience })}</span>
            </div>
          ) : null}
          {mentor.mentored_count > 0 && (
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">{t('mentorship.card.mentoredLabel')}</span>
              <span className="font-bold text-gray-700">{mentor.mentored_count}</span>
            </div>
          )}
          {mentor.graduation_year && (
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">{t('mentorship.card.classLabel')}</span>
              <span className="font-bold text-gray-700">{mentor.graduation_year}</span>
            </div>
          )}
        </div>

        {expertise.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {expertise.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-0.5 text-[10px] font-bold rounded"
                style={{ background: BRAND_BG, color: BRAND }}>{skill}</span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-1.5 pt-2 border-t border-gray-100">
          <ActionButton small />
          <button onClick={goToDetail}
            className="px-3 text-[11px] font-bold rounded-md text-center transition-colors border flex items-center"
            style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
