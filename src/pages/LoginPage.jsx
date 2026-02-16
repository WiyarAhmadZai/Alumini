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
    department: '',
    universityId: ''
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
              src="/kpu2.jpg"
              alt="KPU Campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <div className="mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        src="/logo_kpu.png"
                        alt="KPU University"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-bold text-white text-sm truncate">
                        KPU University
                      </div>
                      <div className="text-xs text-white/80 truncate">
                        Excellence in Education
                      </div>
                    </div>
                  </div>
                </div>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <option value="1403">1403</option>
                              <option value="1402">1402</option>
                              <option value="1401">1401</option>
                              <option value="1400">1400</option>
                              <option value="1399">1399</option>
                              <option value="1398">1398</option>
                              <option value="1397">1397</option>
                              <option value="1396">1396</option>
                              <option value="1395">1395</option>
                              <option value="1394">1394</option>
                              <option value="1393">1393</option>
                              <option value="1392">1392</option>
                              <option value="1391">1391</option>
                              <option value="1390">1390</option>
                              <option value="1389">1389</option>
                              <option value="1388">1388</option>
                              <option value="1387">1387</option>
                              <option value="1386">1386</option>
                              <option value="1385">1385</option>
                              <option value="1384">1384</option>
                              <option value="1383">1383</option>
                              <option value="1382">1382</option>
                              <option value="1381">1381</option>
                              <option value="1380">1380</option>
                              <option value="1379">1379</option>
                              <option value="1378">1378</option>
                              <option value="1377">1377</option>
                              <option value="1376">1376</option>
                              <option value="1375">1375</option>
                              <option value="1374">1374</option>
                              <option value="1373">1373</option>
                              <option value="1372">1372</option>
                              <option value="1371">1371</option>
                              <option value="1370">1370</option>
                              <option value="1369">1369</option>
                              <option value="1368">1368</option>
                              <option value="1367">1367</option>
                              <option value="1366">1366</option>
                              <option value="1365">1365</option>
                              <option value="1364">1364</option>
                              <option value="1363">1363</option>
                              <option value="1362">1362</option>
                              <option value="1361">1361</option>
                              <option value="1360">1360</option>
                              <option value="1359">1359</option>
                              <option value="1358">1358</option>
                              <option value="1357">1357</option>
                              <option value="1356">1356</option>
                              <option value="1355">1355</option>
                              <option value="1354">1354</option>
                              <option value="1353">1353</option>
                              <option value="1352">1352</option>
                              <option value="1351">1351</option>
                              <option value="1350">1350</option>
                              <option value="1349">1349</option>
                              <option value="1348">1348</option>
                              <option value="1347">1347</option>
                              <option value="1346">1346</option>
                              <option value="1345">1345</option>
                              <option value="1344">1344</option>
                              <option value="1343">1343</option>
                              <option value="1342">1342</option>
                              <option value="1341">1341</option>
                              <option value="1340">1340</option>
                              <option value="1339">1339</option>
                              <option value="1338">1338</option>
                              <option value="1337">1337</option>
                              <option value="1336">1336</option>
                              <option value="1335">1335</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Faculty
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
                              <option value="">Select faculty</option>
                              <option value="civil-engineering">Faculty of Civil Engineering</option>
                              <option value="mechanical-engineering">Faculty of Mechanical Engineering</option>
                              <option value="electrical-engineering">Faculty of Electrical Engineering</option>
                              <option value="computer-science">Faculty of Computer Science</option>
                              <option value="architecture">Faculty of Architecture and Urban Planning</option>
                              <option value="geology-mining">Faculty of Geology and Mining</option>
                              <option value="chemical-engineering">Faculty of Chemical Engineering</option>
                              <option value="surveying-mapping">Faculty of Surveying and Mapping</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          University ID
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            name="universityId"
                            value={formData.universityId || ''}
                            onChange={handleInputChange}
                            placeholder="Enter your university ID"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white/50 text-black placeholder-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                            required
                          />
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
