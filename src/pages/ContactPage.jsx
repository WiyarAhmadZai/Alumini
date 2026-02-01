import React from 'react';
import Layout from '../components/Layout';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiUsers, FiMessageSquare, FiNavigation, FiCalendar, FiBriefcase, FiUser } from 'react-icons/fi';

const ContactPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/kpu4.jpg")'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-black/20"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 lg:mb-8 leading-tight tracking-tight">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
              Get in touch with Kabul Polytechnic University Alumni Association
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information & Map Section */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Email */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMail className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600 mb-3">alumni@kpu.edu.af</p>
                      <a href="mailto:alumni@kpu.edu.af" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        <FiSend className="mr-2" />
                        Send Email
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPhone className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                      <p className="text-gray-600 mb-3">+93 20 123 4567</p>
                      <a href="tel:+93201234567" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                        <FiPhone className="mr-2" />
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-600 mb-3">
                        Kabul Polytechnic University<br />
                        Kabul, Afghanistan
                      </p>
                      <a 
                        href="https://maps.google.com/?q=Kabul+Polytechnic+University" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
                      >
                        <FiNavigation className="mr-2" />
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Find Us</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  {/* Embedded Map */}
                  <div className="w-full h-[400px] bg-gray-200 relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.1234567890!2d69.1234567890!3d34.1234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDIwLjAwMDAwMCwgNjXCsDA3JjAwLjAwMDAwMA!5e0!3m2!1sen!2s!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  
                  {/* Map Overlay with Click to Navigate */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 cursor-pointer flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg px-4 py-2 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <FiNavigation className="text-blue-600" />
                        <span className="text-sm font-medium">Click for Google Maps</span>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href="https://maps.google.com/?q=Kabul+Polytechnic+University" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                    aria-label="Open in Google Maps"
                  ></a>
                </div>
                
                {/* Map Info */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Kabul Polytechnic University</h4>
                      <p className="text-sm text-gray-600">Main Campus, Kabul, Afghanistan</p>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href="https://maps.google.com/?q=Kabul+Polytechnic+University" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiNavigation className="text-sm" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about membership, events, or opportunities? We'd love to hear from you.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>General Inquiry</option>
                  <option>Membership Information</option>
                  <option>Event Registration</option>
                  <option>Career Opportunities</option>
                  <option>Mentorship Program</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="newsletter" className="ml-2 text-sm text-gray-600">
                    Subscribe to our newsletter
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <FiMessageSquare />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find what you're looking for with these helpful resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/about" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiUsers className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">About Us</h3>
              <p className="text-gray-600 text-sm">Learn more about our mission and history</p>
            </a>

            <a href="/events" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiCalendar className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Upcoming Events</h3>
              <p className="text-gray-600 text-sm">Discover our upcoming alumni events</p>
            </a>

            <a href="/mentorship" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiUser className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mentorship</h3>
              <p className="text-gray-600 text-sm">Join our mentorship program</p>
            </a>

            <a href="/jobs" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiBriefcase className="text-orange-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Career Center</h3>
              <p className="text-gray-600 text-sm">Explore job opportunities</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
