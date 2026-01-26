import React, { useState, useEffect } from 'react';
import { 
  FiArrowRight, 
  FiMapPin, 
  FiVideo, 
  FiChevronLeft, 
  FiChevronRight
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

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

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
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.8) 100%), url("${slide.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em] mb-6 animate-slide-up">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl font-normal leading-relaxed mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                <button className="min-w-[160px] h-12 px-6 bg-primary text-white text-base font-bold rounded-lg shadow-lg hover:scale-105 transition-transform">
                  Join the Network
                </button>
                <button className="min-w-[160px] h-12 px-6 bg-white/20 backdrop-blur-md text-white border border-white/30 text-base font-bold rounded-lg hover:bg-white/30 transition-all">
                  Learn More
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
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-10 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em]">Latest News</h2>
            <a className="text-primary font-semibold flex items-center gap-1 hover:underline" href="#">
              View All <FiArrowRight className="text-sm" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-4 group cursor-pointer bg-white dark:bg-background-dark p-2 rounded-xl border border-transparent hover:border-primary/20 hover:shadow-lg transition-all animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden" style={{backgroundImage: `url("${item.image}")`}}></div>
                <div className="px-2 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${item.categoryColor} text-[10px] uppercase font-bold px-2 py-0.5 rounded`}>{item.category}</span>
                    <p className="text-[#636c88] dark:text-gray-400 text-xs font-normal">{item.date}</p>
                  </div>
                  <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-[#636c88] dark:text-gray-400 text-sm font-normal leading-normal mt-2 line-clamp-2">{item.excerpt}</p>
                </div>
              </div>
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
        <section className="w-full max-w-[1200px] mx-auto px-4 md:px-10 py-20 text-center">
          <h2 className="text-primary text-sm font-bold uppercase tracking-widest mb-2">Our Pride</h2>
          <h3 className="text-3xl font-bold mb-12">Success Stories</h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-background-dark p-10 md:p-16 rounded-3xl shadow-2xl relative animate-scale-in">
              <div className="text-6xl text-primary/10 absolute top-8 left-8">"</div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 mb-6 bg-cover bg-center" 
                     style={{backgroundImage: `url("${testimonials[currentTestimonial].image}")`}}></div>
                <p className="text-lg md:text-xl italic text-[#111318] dark:text-gray-300 leading-relaxed mb-8">
                  {testimonials[currentTestimonial].quote}
                </p>
                <h4 className="text-xl font-bold text-primary">{testimonials[currentTestimonial].name}</h4>
                <p className="text-[#636c88] dark:text-gray-400 text-sm">{testimonials[currentTestimonial].faculty}</p>
                <p className="text-gray-400 text-xs font-medium mt-1">{testimonials[currentTestimonial].position}</p>
              </div>
              <div className="flex justify-center gap-2 mt-10">
                {testimonials.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full ${index === currentTestimonial ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                ))}
              </div>
            </div>
            <button 
              className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            >
              <FiChevronLeft />
            </button>
            <button 
              className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
            >
              <FiChevronRight />
            </button>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full bg-primary text-white py-16 px-4">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">Ready to Reconnect?</h2>
            <p className="text-white/80 text-lg mb-10 animate-slide-up" style={{animationDelay: '0.2s'}}>
              Join over 15,000 alumni worldwide and stay updated with the latest university developments and opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <button className="h-12 px-8 bg-white text-primary font-bold rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Sign Up Now
              </button>
              <button className="h-12 px-8 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all">
                Contact Us
              </button>
            </div>
          </div>
        </section>
    </Layout>
  );
};

export default HomePage;
