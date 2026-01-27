import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin, FiVideo, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiMail } from 'react-icons/fi';

const EventsPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const events = [
    {
      id: 1,
      title: "Future of Civil Engineering in Afghanistan",
      date: "MAY 15",
      time: "10:00 AM - 02:00 PM",
      location: "KPU Main Hall, Kabul",
      type: "Workshop",
      typeColor: "bg-primary",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0dUWcNiyn3vjWhg_aU4GGrZNqP2W7qXonUCX8rAV7Gq9g2s6NM7WWoULwrrII12ZgCOatOWePZ4jVn2wMvlBYTnjBTRQPnKT4buVUSMNE9rXaedHzziBWP-gwivhk4GjxDhxwZwin8JRgOSdkzQiKVMuzBYCwza_ILhJqG97kkZ8cp6QpmDwplHbO_kcoO-gqpqFG6--UJylVHImpf-_lY0uiqwxpfNqqBu0liHQFMD4WTF2yxXM3tHj2WXthfJAVQokhVRxKte9B"
    },
    {
      id: 2,
      title: "Global Career Paths for KPU Alumni",
      date: "MAY 28",
      time: "04:00 PM (GMT+4:30)",
      location: "Online via Zoom",
      type: "Webinar",
      typeColor: "bg-purple-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAAbWZJAPyiSzYoUOzTpK228PZtXdYewafrx7Y5zY8sWeNnPkD13g9CBkJErGcgSoYkb8xdVzs2ZJpJziOUGCD-uNECvpx5VUbQ8PpIn2DwMnJBiL6kmzInT9rn73W64K-PiyGbX9bRobs0tR6kWW8QRBfRrhfI1mppU1oTP5tDs0_rAyLhH1p03kRz1toTyOIMJ4UFiZZ2YX5hgWo0WwjTEkBTbN5PJ7iiNTVpwPJKg8EaiDVOX8mJVyzhjgktsAPSVBYZzw8mMlj"
    },
    {
      id: 3,
      title: "Alumni Sports Meet: Football Final",
      date: "JUN 05",
      time: "08:00 AM - 12:00 PM",
      location: "KPU Sports Complex",
      type: "Sports",
      typeColor: "bg-green-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpRERhD7Pe6Xw_w9Y3Di452nbjUm5qvhHTppYgtVgfJonvgbV-FaGLgspCUUqikD5OEdh6KxFpOnXN2__l_5_5eLO2TjNfn8NWi65krWP8RTpMIHOxT6gkcq5vcd97tDJOYPnqK87_gHSS2VuXf49Whci3zM_K7AUOXvC2etxKCeP5poLFwTyofUrOg1GT-8SgI3l2OWbIqYSsBUPqomSIimlci7pi2oaDCeUDrIthesrNjic1YsImS8ZXMwfHiZpAPbAuyokFyZX"
    },
    {
      id: 4,
      title: "Class of 2014: 10th Year Reunion",
      date: "JUN 12",
      time: "07:00 PM Onwards",
      location: "Serena Hotel, Kabul",
      type: "Reunion",
      typeColor: "bg-orange-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4fcqyrHLNTeKVN1yfBP5M70AzhKLfw5RYBl4Ng0vpDTOy2JeNpPH8EvLMVTWLX3oY0ZX8DrDtaMuLwEn6lKJSLx3feN3XtSiLocQ8B8tO-ry-q-ZIeopp7_UOv3tHBCEnLHafxrR2zwdsRBFXAuHNJ3wrWjNZPUFKXKhENUatG3HDQ-sbWP8hxKdVx_2wF-R3kb9jIGOubiWsCLzPuWsfuoOgiSbm4wLHdZlfuvBd3S3tIdelUWeRVypwqnlDCaHnyZ8eMc0n6V4a"
    }
  ];

  const categories = [
    { name: "Reunions", count: 12 },
    { name: "Workshops", count: 8 },
    { name: "Webinars", count: 24 },
    { name: "Sports", count: 5 },
    { name: "Career Fairs", count: 3 }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
        {/* Dark background using system colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark to-primary/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-lines.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-8">
              {/* Featured badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-sm font-semibold w-fit border border-white/10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-lg"></span>
                </span>
                Featured Event
                <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">LIVE</span>
              </div>
              
              {/* Main title */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
                  Annual KPU Alumni
                  <span className="block text-primary">
                    Gala 2024
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl">
                  Join us for an unforgettable evening of celebration, networking, and honoring the achievements of our global alumni community in Kabul.
                </p>
              </div>

              {/* Enhanced countdown */}
              <div className="space-y-4">
                <p className="text-white/70 font-medium">Event starts in:</p>
                <div className="flex flex-wrap gap-4">
                  <div className="countdown-item hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <span className="text-3xl lg:text-4xl font-bold text-white">12</span>
                    <span className="text-xs uppercase font-bold text-white/60 tracking-wider">Days</span>
                  </div>
                  <div className="countdown-item hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <span className="text-3xl lg:text-4xl font-bold text-white">08</span>
                    <span className="text-xs uppercase font-bold text-white/60 tracking-wider">Hours</span>
                  </div>
                  <div className="countdown-item hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <span className="text-3xl lg:text-4xl font-bold text-white">45</span>
                    <span className="text-xs uppercase font-bold text-white/60 tracking-wider">Mins</span>
                  </div>
                  <div className="countdown-item hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <span className="text-3xl lg:text-4xl font-bold text-white">19</span>
                    <span className="text-xs uppercase font-bold text-white/60 tracking-wider">Secs</span>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group relative px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-xl transform hover:scale-105">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Register Now
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button className="group px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm">
                  <span className="flex items-center gap-2">
                    Event Details
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Event info badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg text-white/70 text-sm border border-white/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Dec 15, 2024
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg text-white/70 text-sm border border-white/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Serena Hotel, Kabul
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-lg text-white/70 text-sm border border-white/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  500+ Attendees
                </div>
              </div>
            </div>

            {/* Right Content - Enhanced Image */}
            <div className="hidden lg:block relative">
              {/* Dark glowing background effect */}
              <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-3xl"></div>
              
              {/* Main image container */}
              <div className="relative group">
                {/* Image frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 backdrop-blur-sm transform transition-all duration-500 group-hover:scale-105">
                  <img 
                    alt="KPU Alumni Gala" 
                    className="w-full h-auto object-cover aspect-video" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC126DAr5Qw0O932Pa0F2On4dslt3MWS_V3gpBn1Cz1NZ_N-2Y8VlOccwUzND9fm-7ViMYqM4C-LVI6nNrm2H513MmA-nFftbknCRJFqpNzWrXsiDtLBnBgYspv_2CFnttuHxcWL6eSjmZQAEAQc7DBvevDehS-7A-AftbR6VoGfIqdukQ-RRORDocSbRBEtViltUH9cCoFPYOKxUqX0K1I8AFEI4UKSg3-Fu7nvlG-ZwZBxZiMInQ-Bl8B6-yJmvkmA45zu8he7T3B"
                  />
                  
                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Floating badges */}
                  <div className="absolute top-6 left-6 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                    🔴 LIVE
                  </div>
                  <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold shadow-lg border border-white/20">
                    Featured
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-8">
              {/* View Toggle */}
              <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-[#f0f1f4] dark:border-slate-800 flex shadow-sm">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white' 
                      : 'text-[#636c88] dark:text-slate-400 hover:bg-[#f0f1f4] dark:hover:bg-slate-800'
                  }`}
                >
                  <FiCalendar className="text-[18px]" />
                  List View
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                    viewMode === 'calendar' 
                      ? 'bg-primary text-white' 
                      : 'text-[#636c88] dark:text-slate-400 hover:bg-[#f0f1f4] dark:hover:bg-slate-800'
                  }`}
                >
                  <FiCalendar className="text-[18px]" />
                  Calendar
                </button>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-6 bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-[#f0f1f4] dark:border-slate-800 shadow-sm">
                <div>
                  <h2 className="text-[#111318] dark:text-white text-lg font-bold">Popular Categories</h2>
                  <p className="text-[#636c88] dark:text-slate-400 text-sm">Browse by event type</p>
                </div>
                <div className="flex flex-col gap-2">
                  {categories.map((category, index) => (
                    <a key={index} className="flex items-center justify-between group" href="#">
                      <span className="text-sm font-medium text-[#636c88] dark:text-slate-300 group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                      <span className="px-2 py-0.5 bg-[#f0f1f4] dark:bg-slate-800 rounded text-[10px] font-bold">
                        {category.count}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-xl flex flex-col gap-4">
                <FiMail className="text-primary text-3xl" />
                <h3 className="font-bold text-[#111318] dark:text-white">Stay Updated</h3>
                <p className="text-sm text-[#636c88] dark:text-slate-400 leading-relaxed">
                  Get the latest event invitations directly in your inbox.
                </p>
                <input 
                  className="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="Email address" 
                  type="email"
                />
                <button className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>

          {/* Events List */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-slate-900 border border-[#f0f1f4] dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-sm">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 bg-[#f8f9fb] dark:bg-slate-800 text-sm focus:ring-primary" 
                  placeholder="Search events..." 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select 
                  className="form-select text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-w-[140px] focus:ring-primary"
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="reunions">Reunions</option>
                  <option value="workshops">Workshops</option>
                  <option value="webinars">Webinars</option>
                </select>
                <input 
                  className="form-input text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary" 
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#111318] dark:text-white">Upcoming Events</h2>
              <div className="text-sm text-[#636c88] dark:text-slate-400">
                Sort by: <span className="text-primary font-bold cursor-pointer">Date Ascending</span>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white dark:bg-slate-900 border border-[#f0f1f4] dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={event.image}
                    />
                    <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg flex flex-col items-center shadow-lg">
                      <span className="text-primary font-bold text-sm">{event.date.split(' ')[0]}</span>
                      <span className="text-lg font-bold leading-none">{event.date.split(' ')[1]}</span>
                    </div>
                    <div className={`absolute bottom-4 right-4 ${event.typeColor}/90 text-white px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm`}>
                      {event.type}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                        <FiClock className="text-[16px]" />
                        {event.time}
                      </div>
                      <h3 className="text-lg font-bold text-[#111318] dark:text-white group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[#636c88] dark:text-slate-400 text-sm">
                        {event.location.includes('Online') ? (
                          <FiVideo className="text-[16px]" />
                        ) : (
                          <FiMapPin className="text-[16px]" />
                        )}
                        {event.location}
                      </div>
                    </div>
                    <button className="w-full bg-[#f0f1f4] dark:bg-slate-800 text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-6 border-t border-[#f0f1f4] dark:border-slate-800 mt-4">
              <p className="text-sm text-[#636c88] dark:text-slate-400">
                Showing <span className="font-bold text-[#111318] dark:text-white">12</span> of 38 events
              </p>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#f0f1f4] dark:border-slate-800 hover:bg-[#f0f1f4] dark:hover:bg-slate-800 text-[#111318] dark:text-white">
                  <FiChevronLeft />
                </button>
                <button className="flex h-10 px-4 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">1</button>
                <button className="flex h-10 px-4 items-center justify-center rounded-lg hover:bg-[#f0f1f4] dark:hover:bg-slate-800 text-[#111318] dark:text-white font-bold text-sm">2</button>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#f0f1f4] dark:border-slate-800 hover:bg-[#f0f1f4] dark:hover:bg-slate-800 text-[#111318] dark:text-white">
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </Layout>
  );
};

export default EventsPage;
