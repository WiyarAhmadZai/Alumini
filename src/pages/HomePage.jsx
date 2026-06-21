import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiArrowRight, 
  FiMapPin, 
  FiVideo, 
  FiUser,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import Layout from '../components/Layout';
import eventService from '../services/eventService';
import authService from '../services/authService';

const HomePage = () => {
  const { t } = useTranslation();
  const isLoggedIn = authService.isAuthenticated();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const testimonials = [
    {
      id: 1,
      name: t('home.testimonial1Name'),
      faculty: t('home.testimonial1Faculty'),
      position: t('home.testimonial1Position'),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaWputQgrtqvH19cpmyP3uCvvRmQa3yZJ4fhdPG6u6uH1r6tax7vI96sWnFw9EMI0dSs6bc61_YdpgFuNeDszhcVigGvIVfjANjMt3AlTzSSr7E5m3mb9pNzz4-YZdl44IKjcYUA0Mvxl0Shnm8GbxU8ZdtZYNo9X1gp4syOsx8EZjGvYWgiELwXtgKqZFxKqS0x6zjem1YxkW0yyMTxZ7Nl0iEkeqbb5IQul9v1EPclzONwYppFPstjSfgJF7bXNeJRkm4oB1O2ZQ",
      quote: t('home.testimonial1Quote')
    },
    {
      id: 2,
      name: t('home.testimonial2Name'),
      faculty: t('home.testimonial2Faculty'),
      position: t('home.testimonial2Position'),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6",
      quote: t('home.testimonial2Quote')
    },
    {
      id: 3,
      name: t('home.testimonial3Name'),
      faculty: t('home.testimonial3Faculty'),
      position: t('home.testimonial3Position'),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVohtH1gLp5WAJrlgReHjFK4bcxbaKExtmpDy1ddOFn43bBT3qxvxGyxeWK8rgUxc2WSB-oTdim3H3s_Wbux3NuIZpRy_nRWKG8WudjGPZSUyThUcvs3JH_vT483tyT74PZ49c6ks7QwWUJyRYkiz9kPgKtBcRNPt5J2oTEEQwn3MecGPMc39f7d__iXaRM87cMUs9kZQDq8XIppsbkxUr5mrUDLFHfwiLAawH4zgMRMerxMwtmcQGiblMLofVGU9ViCf5O95tPuAr",
      quote: t('home.testimonial3Quote')
    },
    {
      id: 4,
      name: t('home.testimonial4Name'),
      faculty: t('home.testimonial4Faculty'),
      position: t('home.testimonial4Position'),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqdS05N6dUOezB_fXLMqTRjdAAp6B3kOeB6cWFmDUtCh6j8IDrV6MDyV3yKgI7hLgUYZtqG5cv_RDjVj7WtEoAyaZHA4mndXhA0WnIyFFI6TwptPI2Ti4zi6Zf3ixLjcqWeoA-XVucLQriYGZwlIhqkE8gwl-x3gmjz-YByccyZDHW7IkUlKaU4LCxGX2gJdyUkeQI7BwVZ78_nbdY7OehekRwxmpFhXqKrplRTGPt9r7yGOv2pIJRApgUpP4aGy8iK3K6J693CixZ",
      quote: t('home.testimonial4Quote')
    }
  ];

  const heroSlides = [
    {
      id: 1,
      title: t('home.heroSlide1Title'),
      subtitle: t('home.heroSlide1Subtitle'),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqdS05N6dUOezB_fXLMqTRjdAAp6B3kOeB6cWFmDUtCh6j8IDrV6MDyV3yKgI7hLgUYZtqG5cv_RDjVj7WtEoAyaZHA4mndXhA0WnIyFFI6TwptPI2Ti4zi6Zf3ixLjcqWeoA-XVucLQriYGZwlIhqkE8gwl-x3gmjz-YByccyZDHW7IkUlKaU4LCxGX2gJdyUkeQI7BwVZ78_nbdY7OehekRwxmpFhXqKrplRTGPt9r7yGOv2pIJRApgUpP4aGy8iK3K6J693CixZ"
    },
    {
      id: 2,
      title: t('home.heroSlide2Title'),
      subtitle: t('home.heroSlide2Subtitle'),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6"
    },
    {
      id: 3,
      title: t('home.heroSlide3Title'),
      subtitle: t('home.heroSlide3Subtitle'),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVohtH1gLp5WAJrlgReHjFK4bcxbaKExtmpDy1ddOFn43bBT3qxvxGyxeWK8rgUxc2WSB-oTdim3H3s_Wbux3NuIZpRy_nRWKG8WudjGPZSUyThUcvs3JH_vT483tyT74PZ49c6ks7QwWUJyRYkiz9kPgKtBcRNPt5J2oTEEQwn3MecGPMc39f7d__iXaRM87cMUs9kZQDq8XIppsbkxUr5mrUDLFHfwiLAawH4zgMRMerxMwtmcQGiblMLofVGU9ViCf5O95tPuAr"
    }
  ];

  // Auto-slide functionality for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Auto-slide functionality for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => {
        if (prev >= testimonials.length) {
          // When reaching the cloned first card, instantly jump to real first card
          return 0;
        }
        return prev + 1;
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [testimonials.length]);

  // Fetch upcoming events — only events whose start_date is strictly in the future,
  // sorted nearest-first, with the closest event highlighted at the top.
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        // Ask the backend for upcoming events only (start_date > now), nearest first.
        // Without status=upcoming the list is sorted by start_date asc and returns the
        // OLDEST (past) events first, pushing genuine upcoming events out of the page.
        const response = await eventService.getEvents({
          per_page: 20,
          status: 'upcoming',
          sort_by: 'start_date',
          sort_order: 'asc',
        });
        const allEvents = response.data.data;
        const now = new Date();

        const futureEvents = allEvents.filter(event => {
          const startDate = new Date(event.start_date);
          if (!(startDate > now)) return false; // must be strictly in the future

          if (event.registration_deadline) {
            const deadlineDate = new Date(event.registration_deadline);
            if (deadlineDate <= now) return false; // registration already closed
          }
          return true;
        });

        // Featured events bubble to the top, then sort by nearest start_date.
        const nearestEvents = futureEvents
          .sort((a, b) => {
            const af = a.is_featured ? 1 : 0;
            const bf = b.is_featured ? 1 : 0;
            if (af !== bf) return bf - af;
            return new Date(a.start_date) - new Date(b.start_date);
          })
          .slice(0, 2);

        setUpcomingEvents(nearestEvents);
      } catch (error) {
        // Silently handle error
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Fetch latest 3 events for news section
  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const response = await eventService.getEvents({ per_page: 10 });
        const allEvents = response.data.data;
        // Sort by start_date descending to get most recent first, take top 3
        const sorted = [...allEvents]
          .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
          .slice(0, 3);
        setLatestEvents(sorted);
      } catch {
        // silently ignore
      }
    };
    fetchLatestEvents();
  }, []);

  // Update countdown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero Section - Full Width Slider */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden">
        <div className="relative w-full h-full bg-black">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%), url("${slide.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
          
          <div className="relative z-10 h-full flex items-center justify-center px-3 sm:px-4 md:px-6">
            <div className="text-center text-white max-w-5xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black leading-tight tracking-[-0.033em] mb-3 sm:mb-4 md:mb-6 animate-slide-up">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-normal leading-relaxed mb-4 sm:mb-6 md:mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                <Link to="/login" className="group relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#002759] to-[#0a519b] text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl hover:shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden inline-block text-center">
                  <span className="relative z-10">{t('home.joinTheNetwork')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a519b] to-[#003d7a] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                </Link>
                <button className="group relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-md text-white border border-white/40 text-xs sm:text-sm md:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-white/20 hover:border-white/60 hover:shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10">{t('home.learnMore')}</span>
                  <div className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Slider Navigation Dots */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-1 sm:gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-4 sm:w-6 md:w-8' : 'bg-white/50 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Events / News Section */}
      <section className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 sm:mb-8 lg:mb-12 gap-4">
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#002759] mb-1 sm:mb-2">{t('home.stayUpdated')}</h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] text-gray-900">{t('home.latestEvents')}</h3>
          </div>
          <Link
            to="/events"
            className="group flex items-center gap-1 sm:gap-2 text-[#002759] font-semibold hover:text-[#194ce6] transition-all duration-300"
          >
            {t('common.viewAll')}
            <FiArrowRight className="text-xs sm:text-sm transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {latestEvents.length === 0 ? (
          /* Skeleton while loading */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-0">
            {latestEvents.map((event) => {
              const eventDate = new Date(event.start_date);
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });
              const category = event.type || event.event_type || t('home.eventCategoryDefault');
              const image = event.image || event.cover_image || event.thumbnail;

              return (
                <article key={event.id} className="group cursor-pointer bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    {image ? (
                      <img
                        src={image}
                        alt={event.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #0f2d8a 0%, #194ce6 100%)' }}>
                        <FiCalendar className="text-white/40 text-5xl" />
                      </div>
                    )}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20">
                      <span className="text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full shadow-md capitalize"
                        style={{ background: '#eef1fd', color: '#194ce6' }}>
                        {category}
                      </span>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-20">
                      <span className="text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-1 sm:px-2 py-0.5 rounded">
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold leading-tight text-gray-900 mb-1 sm:mb-2 md:mb-3 group-hover:text-[#194ce6] transition-colors duration-300 line-clamp-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-3 md:mb-4">
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-gray-400 text-xs flex items-center gap-1 mb-3">
                        <FiMapPin className="text-xs flex-shrink-0" />
                        {event.location}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/events/${event.id}`}
                        className="inline-flex items-center gap-1 sm:gap-2 font-medium text-xs sm:text-sm transition-colors duration-300"
                        style={{ color: '#194ce6' }}
                      >
                        {t('common.readMore')}
                        <FiArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                      <div className="flex gap-0.5 sm:gap-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#194ce6', opacity: 0.4 }} />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#194ce6', opacity: 0.7 }} />
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: '#194ce6' }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

        {/* Upcoming Events */}
        <section className="w-full py-12 sm:py-16 flex justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
                 backgroundAttachment: 'fixed',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}></div>
          <div className="w-full max-w-[1200px] px-4 sm:px-6 md:px-10 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="lg:w-1/3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-2">{t('home.saveTheDate')}</h2>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-4 text-white">{t('home.upcomingEvents')}</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">{t('home.upcomingEventsSubtitle')}</p>
                <Link 
                  to="/events"
                  className="h-16 px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#002759] transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {t('home.viewCalendar')}
                </Link>
              </div>
              <div className="lg:w-2/3 flex flex-col gap-3 sm:gap-4">
                {upcomingEvents.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center p-8 sm:p-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mb-4">
                      <FiCalendar className="text-blue-300 text-2xl sm:text-3xl" />
                    </div>
                    <h4 className="text-white text-lg sm:text-xl font-bold mb-2">{t('home.noUpcomingEvents')}</h4>
                    <p className="text-gray-300 text-xs sm:text-sm max-w-md">
                      {t('home.noUpcomingEventsDesc')}
                    </p>
                    <Link
                      to="/events"
                      className="mt-5 inline-flex items-center gap-2 px-5 py-2 border border-white/40 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-white/15 transition-colors"
                    >
                      <FiCalendar /> {t('home.browseCalendar')}
                    </Link>
                  </div>
                )}
                {upcomingEvents.map((event, index) => {
                  const eventDate = new Date(event.start_date);
                  const day = eventDate.getDate();
                  const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
                  const time = eventDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  });
                  const isOnline = event.mode === 'online';
                  
                  // Calculate countdown
                  const now = new Date();
                  const timeDiff = eventDate - now;
                  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                  
                  return (
                    <div key={event.id} className="flex gap-3 sm:gap-6 items-center p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:border-[#002759]/50 transition-all group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className={`flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px] h-[60px] sm:h-[70px] ${index === 0 ? 'bg-[#002759] text-white' : 'bg-white/20 border border-white/30 rounded-lg'}`}>
                        <span className="text-lg sm:text-xl font-bold">{day}</span>
                        <span className="text-[10px] uppercase font-medium text-gray-300">{month}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-base sm:text-lg font-bold transition-colors">{event.title}</h4>
                        <p className="text-gray-300 text-xs sm:text-sm flex items-center gap-1">
                          {isOnline ? <FiVideo /> : <FiMapPin />} {event.location} • {time}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {days > 0 && `${days}${t('home.unitDay')} `}
                          {hours > 0 && `${hours}${t('home.unitHour')} `}
                          {minutes > 0 && `${minutes}${t('home.unitMinute')} `}
                          {seconds >= 0 && `${seconds}${t('home.unitSecond')}`} {t('home.left')}
                        </p>
                      </div>
                      <Link 
                        to={`/events/${event.id}`}
                        className="material-symbols-outlined text-gray-400 hover:text-white transition-colors"
                      >
                        arrow_forward
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories - Modern Slider */}
        <section className="w-full py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-[#002759] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#0a519b] rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12">
              <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest text-[#002759] mb-2 sm:mb-3 px-3 py-1.5 bg-[#002759]/10 rounded-full">
                {t('home.ourPride')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3 bg-gradient-to-r from-[#002759] to-[#0a519b] bg-clip-text text-transparent">
                {t('home.successStories')}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                {t('home.successStoriesSubtitle')}
              </p>
            </div>
            
            {/* Modern Slider */}
            <div className="relative max-w-6xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white border border-gray-100">
                {/* Slider Container */}
                <div 
                  className="flex transition-transform duration-700 ease-out"
                  style={{
                    transform: `translateX(-${currentTestimonial * 100}%)`,
                    transition: currentTestimonial === 0 ? 'none' : 'transform 700ms ease-out'
                  }}
                >
                  {[...testimonials, testimonials[0]].map((testimonial, index) => (
                    <div key={`${testimonial.id}-${index}`} className="w-full flex-shrink-0">
                      <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
                        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
                          {/* Left - Image */}
                          <div className="relative order-2 lg:order-1">
                            <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56">
                              {/* Glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-[#002759]/15 to-[#0a519b]/15 rounded-full blur-2xl transform scale-110"></div>
                              {/* Image container */}
                              <div className="relative w-full h-full rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-xl">
                                <img 
                                  src={testimonial.image} 
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {/* Floating badge */}
                              <div className="absolute -bottom-2 -right-2 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#002759] to-[#0a519b] rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right - Content */}
                          <div className="order-1 lg:order-2 text-center lg:text-left">
                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                              {testimonial.quote}
                            </p>
                            
                            <div className="space-y-2 sm:space-y-3">
                              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#002759]">
                                {testimonial.name}
                              </h4>
                              <div className="space-y-1">
                                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                                  {testimonial.faculty}
                                </p>
                                <p className="text-[#0a519b] text-xs sm:text-sm font-semibold">
                                  {testimonial.position}
                                </p>
                              </div>
                            </div>
                            
                            {/* Achievement badges */}
                            <div className="flex flex-wrap gap-2 mt-4 sm:mt-6 justify-center lg:justify-start">
                              <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#002759]/10 to-[#0a519b]/10 text-[#002759] text-xs font-semibold rounded-full border border-[#002759]/20">
                                {t('home.badgeAlumniSuccess')}
                              </span>
                              <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#0a519b]/10 to-[#003d7a]/10 text-[#0a519b] text-xs font-semibold rounded-full border border-[#0a519b]/20">
                                {t('home.badgeGlobalImpact')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <button 
                className="absolute top-1/2 -left-3 sm:-left-4 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-[#002759] hover:bg-gradient-to-r hover:from-[#002759] hover:to-[#0a519b] hover:text-white transition-all duration-300 z-20 group border border-gray-100"
                onClick={() => {
                  if (currentTestimonial === 0) {
                    setCurrentTestimonial(testimonials.length - 1);
                  } else {
                    setCurrentTestimonial(prev => prev - 1);
                  }
                }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="absolute top-1/2 -right-3 sm:-right-4 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white shadow-xl flex items-center justify-center text-[#002759] hover:bg-gradient-to-r hover:from-[#002759] hover:to-[#0a519b] hover:text-white transition-all duration-300 z-20 group border border-gray-100"
                onClick={() => {
                  setCurrentTestimonial(prev => prev + 1);
                }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                      (currentTestimonial === index || (currentTestimonial === testimonials.length && index === 0))
                        ? 'w-8 sm:w-12 bg-gradient-to-r from-[#002759] to-[#0a519b]' 
                        : 'w-2.5 sm:w-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join Community - Modern CTA */}
        <section className="w-full py-12 sm:py-16 lg:py-20 relative overflow-hidden">
          {/* Background with modern gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#002759] to-slate-800"></div>
          
          {/* Modern decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full blur-2xl"></div>
          </div>
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="text-center mb-10 sm:mb-12">
              {!isLoggedIn ? (
                <>
                  {/* Modern badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full mb-6">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    <span className="text-cyan-300 text-sm font-semibold">{t('home.joinOurGlobalNetwork')}</span>
                  </div>

                  {/* Main heading */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                    {t('home.readyTo')}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> {t('home.reconnect')}</span>{t('home.questionMark')}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-white/70 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10">
                    {t('home.ctaSubtitle')}
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                    <Link to="/register" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-base sm:text-lg font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      <span className="relative z-10 flex items-center gap-3">
                        <FiUser className="text-xl" />
                        {t('home.signUpNow')}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                    </Link>

                    <Link to="/contact" className="group relative px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white text-base sm:text-lg font-bold rounded-xl hover:bg-white/20 hover:border-white/40 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                      <span className="flex items-center gap-3">
                        <FiMail className="text-xl" />
                        {t('home.contactUs')}
                      </span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Logged-in alumni: motivational message instead of the sign-up CTA */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full mb-6">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    <span className="text-cyan-300 text-sm font-semibold">{t('home.memberBadge')}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                    {t('home.welcomeBackTitle')}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> {t('home.welcomeBackHighlight')}</span>
                  </h2>
                  <p className="text-white/70 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10">
                    {t('home.welcomeBackSubtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                    <Link to="/mentorship" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-base sm:text-lg font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 transition-all duration-300">
                      <span className="flex items-center gap-3"><FiUser className="text-xl" />{t('home.exploreMentorship')}</span>
                    </Link>
                    <Link to="/events" className="group relative px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white text-base sm:text-lg font-bold rounded-xl hover:bg-white/20 hover:border-white/40 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                      <span className="flex items-center gap-3"><FiCalendar className="text-xl" />{t('home.browseEvents')}</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
    </Layout>
  );
};

export default HomePage;
