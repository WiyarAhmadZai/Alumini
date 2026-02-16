import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import alumniService from '../services/alumniService';

const VerifiedAlumniRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university_id: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_job_title: '',
    current_company: '',
    location: '',
    linkedin_profile: '',
    bio: ''
  });
  
  const [studentData, setStudentData] = useState(null);
  const [showTazkiraModal, setShowTazkiraModal] = useState(false);
  const [tazkiraNumber, setTazkiraNumber] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [verificationError, setVerificationError] = useState('');

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
    
    // Clear errors when user changes university_id
    if (name === 'university_id') {
      setSearchError('');
      setStudentData(null);
      setSubmitError('');
    }
  };
  
  const handleTazkiraChange = (e) => {
    setTazkiraNumber(e.target.value);
    setVerificationError('');
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };
  
  
  const searchStudent = async () => {
    if (!formData.university_id.trim()) {
      setSearchError('University ID is required');
      return;
    }
    
    setSearchLoading(true);
    setSearchError('');
    
    try {
      const response = await alumniService.searchStudent(formData.university_id);
      setStudentData(response.data);
    } catch (error) {
      setSearchError(error.response?.data?.message || 'Student not found. Please check your University ID.');
      setStudentData(null);
    } finally {
      setSearchLoading(false);
    }
  };
  
  const verifyTazkira = async () => {
    if (!tazkiraNumber.trim()) {
      setVerificationError('Tazkira number is required');
      return;
    }
    
    setVerificationLoading(true);
    setVerificationError('');
    
    try {
      const response = await alumniService.verifyTazkira(formData.university_id, tazkiraNumber);
      
      if (response.verified) {
        setShowTazkiraModal(false);
        // Proceed with registration
        await submitRegistration();
      }
    } catch (error) {
      let errorMessage = 'Tazkira verification failed. Please check your tazkira number.';
      
      if (error.response?.data?.error_type) {
        switch (error.response.data.error_type) {
          case 'university_id_not_found':
            errorMessage = 'University ID not found in our records. Please check your University ID first.';
            break;
          case 'tazkira_not_found':
            errorMessage = 'Tazkira number not found in our records. Please check your tazkira number.';
            break;
          case 'mismatch':
            errorMessage = 'University ID and Tazkira number do not match the same student in our records.';
            break;
          default:
            errorMessage = error.response?.data?.message || errorMessage;
        }
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      setVerificationError(errorMessage);
    } finally {
      setVerificationLoading(false);
    }
  };
  
  const submitRegistration = async () => {
    const submissionData = new FormData();
    submissionData.append('university_id', formData.university_id);
    submissionData.append('email', formData.email);
    submissionData.append('password', formData.password);
    submissionData.append('password_confirmation', formData.password_confirmation);
    submissionData.append('current_job_title', formData.current_job_title);
    submissionData.append('current_company', formData.current_company);
    submissionData.append('location', formData.location);
    submissionData.append('linkedin_profile', formData.linkedin_profile);
    submissionData.append('bio', formData.bio);
    
    if (formData.profile_image) {
      submissionData.append('profile_image', formData.profile_image);
    }
    
    if (formData.cover_image) {
      submissionData.append('cover_image', formData.cover_image);
    }
    
    setLoading(true);
    setSubmitError('');
    
    try {
      await alumniService.registerVerifiedAlumni(submissionData);
      setSuccess(true);
      
      // Redirect to profile page after successful registration
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setSubmitError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!studentData) {
      setSearchError('Please search for your student profile first');
      return;
    }
    
    // Show tazkira verification modal
    setShowTazkiraModal(true);
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
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Student Search Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">� Find Your Student Profile</h2>
                <p className="text-sm text-gray-600 mb-6">Enter your University ID to search for your student profile in our MIS records.</p>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="university_id" className="block text-sm font-medium text-gray-700 mb-2">University ID <span className="text-red-700">*</span></label>
                    <input
                      type="text"
                      id="university_id"
                      name="university_id"
                      value={formData.university_id}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                        errors.university_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your University ID"
                    />
                    {errors.university_id && <p className="mt-1 text-sm text-red-600">{errors.university_id}</p>}
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={searchStudent}
                      disabled={searchLoading || !formData.university_id.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {searchLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Searching...
                        </span>
                      ) : 'Search Profile'}
                    </button>
                  </div>
                </div>
                
                {searchError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{searchError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Student Profile Display */}
              {studentData && (
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">👤 Student Profile Found</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Full Name</p>
                        <p className="text-base font-semibold text-gray-900">{studentData.first_name} {studentData.father_name} {studentData.grandfather_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">University ID</p>
                        <p className="text-base font-semibold text-gray-900">{studentData.student_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Faculty</p>
                        <p className="text-base font-semibold text-gray-900">{studentData.department?.faculty?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Graduation Year</p>
                        <p className="text-base font-semibold text-gray-900">{studentData.graduation_year || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone Number</p>
                        <p className="text-base font-semibold text-gray-900">{studentData.phone_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Department</p>
                        <p className="text-base font-semibold text-gray-900">{studentData.department?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Account Information Section */}
              {studentData && (
                <div className="border-b border-gray-200 pb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 Account Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-700">*</span></label>
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
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-700">*</span></label>
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
                      <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password <span className="text-red-700">*</span></label>
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
              )}
              
              {/* Professional Information Section */}
              {studentData && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">💼 Professional Information (Optional)</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    
                    <div>
                      <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                      <input
                        type="file"
                        id="profile_image"
                        name="profile_image"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                      <input
                        type="file"
                        id="cover_image"
                        name="cover_image"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base text-gray-900"
                      />
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
              )}
              
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || !studentData}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Tazkira Verification Modal */}
      {showTazkiraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 Verify Your Identity</h3>
            <p className="text-gray-600 mb-6">Please enter your tazkira number to complete the verification process.</p>
            
            <div className="mb-6">
              <label htmlFor="tazkira_number" className="block text-sm font-medium text-gray-700 mb-2">Tazkira Number <span className="text-red-700">*</span></label>
              <input
                type="text"
                id="tazkira_number"
                value={tazkiraNumber}
                onChange={handleTazkiraChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400 placeholder-text-sm text-base text-gray-900 ${
                  verificationError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your tazkira number"
              />
              {verificationError && <p className="mt-1 text-sm text-red-600">{verificationError}</p>}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowTazkiraModal(false);
                  setTazkiraNumber('');
                  setVerificationError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={verifyTazkira}
                disabled={verificationLoading || !tazkiraNumber.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {verificationLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify & Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VerifiedAlumniRegistration;
