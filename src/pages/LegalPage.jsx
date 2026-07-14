import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiHeart, FiTrendingUp, FiX, FiDollarSign, FiUser, FiMail, FiPhone, FiAward, FiTarget, FiCheckCircle, FiArrowRight, FiUsers, FiGift } from 'react-icons/fi';
import Swal from 'sweetalert2';
import fundraisingService from '../services/fundraisingService';
import authService from '../services/authService';
import { useHero } from '../contexts/HeroContext';
import HeroBackground from '../components/ui/HeroBackground';

// ─── Brand palette ─────────────────────────────────────────────
const BRAND = '#002759';        // primary dark navy
const BRAND_LIGHT = '#0a519b';  // hover dark
const BRAND_ACCENT = '#194ce6'; // accent royal blue (matches site)
const BRAND_BG = '#eef1fd';     // soft surface
const BRAND_BORDER = '#c5ccf7'; // soft border
const PHONE_REGEX = /^[+\d][\d\s\-()]{6,29}$/;

// ─── Eyebrow chip used above every section heading ───
const Eyebrow = ({ children, dark = false }) => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
    style={dark
      ? { background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.20)' }
      : { background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }}
  >
    {children}
  </span>
);

// ─── Donor rank badge (Gold / Silver / Bronze for top 3) ───
const RankBadge = ({ rank }) => {
  const { t } = useTranslation();
  if (rank > 3) return null;
  const styles = [
    null,
    { bg: 'linear-gradient(135deg,#fbbf24 0%,#d97706 100%)', label: '1' },
    { bg: 'linear-gradient(135deg,#d1d5db 0%,#9ca3af 100%)', label: '2' },
    { bg: 'linear-gradient(135deg,#f59e0b 0%,#92400e 100%)', label: '3' },
  ][rank];
  return (
    <span
      className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shadow-md ring-2 ring-white"
      style={{ background: styles.bg }}
      title={t('legal.wall.rankBadge', { rank })}
    >
      {styles.label}
    </span>
  );
};

const resolveImg = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/storage/')) return `http://localhost:8001${img}`;
  if (img.startsWith('storage/')) return `http://localhost:8001/${img}`;
  return `http://localhost:8001/storage/${img}`;
};

// ─────────── Donation Modal ───────────
const DonationModal = ({ open, project, initialAmount, onClose, onSuccess }) => {
  const { t } = useTranslation();
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
    if (!form.donor_name.trim()) e.donor_name = t('legal.modal.errNameRequired');
    if (!form.donor_email.trim()) e.donor_email = t('legal.modal.errEmailRequired');
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.donor_email.trim())) e.donor_email = t('legal.modal.errEmailInvalid');
    if (form.donor_phone && !PHONE_REGEX.test(form.donor_phone.trim())) e.donor_phone = t('legal.modal.errPhoneInvalid');
    if (!form.amount || Number(form.amount) < 1) e.amount = t('legal.modal.errAmountInvalid');
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
        title: t('legal.modal.thankYouTitle'),
        text: t('legal.modal.thankYouText'),
        confirmButtonColor: BRAND,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || t('legal.modal.donateFailed');
      const serverErrors = err.response?.data?.errors || {};
      if (Object.keys(serverErrors).length > 0) {
        const mapped = {};
        Object.keys(serverErrors).forEach(k => { mapped[k] = serverErrors[k][0]; });
        setErrors(mapped);
      } else {
        Swal.fire({ icon: 'error', title: t('legal.modal.errorTitle'), text: msg });
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
              {project ? t('legal.modal.donateToProject') : t('legal.modal.quickGift')}
            </p>
            <h3 className="text-lg font-bold truncate">{project?.title || t('legal.modal.supportKpu')}</h3>
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
              <span>{t('legal.modal.prefilled')}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiUser className="inline mr-1" size={11} /> {t('legal.modal.fullName')}
              </label>
              <input
                type="text"
                value={form.donor_name}
                onChange={(e) => { setForm({ ...form, donor_name: e.target.value }); if (errors.donor_name) setErrors({ ...errors, donor_name: null }); }}
                placeholder={t('legal.modal.fullNamePlaceholder')}
                className={inputCls('donor_name')}
              />
              {errors.donor_name && <p className="text-[11px] text-red-600 mt-1">{errors.donor_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiMail className="inline mr-1" size={11} /> {t('legal.modal.email')}
              </label>
              <input
                type="email"
                value={form.donor_email}
                onChange={(e) => { setForm({ ...form, donor_email: e.target.value }); if (errors.donor_email) setErrors({ ...errors, donor_email: null }); }}
                placeholder={t('legal.modal.emailPlaceholder')}
                className={inputCls('donor_email')}
              />
              {errors.donor_email && <p className="text-[11px] text-red-600 mt-1">{errors.donor_email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiPhone className="inline mr-1" size={11} /> {t('legal.modal.phone')} <span className="text-gray-400 font-normal">{t('legal.modal.phoneOptional')}</span>
              </label>
              <input
                type="tel"
                value={form.donor_phone}
                onChange={(e) => { setForm({ ...form, donor_phone: e.target.value }); if (errors.donor_phone) setErrors({ ...errors, donor_phone: null }); }}
                placeholder={t('legal.modal.phonePlaceholder')}
                className={inputCls('donor_phone')}
              />
              {errors.donor_phone && <p className="text-[11px] text-red-600 mt-1">{errors.donor_phone}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                <FiAward className="inline mr-1" size={11} /> {t('legal.modal.graduationYear')} <span className="text-gray-400 font-normal">{t('legal.modal.phoneOptional')}</span>
              </label>
              <input
                type="text"
                value={form.donor_graduation_year}
                onChange={(e) => setForm({ ...form, donor_graduation_year: e.target.value })}
                placeholder={t('legal.modal.graduationYearPlaceholder')}
                className={inputCls('donor_graduation_year')}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <FiDollarSign className="inline mr-1" size={11} /> {t('legal.modal.amount')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => { setForm({ ...form, amount: e.target.value }); if (errors.amount) setErrors({ ...errors, amount: null }); }}
                placeholder={t('legal.modal.amountPlaceholder')}
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
              {t('legal.modal.yourMessage')} <span className="text-gray-400 font-normal">{t('legal.modal.messageOptional')}</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              maxLength={1000}
              placeholder={t('legal.modal.messagePlaceholder')}
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
            {t('legal.modal.cancel')}
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
              <><FiHeart size={14} /> {t('legal.modal.submitDonation')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────── Main Page ───────────
const GivingPage = () => {
  const { t } = useTranslation();
  const hero = useHero('legal');
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
      Swal.fire({ icon: 'warning', title: t('legal.quickGift.selectAmountTitle'), confirmButtonColor: BRAND });
      return;
    }
    openDonation(null, amt);
  };

  const quickGiftAmounts = [25, 50, 100, 250, 500, 1000];

  const getProgressPercentage = (raised, goal) => {
    if (goal <= 0) return 0;
    return Math.min((raised / goal) * 100, 100);
  };

  // ─── Aggregated stats for the metric strip ───
  const totalRaised = projects.reduce((sum, p) => sum + Number(p.raised_amount || 0), 0);
  const totalGoal = projects.reduce((sum, p) => sum + Number(p.goal_amount || 0), 0);
  const overallPct = totalGoal > 0 ? Math.min((totalRaised / totalGoal) * 100, 100) : 0;
  const activeProjectsCount = projects.length;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="relative w-full h-[440px] sm:h-[500px] overflow-hidden">
          <HeroBackground page="legal"
            fallbackImage="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80"
            overlay="linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.85) 100%)" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 pb-20">
            <Eyebrow dark><FiHeart size={11} /> {hero.badge || t('legal.hero.badge')}</Eyebrow>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 max-w-3xl">
              {hero.title || t('legal.hero.title')}
            </h1>
            <p className="text-base sm:text-lg text-white/75 max-w-2xl mb-7 leading-relaxed font-light">
              {hero.subtitle || t('legal.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 font-bold rounded-lg transition text-sm shadow-lg"
                style={{ background: '#fff', color: BRAND }}
              >
                {t('legal.hero.exploreProjects')}
              </button>
              <button
                onClick={() => openDonation()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition text-sm"
              >
                <FiHeart size={14} /> {t('legal.hero.donateNow')}
              </button>
            </div>
          </div>
        </section>

        {/* Metric strip — overlaps hero */}
        <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-14 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white rounded-2xl border border-gray-200 shadow-xl p-3 sm:p-5">
            <div className="text-center px-3 py-2 sm:py-1 border-r border-gray-100 last:border-r-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">{t('legal.metrics.totalRaised')}</div>
              <div className="text-xl sm:text-2xl font-extrabold" style={{ color: BRAND }}>
                ${Number(totalRaised).toLocaleString()}
              </div>
            </div>
            <div className="text-center px-3 py-2 sm:py-1 md:border-r border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">{t('legal.metrics.generousDonors')}</div>
              <div className="text-xl sm:text-2xl font-extrabold" style={{ color: BRAND }}>
                {Number(topDonorsTotal || 0).toLocaleString()}
              </div>
            </div>
            <div className="text-center px-3 py-2 sm:py-1 border-r border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">{t('legal.metrics.activeProjects')}</div>
              <div className="text-xl sm:text-2xl font-extrabold" style={{ color: BRAND }}>
                {activeProjectsCount}
              </div>
            </div>
            <div className="text-center px-3 py-2 sm:py-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">{t('legal.metrics.overallProgress')}</div>
              <div className="text-xl sm:text-2xl font-extrabold" style={{ color: BRAND }}>
                {Math.round(overallPct)}%
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 pb-14">
          {/* Projects */}
          <section id="projects-section" className="mb-16">
            <div className="text-center mb-10">
              <Eyebrow><FiTarget size={11} /> {t('legal.projects.eyebrow')}</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{t('legal.projects.title')}</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t('legal.projects.subtitle')}
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
                <p className="text-gray-500 font-semibold">{t('legal.projects.emptyTitle')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('legal.projects.emptySubtitle')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const pct = project.progress_percent ?? getProgressPercentage(project.raised_amount, project.goal_amount);
                  const imgUrl = resolveImg(project.image);
                  const remaining = Number(project.remaining_amount ?? Math.max(0, project.goal_amount - project.raised_amount));
                  return (
                    <div key={project.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {imgUrl ? (
                          <img src={imgUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)` }}>
                            <FiHeart size={56} className="text-white/25" />
                          </div>
                        )}
                        {/* Funded chip */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider shadow-md"
                          style={{ color: BRAND }}>
                          {t('legal.projects.funded', { pct: Math.round(pct) })}
                        </div>
                        {/* Donor count chip */}
                        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-black/40 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
                          <FiUsers size={10} /> {project.donors_count === 1 ? t('legal.projects.donorOne', { count: project.donors_count || 0 }) : t('legal.projects.donorOther', { count: project.donors_count || 0 })}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-5 line-clamp-2 min-h-[40px] leading-relaxed">{project.description}</p>

                        {/* Progress */}
                        <div className="mb-5">
                          <div className="flex justify-between items-baseline text-[11px] font-semibold mb-1.5">
                            <span className="text-gray-500">{t('legal.projects.raised')}</span>
                            <span className="font-extrabold text-lg" style={{ color: BRAND }}>
                              ${Number(project.raised_amount).toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${BRAND_ACCENT} 0%, ${BRAND} 100%)` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] mt-1.5">
                            <span className="text-gray-500">{t('legal.projects.goal')} <span className="font-bold text-gray-700">${Number(project.goal_amount).toLocaleString()}</span></span>
                            <span className="font-bold text-gray-700">{Math.round(pct)}%</span>
                          </div>

                          {/* Remaining row — brand-soft */}
                          <div className="mt-3 px-3 py-2 rounded-lg flex items-center justify-between"
                            style={{ background: BRAND_BG, border: `1px solid ${BRAND_BORDER}` }}>
                            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: BRAND }}>
                              {t('legal.projects.remaining')}
                            </span>
                            <span className="text-sm font-extrabold" style={{ color: BRAND }}>
                              ${remaining.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => openDonation(project)}
                          className="mt-auto w-full inline-flex items-center justify-center gap-2 text-white font-bold py-2.5 rounded-lg transition text-sm shadow-sm"
                          style={{ backgroundColor: BRAND }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_LIGHT}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND}
                        >
                          <FiHeart size={14} /> {t('legal.projects.donateToThis')}
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
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Left/right split */}
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Left — branded panel */}
                <div className="lg:col-span-2 p-8 flex flex-col justify-center text-white relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)` }}>
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10" style={{ background: '#fff' }} />
                  <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10" style={{ background: '#fff' }} />
                  <div className="relative">
                    <Eyebrow dark><FiGift size={11} /> {t('legal.quickGift.eyebrow')}</Eyebrow>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">{t('legal.quickGift.title')}</h2>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {t('legal.quickGift.subtitle')}
                    </p>
                  </div>
                </div>

                {/* Right — form */}
                <div className="lg:col-span-3 p-8">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-3">
                    {t('legal.quickGift.chooseAmount')}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
                    {quickGiftAmounts.map((amount) => {
                      const active = Number(quickAmount) === amount;
                      return (
                        <button
                          key={amount}
                          onClick={() => { setQuickAmount(amount); setQuickCustom(''); }}
                          className="py-2.5 px-2 rounded-lg font-bold text-sm transition border"
                          style={active
                            ? { background: BRAND, borderColor: BRAND, color: '#fff' }
                            : { background: '#fff', borderColor: '#e5e7eb', color: '#374151' }}
                          onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = BRAND_BORDER; e.currentTarget.style.background = BRAND_BG; e.currentTarget.style.color = BRAND; } }}
                          onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#374151'; } }}
                        >
                          ${amount}
                        </button>
                      );
                    })}
                  </div>

                  <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                    {t('legal.quickGift.customAmount')}
                  </label>
                  <div className="relative mb-5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                      type="number"
                      min="1"
                      value={quickCustom}
                      onChange={(e) => { setQuickCustom(e.target.value); setQuickAmount(''); }}
                      placeholder={t('legal.quickGift.customPlaceholder')}
                      className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#002759] focus:border-[#002759] outline-none transition"
                    />
                  </div>

                  <button
                    onClick={handleQuickGift}
                    className="w-full inline-flex items-center justify-center gap-2 text-white font-bold py-3 rounded-lg transition text-sm shadow-sm"
                    style={{ backgroundColor: BRAND }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BRAND_LIGHT}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BRAND}
                  >
                    <FiHeart size={14} /> {t('legal.quickGift.processDonation')}
                  </button>

                  <p className="text-[11px] text-gray-400 mt-3 text-center">
                    {t('legal.quickGift.privacyNote')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Wall of Honor / Top donors (only completed) */}
          <section>
            <div className="text-center mb-10">
              <Eyebrow><FiAward size={11} /> {t('legal.wall.eyebrow')}</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{t('legal.wall.title')}</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t('legal.wall.subtitle')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {topDonors.length === 0 ? (
                <div className="text-center py-10">
                  <FiHeart size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-semibold">{t('legal.wall.emptyTitle')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('legal.wall.emptySubtitle')}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topDonors.map((donor, index) => {
                      const projectsAmt = Number(donor.projects_amount || 0);
                      const quickAmt = Number(donor.quick_gift_amount || 0);
                      const rank = index + 1;
                      return (
                        <div key={index} className="p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition">
                          <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                              <RankBadge rank={rank} />
                              {donor.alumni_student_id ? (
                                <Link to={`/profile/${donor.alumni_student_id}`}>
                                  {donor.profile_image ? (
                                    <img src={resolveImg(donor.profile_image)} alt={donor.donor_name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow ring-1 ring-gray-200" />
                                  ) : (
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow ring-1 ring-gray-200" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)` }}>
                                      {donor.donor_name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                  )}
                                </Link>
                              ) : (
                                <>
                                  {donor.profile_image ? (
                                    <img src={resolveImg(donor.profile_image)} alt={donor.donor_name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow ring-1 ring-gray-200" />
                                  ) : (
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow ring-1 ring-gray-200" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)` }}>
                                      {donor.donor_name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {donor.alumni_student_id ? (
                                <Link to={`/profile/${donor.alumni_student_id}`} className="font-bold text-gray-900 hover:text-[#002759] truncate block">
                                  {donor.donor_name}
                                </Link>
                              ) : (
                                <h4 className="font-bold text-gray-900 truncate">{donor.donor_name}</h4>
                              )}
                              {donor.donor_graduation_year && (
                                <p className="text-xs text-gray-500">{t('legal.wall.classOf', { year: donor.donor_graduation_year })}</p>
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
                                <FiTarget size={10} /> {t('legal.wall.projects')}
                              </span>
                              <span className="font-bold text-[#002759]">${projectsAmt.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between px-2.5 py-1.5 bg-purple-50 border border-purple-100 rounded-md">
                              <span className="flex items-center gap-1 text-purple-700 font-semibold">
                                <FiHeart size={10} /> {t('legal.wall.quickGift')}
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
                        {t('legal.wall.seeAll', { count: topDonorsTotal })} <FiArrowRight size={14} />
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
