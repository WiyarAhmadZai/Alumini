import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin, FiVideo, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiMail, FiUsers, FiDollarSign } from 'react-icons/fi';
import eventService from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import EventRegistrationModal from '../components/event/EventRegistrationModal';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView = ({ events, calendarDate, setCalendarDate, onDayClick, onEventClick }) => {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Map events to their date string (YYYY-MM-DD)
  const eventsByDate = {};
  events.forEach(ev => {
    const d = ev.start_date ? ev.start_date.slice(0, 10) : null;
    if (d) {
      if (!eventsByDate[d]) eventsByDate[d] = [];
      eventsByDate[d].push(ev);
    }
  });

  const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <FiChevronLeft className="text-gray-600" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">
          {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <FiChevronRight className="text-gray-600" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="min-h-[90px] border-b border-r border-gray-100 bg-gray-50/50" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = eventsByDate[dateStr] || [];
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          return (
            <div
              key={day}
              onClick={() => dayEvents.length > 0 && onDayClick(dateStr)}
              className={`min-h-[90px] border-b border-r border-gray-100 p-1 ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-blue-50' : ''} transition-colors`}
            >
              <div className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
              }`}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map(ev => (
                  <div
                    key={ev.id}
                    onClick={(e) => { e.stopPropagation(); onEventClick(ev.id); }}
                    className="text-[10px] leading-tight bg-blue-600 text-white rounded px-1 py-0.5 truncate cursor-pointer hover:bg-blue-700"
                    title={ev.title}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-blue-600 font-semibold px-1">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          Event
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold inline-block"></span>
          Today
        </span>
        <span className="ml-auto text-gray-400">Click a day with events to filter the list view</span>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('start_date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });

  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchFeaturedEvent();
    fetchCategories();
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, eventFilter, dateFrom, dateTo, sortBy, sortOrder]);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    } else {
      setUserRegistrations([]);
    }
  }, [user]);

  const fetchFeaturedEvent = async () => {
    try {
      const response = await eventService.getFeaturedEvent();
      setFeaturedEvent(response.data);
    } catch (error) {
      console.error('Failed to fetch featured event:', error);
      // Don't show Swal to prevent infinite loops
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await eventService.getEventCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Don't show Swal to prevent infinite loops
    }
  };

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: 12,
        search: searchTerm || undefined,
        type: eventFilter === 'all' ? undefined : eventFilter,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      // Remove undefined values from params
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await eventService.getEvents(params);
      
      // Use server-side pagination data directly
      setEvents(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Don't show Swal for every error to prevent infinite loops
      // Only show if it's not a network error or if it's the first attempt
      if (error.message && !error.message.includes('Failed to load events')) {
        Swal.fire('Error', 'Failed to load events', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      if (!user) {
        setUserRegistrations([]);
        return;
      }
      const response = await eventService.getMyRegistrations();
      
      // Filter out cancelled registrations
      const activeRegistrations = (response.data || []).filter(reg => reg.status !== 'cancelled');
      
      setUserRegistrations(activeRegistrations);
    } catch (error) {
      console.error('Failed to fetch user registrations:', error);
      // Don't show Swal to prevent infinite loops
      setUserRegistrations([]);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const isRegistrationClosed = (event) => {
    if (!event) return true;
    
    // Use only the deadline to control registration
    const now = new Date();
    const isRegistrationDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) <= now;
    
    // Registration is closed only if the deadline has passed
    return isRegistrationDeadlinePassed;
  };

  const handleRegister = (eventId, e) => {
    e.stopPropagation();
    
    if (!user) {
      Swal.fire('Login Required', 'Please login to register for this event', 'info');
      return;
    }

    // Find event from events list or featured event
    const event = events.find(ev => ev.id === eventId) || featuredEvent;
    
    if (!event) {
      Swal.fire('Event Not Found', 'The requested event could not be found.', 'error');
      return;
    }
    
    // Check if user is already registered for this event
    const existingRegistration = userRegistrations.find(reg => reg.alumni_event_id === eventId);
    if (existingRegistration) {
      Swal.fire({
        icon: 'info',
        title: 'Already Registered',
        text: 'You are already registered for this event.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Got it',
        position: 'center',
        backdrop: 'rgba(0, 0, 0, 0.4)'
      });
      return;
    }
    
    const now = new Date();
    const eventEndDate = new Date(event.end_date);
    
    // Check if event has already ended/completed
    if (eventEndDate <= now) {
      Swal.fire('Event Completed', 'This event has already happened and registration is no longer available.', 'error');
      return;
    }
    
    // Check if event is full
    if (event.max_attendees && event.current_attendees >= event.max_attendees) {
      Swal.fire('Seats Full', 'You cannot register for this event because all the seats are full.', 'warning');
      return;
    }
    
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = () => {
    Swal.fire({
      icon: 'success',
      title: 'Registration Successful!',
      text: 'You have been registered for this event successfully.',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Great!',
      timer: 3000,
      timerProgressBar: true,
      position: 'center',
      backdrop: 'rgba(0, 0, 0, 0.4)'
    });
    fetchEvents();
    fetchUserRegistrations();
  };

  const getUserRegistrationStatus = (eventId) => {
    const registration = userRegistrations.find(reg => reg.alumni_event_id === eventId);
    return registration?.status;
  };

  const getRegistrationButtonText = (eventId) => {
    const status = getUserRegistrationStatus(eventId);
    const event = events.find(ev => ev.id === eventId);
    
    if (!event) return 'Register Now';
    
    // Use only the deadline to control registration
    const now = new Date();
    const isRegistrationDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) <= now;
    
    // Check if user is already registered
    if (status === 'registered' || status === 'confirmed') {
      return 'Registered';
    }
    if (status === 'cancelled') {
      return 'Register Again';
    }
    
    // Check registration availability based only on deadline
    if (isRegistrationDeadlinePassed) {
      return 'Registration Closed';
    }
    
    return 'Register Now';
  };

  const getRegistrationButtonClass = (eventId) => {
    const status = getUserRegistrationStatus(eventId);
    const event = events.find(ev => ev.id === eventId);
    
    if (!event) return 'bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors';
    
    // Use only the deadline to control registration
    const now = new Date();
    const isRegistrationDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) <= now;
    
    // Check if user is already registered
    if (status === 'registered' || status === 'confirmed') {
      return 'bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors';
    }
    
    // Check registration availability based only on deadline
    if (isRegistrationDeadlinePassed) {
      return 'bg-gray-400 text-white font-semibold py-2 rounded-lg cursor-not-allowed opacity-75';
    }
    
    return 'bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors';
  };

  const formatCountdown = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;

    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, mins, secs };
  };

  const [countdown, setCountdown] = useState(null);

  // Live countdown effect
  useEffect(() => {
    if (!featuredEvent) return;

    const updateCountdown = () => {
      const now = new Date();
      const event = new Date(featuredEvent.start_date);
      const diff = event - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0, months: 0, years: 0 });
        return;
      }

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ years, months, days, hours, mins, secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [featuredEvent]);

  const getTypeColor = (eventType) => {
    const colors = {
      'workshop': 'bg-blue-600',
      'webinar': 'bg-purple-600',
      'sports': 'bg-green-600',
      'reunion': 'bg-orange-600',
      'career_fair': 'bg-red-600',
      'conference': 'bg-indigo-600',
      'seminar': 'bg-pink-600',
      'networking': 'bg-teal-600',
    };
    return colors[eventType] || 'bg-gray-600';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[350px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={featuredEvent?.featured_image || '/images/hero-bg.jpg'}
              alt={featuredEvent?.title || 'Events'}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/hero-bg.jpg'; }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.82) 100%)' }}></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="flex flex-col gap-6 pt-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Featured Event
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {featuredEvent ? (
                    <>
                      {featuredEvent.title.split(' ').slice(0, 3).join(' ')}
                      <span className="block text-blue-300">
                        {featuredEvent.title.split(' ').slice(3).join(' ')}
                      </span>
                    </>
                  ) : (
                    <>
                      Annual KPU Alumni
                      <span className="block text-blue-300">Gala 2024</span>
                    </>
                  )}
                </h1>
                
                <p className="text-base text-white/80 leading-relaxed">
                  {featuredEvent 
                    ? featuredEvent.description.substring(0, 150) + '...'
                    : 'Join us for an unforgettable evening of celebration, networking, and honoring the achievements of our global alumni community in Kabul.'
                  }
                </p>

                {countdown && (
                  <div className="space-y-2">
                    <p className="text-white/70 text-sm font-medium">Event starts in:</p>
                    <div className="flex flex-wrap gap-2">
                      {countdown.years > 0 && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{countdown.years}</div>
                          <div className="text-xs uppercase font-bold text-white/60">Years</div>
                        </div>
                      )}
                      {countdown.months > 0 && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{countdown.months}</div>
                          <div className="text-xs uppercase font-bold text-white/60">Months</div>
                        </div>
                      )}
                      {countdown.days > 0 && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{countdown.days}</div>
                          <div className="text-xs uppercase font-bold text-white/60">Days</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{countdown.hours}</div>
                        <div className="text-xs uppercase font-bold text-white/60">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{countdown.mins}</div>
                        <div className="text-xs uppercase font-bold text-white/60">Mins</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{countdown.secs}</div>
                        <div className="text-xs uppercase font-bold text-white/60">Secs</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Details */}
                {featuredEvent && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-300" />
                        <span>{new Date(featuredEvent.start_date).toLocaleDateString('en-GB', { 
                          weekday: 'short', 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-blue-300" />
                        <span>{new Date(featuredEvent.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(featuredEvent.end_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                      </div>
                      <span className="text-white/60 text-xs">({featuredEvent.time_zone})</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      {featuredEvent.mode === 'online' ? (
                        <FiVideo className="text-blue-300" />
                      ) : (
                        <FiMapPin className="text-blue-300" />
                      )}
                      <span>{featuredEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getTypeColor(featuredEvent.event_type)}`}>
                        {featuredEvent.event_type.replace('_', ' ').toUpperCase()}
                      </span>
                      {featuredEvent.registration_fee > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-green-600">
                          ${featuredEvent.registration_fee}
                        </span>
                      )}
                      {featuredEvent.mode === 'online' && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-blue-600">
                          ONLINE
                        </span>
                      )}
                    </div>
                    
                    {/* Registration Deadline for Featured Event */}
                    {featuredEvent.registration_deadline && (
                      <div className="flex items-center justify-between text-white/80 text-sm mt-3">
                        <span className="font-medium">Registration Deadline</span>
                        <span className="font-bold">
                          {new Date(featuredEvent.registration_deadline).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit' 
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {featuredEvent ? (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isRegistrationClosed(featuredEvent)) {
                            // Show SweetAlert for closed registration
                            const now = new Date();
                            const isRegistrationDeadlinePassed = featuredEvent.registration_deadline && new Date(featuredEvent.registration_deadline) <= now;
                            if (isRegistrationDeadlinePassed) {
                              Swal.fire({
                                icon: 'warning',
                                title: 'Registration Closed',
                                html: 'Deadline passed. Contact the KPU team <a href="/contact" style="color: #2563eb; text-decoration: underline;">if you want to participate</a>.',
                                confirmButtonColor: '#2563eb',
                                confirmButtonText: 'Contact KPU Team',
                                showCancelButton: true,
                                cancelButtonText: 'Close',
                                position: 'center',
                                backdrop: 'rgba(0, 0, 0, 0.4)'
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  navigate('/contact');
                                }
                              });
                              return;
                            }
                            // For other closed reasons, show a generic message
                            Swal.fire({
                              icon: 'info',
                              title: 'Registration Unavailable',
                              text: 'Registration is not available for this event.',
                              confirmButtonColor: '#2563eb',
                              confirmButtonText: 'Got it',
                              position: 'center',
                              backdrop: 'rgba(0, 0, 0, 0.4)'
                            });
                            return;
                          }
                          handleRegister(featuredEvent.id, e);
                        }}
                        disabled={isRegistrationClosed(featuredEvent)}
                        className={`px-6 py-2 font-semibold rounded-lg transition-colors text-sm ${getRegistrationButtonClass(featuredEvent.id)} ${isRegistrationClosed(featuredEvent) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {getRegistrationButtonText(featuredEvent.id)}
                      </button>
                      <button 
                        onClick={() => handleEventClick(featuredEvent.id)}
                        className="px-6 py-2 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm"
                      >
                        Event Details
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Register Now
                      </button>
                      <button className="px-6 py-2 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm">
                        Event Details
                      </button>
                    </>
                  )}
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
                        <div className="text-3xl font-bold text-yellow-400">
                          {featuredEvent?.current_attendees || '0'}
                        </div>
                        <div className="text-sm text-white/70">Attendees</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">
                          {featuredEvent?.speakers_count || '0'}
                        </div>
                        <div className="text-sm text-white/70">Speakers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">
                          {featuredEvent?.awards_count || '0'}
                        </div>
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List View
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('calendar');
                      setCalendarDate(dateFrom ? new Date(dateFrom) : new Date());
                    }}
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
                  <div className="space-y-1">
                    <button
                      onClick={() => setEventFilter('all')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        eventFilter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>All Events</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${eventFilter === 'all' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                        {categories.reduce((sum, c) => sum + c.count, 0)}
                      </span>
                    </button>
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => setEventFilter(category.type)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          eventFilter === category.type
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${eventFilter === category.type ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                          {category.count}
                        </span>
                      </button>
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
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-black text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                      placeholder="Search events..." 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <select
                      className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="reunion">Reunions</option>
                      <option value="workshop">Workshops</option>
                      <option value="webinar">Webinars</option>
                      <option value="sports">Sports</option>
                      <option value="career_fair">Career Fairs</option>
                      <option value="conference">Conferences</option>
                      <option value="seminar">Seminars</option>
                      <option value="networking">Networking</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        title="From date"
                      />
                      <span className="text-gray-400 text-sm">to</span>
                      <input
                        className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-black focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        title="To date"
                      />
                      {(dateFrom || dateTo) && (
                        <button
                          onClick={() => { setDateFrom(''); setDateTo(''); }}
                          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                          title="Clear dates"
                        >×</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewMode === 'calendar' ? 'Event Calendar' : 'Upcoming Events'}
                </h2>
                {viewMode === 'list' && (
                  <div className="text-sm text-gray-600">
                    Sort by: <span className="text-blue-600 font-bold cursor-pointer">Date Ascending</span>
                  </div>
                )}
              </div>

              {/* Calendar View */}
              {viewMode === 'calendar' && (
                <CalendarView
                  events={events}
                  calendarDate={calendarDate}
                  setCalendarDate={setCalendarDate}
                  onDayClick={(dateStr) => {
                    setDateFrom(dateStr);
                    setDateTo(dateStr);
                    setViewMode('list');
                  }}
                  onEventClick={handleEventClick}
                />
              )}

              {/* Events Grid (List View) */}
              {viewMode === 'list' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200 h-[440px] animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-10 bg-gray-200 rounded mt-auto" />
                      </div>
                    </div>
                  ))
                ) : events.length === 0 ? (
                  <div className="col-span-3 text-center py-16 text-gray-500">
                    <FiCalendar className="text-5xl mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No events found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                ) : events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 h-[440px] w-full flex flex-col group">
                    <div className="relative h-48 flex-shrink-0 overflow-hidden">
                      {event.featured_image ? (
                        <img 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          src={event.featured_image}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <FiCalendar className="text-white text-4xl" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                        <div className="text-blue-600 font-bold text-xs">
                          {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </div>
                        <div className="text-base font-bold text-gray-900">
                          {new Date(event.start_date).toLocaleDateString('en-US', { day: 'numeric' })}
                        </div>
                      </div>
                      <div className={`absolute top-4 right-4 ${getTypeColor(event.event_type)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {event.event_type}
                      </div>
                      <button
                        onClick={() => handleEventClick(event.id)}
                        className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                        title="View Event Details"
                      >
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs mb-2">
                        <FiClock className="text-[12px]" />
                        <span className="truncate">
                          {new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(event.end_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ({event.time_zone})
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 flex-1 leading-tight">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-4">
                        {event.location.includes('Online') ? (
                          <FiVideo className="text-[12px] flex-shrink-0" />
                        ) : (
                          <FiMapPin className="text-[12px] flex-shrink-0" />
                        )}
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{event.current_attendees || 0} attending</span>
                        {event.max_attendees && (
                          <span>{event.max_attendees - event.current_attendees} spots left</span>
                        )}
                      </div>
                      
                      {/* Registration Deadline */}
                      {event.registration_deadline && (
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span className="font-medium">Registration Deadline</span>
                          <span className="font-bold">
                            {new Date(event.registration_deadline).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: '2-digit' 
                            })} {new Date(event.registration_deadline).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit', 
                              hour12: true 
                            })}
                          </span>
                        </div>
                      )}
                      <div className="mt-auto">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isRegistrationClosed(event)) {
                              // Show SweetAlert for closed registration
                              const now = new Date();
                              const isRegistrationDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) <= now;
                              if (isRegistrationDeadlinePassed) {
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'Registration Closed',
                                  html: 'Deadline passed. Contact the KPU team <a href="/contact" style="color: #2563eb; text-decoration: underline;">if you want to participate</a>.',
                                  confirmButtonColor: '#2563eb',
                                  confirmButtonText: 'Contact KPU Team',
                                  showCancelButton: true,
                                  cancelButtonText: 'Close',
                                  position: 'center',
                                  backdrop: 'rgba(0, 0, 0, 0.4)'
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    navigate('/contact');
                                  }
                                });
                                return;
                              }
                              // For other closed reasons, show a generic message
                              Swal.fire({
                                icon: 'info',
                                title: 'Registration Unavailable',
                                text: 'Registration is not available for this event.',
                                confirmButtonColor: '#2563eb',
                                confirmButtonText: 'Got it',
                                position: 'center',
                                backdrop: 'rgba(0, 0, 0, 0.4)'
                              });
                              return;
                            }
                            handleRegister(event.id, e);
                          }}
                          disabled={isRegistrationClosed(event)}
                          className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm ${getRegistrationButtonClass(event.id)} ${isRegistrationClosed(event) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {getRegistrationButtonText(event.id)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}

              {/* Pagination (list view only) */}
              {viewMode === 'list' && (
              <div className="flex items-center justify-between py-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{Math.min(pagination.per_page * (pagination.current_page - 1) + 1, pagination.total)}</span> to{' '}
                  <span className="font-semibold text-gray-900">{Math.min(pagination.per_page * pagination.current_page, pagination.total)}</span> of{' '}
                  <span className="font-semibold text-gray-900">{pagination.total}</span> events
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => fetchEvents(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
                      pagination.current_page <= 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'border border-gray-300 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    let pageNum;
                    if (pagination.last_page <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.current_page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.current_page >= pagination.last_page - 2) {
                      pageNum = pagination.last_page - 4 + i;
                    } else {
                      pageNum = pagination.current_page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchEvents(pageNum)}
                        className={`flex h-10 px-3 items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                          pagination.current_page === pageNum
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'border border-gray-300 hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => fetchEvents(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.last_page}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
                      pagination.current_page >= pagination.last_page 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'border border-gray-300 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>
        </main>

        {/* Event Registration Modal */}
        <EventRegistrationModal 
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          event={selectedEvent}
          onRegistrationSuccess={handleRegistrationSuccess}
        />

      </div>
    </Layout>
  );
};

export default EventsPage;
