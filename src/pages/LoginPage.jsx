import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowRight,
  FiAward, FiUsers, FiBriefcase, FiCalendar, FiLogIn, FiAlertCircle, FiX
} from 'react-icons/fi';
import authService from '../services/authService';

// ─── Brand palette ─────────────────────────────────────────────
const BRAND = '#002759';
const BRAND_LIGHT = '#0a519b';
const BRAND_ACCENT = '#194ce6';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        remember: rememberMe,
      });
      if (response.status === 'success') {
        navigate('/profile');
      } else {
        setError(response.message || t('auth.errors.loginFailed'));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('auth.errors.loginFailedRetry'));
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: FiAward, text: t('auth.benefits.resources') },
    { icon: FiUsers, text: t('auth.benefits.network') },
    { icon: FiBriefcase, text: t('auth.benefits.career') },
    { icon: FiCalendar, text: t('auth.benefits.events') },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero section with form overlay */}
        <section className="relative min-h-[680px] overflow-hidden">
          {/* Background image + dark overlay */}
          <div className="absolute inset-0">
            <img src="/kpu2.jpg" alt={t('auth.brand.university')} className="w-full h-full object-cover" />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.85) 100%)' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-14 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
              {/* ─── Left — branding & benefits ─── */}
              <div className="text-white lg:col-span-3">
                {/* Logo lockup */}
                <div className="inline-flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                    <img src="/logo_kpu.png" alt="KPU" className="w-9 h-9 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-base tracking-tight">{t('auth.brand.network')}</div>
                    <div className="text-xs text-white/60">{t('auth.brand.university')}</div>
                  </div>
                </div>

                {/* Eyebrow chip */}
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
                  style={{ background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.20)' }}
                >
                  <FiLogIn size={11} /> {t('auth.login.eyebrow')}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-5">
                  {t('auth.login.headingLine1')}<br className="hidden lg:block" />
                  <span className="text-white"> {t('auth.login.headingHighlight')}</span>
                </h1>

                <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-xl font-light">
                  {t('auth.login.intro')}
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.10)' }}>
                        <b.icon className="w-4 h-4" style={{ color: '#fff' }} />
                      </span>
                      <span className="text-sm text-white/90 font-medium leading-snug">{b.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ─── Right — login form card ─── */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Card header */}
                  <div className="px-7 pt-7 pb-5">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                      style={{ background: BRAND_BG, color: BRAND, border: `1px solid ${BRAND_BORDER}` }}
                    >
                      {t('auth.login.cardBadge')}
                    </span>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t('auth.login.cardTitle')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('auth.login.cardSubtitle')}</p>
                  </div>

                  <div className="px-7 pb-7">
                    {error && (
                      <div className="flex items-start gap-3 p-3.5 mb-5 rounded-lg bg-red-50 border border-red-200">
                        <FiAlertCircle className="flex-shrink-0 mt-0.5 text-red-600" />
                        <p className="text-xs text-red-700 flex-1">{error}</p>
                        <button type="button" onClick={() => setError('')}
                          className="text-red-400 hover:text-red-700 flex-shrink-0">
                          <FiX size={14} />
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                          {t('auth.login.emailLabel')}
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                          <input
                            type="email" name="email" required
                            value={formData.email} onChange={handleInputChange}
                            placeholder={t('auth.login.emailPlaceholder')}
                            className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition"
                            style={{ '--tw-ring-color': BRAND_BORDER }}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 mb-2">
                          {t('auth.login.passwordLabel')}
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                          <input
                            type={showPassword ? 'text' : 'password'} name="password" required
                            value={formData.password} onChange={handleInputChange}
                            placeholder={t('auth.login.passwordPlaceholder')}
                            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition"
                            style={{ '--tw-ring-color': BRAND_BORDER }}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                            {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* Remember + forgot */}
                      <div className="flex items-center justify-between pt-1">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox" checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                            style={{ accentColor: BRAND }}
                          />
                          <span className="text-xs text-gray-600 font-medium">{t('auth.login.rememberMe')}</span>
                        </label>
                        <button type="button" onClick={(e) => e.preventDefault()}
                          className="text-xs font-semibold hover:underline" style={{ color: BRAND_ACCENT }}>
                          {t('auth.login.forgotPassword')}
                        </button>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit" disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 text-white font-bold py-3 rounded-lg transition text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        style={{ backgroundColor: BRAND }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = BRAND_LIGHT)}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = BRAND)}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('auth.login.signingIn')}
                          </>
                        ) : (
                          <>
                            {t('auth.login.signIn')} <FiArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Divider + register CTA */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400">
                          {t('auth.login.newToAlumni')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button" onClick={() => navigate('/register')}
                      className="w-full inline-flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition text-sm border"
                      style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = BRAND_BORDER; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = BRAND_BG; }}
                    >
                      <FiCheckCircle size={14} /> {t('auth.login.createVerified')}
                    </button>

                    <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
                      {t('auth.login.verifiedNote')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LoginPage;
