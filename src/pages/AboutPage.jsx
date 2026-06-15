import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  FiMail, FiPhone, FiMapPin, FiLinkedin, FiAward, FiUsers, FiTarget, FiGlobe,
  FiArrowRight, FiBookOpen, FiTrendingUp, FiHeart, FiStar, FiZap
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

  const boardMembers = [
    { name: 'Eng. Mohammad Hassan', role: t('about.board.presidentRole'), dept: 'Civil · 1995', img: '/1teacher.jpg' },
    { name: 'Dr. Sarah Ahmadzai', role: t('about.board.vicePresidentRole'), dept: 'Electrical · 2000', img: '/teacher.jpg' },
    { name: 'Ahmad Wali Karimi', role: t('about.board.secretaryRole'), dept: 'Mechanical · 2008', img: '/depositphotos_229021826-stock-photo-focused-male-teacher-formal-wear.jpg' },
    { name: 'Fatima Noori', role: t('about.board.treasurerRole'), dept: 'Computer · 2012', img: '/depositphotos_85627224-stock-photo-civil-engineer-on-blackboard.jpg' },
  ];

  const contactItems = [
    { icon: <FiMail />, title: t('about.contact.emailTitle'), detail: 'it.director@kpu.edu.af' },
    { icon: <FiPhone />, title: t('about.contact.phoneTitle'), detail: '+93 20 252 6364' },
    { icon: <FiMapPin />, title: t('about.contact.addressTitle'), detail: t('about.contact.addressDetail') },
    { icon: <FiBookOpen />, title: t('about.contact.transcriptsTitle'), detail: 'transcript@kpu.edu.af' },
  ];

  return (
    <Layout>

      {/* ═══ HERO (original, simple) ══════════════════════════ */}
      <section className="relative h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.82) 100%), url("/kpu1.jpg")' }}>
        <div className="h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white/90">
            <FiAward className="text-white/70" />
            {t('about.hero.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5 max-w-4xl">
            {t('about.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            {t('about.hero.subtitle')}
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
                  <img src="/chanceler.jpg" alt={t('about.chancellor.name')} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow"
                  style={{ background: BRAND }}>
                  <FiAward className="text-white text-[9px]" />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <blockquote className="text-gray-600 text-xs sm:text-sm leading-relaxed italic font-light mb-3">
                  "{t('about.chancellor.quote')}"
                </blockquote>
                <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-gray-100">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{t('about.chancellor.name')}</p>
                    <p className="text-[10px] text-gray-500">{t('about.chancellor.role')}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="w-6 h-6 rounded flex items-center justify-center hover:opacity-80 transition"
                      style={{ background: BRAND_BG, color: BRAND }}>
                      <FiMail className="text-[10px]" />
                    </button>
                    <button className="w-6 h-6 rounded flex items-center justify-center hover:opacity-80 transition"
                      style={{ background: BRAND_BG, color: BRAND }}>
                      <FiLinkedin className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LEADERSHIP BOARD ══════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label={t('about.board.label')}
            title={t('about.board.title')}
            subtitle={t('about.board.subtitle')}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {boardMembers.map((m) => (
              <div key={m.name} className="bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all p-3 text-center">
                <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 mb-2"
                  style={{ borderColor: BRAND_BORDER }}>
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{m.name}</h3>
                <p className="text-[10px] font-semibold line-clamp-1 mt-0.5" style={{ color: BRAND }}>{m.role}</p>
                <p className="text-[9px] text-gray-400 line-clamp-1 mt-0.5">{m.dept}</p>
                <div className="flex justify-center gap-1 mt-2">
                  <button className="w-5 h-5 rounded flex items-center justify-center hover:opacity-80 transition"
                    style={{ background: BRAND_BG, color: BRAND }}>
                    <FiLinkedin className="text-[9px]" />
                  </button>
                  <button className="w-5 h-5 rounded flex items-center justify-center hover:opacity-80 transition"
                    style={{ background: BRAND_BG, color: BRAND }}>
                    <FiMail className="text-[9px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Compact stats row */}
          <div className="mt-8 rounded-xl border border-gray-100 grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100 bg-white">
            {[
              { value: '15+', label: t('about.board.statYears') },
              { value: '8', label: t('about.board.statDisciplines') },
              { value: '100+', label: t('about.board.statProjects') },
              { value: '50+', label: t('about.board.statAwards') },
            ].map((s, i) => (
              <div key={i} className="px-3 py-4 text-center">
                <div className="text-xl font-extrabold mb-0.5" style={{ color: BRAND_DARK }}>{s.value}</div>
                <div className="text-[10px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

          {/* Single combined CTA */}
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
        </div>
      </section>

    </Layout>
  );
};

export default AboutPage;
