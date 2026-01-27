import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiCalendar } from 'react-icons/fi';

const LoginPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    graduationYear: '',
    department: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    // Set mode based on URL
    if (location.pathname === '/signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
              alt="KPU Campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {isLogin ? 'Welcome Back to KPU Alumni' : 'Join KPU Alumni Network'}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed mb-8">
                  {isLogin 
                    ? 'Connect with fellow graduates, access exclusive resources, and stay updated with alumni events and opportunities.'
                    : 'Become part of our growing community of successful graduates and build lasting professional connections.'
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-yellow-400 text-xl" />
                    <span className="text-white/90">Access exclusive alumni resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-yellow-400 text-xl" />
                    <span className="text-white/90">Network with 10,000+ graduates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-yellow-400 text-xl" />
                    <span className="text-white/90">Career opportunities and mentorship</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-yellow-400 text-xl" />
                    <span className="text-white/90">Alumni events and reunions</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Login Form */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 lg:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </h2>
                  <p className="text-gray-700">
                    {isLogin ? 'Enter your credentials to access your account' : 'Fill in your details to get started'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 text-black placeholder-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Graduation Year
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <select
                            name="graduationYear"
                            value={formData.graduationYear || ''}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 text-black focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                            required
                          >
                            <option value="">Select graduation year</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                            <option value="2015">2015</option>
                            <option value="2014">2014</option>
                            <option value="2013">2013</option>
                            <option value="2012">2012</option>
                            <option value="2011">2011</option>
                            <option value="2010">2010</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Department
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <select
                            name="department"
                            value={formData.department || ''}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 text-black focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                            required
                          >
                            <option value="">Select department</option>
                            <option value="civil">Civil Engineering</option>
                            <option value="mechanical">Mechanical Engineering</option>
                            <option value="electrical">Electrical Engineering</option>
                            <option value="computer">Computer Science</option>
                            <option value="architecture">Architecture</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 text-black placeholder-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white/50 text-black placeholder-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 text-black placeholder-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-700">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join KPU Alumni?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect, grow, and succeed with our comprehensive alumni network
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Network</h3>
                <p className="text-gray-600">Connect with thousands of successful alumni worldwide</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Career Opportunities</h3>
                <p className="text-gray-600">Access exclusive job postings and career resources</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLock className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mentorship Programs</h3>
                <p className="text-gray-600">Get guidance from experienced alumni in your field</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Alumni Events</h3>
                <p className="text-gray-600">Attend reunions, workshops, and networking events</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LoginPage;
