import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, FiNavigation, FiCalendar, FiBriefcase, FiUser, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import messageService from '../services/messageService';

// ─── Brand palette ──────────────────────────────────────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

const ContactPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
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
        title: 'Login Required',
        text: 'Please login to send a message.',
        icon: 'warning',
        confirmButtonColor: BRAND,
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) window.location.href = '/login';
      });
      return;
    }

    if (!formData.message.trim()) {
      Swal.fire({ title: 'Validation Error', text: 'Please enter your message.', icon: 'error', confirmButtonColor: BRAND });
      return;
    }

    try {
      setLoading(true);
      await messageService.sendMessage({ subject: formData.subject, message: formData.message });
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'We will respond to you soon.',
        confirmButtonColor: BRAND,
        timer: 3000,
        timerProgressBar: true
      });
      setFormData(prev => ({ ...prev, message: '' }));
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send message. Please try again.', confirmButtonColor: '#dc2626' });
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: <FiMail />, title: 'Email Us', detail: 'it.director@kpu.edu.af', cta: 'Send Email', href: 'mailto:it.director@kpu.edu.af' },
    { icon: <FiPhone />, title: 'Call Us', detail: '+93 20 252 6364', cta: 'Call Now', href: 'tel:0202526364' },
    { icon: <FiMapPin />, title: 'Visit Us', detail: 'KPU Campus, Kabul, Afghanistan', cta: 'Get Directions', href: 'https://maps.google.com/?q=Kabul+Polytechnic+University' },
    { icon: <FiBookOpen />, title: 'Transcripts', detail: 'transcript@kpu.edu.af', cta: 'Request', href: 'mailto:transcript@kpu.edu.af' },
  ];

  const quickLinks = [
    { icon: <FiUsers />, title: 'About Us', desc: 'Our mission and history', href: '/about' },
    { icon: <FiCalendar />, title: 'Events', desc: 'Upcoming alumni events', href: '/events' },
    { icon: <FiUser />, title: 'Mentorship', desc: 'Join our program', href: '/mentorship' },
    { icon: <FiBriefcase />, title: 'Jobs', desc: 'Career opportunities', href: '/jobs' },
  ];

  return (
    <Layout>
      {/* ═══ HERO (dark overlay with image) ═════════════════════ */}
      <section className="relative h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.60) 100%), url("/kpu5.jpg")' }}>
        <div className="h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-white/90">
            <FiMessageSquare className="text-white/70" />
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5 max-w-4xl">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
            Reach out to the KPU Alumni Association — we're here to help.
          </p>
        </div>
      </section>

      {/* ═══ CONTACT CARDS ═════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border mb-3"
              style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
              Reach Us
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Multiple Ways to Connect
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Choose the channel that works best for you.
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
              Send a Message
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              We'd Love to Hear From You
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Questions about membership, events, or opportunities? Drop us a message.
            </p>
            <div className="w-10 h-0.5 mx-auto mt-4 rounded-full" style={{ background: BRAND }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Form — takes 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">First Name</label>
                    <input
                      type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="John"
                      disabled={!!user?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Last Name</label>
                    <input
                      type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Doe"
                      disabled={!!user?.last_name}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="john.doe@example.com"
                    disabled={!!user?.email}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Subject</label>
                  <input
                    type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all"
                    placeholder="Enter subject..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleInputChange} rows="5"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 focus:ring-2" style={{ accentColor: BRAND }} />
                    <span className="ml-2 text-xs text-gray-600">Subscribe to newsletter</span>
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="text-xs" />
                        Send Message
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
                  title="KPU Map"
                ></iframe>
                <div className="p-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <FiMapPin className="text-xs" style={{ color: BRAND }} />
                    Kabul Polytechnic University
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Kabul, Afghanistan</p>
                </div>
              </div>

              {/* Hours card */}
              <div className="rounded-xl p-5" style={{ background: BRAND_DARK }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-white/10 border border-white/20">
                  <FiAward className="text-white text-sm" />
                </div>
                <h4 className="text-white text-sm font-bold mb-2">Office Hours</h4>
                <div className="space-y-1 text-[11px] text-white/70">
                  <div className="flex justify-between"><span>Mon – Thu</span><span className="text-white/90">8:00 AM – 4:00 PM</span></div>
                  <div className="flex justify-between"><span>Friday</span><span className="text-white/90">8:00 AM – 12:00 PM</span></div>
                  <div className="flex justify-between"><span>Sat – Sun</span><span className="text-white/90">Closed</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-white/60">
                  Response within 24–48 hours
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
              Explore More
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Quick Links
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Useful shortcuts to help you navigate the alumni experience.
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
