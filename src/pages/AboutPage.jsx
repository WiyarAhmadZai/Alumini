import React from 'react';
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

// ─── Data ───────────────────────────────────────────────────────
const values = [
  { icon: <FiHeart />, title: 'Integrity', desc: 'Honest, ethical conduct in every interaction.' },
  { icon: <FiTrendingUp />, title: 'Excellence', desc: 'The highest standards in education & leadership.' },
  { icon: <FiUsers />, title: 'Community', desc: 'Lifelong bonds between graduates and our university.' },
  { icon: <FiZap />, title: 'Innovation', desc: 'Driving progress through technology and creativity.' },
];

const timeline = [
  { year: '1951', title: 'KPU Founded', desc: 'Kabul Polytechnic University opens its doors.' },
  { year: '2010', title: 'Alumni Association', desc: 'Graduates founded the alumni community.' },
  { year: '2018', title: 'Global Network', desc: 'Chapters in Europe, North America, and Asia.' },
  { year: '2024', title: 'Digital Platform', desc: 'Modern platform connecting 5,000+ alumni.' },
];

const boardMembers = [
  { name: 'Eng. Mohammad Hassan', role: 'President', dept: 'Civil · 1995', img: '/1teacher.jpg' },
  { name: 'Dr. Sarah Ahmadzai', role: 'Vice President', dept: 'Electrical · 2000', img: '/teacher.jpg' },
  { name: 'Ahmad Wali Karimi', role: 'Secretary', dept: 'Mechanical · 2008', img: '/depositphotos_229021826-stock-photo-focused-male-teacher-formal-wear.jpg' },
  { name: 'Fatima Noori', role: 'Treasurer', dept: 'Computer · 2012', img: '/depositphotos_85627224-stock-photo-civil-engineer-on-blackboard.jpg' },
];

const contactItems = [
  { icon: <FiMail />, title: 'Email', detail: 'it.director@kpu.edu.af' },
  { icon: <FiPhone />, title: 'Phone', detail: '+93 20 252 6364' },
  { icon: <FiMapPin />, title: 'Address', detail: 'KPU Campus, Kabul, Afghanistan' },
  { icon: <FiBookOpen />, title: 'Transcripts', detail: 'transcript@kpu.edu.af' },
];

// ─── Main Page ──────────────────────────────────────────────────
const AboutPage = () => {
  return (
    <Layout>

      {/* ═══ HERO (original, simple) ══════════════════════════ */}
      <section className="relative h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.82) 100%), url("/kpu1.jpg")' }}>
        <div className="h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white/90">
            <FiAward className="text-white/70" />
            Kabul Polytechnic University
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5 max-w-4xl">
            About KPU Alumni Association
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            Building lifelong connections and fostering professional growth for graduates worldwide.
          </p>
        </div>
      </section>

      {/* ═══ MISSION / VISION / PROMISE ═════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Who We Are"
            title="Built on Purpose"
            subtitle="The principles that guide every connection and opportunity in our community."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <FiTarget />, title: 'Our Mission', body: 'Nurture a vibrant, lifelong network of KPU graduates through professional development, knowledge sharing, and collaboration.' },
              { icon: <FiGlobe />, title: 'Our Vision', body: 'Become the most trusted alumni community in the region — a bridge between heritage and innovation.' },
              { icon: <FiStar />, title: 'Our Promise', body: 'Celebrate achievements, mentor the next generation, and contribute to the development of our nation.' },
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
            label="Our Values"
            title="The Pillars We Stand On"
            subtitle="Four core principles that guide everything we do."
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
            label="Our Journey"
            title="Milestones"
            subtitle="From a single campus in Kabul to a global network."
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
            label="Leadership"
            title="Chancellor's Message"
            subtitle="Words from our esteemed Chancellor."
          />

          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Photo */}
              <div className="md:col-span-2 relative h-56 md:h-auto">
                <img src="/chanceler.jpg" alt="Dr. Ahmad Zia Massoud" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <FiAward className="text-[10px]" style={{ color: BRAND }} />
                  <span className="text-[10px] font-bold" style={{ color: BRAND_DARK }}>Chancellor</span>
                </div>
              </div>

              {/* Text */}
              <div className="md:col-span-3 p-6">
                <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic font-light">
                  "The KPU Alumni Association represents the pride of our institution. Our graduates continue to make
                  significant contributions to Afghanistan's development, and this association serves as a bridge
                  between our past achievements and future aspirations."
                </blockquote>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Dr. Ahmad Zia Massoud</p>
                    <p className="text-[11px] text-gray-500">Chancellor, KPU</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 transition"
                      style={{ background: BRAND_BG, color: BRAND }}>
                      <FiMail className="text-xs" />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-80 transition"
                      style={{ background: BRAND_BG, color: BRAND }}>
                      <FiLinkedin className="text-xs" />
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
            label="Executive Board"
            title="Meet Our Leadership"
            subtitle="Distinguished graduates dedicated to our community."
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
              { value: '15+', label: 'Years Combined' },
              { value: '8', label: 'Disciplines' },
              { value: '100+', label: 'Projects Led' },
              { value: '50+', label: 'Awards' },
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
            label="Connect"
            title="Get in Touch"
            subtitle="Our team is here to help with membership, events, and opportunities."
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
              Ready to reconnect?
            </h3>
            <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">
              Join thousands of KPU graduates shaping Afghanistan's future.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link to="/register" className="px-5 py-2.5 bg-white font-semibold text-xs rounded-lg hover:bg-gray-50 transition inline-flex items-center justify-center gap-1.5"
                style={{ color: BRAND_DARK }}>
                Create Profile <FiArrowRight className="text-xs" />
              </Link>
              <Link to="/contact" className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold text-xs rounded-lg hover:bg-white/15 transition inline-flex items-center justify-center gap-1.5">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default AboutPage;
