import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin, FiVideo, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiMail, FiUsers, FiDollarSign, FiDownload } from 'react-icons/fi';
import eventService from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import EventRegistrationModal from '../components/event/EventRegistrationModal';
import EventCardModal from '../components/event/EventCardModal';
import { FiList, FiX, FiTag } from 'react-icons/fi';

// ─── Brand palette (matches Job Board / Mentorship) ─────────────
const BRAND = '#194ce6';
const BRAND_DARK = '#0f2d8a';
const BRAND_DARKER = '#091d5e';
const BRAND_BG = '#eef1fd';
const BRAND_BORDER = '#c5ccf7';

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

// ─── Filter section header (module scope — stable identity) ───
const FilterSection = ({ icon: Icon, title, count, children }) => (
  <div>
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3 h-3" style={{ color: BRAND }} />
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-700">{title}</h3>
      </div>
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold text-white"
          style={{ background: BRAND }}>
          {count}
        </span>
      )}
    </div>
    {children}
  </div>
);

// ─── Pill toggle row (module scope — stable identity) ───
const PillToggle = ({ label, active, onClick, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full px-3 py-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-between border"
    style={active
      ? { background: BRAND_DARK, color: '#fff', borderColor: BRAND_DARK }
      : { background: '#fff', color: '#374151', borderColor: '#e5e7eb' }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = BRAND_BORDER; e.currentTarget.style.background = BRAND_BG; e.currentTarget.style.color = BRAND; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#374151'; } }}
  >
    <span className="text-left truncate">{label}</span>
    {badge != null && (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0"
        style={active ? { background: 'rgba(255,255,255,0.25)' } : { background: BRAND_BG, color: BRAND }}>
        {badge}
      </span>
    )}
  </button>
);

const GridSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="h-9 bg-gray-200 rounded mt-2" />
    </div>
  </div>
);

// ─── Filter panel — module scope, fully props-driven so the native
//     date picker & inputs never remount on parent re-render ───
const EventsFilterPanel = ({
  viewMode, setViewMode, setCalendarDate,
  eventFilter, setEventFilter, categories,
  dateFrom, setDateFrom, dateTo, setDateTo,
  hasActiveFilters, onReset, activeCount,
}) => {
  const totalEvents = categories.reduce((s, c) => s + c.count, 0);
  return (
    <div className="flex flex-col gap-5">
      {activeCount > 0 && (
        <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: BRAND_BG }}>
          <span className="text-[11px] font-semibold" style={{ color: BRAND_DARK }}>
            {activeCount} active filter{activeCount > 1 ? 's' : ''}
          </span>
          <button onClick={onReset} className="text-[11px] font-bold hover:underline" style={{ color: BRAND }}>
            Clear all
          </button>
        </div>
      )}

      <FilterSection icon={FiList} title="View" count={0}>
        <div className="flex flex-col gap-1.5">
          <PillToggle label="List View" active={viewMode === 'list'} onClick={() => setViewMode('list')} />
          <PillToggle label="Calendar" active={viewMode === 'calendar'}
            onClick={() => { setViewMode('calendar'); setCalendarDate(dateFrom ? new Date(dateFrom) : new Date()); }} />
        </div>
      </FilterSection>

      <div className="h-px bg-gray-100" />

      <FilterSection icon={FiTag} title="Categories" count={eventFilter !== 'all' ? 1 : 0}>
        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
          <PillToggle label="All Events" active={eventFilter === 'all'} onClick={() => setEventFilter('all')} badge={totalEvents} />
          {categories.map((c, i) => (
            <PillToggle key={i} label={c.name} active={eventFilter === c.type} onClick={() => setEventFilter(c.type)} badge={c.count} />
          ))}
        </div>
      </FilterSection>

      <div className="h-px bg-gray-100" />

      <FilterSection icon={FiCalendar} title="Date Range" count={dateFrom || dateTo ? 1 : 0}>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold text-gray-500">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': BRAND_BORDER }} />
          <label className="text-[10px] font-semibold text-gray-500 mt-1">To</label>
          <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': BRAND_BORDER }} />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-[11px] font-semibold hover:underline self-start mt-1" style={{ color: BRAND }}>
              Clear dates
            </button>
          )}
        </div>
      </FilterSection>

      {hasActiveFilters && (
        <button onClick={onReset}
          className="w-full text-[11px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          style={{ background: BRAND_DARK, color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = BRAND_DARKER}
          onMouseLeave={e => e.currentTarget.style.background = BRAND_DARK}>
          <FiX className="w-3 h-3" /> Reset All Filters
        </button>
      )}
    </div>
  );
};

const EventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState('list');
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile drawer
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
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardEvent, setCardEvent] = useState(null);
  const [cardRegistration, setCardRegistration] = useState(null);

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
      const ev = response.data;
      const now = new Date();
      // Only show a featured event when it's truly upcoming AND registration is still open.
      const startInFuture = ev?.start_date && new Date(ev.start_date) > now;
      const deadlinePassed = ev?.registration_deadline && new Date(ev.registration_deadline) < now;
      setFeaturedEvent(ev && startInFuture && !deadlinePassed ? ev : null);
    } catch (error) {
      console.error('Failed to fetch featured event:', error);
      setFeaturedEvent(null);
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

  const resolveImage = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/storage/')) return `http://localhost:8000${img}`;
    if (img.startsWith('storage/')) return `http://localhost:8000/${img}`;
    return `http://localhost:8000/storage/${img}`;
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
        status: 'upcoming',
      };

      // Remove undefined values from params
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await eventService.getEvents(params);

      // Show upcoming events (start_date in future), don't filter by registration deadline
      // Events with closed registration still show but with disabled register button
      setEvents(response.data.data || []);
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
    const now = new Date();
    // Deadline means end of that day — registration is open until 23:59:59 of deadline date
    if (event.registration_deadline) {
      const deadline = new Date(event.registration_deadline);
      deadline.setHours(23, 59, 59, 999);
      if (now > deadline) return true;
    }
    // Also closed if event already started
    if (event.start_date && new Date(event.start_date) <= now) return true;
    return false;
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
    const existingRegistration = userRegistrations.find(reg => Number(reg.alumni_event_id) === Number(eventId));
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

  const getUserRegistration = (eventId) => {
    return userRegistrations.find(reg => Number(reg.alumni_event_id) === Number(eventId));
  };

  const getUserRegistrationStatus = (eventId) => {
    return getUserRegistration(eventId)?.status;
  };

  const openCardModal = (event, e) => {
    if (e) e.stopPropagation();
    const reg = getUserRegistration(event.id);
    setCardEvent(event);
    setCardRegistration(reg);
    setShowCardModal(true);
  };

  const getRegistrationButtonText = (eventId) => {
    const status = getUserRegistrationStatus(eventId);
    const event = events.find(ev => ev.id === eventId);
    
    if (!event) return 'Register Now';
    
    // Use only the deadline to control registration
    const now = new Date();
    const deadlineEnd = event.registration_deadline ? new Date(new Date(event.registration_deadline).setHours(23, 59, 59, 999)) : null;
    const isRegistrationDeadlinePassed = deadlineEnd && now > deadlineEnd;
    
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
    const deadlineEnd = event.registration_deadline ? new Date(new Date(event.registration_deadline).setHours(23, 59, 59, 999)) : null;
    const isRegistrationDeadlinePassed = deadlineEnd && now > deadlineEnd;
    
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

  const hasActiveFilters = !!(searchTerm || eventFilter !== 'all' || dateFrom || dateTo);
  const activeCount = (eventFilter !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);
  const resetFilters = () => { setSearchTerm(''); setEventFilter('all'); setDateFrom(''); setDateTo(''); };

  const filterPanelProps = {
    viewMode, setViewMode, setCalendarDate,
    eventFilter, setEventFilter, categories,
    dateFrom, setDateFrom, dateTo, setDateTo,
    hasActiveFilters, onReset: resetFilters, activeCount,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[350px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={resolveImage(featuredEvent?.featured_image) || '/images/hero-bg.jpg'}
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
                {featuredEvent ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white w-fit">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Featured Event
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white/90 w-fit">
                    <FiCalendar className="text-blue-300" />
                    No Upcoming Events
                  </div>
                )}

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
                      No upcoming events
                      <span className="block text-blue-300">at the moment</span>
                    </>
                  )}
                </h1>

                <p className="text-base text-white/80 leading-relaxed">
                  {featuredEvent
                    ? featuredEvent.description.substring(0, 150) + '...'
                    : "We're not hosting anything new just yet. New reunions, workshops, and networking events are added regularly — check the calendar below or come back soon."
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
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-blue-300" />
                        <span>{new Date(featuredEvent.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
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
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {featuredEvent && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isRegistrationClosed(featuredEvent)) {
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
                  </div>
                )}
              </div>

              {/* Right Content - Styled Div */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  {featuredEvent ? (
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
                          <div className="text-3xl font-bold text-yellow-400">{featuredEvent.current_attendees || '0'}</div>
                          <div className="text-sm text-white/70">Attendees</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-yellow-400">{featuredEvent.speakers_count || '0'}</div>
                          <div className="text-sm text-white/70">Speakers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-yellow-400">{featuredEvent.awards_count || '0'}</div>
                          <div className="text-sm text-white/70">Awards</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-5">
                      <div className="w-20 h-20 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto">
                        <FiCalendar className="w-10 h-10 text-blue-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Stay tuned</h3>
                      <p className="text-white/80 leading-relaxed">
                        We're planning the next round of reunions, workshops, and networking sessions. Browse the calendar or past events below — you'll see new ones here as soon as they're published.
                      </p>
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-lg text-sm transition-colors"
                      >
                        <FiMail /> Get notified
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search bar — overlaps hero */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-7 relative z-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-3 py-2 focus-within:ring-2 transition-all"
                style={{ '--tw-ring-color': BRAND_BORDER }}>
                <FiSearch className="text-gray-400 mr-2.5 flex-shrink-0 w-4 h-4" />
                <input
                  className="w-full border-none bg-transparent focus:ring-0 focus:outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                  placeholder="Search events by title, type, or location…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 ml-2">
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors"
                style={{ background: BRAND_BG, color: BRAND, borderColor: BRAND_BORDER }}>
                <FiFilter className="w-3.5 h-3.5" /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BRAND_BG }}>
                      <FiFilter className="w-3.5 h-3.5" style={{ color: BRAND }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-700">Filters</h2>
                      <p className="text-[10px] text-gray-400">Find events that fit you</p>
                    </div>
                  </div>
                  <div className="p-5"><EventsFilterPanel {...filterPanelProps} /></div>
                </div>

                {/* Newsletter */}
                <div className="rounded-xl p-5 text-white" style={{ background: BRAND_DARK }}>
                  <FiMail className="text-white/80 text-2xl mb-2.5" />
                  <h3 className="font-bold text-base mb-1">Stay Updated</h3>
                  <p className="text-xs text-white/70 mb-3">Get the latest event invitations in your inbox.</p>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/60 text-white text-xs focus:outline-none focus:ring-2 focus:ring-white/30 mb-2.5"
                    placeholder="Email address" type="email" />
                  <button className="w-full text-xs font-bold py-2 rounded-lg transition-colors"
                    style={{ background: '#fff', color: BRAND_DARK }}>
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>

            {/* Mobile filter drawer */}
            {filtersOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Filters</h2>
                    <button onClick={() => setFiltersOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <EventsFilterPanel {...filterPanelProps} />
                  <button onClick={() => setFiltersOpen(false)}
                    className="w-full mt-4 text-white text-sm font-semibold py-2.5 rounded-lg"
                    style={{ background: BRAND_DARK }}>
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Events List */}
            <div className="flex-1 min-w-0">
              {/* Toolbar — count + view toggle */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <p className="text-xs text-gray-500">
                  {loading ? 'Loading…' : (viewMode === 'calendar'
                    ? 'Event calendar'
                    : <>Showing <span className="font-semibold text-gray-900">{events.length}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> events</>)}
                </p>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
                  <button onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    style={viewMode === 'list' ? { background: BRAND_DARK } : {}}>
                    <FiList className="w-3.5 h-3.5" /> List
                  </button>
                  <button onClick={() => { setViewMode('calendar'); setCalendarDate(dateFrom ? new Date(dateFrom) : new Date()); }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                      viewMode === 'calendar' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    style={viewMode === 'calendar' ? { background: BRAND_DARK } : {}}>
                    <FiCalendar className="w-3.5 h-3.5" /> Calendar
                  </button>
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <GridSkeleton key={i} />)
                ) : events.length === 0 ? (
                  <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: BRAND_BG }}>
                      <FiCalendar className="text-2xl" style={{ color: BRAND }} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">No events found</h3>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">Try adjusting your search or removing some filters.</p>
                    {hasActiveFilters && (
                      <button onClick={() => { setSearchTerm(''); setEventFilter('all'); setDateFrom(''); setDateTo(''); }}
                        className="mt-4 px-5 py-2 text-white text-xs font-semibold rounded-lg" style={{ background: BRAND_DARK }}>
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all h-[400px] w-full flex flex-col group">
                    <div className="relative h-40 flex-shrink-0 overflow-hidden">
                      {event.featured_image ? (
                        <img
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={resolveImage(event.featured_image)}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex'); }}
                        />
                      ) : null}
                      <div className={`w-full h-full items-center justify-center ${event.featured_image ? 'hidden' : 'flex'}`} style={{ background: BRAND_DARK }}>
                        <FiCalendar className="text-white text-4xl" />
                      </div>
                      <div className="absolute top-3 left-3 bg-white px-3 py-1.5 rounded-lg shadow-md text-center">
                        <div className="font-bold text-[10px] tracking-wider" style={{ color: BRAND }}>
                          {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </div>
                        <div className="text-base font-extrabold text-gray-900 leading-none">
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
                      <div className="flex items-center gap-2 font-semibold text-xs mb-2" style={{ color: BRAND }}>
                        <FiClock className="text-[12px]" />
                        <span className="truncate">
                          {new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ({event.time_zone})
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
                              year: 'numeric'
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
                              const deadlineEnd = event.registration_deadline ? new Date(new Date(event.registration_deadline).setHours(23, 59, 59, 999)) : null;
    const isRegistrationDeadlinePassed = deadlineEnd && now > deadlineEnd;
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
                        {(getUserRegistrationStatus(event.id) === 'registered' || getUserRegistrationStatus(event.id) === 'confirmed') && (
                          <button
                            onClick={(e) => openCardModal(event, e)}
                            className="w-full flex items-center justify-center gap-2 mt-2 py-2 px-4 bg-[#002759] text-white font-semibold rounded-lg hover:bg-[#003580] transition-colors text-sm"
                          >
                            <FiDownload size={14} />
                            {getUserRegistration(event.id)?.card_downloaded ? 'View Card' : 'Download Card'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}

              {/* Pagination (list view only) */}
              {viewMode === 'list' && !loading && events.length > 0 && pagination.total > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{Math.min(pagination.per_page * (pagination.current_page - 1) + 1, pagination.total)}</span>–
                  <span className="font-semibold text-gray-900">{Math.min(pagination.per_page * pagination.current_page, pagination.total)}</span> of{' '}
                  <span className="font-semibold text-gray-900">{pagination.total}</span> events
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fetchEvents(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="text-sm" />
                  </button>
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
                        className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-semibold transition-colors ${
                          pagination.current_page === pageNum ? 'text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                        style={pagination.current_page === pageNum ? { background: BRAND_DARK } : {}}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => fetchEvents(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.last_page}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight className="text-sm" />
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

        <EventCardModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          event={cardEvent}
          user={user}
          registration={cardRegistration}
          onCardDownloaded={() => {
            setShowCardModal(false);
            fetchUserRegistrations();
          }}
        />

      </div>
    </Layout>
  );
};

export default EventsPage;
