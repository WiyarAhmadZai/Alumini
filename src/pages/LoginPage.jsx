import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import authService from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        remember: rememberMe
      });

      if (response.status === 'success') {
        navigate('/profile');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
                  Welcome Back to KPU Alumni
                </h1>
                <p className="text-xl text-white/90 leading-relaxed mb-8">
                  Connect with fellow graduates, access exclusive resources, and stay updated with alumni events and opportunities.
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
                    Sign In
                  </h2>
                  <p className="text-gray-700">
                    Enter your credentials to access your account
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start justify-between gap-4">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                      type="button"
                      onClick={() => setError('')}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                      aria-label="Dismiss error"
                    >
                      X
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-700">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                    >
                      Create Verified Account
                    </button>
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Get verified as a KPU graduate with MIS integration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LoginPage;
