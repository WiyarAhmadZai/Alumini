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

  const getBadgeIcon = (badgeType) => {
    const icons = {
      'type': FiTag,
      'mode': FiVideo,
      'capacity': FiUsers,
      'fee': FiDollarSign,
    };
    return icons[badgeType] || FiCheck;
  };

  const renderBadge = (badge) => {
    const Icon = badge.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <Icon className="text-xs" />
        {badge.text}
      </div>
    );
  };

  // Show site structure while loading instead of loader
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section with Background Image */}
          <section className="relative min-h-[400px] overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="/kari-shea-apcUIqOPEIo-unsplash.jpg"
                alt="Event Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-32 mb-4"></div>
                <div className="h-12 bg-gray-300 rounded w-3/4 mb-6"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-8">
                {/* Event Details */}
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>
                </div>

                {/* Event Description */}
                <div className="bg-white rounded-lg p-8 border border-gray-200">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Registration Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Event Organizer */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
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
  
  // Compare exact date and time, not just date
  const now = new Date();
  const isRegistrationDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) <= now;
  const isEventPast = new Date(event.end_date) <= now;
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
              className="mb-8 inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span>Back to Events</span>
            </button>
            
            <div className="text-white">
              <div className="flex flex-wrap gap-3 mb-6">
                {event?.event_type && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getTypeColor(event.event_type)}`}>
                    {event.event_type}
                  </span>
                )}
                {event?.mode && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold text-white">
                    {event.mode === 'online' ? 'Online Event' : 'Offline Event'}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {event?.title || 'Event Title'}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-xl" />
                  <span>{event?.start_date ? new Date(event.start_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Date TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-xl" />
                  <span>{event?.start_date ? new Date(event.start_date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  }) : 'Time TBD'} - {event?.end_date ? new Date(event.end_date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  }) : ''} ({event?.time_zone || 'GMT+4:30'})</span>
                </div>
              </div>
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

                {/* Location */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                  <div className="flex items-center gap-3 text-gray-700">
                    {event.location.includes('Online') ? (
                      <FiVideo className="text-xl text-blue-600" />
                    ) : (
                      <FiMapPin className="text-xl text-blue-600" />
                    )}
                    <span>{event.location}</span>
                  </div>
                  {event.mode === 'online' && event.meeting_link && (
                    <div className="mt-3">
                      <a
                        href={event.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Join Meeting →
                      </a>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {event.requirements && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
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
                        <>
                          {/* Only show register button if registration is open and not expired */}
                          {isRegistrationOpen && !isRegistrationDeadlinePassed && !isEventExpired ? (
                            <button
                              onClick={handleRegister}
                              disabled={registering || isEventFull}
                              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {registering ? 'Registering...' : 'Register Now'}
                            </button>
                          ) : (
                            /* Show appropriate message when registration is not available */
                            <div className="text-center">
                              {isEventExpired ? (
                                <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                                  Event has ended
                                </div>
                              ) : isRegistrationDeadlinePassed ? (
                                <div className="px-4 py-2 bg-red-100 text-red-600 rounded-lg">
                                  Registration deadline has passed
                                </div>
                              ) : isEventFull ? (
                                <div className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg">
                                  Event is full
                                </div>
                              ) : (
                                <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                                  Registration not available
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      
                      {!user && !isEventExpired && !isRegistrationDeadlinePassed && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Please login to register for this event
                        </p>
                      )}
                      
                      {isEventExpired && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          This event has already ended. Registration is no longer available.
                        </p>
                      )}
                      
                      {isRegistrationDeadlinePassed && !isEventExpired && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          The registration deadline for this event has passed.
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
              </div>
            </div>
          </main>
        )}
      </div>
    </Layout>
  );
};

export default EventDetailPage;
