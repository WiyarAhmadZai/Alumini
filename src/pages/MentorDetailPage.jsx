import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiArrowLeft, FiMail, FiBriefcase, FiAward, FiUsers, FiStar,
  FiMessageCircle, FiSend, FiCheckCircle, FiClock, FiX, FiUser,
  FiEdit3, FiPhone, FiGlobe, FiCalendar, FiTrendingUp, FiMaximize2,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import mentorService from '../services/mentorService';
import authService from '../services/authService';

const BRAND = '#002759';
const BRAND_LIGHT = '#0a519b';

const resolveImg = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/storage/')) return `http://localhost:8000${img}`;
  if (img.startsWith('storage/')) return `http://localhost:8000/${img}`;
  return `http://localhost:8000/storage/${img}`;
};

// ─────────── Full-screen Image Viewer ───────────
const ImageViewer = ({ src, open, onClose }) => {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open || !src) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
      >
        <FiX size={22} />
      </button>
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain cursor-default"
      />
    </div>
  );
};

// ─────────── Request Mentorship Modal (simple, branded) ───────────
const PHONE_REGEX = /^[+\d][\d\s\-()]{6,29}$/;

const RequestModal = ({ mentor, open, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) { setMessage(''); setWhatsapp(''); setError(''); }
  }, [open]);

  if (!open || !mentor) return null;

  const submit = async () => {
    if (whatsapp && !PHONE_REGEX.test(whatsapp.trim())) {
      setError('Please enter a valid phone number (digits, +, -, ( ) only).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await mentorService.requestMentorship(mentor.id, message, whatsapp);
      onClose();
      setMessage(''); setWhatsapp('');
      Swal.fire({
        icon: 'success',
        title: 'Request Sent',
        text: `Your mentorship request has been sent to ${mentor.name}.`,
        timer: 2500,
        showConfirmButton: false,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      const data = err.response?.data || {};
      onClose();
      if (data.status === 'cooldown') {
        Swal.fire({ icon: 'warning', title: 'Cooldown Active', text: data.message });
      } else {
        const alreadySent = data.status === 'already_requested';
        Swal.fire({
          icon: alreadySent ? 'info' : 'error',
          title: alreadySent ? 'Already Requested' : 'Error',
          text: data.message || 'Failed to send request.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100" style={{ backgroundColor: BRAND }}>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Request Mentorship</p>
            <h3 className="text-base font-bold text-white">{mentor.name}</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <FiX size={20} />
          </button>
        </div>

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

        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-60"
            style={{ backgroundColor: BRAND }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><FiSend size={13} /> Send Request</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────── Review Modal (simple, branded) ───────────
const ReviewModal = ({ mentor, open, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open || !mentor) return null;

  const submit = async () => {
    if (!rating) {
      Swal.fire({ icon: 'warning', title: 'Please select a rating', timer: 1500, showConfirmButton: false });
      return;
    }
    setLoading(true);
    try {
      await mentorService.submitReview(mentor.id, rating, review);
      onClose();
      setRating(0); setReview(''); setHoverRating(0);
      Swal.fire({ icon: 'success', title: 'Thank You', text: 'Your review has been submitted.', timer: 2500, showConfirmButton: false });
      if (onSuccess) onSuccess();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to submit review.' });
    } finally {
      setLoading(false);
    }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const display = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: BRAND }}>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">Leave a Review</p>
            <h3 className="text-base font-bold text-white">for {mentor.name}</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="text-center mb-5 pb-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Rating</p>
            <div className="flex items-center justify-center gap-2" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <FiStar
                    size={32}
                    className={n <= display ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold text-gray-700 mt-2 min-h-[20px]">
              {display ? labels[display] : 'Select a rating'}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Your Experience <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Share how this mentor helped you…"
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#002759] focus:ring-1 focus:ring-[#002759] transition resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{review.length}/1000</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading || !rating}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition disabled:opacity-60"
            style={{ backgroundColor: BRAND }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Submit Review</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────── Main Page ───────────
const MentorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myRequest, setMyRequest] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [viewerSrc, setViewerSrc] = useState(null);

  const storedUser = localStorage.getItem('alumni_user');
  const currentUserId = storedUser ? JSON.parse(storedUser)?.id : null;
  const isOwn = mentor && currentUserId && String(currentUserId) === String(mentor.alumni_student_id);

  const fetchMentor = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mentorService.getById(id);
      if (res.status === 'success') setMentor(res.data);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not load mentor profile.' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchMentor(); }, [fetchMentor]);

  useEffect(() => {
    if (!authService.isAuthenticated() || !mentor) return;
    mentorService.getMyApplications().then(res => {
      const mine = (res.data || []).find(a => String(a.mentor_id) === String(mentor.id));
      setMyRequest(mine || null);
    }).catch(() => {});
  }, [mentor]);

  const openRequest = () => {
    if (!authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info', title: 'Login Required', text: 'Please log in to request mentorship.',
        confirmButtonText: 'Go to Login', confirmButtonColor: BRAND,
      }).then(r => { if (r.isConfirmed) navigate('/login'); });
      return;
    }
    setRequestOpen(true);
  };

  const openReview = () => {
    if (!authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info', title: 'Login Required', text: 'Please log in to leave a review.',
        confirmButtonText: 'Go to Login', confirmButtonColor: BRAND,
      }).then(r => { if (r.isConfirmed) navigate('/login'); });
      return;
    }
    setReviewOpen(true);
  };

  const refreshAfterRequest = () => {
    mentorService.getMyApplications().then(res => {
      const mine = (res.data || []).find(a => String(a.mentor_id) === String(mentor.id));
      setMyRequest(mine || null);
    }).catch(() => {});
  };

  const handleCancelRequest = async () => {
    if (!myRequest) return;
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
      await mentorService.cancelRequest(myRequest.id);
      setMyRequest(null);
      Swal.fire({ icon: 'success', title: 'Cancelled', timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to cancel request.' });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-[#002759] rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!mentor) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center py-32 px-4">
          <FiUsers size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Mentor Not Found</h2>
          <p className="text-gray-500 mb-6 text-center">This mentor profile doesn't exist or has been removed.</p>
          <Link to="/mentorship" className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: BRAND }}>
            Back to Mentors
          </Link>
        </div>
      </Layout>
    );
  }

  const avg = Number(mentor.reviews_avg || 0);
  const totalReviews = mentor.reviews_count || 0;
  const dist = mentor.rating_distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const profileImg = resolveImg(mentor.profile_image);
  const coverImg = resolveImg(mentor.cover_image);

  return (
    <Layout>
      {/* ─────────── HERO (darkened image) ─────────── */}
      <section className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.7) 100%), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80")',
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-3 border border-white/20">
            Mentor Profile
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2">KPU Alumni Mentorship</h1>
          <p className="text-sm text-white/80 max-w-xl">Connect with experienced alumni</p>
        </div>
      </section>

      {/* Back link */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-6">
          <button
            onClick={() => navigate('/mentorship')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#002759] font-semibold bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-[#002759] shadow-sm transition"
          >
            <FiArrowLeft size={14} /> All Mentors
          </button>
        </div>
      </div>

      {/* ─────────── PROFILE CARD ─────────── */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Cover image (clickable) */}
            <div
              className="relative h-40 sm:h-48 md:h-56 cursor-pointer group"
              onClick={() => coverImg && setViewerSrc(coverImg)}
              style={{ backgroundColor: coverImg ? 'transparent' : BRAND }}
            >
              {coverImg ? (
                <>
                  <img src={coverImg} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                    <FiMaximize2 size={20} className="text-white opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: BRAND }} />
              )}
            </div>

            {/* Profile content */}
            <div className="px-5 sm:px-6 pb-6 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Profile image (clickable) — pulled up to overlap cover */}
                <div
                  className="flex-shrink-0 relative cursor-pointer group -mt-20 sm:-mt-24"
                  onClick={() => profileImg && setViewerSrc(profileImg)}
                >
                  {profileImg ? (
                    <img
                      src={profileImg}
                      alt={mentor.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl border-4 border-white object-cover shadow-lg group-hover:brightness-90 transition"
                    />
                  ) : (
                    <div
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl border-4 border-white flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: BRAND }}
                    >
                      {mentor.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  {mentor.status === 'verified' && (
                    <div
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow"
                      style={{ backgroundColor: '#16a34a' }}
                      title="Verified mentor"
                    >
                      <FiCheckCircle className="text-white" size={12} />
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div className="flex-1 min-w-0 sm:pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{mentor.name}</h2>
                  {mentor.title && <p className="text-sm font-semibold" style={{ color: BRAND }}>{mentor.title}</p>}
                  {mentor.company && (
                    <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
                      <FiBriefcase size={12} /> {mentor.company}
                    </p>
                  )}
                  {totalReviews > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <FiStar key={n} size={13} className={n <= Math.round(avg) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{avg.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({totalReviews})</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:pb-2">
                  {isOwn ? (
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold text-xs hover:bg-gray-200 transition"
                    >
                      <FiEdit3 size={12} /> Edit Profile
                    </Link>
                  ) : myRequest && myRequest.status === 'rejected' && myRequest.can_request_again ? (
                    <button
                      onClick={openRequest}
                      className="inline-flex items-center gap-1.5 text-white px-4 py-2 rounded-lg font-semibold text-xs transition"
                      style={{ backgroundColor: BRAND }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_LIGHT}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND}
                    >
                      <FiSend size={12} /> Request Again ({myRequest.rejection_count || 0}/3)
                    </button>
                  ) : myRequest ? (
                    <>
                      <div
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs ${
                          myRequest.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                          myRequest.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}
                        title={myRequest.status === 'rejected' ? `Rejected ${myRequest.rejection_count || 0}/3 times` : ''}
                      >
                        {myRequest.status === 'accepted' && <FiCheckCircle size={12} />}
                        {myRequest.status === 'pending' && <FiClock size={12} />}
                        {myRequest.status === 'rejected' && <FiX size={12} />}
                        {myRequest.status === 'rejected' ? `Rejected (${myRequest.rejection_count || 0}/3)` : myRequest.status.charAt(0).toUpperCase() + myRequest.status.slice(1)}
                      </div>
                      {myRequest.status === 'pending' && (
                        <button
                          onClick={handleCancelRequest}
                          className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-semibold text-xs border border-red-200 hover:bg-red-100 transition"
                        >
                          <FiX size={12} /> Cancel Request
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={openRequest}
                      className="inline-flex items-center gap-1.5 text-white px-4 py-2 rounded-lg font-semibold text-xs transition"
                      style={{ backgroundColor: BRAND }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_LIGHT}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND}
                    >
                      <FiSend size={12} /> Request Mentorship
                    </button>
                  )}
                  {!isOwn && (
                    <button
                      onClick={openReview}
                      className="inline-flex items-center gap-1.5 bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold text-xs border border-gray-300 hover:bg-gray-50 transition"
                    >
                      <FiStar size={12} /> Leave Review
                    </button>
                  )}
                  {myRequest?.status === 'accepted' && mentor.whatsapp_number && (
                    <a
                      href={`https://wa.me/${mentor.whatsapp_number.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#25d366] hover:bg-[#1ebe5b] text-white px-4 py-2 rounded-lg font-semibold text-xs transition"
                      title="Contact on WhatsApp"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND }}>{mentor.mentored_count || 0}</p>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Mentored</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND }}>{mentor.years_of_experience || 0}</p>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Years Exp.</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND }}>{avg.toFixed(1)}</p>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND }}>{mentor.graduation_year || '—'}</p>
                  <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Graduation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── CONTENT ─────────── */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {mentor.bio && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiBriefcase size={16} style={{ color: BRAND }} /> About {mentor.name?.split(' ')[0]}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{mentor.bio}</p>
                </div>
              )}

              {/* Expertise */}
              {mentor.expertise?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiAward size={16} style={{ color: BRAND }} /> Areas of Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border"
                        style={{ backgroundColor: '#f0f4f9', color: BRAND, borderColor: '#e0e7ef' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FiMessageCircle size={16} style={{ color: BRAND }} /> Reviews
                    <span className="text-sm font-semibold text-gray-400">({totalReviews})</span>
                  </h2>
                  {!isOwn && (
                    <button
                      onClick={openReview}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition"
                      style={{ backgroundColor: BRAND }}
                    >
                      <FiStar size={11} /> Write Review
                    </button>
                  )}
                </div>

                <div className="p-5">
                  {totalReviews === 0 ? (
                    <div className="text-center py-10">
                      <FiMessageCircle size={36} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-semibold">No reviews yet</p>
                      <p className="text-xs text-gray-400 mt-1">Be the first to share your experience</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(mentor.reviews || []).map((r) => (
                        <div key={r.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                          <div className="flex items-start gap-3">
                            {r.profile_image ? (
                              <img src={resolveImg(r.profile_image)} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: BRAND }}
                              >
                                {r.reviewer_name?.charAt(0) || '?'}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">{r.reviewer_name}</p>
                                  <div className="flex items-center gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                      <FiStar key={n} size={12} className={n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[11px] text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>
                              </div>
                              {r.review && <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">{r.review}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Rating overview */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Rating Overview</h3>
                <div className="text-center mb-4 pb-4 border-b border-gray-100">
                  <div className="text-5xl font-bold" style={{ color: BRAND }}>{avg.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <FiStar key={n} size={16} className={n <= Math.round(avg) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Based on {totalReviews} reviews</p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = dist[star] || 0;
                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-gray-700 font-semibold">{star}</span>
                        <FiStar size={11} className="fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-yellow-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-7 text-gray-500 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick info */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Quick Info</h3>
                {mentor.faculty && (
                  <div className="flex items-start gap-3">
                    <FiAward size={14} className="mt-0.5 flex-shrink-0" style={{ color: BRAND }} />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Faculty</div>
                      <div className="text-xs font-semibold text-gray-800">{mentor.faculty}</div>
                    </div>
                  </div>
                )}
                {mentor.department && (
                  <div className="flex items-start gap-3">
                    <FiGlobe size={14} className="mt-0.5 flex-shrink-0" style={{ color: BRAND }} />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Department</div>
                      <div className="text-xs font-semibold text-gray-800">{mentor.department}</div>
                    </div>
                  </div>
                )}
                {myRequest?.status === 'accepted' && mentor.email && (
                  <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                    <FiMail size={14} className="mt-0.5 flex-shrink-0" style={{ color: BRAND }} />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Email</div>
                      <a href={`mailto:${mentor.email}`} className="text-xs font-semibold hover:underline break-all" style={{ color: BRAND }}>
                        {mentor.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* View Profile link */}
              <Link
                to={`/profile/${mentor.alumni_student_id}`}
                className="block w-full text-center bg-white border border-gray-200 hover:border-[#002759] text-gray-700 hover:text-[#002759] py-3 rounded-xl text-sm font-semibold transition"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestModal mentor={mentor} open={requestOpen} onClose={() => setRequestOpen(false)} onSuccess={refreshAfterRequest} />
      <ReviewModal mentor={mentor} open={reviewOpen} onClose={() => setReviewOpen(false)} onSuccess={fetchMentor} />
      <ImageViewer src={viewerSrc} open={!!viewerSrc} onClose={() => setViewerSrc(null)} />
    </Layout>
  );
};

export default MentorDetailPage;
