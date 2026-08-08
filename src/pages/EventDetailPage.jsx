import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiMapPin, FiVideo, FiUsers, FiDollarSign, FiTag, FiArrowLeft, FiCheck, FiX, FiAlertCircle, FiDownload } from 'react-icons/fi';
import eventService from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import EventCardModal from '../components/event/EventCardModal';

// Return a RELATIVE /storage path so the image loads from the current origin
// via Vite's dev proxy (see vite.config.js) — works from any host, unlike a
// hardcoded http://localhost:8000 which only resolves on the backend machine.
const resolveImage = (img) => {
  if (!img) return null;
  if (/^https?:\/\//.test(img)) {
    const m = img.match(/\/storage\/.*/);
    return m ? m[0] : img;
  }
  if (img.startsWith('/storage/')) return img;
  if (img.startsWith('storage/')) return `/${img}`;
  return `/storage/${img}`;
};

const EventDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

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
      Swal.fire(t('events.detail.errorTitle'), t('events.detail.loadDetailsFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      Swal.fire(t('events.alert.loginRequiredTitle'), t('events.alert.loginRequiredText'), 'info');
      return;
    }
    // Guard: block registration when all seats are taken.
    if (event?.max_attendees > 0 && event?.current_attendees >= event?.max_attendees) {
      Swal.fire(t('events.detail.eventFullBox', 'This event is full'), t('events.detail.eventFullNote', 'All available seats have been filled.'), 'warning');
      return;
    }

    const { value: specialRequirements } = await Swal.fire({
      title: t('events.detail.registerForEventTitle'),
      input: 'textarea',
      inputLabel: t('events.detail.specialRequirementsLabel'),
      inputPlaceholder: t('events.detail.specialRequirementsPlaceholder'),
      showCancelButton: true,
      confirmButtonText: t('events.detail.register'),
      cancelButtonText: t('events.detail.cancel'),
    });

    if (specialRequirements === undefined) return;

    try {
      setRegistering(true);
      await eventService.registerForEvent(id, specialRequirements);
      
      Swal.fire(t('events.detail.registerSuccessTitle'), t('events.detail.registerSuccessText'), 'success');
      fetchEventDetails(); // Refresh to update registration status
    } catch (error) {
      Swal.fire(t('events.detail.errorTitle'), error.message || t('events.detail.registerErrorText'), 'error');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    const result = await Swal.fire({
      title: t('events.detail.cancelRegTitle'),
      text: t('events.detail.cancelRegText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('events.detail.cancelRegConfirm'),
      cancelButtonText: t('events.detail.cancelRegKeep'),
    });

    if (!result.isConfirmed) return;

    try {
      setCancelling(true);
      await eventService.cancelRegistration(id);
      
      Swal.fire(t('events.detail.cancelledTitle'), t('events.detail.cancelledText'), 'success');
      fetchEventDetails(); // Refresh to update registration status
    } catch (error) {
      Swal.fire(t('events.detail.errorTitle'), error.message || t('events.detail.cancelErrorText'), 'error');
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
                alt={t('events.detail.bgAlt')}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('events.detail.notFoundTitle')}</h2>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('events.detail.backToEvents')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const now = new Date();
  const deadlineEnd = event.registration_deadline ? new Date(new Date(event.registration_deadline).setHours(23, 59, 59, 999)) : null;
  const isRegistrationDeadlinePassed = deadlineEnd && now > deadlineEnd;
  // Seats are full once current attendees reach the maximum (0 / null = unlimited).
  const isEventFull = event.max_attendees > 0 && event.current_attendees >= event.max_attendees;
  const isRegistrationOpen = !isRegistrationDeadlinePassed && !isEventFull;
  const isEventExpired = event.start_date ? new Date(event.start_date) < now : false;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Featured Image */}
        <section className="relative min-h-[400px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={resolveImage(event?.featured_image) || '/kari-shea-apcUIqOPEIo-unsplash.jpg'}
              alt={event?.title || t('events.detail.defaultImageAlt')}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/kari-shea-apcUIqOPEIo-unsplash.jpg'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <button
              onClick={() => navigate('/events')}
              className="mb-8 inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span>{t('events.detail.backToEvents')}</span>
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
                    {event.mode === 'online' ? t('events.detail.onlineEvent') : t('events.detail.offlineEvent')}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {event?.title || t('events.detail.defaultTitle')}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-xl" />
                  <span>{event?.start_date ? new Date(event.start_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  }) : t('events.detail.dateTbd')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-xl" />
                  <span>{event?.start_date ? new Date(event.start_date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : t('events.detail.timeTbd')} ({event?.time_zone || 'GMT+4:30'})</span>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('events.detail.aboutTitle')}</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('events.detail.locationTitle')}</h3>
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
                        {t('events.detail.joinMeeting')}
                      </a>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {event.requirements && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{t('events.detail.requirementsTitle')}</h3>
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
                      <span className="text-sm font-medium text-gray-600">{t('events.detail.registrationStatus')}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        isRegistrationDeadlinePassed
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isRegistrationDeadlinePassed
                          ? t('events.detail.registrationClosed')
                          : t('events.detail.registrationOpen')
                        }
                      </span>
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{t('events.detail.attendees')}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {event.current_attendees}
                        {event.max_attendees > 0 && ` / ${event.max_attendees}`}
                      </span>
                    </div>

                    {/* Registration Fee */}
                    {event.registration_fee > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{t('events.detail.registrationFee')}</span>
                        <span className="text-sm font-bold text-gray-900">
                          ${event.registration_fee}
                        </span>
                      </div>
                    )}

                    {/* Registration Deadline */}
                    {event.registration_deadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{t('events.detail.registrationDeadline')}</span>
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(event.registration_deadline).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
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
                            {userRegistration.status === 'confirmed' ? t('events.detail.confirmed') : t('events.detail.registered')}
                          </div>
                          <button
                            onClick={() => setShowCardModal(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#002759] text-white font-medium rounded-lg hover:bg-[#003580] transition-colors"
                          >
                            <FiDownload size={16} />
                            {userRegistration.card_downloaded ? t('events.detail.viewCard') : t('events.detail.downloadCard')}
                          </button>
                          {!userRegistration.card_downloaded && userRegistration.status === 'registered' && !isEventExpired && (
                            <button
                              onClick={handleCancelRegistration}
                              disabled={cancelling}
                              className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {cancelling ? t('events.detail.cancelling') : t('events.detail.cancelRegistration')}
                            </button>
                          )}
                          {userRegistration.card_downloaded && (
                            <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-1">
                              <FiAlertCircle size={12} />
                              {t('events.detail.cardDownloadedNote')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <>
                          {/* Only show register button if registration deadline has not passed */}
                          {isRegistrationOpen ? (
                            <button
                              onClick={handleRegister}
                              disabled={registering}
                              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {registering ? t('events.detail.registering') : t('events.detail.registerNow')}
                            </button>
                          ) : isEventFull ? (
                            /* Seats are full — no registration allowed */
                            <div className="text-center">
                              <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium">
                                {t('events.detail.eventFullBox', 'This event is full')}
                              </div>
                              <p className="text-xs text-gray-500 text-center mt-2">
                                {t('events.detail.eventFullNote', 'All available seats have been filled.')}
                              </p>
                            </div>
                          ) : (
                            /* Show appropriate message when registration deadline has passed */
                            <div className="text-center">
                              <div className="px-4 py-2 bg-red-100 text-red-600 rounded-lg">
                                {t('events.detail.deadlinePassedBox')}
                              </div>
                              <p className="text-xs text-gray-500 text-center mt-2">
                                {t('events.detail.deadlinePassedNotePrefix')}<a href="/contact" style={{color: '#2563eb', textDecoration: 'underline'}}>{t('events.detail.deadlinePassedNoteLink')}</a>{t('events.detail.deadlinePassedNoteSuffix')}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {!user && isRegistrationOpen && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          {t('events.detail.loginToRegister')}
                        </p>
                      )}
                      
                      {isRegistrationDeadlinePassed && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          {t('events.detail.deadlinePassedNote')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Organizer */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('events.detail.organizerTitle')}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">{t('events.detail.organizerName')}</span>
                      <p className="font-medium text-gray-900">{event.organizer_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">{t('events.detail.organizerEmail')}</span>
                      <p className="font-medium text-gray-900">{event.organizer_email}</p>
                    </div>
                    {event.organizer_phone && (
                      <div>
                        <span className="text-sm text-gray-600">{t('events.detail.organizerPhone')}</span>
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

      {/* Event Card Modal */}
      <EventCardModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        event={event}
        user={user}
        registration={userRegistration}
        onCardDownloaded={() => {
          setShowCardModal(false);
          fetchEventDetails();
        }}
      />
    </Layout>
  );
};

export default EventDetailPage;
