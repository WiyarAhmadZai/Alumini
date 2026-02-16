import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import alumniService from '../services/alumniService';

const VerifiedAlumniRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    graduation_year: '',
    faculty: '',
    university_id: '',
    tazkira_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    current_job_title: '',
    current_company: '',
    location: '',
    linkedin_profile: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear verification status when user changes verification fields
    if (['name', 'faculty', 'university_id'].includes(name)) {
      setVerificationStatus('');
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.graduation_year) {
      newErrors.graduation_year = 'Graduation year is required';
    } else if (formData.graduation_year < 1350 || formData.graduation_year > (new Date().getFullYear() - 621)) {
      newErrors.graduation_year = 'Please enter a valid Hijri Shamsi year (1350-1403)';
    }
    
    if (!formData.faculty) {
      newErrors.faculty = 'Please select your faculty';
    }
    
    if (!formData.university_id.trim()) {
      newErrors.university_id = 'University ID is required';
    }
    
    if (!formData.tazkira_number.trim()) {
      newErrors.tazkira_number = 'Tazkira number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation - at least 8 chars, one capital, one number, one special
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one capital letter, one number, and one special character';
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    // Optional field validations
    if (formData.linkedin_profile && !/^https?:\/\/.+\..+/.test(formData.linkedin_profile)) {
      newErrors.linkedin_profile = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError('');
    setSuccess(false);
    setVerificationStatus('verifying');
    
    try {
      await alumniService.registerVerifiedAlumni(formData);
      setSuccess(true);
      setVerificationStatus('verified');
      
      // Redirect to profile page after successful registration
      setTimeout(() => {
        navigate('/profile');
      }, 2000); // Wait 2 seconds to show success message
      
      // Reset form
      setFormData({
        name: '',
        graduation_year: '',
        faculty: '',
        university_id: '',
        tazkira_number: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        current_job_title: '',
        current_company: '',
        location: '',
        linkedin_profile: '',
        bio: ''
      });
    } catch (error) {
      setVerificationStatus('failed');
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        const errorCode = error.response?.data?.error_code;
        
        // Handle specific verification errors
        if (errorCode === 'STUDENT_NOT_FOUND') {
          setSubmitError('Student not found in MIS records. Please check your University ID and try again.');
        } else if (errorCode === 'TAZKIRA_MISMATCH') {
          setSubmitError('Tazkira number does not match our records. Please verify your tazkira number.');
        } else if (errorCode === 'FACULTY_MISMATCH') {
          setSubmitError('Faculty does not match our records. Please verify your faculty information.');
        } else if (errorCode === 'NAME_MISMATCH') {
          setSubmitError('Name does not match our records. Please enter your exact name as registered in MIS.');
        } else if (errorCode === 'ALREADY_REGISTERED') {
          setSubmitError('You are already registered in our alumni system.');
        } else {
          setSubmitError(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#ccc' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    const levels = [
      { text: 'Weak', color: '#dc3545' },
      { text: 'Fair', color: '#ffc107' },
      { text: 'Good', color: '#20c997' },
      { text: 'Strong', color: '#28a745' }
    ];
    
    return {
      strength: (strength / 4) * 100,
      text: levels[strength - 1]?.text || '',
      color: levels[strength - 1]?.color || '#ccc'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Layout>
      {/* Background Gradient Section - Same as Profile Page */}
      <div className="fixed top-0 left-0 right-0 h-screen bg-gradient-to-b from-[#002759]/80 via-[#002759]/40 to-[#002759]/10 -z-10"></div>
      
      {/* Hero Section - Same as Profile Page */}
      <div className="h-32 bg-cover bg-center relative p-44">
        <div className="absolute inset-0 bg-gradient-to-b from-[#002759]/95 to-blue-500 to-transparent"></div>
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Verified Alumni Registration</h1>
            <p className="text-lg md:text-xl text-blue-100">Join our exclusive network of verified KPU graduates</p>
          </div>
        </div>
      </div>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Registration</h2>
              <p className="text-gray-600">Your information will be verified against our MIS records.</p>
            </div>
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Registration Successful!</h3>
                    <p className="text-sm text-green-700 mt-1">Welcome to our verified alumni network! Redirecting to your profile...</p>
                  </div>
                </div>
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{submitError}</p>
                  </div>
                </div>
              </div>
            )}
            
            {verificationStatus === 'verifying' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="animate-spin h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Verifying Your Information</h3>
                    <p className="text-sm text-blue-700 mt-1">Please wait while we verify your information against our MIS records...</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Verification Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Verification Information</h2>
                <p className="text-sm text-gray-600 mb-6">This information will be verified against our MIS records.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700 mb-2">Graduation Year (Hijri Shamsi) *</label>
                    <input
                      type="number"
                      id="graduation_year"
                      name="graduation_year"
                      value={formData.graduation_year}
                      onChange={handleChange}
                      min="1350"
                      max={new Date().getFullYear() - 621} // Approximate current Hijri year
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.graduation_year ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 1400"
                    />
                    {errors.graduation_year && <p className="mt-1 text-sm text-red-600">{errors.graduation_year}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">Faculty *</label>
                    <select
                      id="faculty"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base text-gray-900 ${
                        errors.faculty ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your faculty</option>
                      <option value="Geology and Mines Faculty">Geology and Mines Faculty</option>
                      <option value="Construction Faculty">Construction Faculty</option>
                      <option value="Electromechanics Faculty">Electromechanics Faculty</option>
                      <option value="Computer Science Faculty">Computer Science Faculty</option>
                      <option value="Chemical industrial Engineering Faculty">Chemical industrial Engineering Faculty</option>
                      <option value="Water and Environmental Engineering Faculty">Water and Environmental Engineering Faculty</option>
                      <option value="Transportation Engineering Faculty">Transportation Engineering Faculty</option>
                      <option value="Geomatics Engineering Faculty">Geomatics Engineering Faculty</option>
                    </select>
                    {errors.faculty && <p className="mt-1 text-sm text-red-600">{errors.faculty}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="university_id" className="block text-sm font-medium text-gray-700 mb-2">University ID *</label>
                    <input
                      type="text"
                      id="university_id"
                      name="university_id"
                      value={formData.university_id}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.university_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Your university ID"
                    />
                    {errors.university_id && <p className="mt-1 text-sm text-red-600">{errors.university_id}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="tazkira_number" className="block text-sm font-medium text-gray-700 mb-2">Tazkira Number *</label>
                    <input
                      type="text"
                      id="tazkira_number"
                      name="tazkira_number"
                      value={formData.tazkira_number}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.tazkira_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Your tazkira number"
                    />
                    {errors.tazkira_number && <p className="mt-1 text-sm text-red-600">{errors.tazkira_number}</p>}
                  </div>
                </div>
              </div>
              
              {/* Account Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 Account Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="your email address"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="your password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Password Strength:</span>
                          <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${passwordStrength.strength}%`,
                              backgroundColor: passwordStrength.color
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.password_confirmation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="re-enter password"
                    />
                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-800">
                    <strong>Password Requirements:</strong> At least 8 characters, one capital letter, one number, and one special character (@$!%*?&)
                  </p>
                </div>
              </div>
              
              {/* Professional Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">💼 Professional Information (Optional)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900"
                      placeholder="your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="current_job_title" className="block text-sm font-medium text-gray-700 mb-2">Current Job Title</label>
                    <input
                      type="text"
                      id="current_job_title"
                      name="current_job_title"
                      value={formData.current_job_title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900"
                      placeholder="your current job title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="current_company" className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
                    <input
                      type="text"
                      id="current_company"
                      name="current_company"
                      value={formData.current_company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900"
                      placeholder="your current company"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900"
                      placeholder="your location"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkedin_profile" className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      id="linkedin_profile"
                      name="linkedin_profile"
                      value={formData.linkedin_profile}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base ${
                        errors.linkedin_profile ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="your linkedin profile"
                    />
                    {errors.linkedin_profile && <p className="mt-1 text-sm text-red-600">{errors.linkedin_profile}</p>}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900"
                    placeholder="tell us about your journey"
                  />
                </div>
              </div>
              
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {verificationStatus === 'verifying' ? 'Verifying...' : 'Registering...'}
                    </span>
                  ) : 'Register as Verified Alumni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifiedAlumniRegistration;
