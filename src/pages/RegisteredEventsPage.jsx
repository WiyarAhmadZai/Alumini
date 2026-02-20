import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin, FiVideo, FiChevronLeft, FiChevronRight, FiUsers, FiDollarSign } from 'react-icons/fi';
import eventService from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const RegisteredEventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });

  useEffect(() => {
    if (user) {
      fetchRegisteredEvents();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRegisteredEvents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await eventService.getMyRegistrations();
      
      // Filter out cancelled registrations
      const activeRegistrations = (response.data || []).filter(reg => reg.status !== 'cancelled');
      
      // Simulate pagination on client side since API might not support it
      const perPage = 12;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedEvents = activeRegistrations.slice(startIndex, endIndex);
      
      setRegisteredEvents(paginatedEvents);
      setPagination({
        current_page: page,
        last_page: Math.ceil(activeRegistrations.length / perPage),
        per_page: perPage,
        total: activeRegistrations.length,
      });
    } catch (error) {
      console.error('Failed to fetch registered events:', error);
      Swal.fire('Error', 'Failed to load your registered events', 'error');
      setRegisteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleCancelRegistration = async (eventId, e) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: 'Cancel Registration?',
      text: 'Are you sure you want to cancel your registration for this event?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'Keep Registration',
    });

    if (result.isConfirmed) {
      try {
        await eventService.cancelRegistration(eventId);
        Swal.fire({
          icon: 'success',
          title: 'Registration Cancelled',
          text: 'Your registration has been cancelled successfully.',
          confirmButtonColor: '#2563eb',
          timer: 2000,
          timerProgressBar: true,
        });
        fetchRegisteredEvents(pagination.current_page);
      } catch (error) {
        Swal.fire('Error', 'Failed to cancel registration', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'registered': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'attended': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchRegisteredEvents(page);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to view your registered events.</p>
            <Link 
              to="/login" 
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[300px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/kpu2.jpg"
              alt="Registered Events"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                My Registered Events
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Manage and track all your event registrations in one place
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : registeredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCalendar className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Registered Events</h3>
              <p className="text-gray-600 mb-6">You haven't registered for any events yet.</p>
              <Link 
                to="/events" 
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Registered Events ({pagination.total})
                </h2>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {registeredEvents.map((registration) => (
                  <div key={registration.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 h-[420px] w-full flex flex-col group">
                    <div className="relative h-48 flex-shrink-0 overflow-hidden">
                      {registration.alumni_event?.featured_image ? (
                        <img 
                          alt={registration.alumni_event?.title || 'Event'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          src={registration.alumni_event.featured_image}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <FiCalendar className="text-white text-4xl" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                        <div className="text-blue-600 font-bold text-xs">
                          {registration.alumni_event?.start_date ? new Date(registration.alumni_event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).split(' ')[0].toUpperCase() : 'N/A'}
                        </div>
                        <div className="text-base font-bold text-gray-900">
                          {registration.alumni_event?.start_date ? new Date(registration.alumni_event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).split(' ')[1] : 'N/A'}
                        </div>
                      </div>
                      <div className={`absolute top-4 right-4 ${getTypeColor(registration.alumni_event?.event_type)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {registration.alumni_event?.event_type?.replace('_', ' ').toUpperCase() || 'EVENT'}
                      </div>
                      <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(registration.status)}`}>
                        {registration.status?.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs mb-2">
                        <FiClock className="text-[12px]" />
                        <span className="truncate">
                          {registration.alumni_event?.start_date && registration.alumni_event?.end_date ? 
                            `${new Date(registration.alumni_event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${new Date(registration.alumni_event.end_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} (${registration.alumni_event.time_zone || 'UTC'})` 
                            : 'Time not available'
                          }
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 flex-1 leading-tight">
                        {registration.alumni_event?.title || 'Event Title'}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-4">
                        {registration.alumni_event?.location?.includes('Online') ? (
                          <FiVideo className="text-[12px] flex-shrink-0" />
                        ) : (
                          <FiMapPin className="text-[12px] flex-shrink-0" />
                        )}
                        <span className="truncate">{registration.alumni_event?.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{registration.alumni_event?.current_attendees || 0} attending</span>
                        {registration.alumni_event?.registration_fee > 0 && (
                          <span className="font-semibold text-green-600">${registration.alumni_event.registration_fee}</span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button 
                          onClick={() => handleEventClick(registration.alumni_event?.id)}
                          className="flex-1 bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                          disabled={!registration.alumni_event?.id}
                        >
                          View Details
                        </button>
                        {(registration.status === 'registered' || registration.status === 'confirmed') && registration.status !== 'cancelled' ? (
                          <button 
                            onClick={(e) => handleCancelRegistration(registration.alumni_event?.id, e)}
                            className="px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm cursor-pointer"
                            title="Cancel Registration"
                            disabled={!registration.alumni_event?.id}
                          >
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-between py-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} events
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pagination.current_page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FiChevronLeft className="text-[16px]" />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            page === pagination.current_page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pagination.current_page === pagination.last_page
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                      <FiChevronRight className="text-[16px]" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default RegisteredEventsPage;
