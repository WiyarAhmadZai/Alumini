import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiHeart, FiTrendingUp, FiX, FiDollarSign, FiUser, FiMail, FiPhone, FiAward, FiTarget, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import Swal from 'sweetalert2';
import fundraisingService from '../services/fundraisingService';
import authService from '../services/authService';

const BRAND = '#002759';
const BRAND_LIGHT = '#0a519b';
const PHONE_REGEX = /^[+\d][\d\s\-()]{6,29}$/;

const resolveImg = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/storage/')) return `http://localhost:8000${img}`;
  if (img.startsWith('storage/')) return `http://localhost:8000/${img}`;
  return `http://localhost:8000/storage/${img}`;
};

// ─────────── Donation Modal ───────────
const DonationModal = ({ open, project, initialAmount, onClose, onSuccess }) => {
  const loggedInUser = (() => {
    try { return JSON.parse(localStorage.getItem('alumni_user') || 'null'); } catch { return null; }
  })();

  const [form, setForm] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    donor_graduation_year: '',
    amount: initialAmount || '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        donor_name: loggedInUser?.name || '',
        donor_email: loggedInUser?.email || '',
        donor_phone: loggedInUser?.phone || '',
        donor_graduation_year: loggedInUser?.graduation_year || '',
        amount: initialAmount || '',
        message: '',
      });
      setErrors({});
    }
  }, [open, initialAmount]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!form.donor_name.trim()) e.donor_name = 'Name is required';
    if (!form.donor_email.trim()) e.donor_email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.donor_email.trim())) e.donor_email = 'Invalid email address';
    if (form.donor_phone && !PHONE_REGEX.test(form.donor_phone.trim())) e.donor_phone = 'Invalid phone number';
    if (!form.amount || Number(form.amount) < 1) e.amount = 'Please enter a valid amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await fundraisingService.donate({
        fundraising_project_id: project?.id || null,
        donor_name: form.donor_name.trim(),
        donor_email: form.donor_email.trim(),
        donor_phone: form.donor_phone.trim() || null,
        donor_graduation_year: form.donor_graduation_year || null,
        amount: Number(form.amount),
        message: form.message.trim() || null,
      });
      onClose();
      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: `Your donation pledge has been submitted. Our team will contact you shortly to process the donation.`,
        confirmButtonColor: BRAND,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit donation.';
      const serverErrors = err.response?.data?.errors || {};
      if (Object.keys(serverErrors).length > 0) {
        const mapped = {};
        Object.keys(serverErrors).forEach(k => { mapped[k] = serverErrors[k][0]; });
        setErrors(mapped);
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-3 py-2.5 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-1 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-200 focus:border-[#002759] focus:ring-[#002759]'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: BRAND }}>
          <div className="text-white min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold mb-1">
              {project ? 'Donate to Project' : 'Quick Gift'}
            </p>
            <h3 className="text-lg font-bold truncate">{project?.title || 'Support KPU'}</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 flex-shrink-0">
            <FiX size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {loggedInUser && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
              <FiCheckCircle size={14} />
              <span>Pre-filled from your profile — you can edit any field.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiUser className="inline mr-1" size={11} /> Full Name *
              </label>
              <input
                type="text"
                value={form.donor_name}
                onChange={(e) => { setForm({ ...form, donor_name: e.target.value }); if (errors.donor_name) setErrors({ ...errors, donor_name: null }); }}
                placeholder="Your full name"
                className={inputCls('donor_name')}
              />
              {errors.donor_name && <p className="text-[11px] text-red-600 mt-1">{errors.donor_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiMail className="inline mr-1" size={11} /> Email *
              </label>
              <input
                type="email"
                value={form.donor_email}
                onChange={(e) => { setForm({ ...form, donor_email: e.target.value }); if (errors.donor_email) setErrors({ ...errors, donor_email: null }); }}
                placeholder="you@example.com"
                className={inputCls('donor_email')}
              />
              {errors.donor_email && <p className="text-[11px] text-red-600 mt-1">{errors.donor_email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiPhone className="inline mr-1" size={11} /> Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.donor_phone}
                onChange={(e) => { setForm({ ...form, donor_phone: e.target.value }); if (errors.donor_phone) setErrors({ ...errors, donor_phone: null }); }}
                placeholder="+93 700 000 000"
                className={inputCls('donor_phone')}
              />
              {errors.donor_phone && <p className="text-[11px] text-red-600 mt-1">{errors.donor_phone}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiAward className="inline mr-1" size={11} /> Graduation Year <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.donor_graduation_year}
                onChange={(e) => setForm({ ...form, donor_graduation_year: e.target.value })}
                placeholder="e.g. 2015"
                className={inputCls('donor_graduation_year')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <FiDollarSign className="inline mr-1" size={11} /> Amount (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => { setForm({ ...form, amount: e.target.value }); if (errors.amount) setErrors({ ...errors, amount: null }); }}
                placeholder="100"
                className={`${inputCls('amount')} pl-7`}
              />
            </div>
            {errors.amount && <p className="text-[11px] text-red-600 mt-1">{errors.amount}</p>}
            {/* Quick-pick amounts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[25, 50, 100, 250, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setForm({ ...form, amount: amt })}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold border transition ${
                    Number(form.amount) === amt
                      ? 'bg-[#002759] text-white border-[#002759]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#002759]'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Your Message <span className="text-gray-400 font-normal">(optional — may be displayed publicly)</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              maxLength={1000}
              placeholder="Share why you're donating or a message of support…"
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#002759] focus:ring-1 focus:ring-[#002759] transition resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{form.message.length}/1000</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
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
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = BRAND_LIGHT)}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = BRAND)}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><FiHeart size={14} /> Submit Donation</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────── Main Page ───────────
const GivingPage = () => {
  const [projects, setProjects] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ open: false, project: null, initialAmount: '' });
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCustom, setQuickCustom] = useState('');

  const [topDonorsTotal, setTopDonorsTotal] = useState(0);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        fundraisingService.getProjects(),
        fundraisingService.getTopDonors(4),
      ]);
      setProjects(pRes.data || []);
      setTopDonors(dRes.data?.donors || []);
      setTopDonorsTotal(dRes.data?.total_count || 0);
    } catch {
      setProjects([]);
      setTopDonors([]);
      setTopDonorsTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openDonation = (project = null, amount = '') => {
    setModalState({ open: true, project, initialAmount: amount });
  };

  const closeDonation = () => setModalState({ open: false, project: null, initialAmount: '' });

  const handleQuickGift = () => {
    const amt = quickAmount || quickCustom;
    if (!amt || Number(amt) < 1) {
      Swal.fire({ icon: 'warning', title: 'Please select an amount', confirmButtonColor: BRAND });
      return;
    }
    openDonation(null, amt);
  };

  const quickGiftAmounts = [25, 50, 100, 250, 500, 1000];

  const getProgressPercentage = (raised, goal) => {
    if (goal <= 0) return 0;
    return Math.min((raised / goal) * 100, 100);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="relative w-full h-[420px] sm:h-[480px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80")',
            }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pt-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4 border border-white/20">
              <FiHeart size={11} /> KPU Giving
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-3xl">
              Support the Future of KPU
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mb-6">
              Your contributions help us maintain excellence in education and provide opportunities for the next generation of engineers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-[#002759] font-bold rounded-lg hover:bg-gray-100 transition text-sm"
              >
                Explore Projects
              </button>
              <button
                onClick={() => openDonation()}
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition text-sm"
              >
                Quick Donation
              </button>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
          {/* Projects */}
          <section id="projects-section" className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Fundraising Projects</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Join us in supporting these important initiatives that will benefit current and future KPU students.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                      <div className="h-2 bg-gray-200 rounded" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <FiTarget size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold">No active fundraising projects right now</p>
                <p className="text-xs text-gray-400 mt-1">Check back later or make a quick donation below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const pct = project.progress_percent ?? getProgressPercentage(project.raised_amount, project.goal_amount);
                  const imgUrl = resolveImg(project.image);
                  return (
                    <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                      <div className="relative h-48 bg-gray-100">
                        {imgUrl ? (
                          <img src={imgUrl} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: BRAND }}>
                            <FiHeart size={48} className="text-white/30" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#002759]">
                          {Math.round(pct)}% FUNDED
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">{project.description}</p>

                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-semibold">
                            <span>Raised: <span className="text-[#002759]">${Number(project.raised_amount).toLocaleString()}</span></span>
                            <span>Goal: ${Number(project.goal_amount).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: BRAND }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
                            <span>{project.donors_count} donors</span>
                            <span>{Math.round(pct)}% funded</span>
                          </div>
                          <div className="mt-2 px-2.5 py-1.5 bg-orange-50 border border-orange-100 rounded-md text-[11px] font-semibold text-orange-700 flex items-center justify-between">
                            <span>Remaining</span>
                            <span>${Number(project.remaining_amount ?? Math.max(0, project.goal_amount - project.raised_amount)).toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => openDonation(project)}
                          className="w-full text-white font-bold py-2.5 rounded-lg transition text-sm"
                          style={{ backgroundColor: BRAND }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_LIGHT}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND}
                        >
                          Donate Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Quick Gift */}
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Make a Quick Gift</h2>
                <p className="text-base text-gray-600">
                  Every contribution, no matter the size, makes a difference in our students' lives.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                  {quickGiftAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setQuickAmount(amount); setQuickCustom(''); }}
                      className={`py-3 px-4 rounded-lg font-bold transition border ${
                        Number(quickAmount) === amount
                          ? 'text-white'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#002759]'
                      }`}
                      style={Number(quickAmount) === amount ? { backgroundColor: BRAND, borderColor: BRAND } : {}}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="1"
                      value={quickCustom}
                      onChange={(e) => { setQuickCustom(e.target.value); setQuickAmount(''); }}
                      placeholder="Enter custom amount"
                      className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#002759] focus:border-[#002759] outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleQuickGift}
                  className="w-full text-white font-bold py-3 rounded-lg transition text-base"
                  style={{ backgroundColor: BRAND }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_LIGHT}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND}
                >
                  Process Donation
                </button>
              </div>
            </div>
          </section>

          {/* Wall of Honor / Top donors (only completed) */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Wall of Honor</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                We gratefully acknowledge the generous alumni who have made contributions to KPU.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {topDonors.length === 0 ? (
                <div className="text-center py-10">
                  <FiHeart size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-semibold">No completed donations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to contribute!</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topDonors.map((donor, index) => {
                      const projectsAmt = Number(donor.projects_amount || 0);
                      const quickAmt = Number(donor.quick_gift_amount || 0);
                      return (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition border border-gray-100">
                          <div className="flex items-start gap-4">
                            {donor.alumni_student_id ? (
                              <Link to={`/profile/${donor.alumni_student_id}`} className="flex-shrink-0">
                                {donor.profile_image ? (
                                  <img src={resolveImg(donor.profile_image)} alt={donor.donor_name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
                                ) : (
                                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: BRAND }}>
                                    {donor.donor_name?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </Link>
                            ) : (
                              <div className="flex-shrink-0">
                                {donor.profile_image ? (
                                  <img src={resolveImg(donor.profile_image)} alt={donor.donor_name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
                                ) : (
                                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: BRAND }}>
                                    {donor.donor_name?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              {donor.alumni_student_id ? (
                                <Link to={`/profile/${donor.alumni_student_id}`} className="font-bold text-gray-900 hover:text-[#002759] truncate block">
                                  {donor.donor_name}
                                </Link>
                              ) : (
                                <h4 className="font-bold text-gray-900 truncate">{donor.donor_name}</h4>
                              )}
                              {donor.donor_graduation_year && (
                                <p className="text-xs text-gray-500">Class of {donor.donor_graduation_year}</p>
                              )}
                              {donor.faculty && (
                                <p className="text-[11px] text-gray-400 truncate">{donor.faculty}</p>
                              )}
                              {donor.last_message && (
                                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 italic">"{donor.last_message}"</p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-lg" style={{ color: BRAND }}>${Number(donor.total_amount).toLocaleString()}</p>
                              <p className="text-[10px] text-gray-400">
                                {donor.last_donation_at ? new Date(donor.last_donation_at).getFullYear() : ''}
                              </p>
                            </div>
                          </div>

                          {/* Breakdown: Projects vs Quick Gift */}
                          <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-[11px]">
                            <div className="flex items-center justify-between px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-md">
                              <span className="flex items-center gap-1 text-[#002759] font-semibold">
                                <FiTarget size={10} /> Projects
                              </span>
                              <span className="font-bold text-[#002759]">${projectsAmt.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between px-2.5 py-1.5 bg-purple-50 border border-purple-100 rounded-md">
                              <span className="flex items-center gap-1 text-purple-700 font-semibold">
                                <FiHeart size={10} /> Quick Gift
                              </span>
                              <span className="font-bold text-purple-700">${quickAmt.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Per-project breakdown if donated to multiple */}
                          {donor.projects_breakdown && donor.projects_breakdown.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {donor.projects_breakdown.map((pb, i) => (
                                <div key={i} className="flex items-center justify-between text-[10px] text-gray-600 px-2">
                                  <span className="truncate">• {pb.project_title}</span>
                                  <span className="font-semibold text-gray-800 ml-2">${Number(pb.amount).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {topDonorsTotal > 4 && (
                    <div className="text-center mt-6">
                      <Link
                        to="/donors"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg text-white transition"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_LIGHT}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND}
                      >
                        See All {topDonorsTotal} Donors <FiArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        {/* Donation Modal */}
        <DonationModal
          open={modalState.open}
          project={modalState.project}
          initialAmount={modalState.initialAmount}
          onClose={closeDonation}
          onSuccess={fetchAll}
        />
      </div>
    </Layout>
  );
};

export default GivingPage;
