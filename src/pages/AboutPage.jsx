import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import authService from '../services/authService';
import { useSettings } from '../contexts/SettingsContext';
import { useHero } from '../contexts/HeroContext';
import HeroBackground from '../components/ui/HeroBackground';
import {
  FiMail, FiPhone, FiMapPin, FiLinkedin, FiAward, FiUsers, FiTarget, FiGlobe,
  FiArrowRight, FiBookOpen, FiTrendingUp, FiHeart, FiStar, FiZap, FiUser, FiGithub
} from 'react-icons/fi';

// ─── Brand palette ──────────────────────────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

// ─── Shared bits ────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border"
    style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
    {children}
  </div>
);

const SectionHeader = ({ label, title, subtitle }) => (
  <div className="text-center mb-10 max-w-xl mx-auto">
    <div className="flex justify-center mb-3">
      <SectionLabel>{label}</SectionLabel>
    </div>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
      {title}
    </h2>
    {subtitle && <p className="text-gray-500 text-sm leading-relaxed">{subtitle}</p>}
    <div className="w-10 h-0.5 mx-auto mt-4 rounded-full" style={{ background: BRAND }} />
  </div>
);

// ─── Main Page ──────────────────────────────────────────────────
const AboutPage = () => {
  const { t } = useTranslation();
  const hero = useHero('about');
  const { chancellor, board, pick, loaded } = useSettings();
  const isLoggedIn = authService.isAuthenticated();

  // Chancellor — dynamic from admin settings, with i18n fallback.
  const chName = pick(chancellor?.name) || t('about.chancellor.name');
  const chRole = pick(chancellor?.role) || t('about.chancellor.role');
  const chQuote = pick(chancellor?.message) || t('about.chancellor.quote');
  const chPhoto = chancellor?.photo || '/chanceler.jpg';
  const chEmail = chancellor?.email || '';
  const chLinkedin = chancellor?.linkedin || '';
  const chGithub = chancellor?.github || '';

  const values = [
    { icon: <FiHeart />, title: t('about.values.integrityTitle'), desc: t('about.values.integrityDesc') },
    { icon: <FiTrendingUp />, title: t('about.values.excellenceTitle'), desc: t('about.values.excellenceDesc') },
    { icon: <FiUsers />, title: t('about.values.communityTitle'), desc: t('about.values.communityDesc') },
    { icon: <FiZap />, title: t('about.values.innovationTitle'), desc: t('about.values.innovationDesc') },
  ];

  const timeline = [
    { year: '1951', title: t('about.timeline.foundedTitle'), desc: t('about.timeline.foundedDesc') },
    { year: '2010', title: t('about.timeline.associationTitle'), desc: t('about.timeline.associationDesc') },
    { year: '2018', title: t('about.timeline.globalTitle'), desc: t('about.timeline.globalDesc') },
    { year: '2024', title: t('about.timeline.platformTitle'), desc: t('about.timeline.platformDesc') },
  ];

  // Executive board — only the real members configured by the admin (no static
  // placeholders). While settings load, the section shows a skeleton; if none
  // are configured, the section is hidden entirely.
  const boardMembers = (board || []).map((m) => ({
    name: pick(m.name) || '',
    role: pick(m.role) || '',
    dept: [m.faculty, m.graduation_year].filter(Boolean).join(' · '),
    img: m.photo || '',
    email: m.email || '',
    linkedin: m.linkedin || '',
    github: m.github || '',
  }));

  const contactItems = [
    { icon: <FiMail />, title: t('about.contact.emailTitle'), detail: 'it.director@kpu.edu.af' },
    { icon: <FiPhone />, title: t('about.contact.phoneTitle'), detail: '+93 20 252 6364' },
    { icon: <FiMapPin />, title: t('about.contact.addressTitle'), detail: t('about.contact.addressDetail') },
    { icon: <FiBookOpen />, title: t('about.contact.transcriptsTitle'), detail: 'transcript@kpu.edu.af' },
  ];

  return (
    <Layout>

      {/* ═══ HERO (dynamic banner / slider) ══════════════════════════ */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <HeroBackground page="about" fallbackImage="/kpu1.jpg"
          overlay="linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.82) 100%)" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white/90">
            <FiAward className="text-white/70" />
            {hero.badge || t('about.hero.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5 max-w-4xl">
            {hero.title || t('about.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            {hero.subtitle || t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* ═══ MISSION / VISION / PROMISE ═════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label={t('about.whoWeAre.label')}
            title={t('about.whoWeAre.title')}
            subtitle={t('about.whoWeAre.subtitle')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <FiTarget />, title: t('about.whoWeAre.missionTitle'), body: t('about.whoWeAre.missionBody') },
              { icon: <FiGlobe />, title: t('about.whoWeAre.visionTitle'), body: t('about.whoWeAre.visionBody') },
              { icon: <FiStar />, title: t('about.whoWeAre.promiseTitle'), body: t('about.whoWeAre.promiseBody') },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-base"
                  style={{ background: BRAND_BG, color: BRAND }}>
                  {c.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CORE VALUES ═══════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50/70">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label={t('about.values.label')}
            title={t('about.values.title')}
            subtitle={t('about.values.subtitle')}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 text-sm text-white"
                  style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})` }}>
                  {v.icon}
                </div>
                <h4 className="text-xs font-bold text-gray-900 mb-1">{v.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ══════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            label={t('about.timeline.label')}
            title={t('about.timeline.title')}
            subtitle={t('about.timeline.subtitle')}
          />

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px" style={{ background: BRAND_BORDER }} />

            {timeline.map((item, i) => (
              <div key={i} className={`relative flex items-start gap-4 mb-6 last:mb-0 md:items-center ${
                i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : 'md:flex-row'
              }`}>
                <div className="flex-1 pl-10 md:pl-0 md:px-6">
                  <div className="inline-block bg-white border border-gray-100 rounded-lg p-3.5 text-left md:max-w-sm shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: BRAND }}>
                      {item.year}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow z-10"
                  style={{ background: BRAND }} />

                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHANCELLOR'S MESSAGE ══════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50/70">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            label={t('about.chancellor.label')}
            title={t('about.chancellor.title')}
            subtitle={t('about.chancellor.subtitle')}
          />

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <div className="flex items-start gap-4">
              {/* Small circular photo */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2"
                  style={{ borderColor: BRAND_BORDER }}>
                  <img src={chPhoto} alt={chName} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow"
                  style={{ background: BRAND }}>
                  <FiAward className="text-white text-[9px]" />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <blockquote className="text-gray-600 text-xs sm:text-sm leading-relaxed italic font-light mb-3">
                  "{chQuote}"
                </blockquote>
                <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-gray-100">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{chName}</p>
                    <p className="text-[10px] text-gray-500">{chRole}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {chEmail && (
                      <a href={`mailto:${chEmail}`}
                        className="w-6 h-6 rounded flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        style={{ background: BRAND_BG, color: BRAND }}>
                        <FiMail className="text-[10px]" />
                      </a>
                    )}
                    {chGithub && (
                      <a href={chGithub} target="_blank" rel="noopener noreferrer"
                        className="w-6 h-6 rounded flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        style={{ background: BRAND_BG, color: BRAND }}>
                        <FiGithub className="text-[10px]" />
                      </a>
                    )}
                    {chLinkedin && (
                      <a href={chLinkedin} target="_blank" rel="noopener noreferrer"
                        className="w-6 h-6 rounded flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        style={{ background: BRAND_BG, color: BRAND }}>
                        <FiLinkedin className="text-[10px]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LEADERSHIP BOARD — real data only; skeleton while loading, hidden if empty ══ */}
      {(!loaded || boardMembers.length > 0) && (
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label={t('about.board.label')}
            title={t('about.board.title')}
            subtitle={t('about.board.subtitle')}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!loaded ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full mb-3 bg-gray-200 animate-pulse" />
                  <div className="h-4 w-28 mx-auto rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-20 mx-auto rounded bg-gray-200 animate-pulse mt-2" />
                  <div className="h-2.5 w-16 mx-auto rounded bg-gray-200 animate-pulse mt-2" />
                </div>
              ))
            ) : (
              boardMembers.map((m, i) => (
                <div key={m.name || i} className="bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all p-5 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 mb-3 flex items-center justify-center bg-gray-100"
                    style={{ borderColor: BRAND_BORDER }}>
                    {m.img ? (
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <FiUser className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{m.name}</h3>
                  <p className="text-xs font-semibold line-clamp-1 mt-1" style={{ color: BRAND }}>{m.role}</p>
                  {m.dept && <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">{m.dept}</p>}
                  <div className="flex justify-center gap-1.5 mt-3">
                    {m.github && (
                      <a href={m.github} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        style={{ background: BRAND_BG, color: BRAND }}>
                        <FiGithub className="text-xs" />
                      </a>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        style={{ background: BRAND_BG, color: BRAND }}>
                        <FiLinkedin className="text-xs" />
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 transition cursor-pointer"
                        style={{ background: BRAND_BG, color: BRAND }}>
                        <FiMail className="text-xs" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      )}

      {/* ═══ CONTACT + CTA ═════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50/70">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label={t('about.contact.label')}
            title={t('about.contact.title')}
            subtitle={t('about.contact.subtitle')}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {contactItems.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 text-sm"
                  style={{ background: BRAND_BG, color: BRAND }}>
                  {c.icon}
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">{c.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed break-words">{c.detail}</p>
              </div>
            ))}
          </div>

          {/* Single combined CTA — hidden for logged-in alumni */}
          {!isLoggedIn && (
            <div className="rounded-2xl overflow-hidden p-8 text-center" style={{ background: BRAND_DARK }}>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
                {t('about.contact.ctaTitle')}
              </h3>
              <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">
                {t('about.contact.ctaSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link to="/register" className="px-5 py-2.5 bg-white font-semibold text-xs rounded-lg hover:bg-gray-50 transition inline-flex items-center justify-center gap-1.5"
                  style={{ color: BRAND_DARK }}>
                  {t('about.contact.ctaCreate')} <FiArrowRight className="text-xs" />
                </Link>
                <Link to="/contact" className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold text-xs rounded-lg hover:bg-white/15 transition inline-flex items-center justify-center gap-1.5">
                  {t('about.contact.ctaContact')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

    </Layout>
  );
};

export default AboutPage;
