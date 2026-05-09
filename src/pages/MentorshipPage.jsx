import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiSearch,
  FiX,
  FiStar,
  FiEye,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import mentorService from '../services/mentorService';
import authService from '../services/authService';

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
      title: 'Cancel Request?',
      text: `Cancel your mentorship request to ${mentor.name}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'No',
    });
    if (!confirm.isConfirmed) return;
    try {
      await mentorService.cancelRequest(requestId);
      setMyApplicationMap(prev => {
        const copy = { ...prev };
        delete copy[mentor.id];
        return copy;
      });
      Swal.fire({ icon: 'success', title: 'Cancelled', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to cancel.' });
    }
  };

  const openRequestModal = (mentor) => {
    if (!authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please log in to request mentorship.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#002759',
      }).then(r => { if (r.isConfirmed) navigate('/login'); });
      return;
    }
    if (iAmMentor) {
      Swal.fire({
        icon: 'info',
        title: 'Mentors Cannot Apply',
        text: 'You are registered as a mentor, so you cannot request mentorship from another mentor.',
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
        title: 'Request Sent',
        text: `Your request has been sent to ${mentor.name}.`,
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
        Swal.fire({ icon: 'info', title: 'Already Requested', text: data.message });
      } else if (data.status === 'cooldown') {
        setMyApplicationMap(prev => ({
          ...prev,
          [mentor.id]: { status: 'rejected', rejection_count: data.rejection_count || 3, can_request_again: false },
        }));
        Swal.fire({ icon: 'warning', title: 'Cooldown Active', text: data.message });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Failed to send request.' });
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-80 sm:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center text-white max-w-3xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              KPU Alumni Mentorship Hub
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Connect with experienced alumni mentors and guide the next generation of KPU professionals
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <h2 className="text-gray-900 text-lg font-bold">Filter Mentors</h2>
              <p className="text-gray-600 text-sm">Find your perfect match</p>
            </div>

            {/* Search inside sidebar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search mentors…"
                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchInput && (
                <button onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FiX size={13} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-gray-900">Faculty</p>
              <div className="flex flex-col gap-2">
                {FACULTY_OPTIONS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedFaculty[key]}
                      onChange={() => handleFacultyChange(key)}
                      className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-gray-900">Years of Experience</p>
              <select
                value={experienceLevel}
                onChange={e => { setExperienceLevel(e.target.value); setPage(1); }}
                className="w-full rounded-lg border-gray-200 bg-white text-sm text-gray-900 focus:ring-blue-500"
              >
                <option value="all">All experience levels</option>
                <option value="5-10">5+ years</option>
                <option value="10-15">10+ years</option>
                <option value="15+">15+ years</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-gray-900">Expertise Area</p>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_OPTIONS.map(expertise => (
                  <button
                    key={expertise}
                    onClick={() => handleExpertiseToggle(expertise)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                      selectedExpertise.includes(expertise)
                        ? 'bg-blue-100 text-blue-600 border-blue-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {expertise}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-100 text-gray-900 text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Mentor Cards */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : 'Featured Mentors'}
              </h2>
              <p className="text-gray-600">
                {searchQuery
                  ? `${pagination.total} mentor${pagination.total !== 1 ? 's' : ''} found`
                  : 'Alumni who have volunteered to guide the next generation'}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
              >
                <FiX size={13} />
                Clear search
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : mentors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <FiUser className="text-5xl mb-3 text-gray-300" />
              <p className="text-lg font-semibold">No mentors found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map(mentor => (
                <MentorCard
                  key={mentor.id}
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
          {!loading && mentors.length > 0 && (
            <div className="flex items-center justify-between py-6 border-t border-gray-200 mt-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{pagination.total}</span> mentors
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pagination.current_page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900 disabled:opacity-40"
                >
                  <FiChevronLeft />
                </button>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-10 px-4 items-center justify-center rounded-lg font-semibold text-sm ${
                      p === pagination.current_page
                        ? 'text-white'
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                    style={p === pagination.current_page ? { backgroundColor: '#002759' } : {}}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                  disabled={pagination.current_page === pagination.last_page}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900 disabled:opacity-40"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

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
  const [message, setMessage] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setMessage(''); setWhatsapp(''); setError(''); }
  }, [open]);

  const handleSend = () => {
    if (whatsapp && !PHONE_REGEX.test(whatsapp.trim())) {
      setError('Please enter a valid phone number (digits, +, -, ( ) only).');
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
              <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Request Mentorship</p>
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
              WhatsApp Number <span className="text-gray-400 font-normal">(optional)</span>
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
              Introduction Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Tell the mentor what you'd like guidance on…"
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
            Cancel
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
              <>Send Request</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MentorCard = ({ mentor, onRequest, onCancel, requesting, navigate, currentUserId, application, iAmMentor }) => {
  const applicationStatus = application?.status || null;
  const canRequestAgain = application?.can_request_again || false;
  const rejectionCount = application?.rejection_count || 0;
  const applicationId = application?.id || null;
  const profileImg = mentor.profile_image;
  const isOwnCard = currentUserId && String(currentUserId) === String(mentor.alumni_student_id);
  const avg = Number(mentor.reviews_avg || 0);
  const reviewsCount = mentor.reviews_count || 0;

  const goToDetail = () => navigate(`/mentorship/${mentor.id}`);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl transition-all relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
      <div className="relative z-10">
        <div className="flex gap-4">
          <div
            className="relative flex-shrink-0 cursor-pointer"
            onClick={goToDetail}
            title="View mentor"
          >
            {profileImg ? (
              <img
                src={profileImg}
                alt={mentor.name}
                className="w-20 h-20 rounded-xl border-2 border-blue-600/20 object-cover hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl border-2 border-blue-600/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold hover:opacity-90 transition-opacity">
                {mentor.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-bold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
              onClick={goToDetail}
            >
              {mentor.name}
            </h3>
            {mentor.title && <p className="text-blue-600 text-sm font-semibold truncate">{mentor.title}</p>}
            {mentor.company && <p className="text-gray-600 text-xs truncate">At {mentor.company}</p>}

            {/* Rating */}
            {reviewsCount > 0 ? (
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <FiStar key={n} size={11} className={n <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">{avg.toFixed(1)}</span>
                <span className="text-[10px] text-gray-500">({reviewsCount})</span>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1.5">No reviews yet</p>
            )}

            {mentor.expertise?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {mentor.expertise.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {mentor.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">{mentor.bio}</p>
        )}

        <div className="flex items-center gap-6 py-3 border-y border-gray-200 mt-2">
          {mentor.mentored_count > 0 && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Mentored</span>
              <span className="text-sm font-bold">{mentor.mentored_count} Alumni</span>
            </div>
          )}
          {mentor.graduation_year && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Graduation</span>
              <span className="text-sm font-bold">Class of {mentor.graduation_year}</span>
            </div>
          )}
          {mentor.years_of_experience && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500">Experience</span>
              <span className="text-sm font-bold">{mentor.years_of_experience} yrs</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={goToDetail}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-900 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
          >
            <FiEye size={14} /> View
          </button>
          {isOwnCard ? (
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
            >
              Edit
            </button>
          ) : iAmMentor && (!applicationStatus || (applicationStatus === 'rejected' && canRequestAgain)) ? (
            <button
              disabled
              title="Mentors cannot apply for mentorship"
              className="flex-1 text-sm font-semibold py-2.5 rounded-lg border bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
            >
              Mentors Can't Apply
            </button>
          ) : applicationStatus === 'accepted' ? (
            <button disabled className="flex-1 text-sm font-semibold py-2.5 rounded-lg border bg-green-50 text-green-700 border-green-200">
              ✓ Accepted
            </button>
          ) : applicationStatus === 'pending' ? (
            <div className="flex-1 flex gap-1">
              <button disabled className="flex-1 text-sm font-semibold py-2.5 rounded-lg border bg-yellow-50 text-yellow-700 border-yellow-200">
                ⏱ Pending
              </button>
              <button
                onClick={() => applicationId && onCancel && onCancel(applicationId, mentor)}
                title="Cancel request"
                className="px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                <FiX size={14} />
              </button>
            </div>
          ) : applicationStatus === 'rejected' && !canRequestAgain ? (
            <button disabled className="flex-1 text-sm font-semibold py-2.5 rounded-lg border bg-red-50 text-red-700 border-red-200" title="Cooldown: try again later">
              ✗ Rejected ({rejectionCount}/3)
            </button>
          ) : (
            <button
              onClick={() => onRequest(mentor)}
              disabled={requesting}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
              style={{ backgroundColor: '#002759' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a519b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#002759'}
            >
              {requesting ? 'Sending…' : (applicationStatus === 'rejected' ? `Request Again (${rejectionCount}/3)` : 'Request')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
