import React from 'react';
import Layout from '../components/Layout';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiFacebook } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[500px] bg-cover bg-center" style={{backgroundImage: 'url("/kpu1.jpg")'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              About KPU Alumni Association
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Building lifelong connections and fostering professional growth for Kabul Polytechnic University graduates worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Mission & History Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mission */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To create a vibrant network of Kabul Polytechnic University alumni, fostering professional development, 
                knowledge sharing, and collaborative opportunities that contribute to the advancement of our members 
                and the engineering community in Afghanistan and beyond.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We strive to maintain strong connections between graduates and the university, facilitating mentorship, 
                career opportunities, and continuous learning while celebrating the achievements of our alumni community.
              </p>
            </div>

            {/* History */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our History</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2010, the KPU Alumni Association began as a small initiative by dedicated graduates who 
                recognized the need for a structured network to connect Kabul Polytechnic University alumni across 
                various engineering disciplines and geographical locations.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Over the past decade, we have grown from a handful of members to a thriving community of over 
                5,000 alumni, establishing chapters in major cities and organizing numerous events that bring 
                our community together.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we stand as a testament to the excellence of KPU's engineering education and the remarkable 
                achievements of our graduates in shaping Afghanistan's infrastructure and technological advancement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message from Chancellor Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Message from the Chancellor</h2>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/5">
                  <div className="h-full min-h-[400px] bg-cover bg-center" style={{backgroundImage: 'url("/chancellor_bg.jpg")'}}></div>
                </div>
                <div className="lg:w-3/5 p-8 lg:p-12">
                  <blockquote className="text-xl text-gray-700 italic leading-relaxed mb-8">
                    "The KPU Alumni Association represents the pride of our institution. Our graduates continue to 
                    make significant contributions to Afghanistan's development, and this association serves as a 
                    bridge between our past achievements and future aspirations. I encourage all alumni to actively 
                    participate in this vibrant community."
                  </blockquote>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-3xl">👤</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">Dr. Ahmad Zia Massoud</h4>
                      <p className="text-gray-600 text-lg">Chancellor, Kabul Polytechnic University</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Board Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Board</h2>
            <p className="text-xl text-gray-600">Dedicated leaders guiding our alumni community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Board Member 1 */}
            <div className="text-center group">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-6xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Eng. Mohammad Hassan</h3>
              <p className="text-gray-600 text-lg mb-3">President</p>
              <p className="text-sm text-gray-500 mb-4">Civil Engineering, Class of 1995</p>
              <div className="flex justify-center gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
              </div>
            </div>

            {/* Board Member 2 */}
            <div className="text-center group">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-6xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dr. Sarah Ahmadzai</h3>
              <p className="text-gray-600 text-lg mb-3">Vice President</p>
              <p className="text-sm text-gray-500 mb-4">Electrical Engineering, Class of 2000</p>
              <div className="flex justify-center gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
              </div>
            </div>

            {/* Board Member 3 */}
            <div className="text-center group">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-6xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ahmad Wali Karimi</h3>
              <p className="text-gray-600 text-lg mb-3">Secretary</p>
              <p className="text-sm text-gray-500 mb-4">Mechanical Engineering, Class of 2008</p>
              <div className="flex justify-center gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
              </div>
            </div>

            {/* Board Member 4 */}
            <div className="text-center group">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-gray-500 text-6xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fatima Noori</h3>
              <p className="text-gray-600 text-lg mb-3">Treasurer</p>
              <p className="text-sm text-gray-500 mb-4">Computer Engineering, Class of 2012</p>
              <div className="flex justify-center gap-4">
                <FiLinkedin className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
                <FiMail className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Reconnect Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to reconnect with your alma mater?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto">
            Join thousands of KPU graduates who are already making a difference through our alumni network. 
            Whether you're looking to mentor current students, find career opportunities, or simply stay connected 
            with old friends, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-10 py-4 bg-white text-blue-900 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Join Alumni Network
            </button>
            <button className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMail className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600 text-lg">alumni@kpu.edu.af</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPhone className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Phone</h3>
              <p className="text-gray-600 text-lg">+93 20 123 4567</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiMapPin className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Address</h3>
              <p className="text-gray-600 text-lg">Kabul Polytechnic University<br />Kabul, Afghanistan</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
