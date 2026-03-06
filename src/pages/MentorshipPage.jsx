import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import mentorService from '../services/mentorService';
import authService from '../services/authService';

const FACULTY_OPTIONS = [
  { key: 'Civil Engineering',  label: 'Civil Engineering' },
  { key: 'Computer Science',   label: 'Computer Science' },
  { key: 'Electromechanics',   label: 'Electromechanics' },
  { key: 'Geomatics',          label: 'Geomatics' },
  { key: 'Architecture',       label: 'Architecture' },
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

  const handleRequestMentorship = async (mentor) => {
    const isLoggedIn = authService.isLoggedIn?.() ?? !!localStorage.getItem('alumni_token');
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please log in to request mentorship.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#2563eb',
      }).then(r => { if (r.isConfirmed) navigate('/login'); });
      return;
    }

    const { value: formValues, isConfirmed } = await Swal.fire({
      title: `Request Mentorship`,
      html: `<p style="color:#4b5563;font-size:13px;margin-bottom:12px">Send a request to <strong>${mentor.name}</strong></p>
             <input id="swal-wa" class="swal2-input" placeholder="WhatsApp number (optional)" style="font-size:13px;" />
             <textarea id="swal-msg" class="swal2-textarea" placeholder="Introduce yourself and explain what you'd like guidance on... (optional)" style="font-size:13px;resize:none;height:80px;"></textarea>`,
      showCancelButton: true,
      confirmButtonText: 'Send Request',
      confirmButtonColor: '#2563eb',
      cancelButtonText: 'Cancel',
      preConfirm: () => ({
        message: document.getElementById('swal-msg')?.value || '',
        whatsapp_number: document.getElementById('swal-wa')?.value || '',
      }),
    });

    if (!isConfirmed) return;

    setRequestingId(mentor.id);
    try {
      await mentorService.requestMentorship(mentor.id, formValues?.message, formValues?.whatsapp_number);
      Swal.fire({
        icon: 'success',
        title: 'Request Sent!',
        text: `Your mentorship request has been sent to ${mentor.name}. They will get back to you soon.`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send request.';
      const alreadySent = err.response?.data?.status === 'already_requested';
      Swal.fire({
        icon: alreadySent ? 'info' : 'error',
        title: alreadySent ? 'Already Requested' : 'Error',
        text: msg,
      });
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
      if (activeFaculties.length === 1) params.faculty = activeFaculties[0];

      if (selectedExpertise.length === 1) params.expertise = selectedExpertise[0];

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
                <MentorCard key={mentor.id} mentor={mentor} onRequest={handleRequestMentorship} requesting={requestingId === mentor.id} navigate={navigate} currentUserId={currentUserId} />
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
                    className={`flex h-10 px-4 items-center justify-center rounded-lg font-bold text-sm ${
                      p === pagination.current_page
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
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
    </Layout>
  );
};

const MentorCard = ({ mentor, onRequest, requesting, navigate, currentUserId }) => {
  const profileImg = mentor.profile_image;
  const isOwnCard = currentUserId && String(currentUserId) === String(mentor.alumni_student_id);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl transition-all relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
      <div className="relative z-10">
        <div className="flex gap-4">
          <div
            className="relative flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/profile/${mentor.alumni_student_id}`)}
            title="View profile"
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
              onClick={() => navigate(`/profile/${mentor.alumni_student_id}`)}
            >
              {mentor.name}
            </h3>
            {mentor.title && <p className="text-blue-600 text-sm font-semibold truncate">{mentor.title}</p>}
            {mentor.company && <p className="text-gray-600 text-xs truncate">At {mentor.company}</p>}
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

        {isOwnCard ? (
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-gray-100 text-gray-700 text-sm font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors mt-2 border border-gray-200"
          >
            This is your mentor profile — Edit
          </button>
        ) : (
          <button
            onClick={() => onRequest(mentor)}
            disabled={requesting}
            className="w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {requesting ? 'Sending…' : 'Request Mentorship'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;
