import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin, FiVideo, FiUsers, FiDollarSign, FiTag, FiArrowLeft, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import eventService from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventDetails(id);
      setEvent(response.data);
      
      // Check if user is registered
      if (user && response.data.registrations) {
        const registration = response.data.registrations.find(
          reg => reg.alumni_student_id === user.id
        );
        setUserRegistration(registration);
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      Swal.fire('Error', 'Failed to load event details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      Swal.fire('Login Required', 'Please login to register for this event', 'info');
      return;
    }

    const { value: specialRequirements } = await Swal.fire({
      title: 'Register for Event',
      input: 'textarea',
      inputLabel: 'Special Requirements (Optional)',
      inputPlaceholder: 'Any special requirements or accommodations...',
      showCancelButton: true,
      confirmButtonText: 'Register',
      cancelButtonText: 'Cancel',
    });

    if (specialRequirements === undefined) return;

    try {
      setRegistering(true);
      await eventService.registerForEvent(id, specialRequirements);
      
      Swal.fire('Success!', 'You have been registered for this event', 'success');
      fetchEventDetails(); // Refresh to update registration status
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to register for event', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    const result = await Swal.fire({
      title: 'Cancel Registration?',
      text: 'Are you sure you want to cancel your registration for this event?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep Registration',
    });

    if (!result.isConfirmed) return;

    try {
      setCancelling(true);
      await eventService.cancelRegistration(id);
      
      Swal.fire('Cancelled', 'Your registration has been cancelled', 'success');
      fetchEventDetails(); // Refresh to update registration status
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to cancel registration', 'error');
    } finally {
      setCancelling(false);
    }
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

  const getRegistrationStatusBadge = () => {
    if (!userRegistration) return null;

    const badges = {
      registered: { color: 'bg-blue-100 text-blue-800', icon: FiClock, text: 'Registered' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: FiCheck, text: 'Confirmed' },
      attended: { color: 'bg-purple-100 text-purple-800', icon: FiCheck, text: 'Attended' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FiX, text: 'Cancelled' },
      no_show: { color: 'bg-gray-100 text-gray-800', icon: FiX, text: 'No Show' },
    };

    const badge = badges[userRegistration.status];
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="text-xs" />
        {badge.text}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Events
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const isRegistrationOpen = event.registration_status === 'open';
  const isEventFull = event.current_attendees >= event.max_attendees && event.max_attendees > 0;
  const isRegistrationDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) < new Date();
  const isEventPast = new Date(event.end_date) < new Date();
  const isEventExpired = isEventPast;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Featured Image */}
        <section className="relative min-h-[400px] overflow-hidden">
          {event?.featured_image ? (
            <div className="absolute inset-0 z-0">
              <img
                src={event.featured_image}
                alt={event?.title || 'Event'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
            </div>
          ) : (
            <div className="absolute inset-0 z-0">
              <img
                src="/kari-shea-apcUIqOPEIo-unsplash.jpg"
                alt="Event Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
            </div>
          )}
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <FiArrowLeft />
              Back to Events
            </button>
            
            <div className="max-w-3xl">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-white/20 rounded w-1/3 animate-pulse"></div>
                  <div className="h-12 bg-white/20 rounded w-2/3 animate-pulse"></div>
                  <div className="h-6 bg-white/20 rounded w-1/2 animate-pulse"></div>
                </div>
              ) : event ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getTypeColor(event.event_type)}`}>
                      {event.event_type.replace('_', ' ').toUpperCase()}
                    </div>
                    {getRegistrationStatusBadge()}
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {event.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      <span>{new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>{new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(event.end_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.mode === 'online' ? <FiVideo /> : <FiMapPin />}
                      <span>{event.location}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-white text-center">
                  <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
                  <p className="text-xl">The event you're looking for doesn't exist.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Event Details */}
        {!loading && event && (
          <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Agenda */}
                {event.agenda && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Agenda</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {event.agenda}
                      </p>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {event.requirements && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {event.requirements}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Registration Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="space-y-4">
                    {/* Registration Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Registration Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        isEventExpired 
                          ? 'bg-gray-100 text-gray-800'
                          : isRegistrationOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {isEventExpired 
                          ? 'Event Ended' 
                          : isRegistrationOpen 
                            ? 'Open' 
                            : 'Closed'
                        }
                      </span>
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Attendees</span>
                      <span className="text-sm font-bold text-gray-900">
                        {event.current_attendees}
                        {event.max_attendees > 0 && ` / ${event.max_attendees}`}
                      </span>
                    </div>

                    {/* Registration Fee */}
                    {event.registration_fee > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Registration Fee</span>
                        <span className="text-sm font-bold text-gray-900">
                          ${event.registration_fee}
                        </span>
                      </div>
                    )}

                    {/* Registration Deadline */}
                    {event.registration_deadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Registration Deadline</span>
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(event.registration_deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Registration Button */}
                    <div className="pt-4">
                      {userRegistration ? (
                        <div className="space-y-3">
                          <div className={`px-4 py-2 rounded-lg text-center font-medium ${
                            userRegistration.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {userRegistration.status === 'confirmed' ? 'Confirmed' : 'Registered'}
                          </div>
                          {userRegistration.status === 'registered' && !isEventExpired && (
                            <button
                              onClick={handleCancelRegistration}
                              disabled={cancelling}
                              className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={handleRegister}
                          disabled={registering || !isRegistrationOpen || isEventFull || isRegistrationDeadlinePassed || isEventPast}
                          className="w-full px-4 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isEventExpired 
                            ? 'Event Has Ended' 
                            : isEventPast 
                              ? 'Event Ended' 
                              : registering 
                                ? 'Registering...' 
                                : !isRegistrationOpen 
                                  ? isEventFull 
                                    ? 'Event Full' 
                                    : 'Registration Closed'
                                  : 'Register Now'
                          }
                        </button>
                      )}
                      
                      {!user && !isEventExpired && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Please login to register for this event
                        </p>
                      )}
                      
                      {isEventExpired && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          This event has already ended. Registration is no longer available.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Organizer */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Event Organizer</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Name</span>
                      <p className="font-medium text-gray-900">{event.organizer_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email</span>
                      <p className="font-medium text-gray-900">{event.organizer_email}</p>
                    </div>
                    {event.organizer_phone && (
                      <div>
                        <span className="text-sm text-gray-600">Phone</span>
                        <p className="font-medium text-gray-900">{event.organizer_phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {event.tags && Array.isArray(event.tags) && event.tags.length > 0 && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          <FiTag className="text-xs" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>
    </Layout>
  );
};

export default EventDetailPage;
