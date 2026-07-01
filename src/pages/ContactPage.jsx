import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, FiNavigation, FiCalendar, FiBriefcase, FiUser, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useHero } from '../contexts/HeroContext';
import HeroBackground from '../components/ui/HeroBackground';
import Swal from 'sweetalert2';
import messageService from '../services/messageService';

// ─── Brand palette ──────────────────────────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const ContactPage = () => {
  const { t } = useTranslation();
  const hero = useHero('contact');
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: t('contact.form.defaultSubject'),
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      Swal.fire({
        title: t('contact.alerts.loginRequiredTitle'),
        text: t('contact.alerts.loginRequiredText'),
        icon: 'warning',
        confirmButtonColor: BRAND,
        confirmButtonText: t('contact.alerts.loginBtn'),
        showCancelButton: true,
        cancelButtonText: t('contact.alerts.cancelBtn')
      }).then((result) => {
        if (result.isConfirmed) window.location.href = '/login';
      });
      return;
    }

    if (!formData.message.trim()) {
      Swal.fire({ title: t('contact.alerts.validationTitle'), text: t('contact.alerts.validationText'), icon: 'error', confirmButtonColor: BRAND });
      return;
    }

    try {
      setLoading(true);
      await messageService.sendMessage({ subject: formData.subject, message: formData.message });
      Swal.fire({
        icon: 'success',
        title: t('contact.alerts.sentTitle'),
        text: t('contact.alerts.sentText'),
        confirmButtonColor: BRAND,
        timer: 3000,
        timerProgressBar: true
      });
      setFormData(prev => ({ ...prev, message: '' }));
    } catch {
      Swal.fire({ icon: 'error', title: t('contact.alerts.errorTitle'), text: t('contact.alerts.errorText'), confirmButtonColor: '#dc2626' });
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: <FiMail />, title: t('contact.cards.emailTitle'), detail: 'it.director@kpu.edu.af', cta: t('contact.cards.emailCta'), href: 'mailto:it.director@kpu.edu.af' },
    { icon: <FiPhone />, title: t('contact.cards.callTitle'), detail: '+93 20 252 6364', cta: t('contact.cards.callCta'), href: 'tel:0202526364' },
    { icon: <FiMapPin />, title: t('contact.cards.visitTitle'), detail: t('contact.cards.visitDetail'), cta: t('contact.cards.visitCta'), href: 'https://maps.google.com/?q=Kabul+Polytechnic+University' },
    { icon: <FiBookOpen />, title: t('contact.cards.transcriptsTitle'), detail: 'transcript@kpu.edu.af', cta: t('contact.cards.transcriptsCta'), href: 'mailto:transcript@kpu.edu.af' },
  ];

  const quickLinks = [
    { icon: <FiUsers />, title: t('contact.quickLinks.aboutTitle'), desc: t('contact.quickLinks.aboutDesc'), href: '/about' },
    { icon: <FiCalendar />, title: t('contact.quickLinks.eventsTitle'), desc: t('contact.quickLinks.eventsDesc'), href: '/events' },
    { icon: <FiUser />, title: t('contact.quickLinks.mentorshipTitle'), desc: t('contact.quickLinks.mentorshipDesc'), href: '/mentorship' },
    { icon: <FiBriefcase />, title: t('contact.quickLinks.jobsTitle'), desc: t('contact.quickLinks.jobsDesc'), href: '/jobs' },
  ];

  return (
    <Layout>
      {/* ═══ HERO — branded design language ═════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 380 }}>
        <HeroBackground page="contact" fallbackImage="/kpu5.jpg"
          overlay="linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.85) 100%)" />

        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 sm:px-6 text-center text-white" style={{ minHeight: 380 }}>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 mb-3">
            <FiMessageSquare className="text-[10px]" />
            {hero.badge || t('contact.hero.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3 max-w-3xl">
            {hero.title || t('contact.hero.title')}
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light">
            {hero.subtitle || t('contact.hero.subtitle')}
          </p>

          {/* Inline quick info row — branded style consistent with other pages */}
          <div className="mt-5 hidden sm:flex items-stretch bg-white/8 border border-white/15 rounded-xl overflow-hidden">
            <div className="px-5 py-2 flex items-center gap-2 text-[11px]">
              <FiPhone className="text-white/50 w-3 h-3" />
              <span className="text-white/80 font-medium">+93 20 252 6364</span>
            </div>
            <div className="w-px bg-white/15" />
            <div className="px-5 py-2 flex items-center gap-2 text-[11px]">
              <FiMail className="text-white/50 w-3 h-3" />
              <span className="text-white/80 font-medium">it.director@kpu.edu.af</span>
            </div>
            <div className="w-px bg-white/15" />
            <div className="px-5 py-2 flex items-center gap-2 text-[11px]">
              <FiMapPin className="text-white/50 w-3 h-3" />
              <span className="text-white/80 font-medium">{t('contact.hero.campus')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CARDS ═════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border mb-3"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              {t('contact.cardsSection.label')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {t('contact.cardsSection.title')}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('contact.cardsSection.subtitle')}
            </p>
            <div className="w-10 h-0.5 mx-auto mt-4 rounded-full" style={{ background: BRAND }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {contactCards.map((c) => (
              <a key={c.title} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-base"
                  style={{ background: BRAND_BG, color: BRAND }}>
                  {c.icon}
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3 break-words line-clamp-2">{c.detail}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                  style={{ color: BRAND_DARK }}>
                  {c.cta} <FiSend className="text-[9px]" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FORM + MAP ═════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border mb-3"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              {t('contact.form.label')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {t('contact.form.title')}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('contact.form.subtitle')}
            </p>
            <div className="w-10 h-0.5 mx-auto mt-4 rounded-full" style={{ background: BRAND }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Form — takes 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{t('contact.form.firstName')}</label>
                    <input
                      type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder={t('contact.form.firstNamePlaceholder')}
                      disabled={!!user?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{t('contact.form.lastName')}</label>
                    <input
                      type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder={t('contact.form.lastNamePlaceholder')}
                      disabled={!!user?.last_name}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{t('contact.form.email')}</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder={t('contact.form.emailPlaceholder')}
                    disabled={!!user?.email}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{t('contact.form.subject')}</label>
                  <input
                    type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all"
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{t('contact.form.message')}</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleInputChange} rows="5"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                    required
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 focus:ring-2" style={{ accentColor: BRAND }} />
                    <span className="ml-2 text-xs text-gray-600">{t('contact.form.newsletter')}</span>
                  </label>
                  <button
                    type="submit" disabled={loading}
                    className="px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: BRAND_DARK }}
                    onMouseEnter={e => !loading && (e.currentTarget.style.background = '#091d5e')}
                    onMouseLeave={e => !loading && (e.currentTarget.style.background = BRAND_DARK)}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      <>
                        <FiSend className="text-xs" />
                        {t('contact.form.send')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Map + Info — takes 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Map */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=Kabul+Polytechnic+University&output=embed"
                  width="100%" height="220"
                  style={{ border: 0 }}
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title={t('contact.map.mapAlt')}
                ></iframe>
                <div className="p-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FiMapPin className="text-xs" style={{ color: BRAND }} />
                    {t('contact.map.title')}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{t('contact.map.location')}</p>
                </div>
              </div>

              {/* Hours card */}
              <div className="rounded-xl p-5" style={{ background: BRAND_DARK }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10 border border-white/20">
                  <FiAward className="text-white text-sm" />
                </div>
                <h4 className="text-white text-sm font-bold mb-2">{t('contact.map.officeHours')}</h4>
                <div className="space-y-1 text-[11px] text-white/70">
                  <div className="flex justify-between"><span>{t('contact.map.monThu')}</span><span className="text-white/90">{t('contact.map.monThuTime')}</span></div>
                  <div className="flex justify-between"><span>{t('contact.map.friday')}</span><span className="text-white/90">{t('contact.map.fridayTime')}</span></div>
                  <div className="flex justify-between"><span>{t('contact.map.weekend')}</span><span className="text-white/90">{t('contact.map.closed')}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-white/60">
                  {t('contact.map.responseTime')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUICK LINKS ═══════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border mb-3"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              {t('contact.links.label')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {t('contact.links.title')}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('contact.links.subtitle')}
            </p>
            <div className="w-10 h-0.5 mx-auto mt-4 rounded-full" style={{ background: BRAND }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickLinks.map((q) => (
              <Link key={q.title} to={q.href}
                className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-base"
                  style={{ background: BRAND_BG, color: BRAND }}>
                  {q.icon}
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">{q.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{q.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
