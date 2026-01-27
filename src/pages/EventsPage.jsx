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
      typeColor: "bg-blue-600",
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
    },
    {
      id: 5,
      title: "Tech Innovation Summit 2024",
      date: "JUN 20",
      time: "09:00 AM - 06:00 PM",
      location: "KPU Conference Center",
      type: "Workshop",
      typeColor: "bg-blue-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0dUWcNiyn3vjWhg_aU4GGrZNqP2W7qXonUCX8rAV7Gq9g2s6NM7WWoULwrrII12ZgCOatOWePZ4jVn2wMvlBYTnjBTRQPnKT4buVUSMNE9rXaedHzziBWP-gwivhk4GjxDhxwZwin8JRgOSdkzQiKVMuzBYCwza_ILhJqG97kkZ8cp6QpmDwplHbO_kcoO-gqpqFG6--UJylVHImpf-_lY0uiqwxpfNqqBu0liHQFMD4WTF2yxXM3tHj2WXthfJAVQokhVRxKte9B"
    },
    {
      id: 6,
      title: "Alumni Networking Night",
      date: "JUN 25",
      time: "06:00 PM - 09:00 PM",
      location: "KPU Alumni Center",
      type: "Reunion",
      typeColor: "bg-orange-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4fcqyrHLNTeKVN1yfBP5M70AzhKLfw5RYBl4Ng0vpDTOy2JeNpPH8EvLMVTWLX3oY0ZX8DrDtaMuLwEn6lKJSLx3feN3XtSiLocQ8B8tO-ry-q-ZIeopp7_UOv3tHBCEnLHafxrR2zwdsRBFXAuHNJ3wrWjNZPUFKXKhENUatG3HDQ-sbWP8hxKdVx_2wF-R3kb9jIGOubiWsCLzPuWsfuoOgiSbm4wLHdZlfuvBd3S3tIdelUWeRVypwqnlDCaHnyZ8eMc0n6V4a"
    },
    {
      id: 7,
      title: "Digital Marketing Masterclass",
      date: "JUL 02",
      time: "02:00 PM - 05:00 PM",
      location: "Online via Zoom",
      type: "Webinar",
      typeColor: "bg-purple-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAAbWZJAPyiSzYoUOzTpK228PZtXdYewafrx7Y5zY8sWeNnPkD13g9CBkJErGcgSoYkb8xdVzs2ZJpJziOUGCD-uNECvpx5VUbQ8PpIn2DwMnJBiL6kmzInT9rn73W64K-PiyGbX9bRobs0tR6kWW8QRBfRrhfI1mppU1oTP5tDs0_rAyLhH1p03kRz1toTyOIMJ4UFiZZ2YX5hgWo0WwjTEkBTbN5PJ7iiNTVpwPJKg8EaiDVOX8mJVyzhjgktsAPSVBYZzw8mMlj"
    },
    {
      id: 8,
      title: "Annual Alumni Cricket Tournament",
      date: "JUL 10",
      time: "07:00 AM - 06:00 PM",
      location: "KPU Sports Ground",
      type: "Sports",
      typeColor: "bg-green-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpRERhD7Pe6Xw_w9Y3Di452nbjUm5qvhHTppYgtVgfJonvgbV-FaGLgspCUUqikD5OEdh6KxFpOnXN2__l_5_5eLO2TjNfn8NWi65krWP8RTpMIHOxT6gkcq5vcd97tDJOYPnqK87_gHSS2VuXf49Whci3zM_K7AUOXvC2etxKCeP5poLFwTyofUrOg1GT-8SgI3l2OWbIqYSsBUPqomSIimlci7pi2oaDCeUDrIthesrNjic1YsImS8ZXMwfHiZpAPbAuyokFyZX"
    },
    {
      id: 9,
      title: "Entrepreneurship Workshop",
      date: "JUL 15",
      time: "10:00 AM - 04:00 PM",
      location: "KPU Business School",
      type: "Workshop",
      typeColor: "bg-blue-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0dUWcNiyn3vjWhg_aU4GGrZNqP2W7qXonUCX8rAV7Gq9g2s6NM7WWoULwrrII12ZgCOatOWePZ4jVn2wMvlBYTnjBTRQPnKT4buVUSMNE9rXaedHzziBWP-gwivhk4GjxDhxwZwin8JRgOSdkzQiKVMuzBYCwza_ILhJqG97kkZ8cp6QpmDwplHbO_kcoO-gqpqFG6--UJylVHImpf-_lY0uiqwxpfNqqBu0liHQFMD4WTF2yxXM3tHj2WXthfJAVQokhVRxKte9B"
    },
    {
      id: 10,
      title: "AI and Future Technologies",
      date: "JUL 22",
      time: "03:00 PM - 06:00 PM",
      location: "Online via Zoom",
      type: "Webinar",
      typeColor: "bg-purple-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAAbWZJAPyiSzYoUOzTpK228PZtXdYewafrx7Y5zY8sWeNnPkD13g9CBkJErGcgSoYkb8xdVzs2ZJpJziOUGCD-uNECvpx5VUbQ8PpIn2DwMnJBiL6kmzInT9rn73W64K-PiyGbX9bRobs0tR6kWW8QRBfRrhfI1mppU1oTP5tDs0_rAyLhH1p03kRz1toTyOIMJ4UFiZZ2YX5hgWo0WwjTEkBTbN5PJ7iiNTVpwPJKg8EaiDVOX8mJVyzhjgktsAPSVBYZzw8mMlj"
    },
    {
      id: 11,
      title: "Class of 2019: 5th Year Reunion",
      date: "JUL 28",
      time: "07:00 PM Onwards",
      location: "Intercontinental Hotel, Kabul",
      type: "Reunion",
      typeColor: "bg-orange-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4fcqyrHLNTeKVN1yfBP5M70AzhKLfw5RYBl4Ng0vpDTOy2JeNpPH8EvLMVTWLX3oY0ZX8DrDtaMuLwEn6lKJSLx3feN3XtSiLocQ8B8tO-ry-q-ZIeopp7_UOv3tHBCEnLHafxrR2zwdsRBFXAuHNJ3wrWjNZPUFKXKhENUatG3HDQ-sbWP8hxKdVx_2wF-R3kb9jIGOubiWsCLzPuWsfuoOgiSbm4wLHdZlfuvBd3S3tIdelUWeRVypwqnlDCaHnyZ8eMc0n6V4a"
    },
    {
      id: 12,
      title: "Basketball Championship Finals",
      date: "AUG 05",
      time: "04:00 PM - 08:00 PM",
      location: "KPU Indoor Stadium",
      type: "Sports",
      typeColor: "bg-green-600",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpRERhD7Pe6Xw_w9Y3Di452nbjUm5qvhHTppYgtVgfJonvgbV-FaGLgspCUUqikD5OEdh6KxFpOnXN2__l_5_5eLO2TjNfn8NWi65krWP8RTpMIHOxT6gkcq5vcd97tDJOYPnqK87_gHSS2VuXf49Whci3zM_K7AUOXvC2etxKCeP5poLFwTyofUrOg1GT-8SgI3l2OWbIqYSsBUPqomSIimlci7pi2oaDCeUDrIthesrNjic1YsImS8ZXMwfHiZpAPbAuyokFyZX"
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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[500px] bg-blue-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Featured Event
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Annual KPU Alumni
                  <span className="block text-yellow-400">Gala 2024</span>
                </h1>
                
                <p className="text-lg text-white/90 leading-relaxed">
                  Join us for an unforgettable evening of celebration, networking, and honoring the achievements of our global alumni community in Kabul.
                </p>

                <div className="space-y-3">
                  <p className="text-white/80 font-medium">Event starts in:</p>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">12</div>
                      <div className="text-xs uppercase font-bold text-white/70">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">08</div>
                      <div className="text-xs uppercase font-bold text-white/70">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">45</div>
                      <div className="text-xs uppercase font-bold text-white/70">Mins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">19</div>
                      <div className="text-xs uppercase font-bold text-white/70">Secs</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                    Register Now
                  </button>
                  <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                    Event Details
                  </button>
                </div>
              </div>

              {/* Right Content - Styled Div */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Premium Event</h3>
                    <p className="text-white/80">Experience an unforgettable evening with distinguished alumni, faculty, and industry leaders.</p>
                    <div className="flex justify-center gap-6 pt-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">500+</div>
                        <div className="text-sm text-white/70">Attendees</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">50+</div>
                        <div className="text-sm text-white/70">Speakers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">10+</div>
                        <div className="text-sm text-white/70">Awards</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-8 flex flex-col gap-8">
                {/* View Toggle */}
                <div className="bg-white p-1 rounded-lg border border-gray-200 flex">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiCalendar className="text-[16px]" />
                    List View
                  </button>
                  <button 
                    onClick={() => setViewMode('calendar')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'calendar' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiCalendar className="text-[16px]" />
                    Calendar
                  </button>
                </div>

                {/* Categories */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-gray-900 text-lg font-bold mb-4">Popular Categories</h2>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <a key={index} className="flex items-center justify-between group py-2 hover:text-blue-600 transition-colors" href="#">
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                          {category.count}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-blue-600 p-6 rounded-lg text-white">
                  <FiMail className="text-white/80 text-2xl mb-3" />
                  <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Get the latest event invitations directly in your inbox.
                  </p>
                  <input 
                    className="w-full px-4 py-2 rounded-lg border-white/20 bg-white/10 placeholder-white/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 mb-3" 
                    placeholder="Email address" 
                    type="email"
                  />
                  <button className="w-full bg-white text-blue-600 text-sm font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>

            {/* Events List */}
            <div className="flex-1">
              {/* Search and Filters */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                      placeholder="Search events..." 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <select 
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="reunions">Reunions</option>
                      <option value="workshops">Workshops</option>
                      <option value="webinars">Webinars</option>
                    </select>
                    <input 
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <div className="text-sm text-gray-600">
                  Sort by: <span className="text-blue-600 font-bold cursor-pointer">Date Ascending</span>
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img 
                        alt={event.title} 
                        className="w-full h-full object-cover" 
                        src={event.image}
                      />
                      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                        <div className="text-blue-600 font-bold text-sm">{event.date.split(' ')[0]}</div>
                        <div className="text-lg font-bold text-gray-900">{event.date.split(' ')[1]}</div>
                      </div>
                      <div className={`absolute top-4 right-4 ${event.typeColor} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {event.type}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-2">
                        <FiClock className="text-[14px]" />
                        {event.time}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                        {event.location.includes('Online') ? (
                          <FiVideo className="text-[14px]" />
                        ) : (
                          <FiMapPin className="text-[14px]" />
                        )}
                        {event.location}
                      </div>
                      <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Register Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between py-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-gray-900">12</span> of 38 events
                </p>
                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors">
                    <FiChevronLeft />
                  </button>
                  <button className="flex h-10 px-4 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">1</button>
                  <button className="flex h-10 px-4 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-sm transition-colors">2</button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors">
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center">
              <p className="text-sm">© 2024 Kabul Polytechnic University Alumni Association</p>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Event Guidelines</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default EventsPage;
