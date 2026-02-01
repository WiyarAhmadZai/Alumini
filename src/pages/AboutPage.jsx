import React from 'react';
import Layout from '../components/Layout';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiFacebook, FiAward, FiUsers, FiTarget, FiGlobe } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/kpu1.jpg")'}}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 lg:mb-8 leading-tight tracking-tight">
              About KPU Alumni Association
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
              Building lifelong connections and fostering professional growth for Kabul Polytechnic University graduates worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Mission & History Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Mission */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-6">
                <FiTarget className="text-3xl sm:text-4xl text-blue-600 mr-4" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  To create a vibrant network of Kabul Polytechnic University alumni, fostering professional development, 
                  knowledge sharing, and collaborative opportunities that contribute to the advancement of our members 
                  and the engineering community in Afghanistan and beyond.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  We strive to maintain strong connections between graduates and the university, facilitating mentorship, 
                  career opportunities, and continuous learning while celebrating the achievements of our alumni community.
                </p>
              </div>
            </div>

            {/* History */}
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-6">
                <FiGlobe className="text-3xl sm:text-4xl text-blue-600 mr-4" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Our History</h2>
              </div>
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Founded in 2010, the KPU Alumni Association began as a small initiative by dedicated graduates who 
                  recognized the need for a structured network to connect Kabul Polytechnic University alumni across 
                  various engineering disciplines and geographical locations.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Over the past decade, we have grown from a handful of members to a thriving community of over 
                  5,000 alumni, establishing chapters in major cities and organizing numerous events that bring 
                  our community together.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Today, we stand as a testament to the excellence of KPU's engineering education and the remarkable 
                  achievements of our graduates in shaping Afghanistan's infrastructure and technological advancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message from Chancellor Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Message from the Chancellor</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto"></div>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5">
                  <div className="h-full min-h-[300px] lg:min-h-[400px] bg-cover bg-center" style={{backgroundImage: 'url("/chancellor_bg.jpg")'}}></div>
                </div>
                <div className="lg:w-3/5 p-6 sm:p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <FiAward className="text-3xl text-blue-600 mr-3" />
                    <span className="text-blue-600 font-semibold text-lg">Leadership Message</span>
                  </div>
                  <blockquote className="text-lg sm:text-xl text-gray-700 italic leading-relaxed mb-8 font-light">
                    "The KPU Alumni Association represents the pride of our institution. Our graduates continue to 
                    make significant contributions to Afghanistan's development, and this association serves as a 
                    bridge between our past achievements and future aspirations. I encourage all alumni to actively 
                    participate in this vibrant community."
                  </blockquote>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-gray-600 text-2xl sm:text-3xl">👤</span>
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Dr. Ahmad Zia Massoud</h4>
                      <p className="text-gray-600 text-base sm:text-lg">Chancellor, Kabul Polytechnic University</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Board Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet the Board</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Dedicated leaders guiding our alumni community</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Board Member 1 */}
            <div className="text-center group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-4xl sm:text-5xl md:text-6xl">👤</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Eng. Mohammad Hassan</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3 font-medium">President</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">Civil Engineering, Class of 1995</p>
              <div className="flex justify-center gap-3 sm:gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
              </div>
            </div>

            {/* Board Member 2 */}
            <div className="text-center group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-4xl sm:text-5xl md:text-6xl">👤</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Dr. Sarah Ahmadzai</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3 font-medium">Vice President</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">Electrical Engineering, Class of 2000</p>
              <div className="flex justify-center gap-3 sm:gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
              </div>
            </div>

            {/* Board Member 3 */}
            <div className="text-center group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-4xl sm:text-5xl md:text-6xl">👤</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Ahmad Wali Karimi</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3 font-medium">Secretary</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">Mechanical Engineering, Class of 2008</p>
              <div className="flex justify-center gap-3 sm:gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
              </div>
            </div>

            {/* Board Member 4 */}
            <div className="text-center group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-4xl sm:text-5xl md:text-6xl">👤</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">Fatima Noori</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3 font-medium">Treasurer</p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">Computer Engineering, Class of 2012</p>
              <div className="flex justify-center gap-3 sm:gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Reconnect Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-8 sm:mb-12">
            <FiUsers className="text-4xl sm:text-5xl md:text-6xl text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              Ready to reconnect with your alma mater?
            </h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Join thousands of KPU graduates who are already making a difference through our alumni network. 
            Whether you're looking to mentor current students, find career opportunities, or simply stay connected 
            with old friends, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-blue-900 font-bold text-base sm:text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Join Alumni Network
            </button>
            <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-lg hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">We'd love to hear from you</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <FiMail className="text-blue-600 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600 text-base sm:text-lg font-medium">alumni@kpu.edu.af</p>
            </div>
            
            <div className="text-center group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <FiPhone className="text-blue-600 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Phone</h3>
              <p className="text-gray-600 text-base sm:text-lg font-medium">+93 20 123 4567</p>
            </div>
            
            <div className="text-center group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 sm:p-8 lg:col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <FiMapPin className="text-blue-600 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Address</h3>
              <p className="text-gray-600 text-base sm:text-lg font-medium">Kabul Polytechnic University<br />Kabul, Afghanistan</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
