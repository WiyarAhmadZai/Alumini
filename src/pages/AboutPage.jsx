import React from 'react';
import Layout from '../components/Layout';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiAward, FiUsers, FiTarget, FiGlobe, FiArrowRight } from 'react-icons/fi';

const BRAND = '#194ce6';
const BRAND_DARK = '#1340c4';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const SectionLabel = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border mb-4"
    style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
    {children}
  </div>
);

const SectionHeading = ({ label, title, subtitle }) => (
  <div className="text-center mb-12">
    <SectionLabel>{label}</SectionLabel>
    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{title}</h2>
    {subtitle && <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">{subtitle}</p>}
    <div className="w-12 h-1 mx-auto mt-5 rounded-full" style={{ background: BRAND }} />
  </div>
);

const boardMembers = [
  {
    name: 'Eng. Mohammad Hassan',
    role: 'President',
    dept: 'Civil Engineering, Class of 1995',
    img: '/1teacher.jpg',
  },
  {
    name: 'Dr. Sarah Ahmadzai',
    role: 'Vice President',
    dept: 'Electrical Engineering, Class of 2000',
    img: '/teacher.jpg',
  },
  {
    name: 'Ahmad Wali Karimi',
    role: 'Secretary',
    dept: 'Mechanical Engineering, Class of 2008',
    img: '/depositphotos_229021826-stock-photo-focused-male-teacher-formal-wear.jpg',
  },
  {
    name: 'Fatima Noori',
    role: 'Treasurer',
    dept: 'Computer Engineering, Class of 2012',
    img: '/depositphotos_85627224-stock-photo-civil-engineer-on-blackboard.jpg',
  },
];

const contactItems = [
  {
    icon: <FiMail />,
    title: 'Email',
    detail: 'it.director@kpu.edu.af',
    cta: 'Send Message',
  },
  {
    icon: <FiPhone />,
    title: 'Phone',
    detail: '0202526364',
    cta: 'Call Now',
  },
  {
    icon: <FiMapPin />,
    title: 'Address',
    detail: 'Kabul Polytechnic University\nKabul, Afghanistan',
    cta: 'Get Directions',
  },
  {
    icon: <FiMail />,
    title: 'Transcript & Diploma Services',
    detail: 'transcript@kpu.edu.af',
    cta: 'Request Documents',
  },
];

const AboutPage = () => {
  return (
    <Layout>

      {/* ── Hero ── */}
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

      {/* ── Mission & History ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f6f8]">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label="Who We Are" title="Our Foundation" subtitle="The principles and journey that guide our alumni community" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
              <div className="h-1 w-full" style={{ background: BRAND }} />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND_BG }}>
                    <FiTarget className="text-xl" style={{ color: BRAND }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                  <p>To create a vibrant network of Kabul Polytechnic University alumni, fostering professional development, knowledge sharing, and collaborative opportunities that contribute to the advancement of our members and the engineering community in Afghanistan and beyond.</p>
                  <p>We strive to maintain strong connections between graduates and the university, facilitating mentorship, career opportunities, and continuous learning while celebrating the achievements of our alumni community.</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold transition-colors" style={{ color: BRAND }}>
                  Learn more about our mission <FiArrowRight />
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
              <div className="h-1 w-full" style={{ background: BRAND }} />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND_BG }}>
                    <FiGlobe className="text-xl" style={{ color: BRAND }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our History</h3>
                </div>
                <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                  <p>Founded in 2010, the KPU Alumni Association began as a small initiative by dedicated graduates who recognized the need for a structured network to connect Kabul Polytechnic University alumni across various engineering disciplines and geographical locations.</p>
                  <p>Over the past decade, we have grown from a handful of members to a thriving community of over 5,000 alumni, establishing chapters in major cities and organizing numerous events that bring our community together.</p>
                  <p>Today, we stand as a testament to the excellence of KPU's engineering education and the remarkable achievements of our graduates.</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold transition-colors" style={{ color: BRAND }}>
                  Explore our journey <FiArrowRight />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chancellor Message ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label="Leadership" title="Chancellor's Message" subtitle="Words of wisdom from our esteemed Chancellor" />

          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
                {/* Photo */}
                <div className="flex-shrink-0 relative">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-md border-4 border-white"
                    style={{ outline: `3px solid ${BRAND_BORDER}` }}>
                    <img src="/chanceler.jpg" alt="Dr. Ahmad Zia Massoud" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    style={{ background: BRAND }}>
                    <FiAward className="text-white text-sm" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 text-center lg:text-left">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
                    style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
                    Chancellor's Vision
                  </span>
                  <blockquote className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 italic">
                    "The KPU Alumni Association represents the pride of our institution. Our graduates continue to make significant contributions to Afghanistan's development, and this association serves as a bridge between our past achievements and future aspirations. I encourage all alumni to actively participate in this vibrant community."
                  </blockquote>
                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">Dr. Ahmad Zia Massoud</p>
                      <p className="text-sm text-gray-500">Chancellor, Kabul Polytechnic University</p>
                    </div>
                    <div className="flex gap-2 sm:ml-auto">
                      <button className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
                        style={{ background: BRAND_BG, borderColor: BRAND_BORDER, color: BRAND }}>
                        <FiMail className="text-sm" />
                      </button>
                      <button className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
                        style={{ background: BRAND_BG, borderColor: BRAND_BORDER, color: BRAND }}>
                        <FiLinkedin className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-3.5 flex items-center justify-between text-sm" style={{ background: BRAND }}>
              <span className="text-white/80 font-medium">Leading Excellence in Engineering Education Since 2010</span>
              <button className="flex items-center gap-1 text-white/80 hover:text-white transition-colors font-medium">
                Read Full Message <FiArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f6f8]">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label="The Board" title="Leadership Team" subtitle="Dedicated leaders guiding our alumni community" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardMembers.map((m) => (
              <div key={m.name}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-1 w-full" style={{ background: BRAND }} />
                <div className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-md border-4 border-white group-hover:scale-105 transition-transform"
                    style={{ outline: `2px solid ${BRAND_BORDER}` }}>
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{m.name}</h3>
                  <div className="w-8 h-0.5 mx-auto mb-2 rounded-full" style={{ background: BRAND }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: BRAND }}>{m.role}</p>
                  <p className="text-xs text-gray-400 mb-4">{m.dept}</p>
                  <div className="flex justify-center gap-2">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
                      style={{ background: BRAND_BG, borderColor: BRAND_BORDER, color: BRAND }}>
                      <FiLinkedin className="text-xs" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors"
                      style={{ background: BRAND_BG, borderColor: BRAND_BORDER, color: BRAND }}>
                      <FiMail className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-x divide-gray-100">
              {[
                { value: '15+', label: 'Years Combined Experience' },
                { value: '4', label: 'Engineering Disciplines' },
                { value: '100+', label: 'Projects Led' },
                { value: '50+', label: 'Awards & Recognitions' },
              ].map((s) => (
                <div key={s.label} className="px-4">
                  <div className="text-2xl font-extrabold mb-1" style={{ color: BRAND }}>{s.value}</div>
                  <div className="text-xs text-gray-500 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: BRAND }}>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 bg-white/15 border border-white/20">
            <FiUsers className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to reconnect with your alma mater?
          </h2>
          <p className="text-lg text-white/75 leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of KPU graduates who are already making a difference through our alumni network —
            mentor students, find opportunities, and stay connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-3.5 bg-white font-bold text-sm sm:text-base rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style={{ color: BRAND }}>
              Join Alumni Network
              <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="group px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold text-sm sm:text-base rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Learn More
              <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label="Reach Us" title="Get in Touch" subtitle="We'd love to hear from you" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactItems.map((c) => (
              <div key={c.title}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                  style={{ background: BRAND_BG, borderColor: BRAND_BORDER, color: BRAND }}>
                  {c.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 whitespace-pre-line">{c.detail}</p>
                <button className="inline-flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: BRAND }}>
                  {c.cta} <FiArrowRight className="text-[10px]" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-8 sm:p-10 text-center" style={{ background: BRAND }}>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Have Questions?</h3>
            <p className="text-white/75 mb-7 max-w-xl mx-auto text-sm sm:text-base">
              Our team is here to help you with any inquiries about membership, events, or opportunities.
            </p>
            <button className="px-7 py-3 bg-white font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-md hover:-translate-y-0.5"
              style={{ color: BRAND }}>
              Contact Support Team
            </button>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default AboutPage;
