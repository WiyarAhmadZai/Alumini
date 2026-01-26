import React, { useState, useEffect } from 'react';
import { 
  FiArrowRight, 
  FiMapPin, 
  FiVideo, 
  FiChevronLeft, 
  FiChevronRight,
  FiUser,
  FiMail
} from 'react-icons/fi';
import Layout from '../components/Layout';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Eng. Ahmad Wali",
      faculty: "Faculty of Civil Engineering, Class of 2012",
      position: "Senior Structural Engineer, Global Bridges Co.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaWputQgrtqvH19cpmyP3uCvvRmQa3yZJ4fhdPG6u6uH1r6tax7vI96sWnFw9EMI0dSs6bc61_YdpgFuNeDszhcVigGvIVfjANjMt3AlTzSSr7E5m3mb9pNzz4-YZdl44IKjcYUA0Mvxl0Shnm8GbxU8ZdtZYNo9X1gp4syOsx8EZjGvYWgiELwXtgKqZFxKqS0x6zjem1YxkW0yyMTxZ7Nl0iEkeqbb5IQul9v1EPclzONwYppFPstjSfgJF7bXNeJRkm4oB1O2ZQ",
      quote: "KPU gave me the solid foundation I needed to excel in the global engineering landscape. The network I built here continues to support my professional journey as a Project Lead in Germany."
    }
  ];

  const heroSlides = [
    {
      id: 1,
      title: "Connecting KPU Graduates Across the Globe",
      subtitle: "Join the official Kabul Polytechnic University Alumni Network to mentor current students, find career opportunities, and stay connected with your alma mater.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqdS05N6dUOezB_fXLMqTRjdAAp6B3kOeB6cWFmDUtCh6j8IDrV6MDyV3yKgI7hLgUYZtqG5cv_RDjVj7WtEoAyaZHA4mndXhA0WnIyFFI6TwptPI2Ti4zi6Zf3ixLjcqWeoA-XVucLQriYGZwlIhqkE8gwl-x3gmjz-YByccyZDHW7IkUlKaU4LCxGX2gJdyUkeQI7BwVZ78_nbdY7OehekRwxmpFhXqKrplRTGPt9r7yGOv2pIJRApgUpP4aGy8iK3K6J693CixZ"
    },
    {
      id: 2,
      title: "Building Tomorrow's Leaders Today",
      subtitle: "Connect with fellow alumni and create lasting professional relationships that span across industries and borders.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6"
    },
    {
      id: 3,
      title: "Excellence in Engineering Education",
      subtitle: "Celebrating decades of academic achievement and professional success from Kabul Polytechnic University graduates.",
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
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change testimonial every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const newsItems = [
    {
      id: 1,
      title: "New Engineering Research Lab Opens",
      excerpt: "The university has unveiled a state-of-the-art facility for civil and structural engineering research...",
      category: "Research",
      date: "Oct 12, 2023",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6",
      categoryColor: "bg-primary/10 text-primary"
    },
    {
      id: 2,
      title: "2023 Graduation Highlights",
      excerpt: "Relive the proud moments from this year's convocation ceremony as we welcomed new alumni...",
      category: "Event",
      date: "Sep 28, 2023",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVohtH1gLp5WAJrlgReHjFK4bcxbaKExtmpDy1ddOFn43bBT3qxvxGyxeWK8rgUxc2WSB-oTdim3H3s_Wbux3NuIZpRy_nRWKG8WudjGPZSUyThUcvs3JH_vT483tyT74PZ49c6ks7QwWUJyRYkiz9kPgKtBcRNPt5J2oTEEQwn3MecGPMc39f7d__iXaRM87cMUs9kZQDq8XIppsbkxUr5mrUDLFHfwiLAawH4zgMRMerxMwtmcQGiblMLofVGU9ViCf5O95tPuAr",
      categoryColor: "bg-green-100 text-green-700"
    },
    {
      id: 3,
      title: "KPU Partners with Global Tech Firms",
      excerpt: "Expanding opportunities for our Computer Science graduates through international internships...",
      category: "Global",
      date: "Aug 15, 2023",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbZs0HKTcPlxNXk6tKWYQOT9Wm0jO0SMma605yZcMwgSAFJ6XQ-WK3HNZtkCXH1FtevWCcC4y8wrFdU2yTCpMEm8ALa1eX9QKXueBFPFESsu_i4OYdidoQfylLxcqlS7n0aFhkNVdNQjZhMKgq4_ceQAH-5ErWzf6kGL-Jo0oND3SPU6VJf8J1r6mou16lOAFf2qlcA3TuFA1lLN_SgGaXiHocSg_zHR_hdgZyzMmJL32ebD3WBG7IsDZ8xZZwU0eEWhSbVbzkfTFX",
      categoryColor: "bg-orange-100 text-orange-700"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Annual Alumni Gala 2024",
      date: "15",
      month: "Nov",
      time: "6:00 PM",
      location: "Main Campus Ballroom",
      icon: <FiMapPin />,
      isPrimary: true
    },
    {
      id: 2,
      title: "Tech Innovation Seminar",
      date: "02",
      month: "Dec",
      time: "2:00 PM",
      location: "Online Webinar",
      icon: <FiVideo />,
      isPrimary: false
    }
  ];

  return (
    <Layout>
      {/* Hero Section - Full Width Slider */}
      <section className="relative w-full h-screen overflow-hidden">
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
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em] mb-6 animate-slide-up">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-base md:text-lg lg:text-xl font-normal leading-relaxed mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                <button className="group relative px-8 py-3 bg-gradient-to-r from-[#002759] to-[#0a519b] text-white text-base font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10">Join the Network</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a519b] to-[#003d7a] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                </button>
                <button className="group relative px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/40 text-base font-semibold rounded-xl hover:bg-white/20 hover:border-white/60 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10">Learn More</span>
                  <div className="absolute inset-0 bg-white/20 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Slider Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>

          {/* Slider Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-10 py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#002759] mb-2">Stay Updated</h2>
            <h3 className="text-4xl font-bold leading-tight tracking-[-0.015em] text-gray-900">Latest News</h3>
          </div>
          <a className="group flex items-center gap-2 text-[#002759] font-semibold hover:text-[#0a519b] transition-all duration-300" href="#">
            View All 
            <FiArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <article key={item.id} className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className={`${item.categoryColor} text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 z-20">
                  <span className="text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                    {item.date}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold leading-tight text-gray-900 mb-3 group-hover:text-[#002759] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <a href="#" className="inline-flex items-center gap-2 text-[#002759] font-medium text-sm hover:text-[#0a519b] transition-colors duration-300">
                    Read More
                    <FiArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

        {/* Upcoming Events */}
        <section className="w-full py-16 flex justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
                 backgroundAttachment: 'fixed',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}></div>
          <div className="w-full max-w-[1200px] px-4 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <h2 className="text-primary text-sm font-bold uppercase tracking-widest mb-2">Save the Date</h2>
                <h3 className="text-white text-3xl font-bold leading-tight mb-4">Upcoming Events</h3>
                <p className="text-gray-300 mb-6">Never miss an opportunity to reconnect with your former classmates and expand your network.</p>
                <button className="h-12 px-6 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
                  View Calendar
                </button>
              </div>
              <div className="md:w-2/3 flex flex-col gap-4">
                {events.map((event, index) => (
                  <div key={event.id} className="flex gap-6 items-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:border-primary/50 transition-all group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className={`flex flex-col items-center justify-center min-w-[70px] h-[70px] ${event.isPrimary ? 'bg-primary text-white' : 'bg-white/20 border border-white/30 rounded-lg'}`}>
                      <span className="text-xl font-bold">{event.date}</span>
                      <span className="text-[10px] uppercase font-medium text-gray-300">{event.month}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h4>
                      <p className="text-gray-300 text-sm flex items-center gap-1">
                        {event.icon} {event.location} • {event.time}
                      </p>
                    </div>
                    <button className="material-symbols-outlined text-gray-400 group-hover:text-primary">arrow_forward</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="w-full py-20 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#002759] mb-2">Our Pride</h2>
              <h3 className="text-3xl font-bold">Success Stories</h3>
            </div>
            
            <div className="relative max-w-6xl mx-auto">
              <div className="overflow-hidden rounded-xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentTestimonial * 100}%)`
                  }}
                >
                  {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                    <div key={`${testimonial.id}-${index}`} className="w-full flex-shrink-0 px-4">
                      <div className="bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-6xl text-[#002759]/10 absolute top-4 left-4">"</div>
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full border-4 border-[#002759]/20 mb-4 bg-cover bg-center" 
                               style={{backgroundImage: `url("${testimonial.image}")`}}></div>
                          <p className="text-base italic text-gray-700 leading-relaxed mb-4 line-clamp-3">
                            {testimonial.quote}
                          </p>
                          <h4 className="text-lg font-bold text-[#002759]">{testimonial.name}</h4>
                          <p className="text-gray-600 text-xs">{testimonial.faculty}</p>
                          <p className="text-gray-500 text-xs font-medium mt-1">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#002759] hover:bg-[#0a519b] hover:text-white transition-all z-10"
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              >
                <FiChevronLeft />
              </button>
              <button 
                className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#002759] hover:bg-[#0a519b] hover:text-white transition-all z-10"
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-20 bg-gradient-to-br from-[#002759] via-[#0a519b] to-[#003d7a] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
          <div className="relative z-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <span className="text-sm font-bold uppercase tracking-widest text-cyan-300 bg-cyan-400/10 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl border border-cyan-300/30">Join Our Community</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to Reconnect?</h2>
              <p className="text-white/90 text-lg md:text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
                Join over 15,000 alumni worldwide and stay updated with the latest university developments and opportunities.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <button className="group relative px-10 py-4 bg-white text-[#002759] text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <FiUser className="text-lg" />
                    Sign Up Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a519b] to-[#003d7a] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                </button>
                <button className="group relative px-10 py-4 bg-transparent border-2 border-white/50 text-white text-base font-bold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:-translate-y-1">
                  <span className="flex items-center gap-2">
                    <FiMail className="text-lg" />
                    Contact Us
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 transform hover:scale-110">
                    <FiUser className="text-3xl text-cyan-400" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">15,000+</div>
                  <p className="text-white/80 text-sm md:text-base">Alumni Worldwide</p>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 transform hover:scale-110">
                    <FiMapPin className="text-3xl text-cyan-400" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
                  <p className="text-white/80 text-sm md:text-base">Countries</p>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 transform hover:scale-110">
                    <FiArrowRight className="text-3xl text-cyan-400" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
                  <p className="text-white/80 text-sm md:text-base">Success Stories</p>
                </div>
              </div>
            </div>
          </div>
        </section>
    </Layout>
  );
};

export default HomePage;
