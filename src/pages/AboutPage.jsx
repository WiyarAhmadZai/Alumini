import React from 'react';
import Layout from '../components/Layout';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiFacebook, FiAward, FiUsers, FiTarget, FiGlobe, FiArrowRight } from 'react-icons/fi';

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
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles and journey that guide our alumni community</p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <FiTarget className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    To create a vibrant network of Kabul Polytechnic University alumni, fostering professional development, 
                    knowledge sharing, and collaborative opportunities that contribute to the advancement of our members 
                    and the engineering community in Afghanistan and beyond.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    We strive to maintain strong connections between graduates and the university, facilitating mentorship, 
                    career opportunities, and continuous learning while celebrating the achievements of our alumni community.
                  </p>
                </div>
                <div className="mt-6 flex items-center text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors cursor-pointer">
                  <span>Learn more about our mission</span>
                  <FiArrowRight className="ml-2" />
                </div>
              </div>
            </div>

            {/* History Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <FiGlobe className="text-emerald-600 text-xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our History</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Founded in 2010, the KPU Alumni Association began as a small initiative by dedicated graduates who 
                    recognized the need for a structured network to connect Kabul Polytechnic University alumni across 
                    various engineering disciplines and geographical locations.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Over the past decade, we have grown from a handful of members to a thriving community of over 
                    5,000 alumni, establishing chapters in major cities and organizing numerous events that bring 
                    our community together.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Today, we stand as a testament to the excellence of KPU's engineering education and the remarkable 
                    achievements of our graduates in shaping Afghanistan's infrastructure and technological advancement.
                  </p>
                </div>
                <div className="mt-6 flex items-center text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors cursor-pointer">
                  <span>Explore our journey</span>
                  <FiArrowRight className="ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600 text-sm">Active Alumni</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-emerald-600 mb-2">13+</div>
              <div className="text-gray-600 text-sm">Years of Excellence</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">8+</div>
              <div className="text-gray-600 text-sm">Global Chapters</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600 text-sm">Annual Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message from Chancellor Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full mb-4">
              <FiAward className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Leadership Message</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Words of wisdom from our esteemed Chancellor</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="p-8 sm:p-10 lg:p-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                  {/* Chancellor Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden shadow-lg">
                        <img src="/chanceler.jpg" alt="Dr. Ahmad Zia Massoud" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                        <FiAward className="text-white text-lg" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="mb-6">
                      <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                        Chancellor's Vision
                      </span>
                    </div>
                    
                    <div className="text-gray-700 leading-relaxed mb-8 text-base sm:text-lg font-normal">
                      The KPU Alumni Association represents the pride of our institution. Our graduates continue to 
                      make significant contributions to Afghanistan's development, and this association serves as a 
                      bridge between our past achievements and future aspirations. I encourage all alumni to actively 
                      participate in this vibrant community.
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <h4 className="text-xl font-bold text-gray-900">Dr. Ahmad Zia Massoud</h4>
                          <p className="text-gray-600 text-sm sm:text-base">Chancellor</p>
                          <p className="text-blue-600 text-sm">Kabul Polytechnic University</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4 sm:mt-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                          <FiMail className="text-blue-600 text-sm" />
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                          <FiLinkedin className="text-blue-600 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Bar */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-white text-sm font-medium">
                    Leading Excellence in Engineering Education Since 2010
                  </div>
                  <div className="flex items-center text-white/80 hover:text-white transition-colors cursor-pointer">
                    <span className="text-sm mr-2">Read Full Message</span>
                    <FiArrowRight className="text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chancellor Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600 text-sm">Years of Academic Leadership</div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-emerald-600 mb-2">10,000+</div>
              <div className="text-gray-600 text-sm">Graduates Mentored</div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 text-sm">Research Publications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Board Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Dedicated leaders guiding our alumni community</p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Board Member 1 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div className="p-6 text-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                  <img src="/1teacher.jpg" alt="Mohammad Hassan" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Eng. Mohammad Hassan</h3>
                <div className="w-12 h-1 bg-blue-600 mx-auto mb-3"></div>
                <p className="text-blue-600 font-semibold text-sm mb-3">President</p>
                <p className="text-gray-500 text-xs mb-4">Civil Engineering, Class of 1995</p>
                <div className="flex justify-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                    <FiLinkedin className="text-blue-600 text-sm" />
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                    <FiMail className="text-blue-600 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Board Member 2 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
              <div className="p-6 text-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                  <img src="/teacher.jpg" alt="Sarah Ahmadzai" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Dr. Sarah Ahmadzai</h3>
                <div className="w-12 h-1 bg-emerald-600 mx-auto mb-3"></div>
                <p className="text-emerald-600 font-semibold text-sm mb-3">Vice President</p>
                <p className="text-gray-500 text-xs mb-4">Electrical Engineering, Class of 2000</p>
                <div className="flex justify-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors cursor-pointer">
                    <FiLinkedin className="text-emerald-600 text-sm" />
                  </div>
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors cursor-pointer">
                    <FiMail className="text-emerald-600 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Board Member 3 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-400"></div>
              <div className="p-6 text-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                  <img src="/depositphotos_229021826-stock-photo-focused-male-teacher-formal-wear.jpg" alt="Ahmad Wali Karimi" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ahmad Wali Karimi</h3>
                <div className="w-12 h-1 bg-purple-600 mx-auto mb-3"></div>
                <p className="text-purple-600 font-semibold text-sm mb-3">Secretary</p>
                <p className="text-gray-500 text-xs mb-4">Mechanical Engineering, Class of 2008</p>
                <div className="flex justify-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors cursor-pointer">
                    <FiLinkedin className="text-purple-600 text-sm" />
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors cursor-pointer">
                    <FiMail className="text-purple-600 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Board Member 4 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-orange-600 to-orange-400"></div>
              <div className="p-6 text-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                  <img src="/depositphotos_85627224-stock-photo-civil-engineer-on-blackboard.jpg" alt="Fatima Noori" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fatima Noori</h3>
                <div className="w-12 h-1 bg-orange-600 mx-auto mb-3"></div>
                <p className="text-orange-600 font-semibold text-sm mb-3">Treasurer</p>
                <p className="text-gray-500 text-xs mb-4">Computer Engineering, Class of 2012</p>
                <div className="flex justify-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors cursor-pointer">
                    <FiLinkedin className="text-orange-600 text-sm" />
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors cursor-pointer">
                    <FiMail className="text-orange-600 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Board Stats */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">15+</div>
                <div className="text-sm text-gray-600">Years Combined Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
                <div className="text-sm text-gray-600">Engineering Disciplines</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">100+</div>
                <div className="text-sm text-gray-600">Projects Led</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
                <div className="text-sm text-gray-600">Awards & Recognitions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Reconnect Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <FiUsers className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to reconnect with your alma mater?
            </h2>
            <div className="w-16 h-1 bg-white mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg sm:text-xl text-white/95 leading-relaxed font-light">
              Join thousands of KPU graduates who are already making a difference through our alumni network. 
              Whether you're looking to mentor current students, find career opportunities, or simply stay connected 
              with old friends, we're here to help you succeed.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12">
            <button className="group px-8 py-4 bg-white text-blue-900 font-bold text-base sm:text-lg rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center">
              <span>Join Alumni Network</span>
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-xl hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center">
              <span>Learn More</span>
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <div className="text-white/80 text-sm">Active Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-sm">Events Yearly</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">8+</div>
              <div className="text-white/80 text-sm">Global Chapters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full mb-4">
              <FiMail className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">We'd love to hear from you</p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 sm:p-8 border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FiMail className="text-blue-600 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600 text-base sm:text-lg font-medium mb-4">alumni@kpu.edu.af</p>
              <div className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                <span className="text-sm font-medium">Send Message</span>
                <FiArrowRight className="ml-2 text-sm" />
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 sm:p-8 border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FiPhone className="text-emerald-600 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Phone</h3>
              <p className="text-gray-600 text-base sm:text-lg font-medium mb-4">+93 20 123 4567</p>
              <div className="flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer">
                <span className="text-sm font-medium">Call Now</span>
                <FiArrowRight className="ml-2 text-sm" />
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 sm:p-8 border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FiMapPin className="text-purple-600 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Address</h3>
              <p className="text-gray-600 text-base sm:text-lg font-medium mb-4">Kabul Polytechnic University<br />Kabul, Afghanistan</p>
              <div className="flex items-center justify-center text-purple-600 hover:text-purple-700 transition-colors cursor-pointer">
                <span className="text-sm font-medium">Get Directions</span>
                <FiArrowRight className="ml-2 text-sm" />
              </div>
            </div>
          </div>

          {/* Contact Form CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 sm:p-12 shadow-xl">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Have Questions?</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Our team is here to help you with any inquiries about membership, events, or opportunities.
              </p>
              <button className="px-8 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Contact Support Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
