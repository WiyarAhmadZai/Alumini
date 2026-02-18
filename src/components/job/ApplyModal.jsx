import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiX, FiUpload, FiUser, FiMail, FiPhone, FiFileText } from 'react-icons/fi';

const ApplyModal = ({ isOpen, onClose, job, onApplicationSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    cover_letter: '',
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setCvFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Import jobService dynamically to avoid circular dependencies
      const { default: jobService } = await import('../../services/jobService');
      
      await jobService.applyForJob(job.id, formData, cvFile);
      
      onApplicationSuccess();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      phone: '',
      email: '',
      cover_letter: '',
    });
    setCvFile(null);
    setError('');
    onClose();
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
              <p className="text-gray-600 mt-1">{job.title} at {job.company}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* User Information Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FiUser className="text-xl" />
              Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {user?.name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Faculty:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {user?.faculty_name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {user?.department_name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Graduation Year:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {user?.graduation_year || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="+93 7XX XXX XXX"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline mr-2" />
              Cover Letter (Optional)
            </label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
            />
          </div>

          {/* CV Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUpload className="inline mr-2" />
              CV/Resume (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="cv_file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="cv_file"
                className="cursor-pointer flex flex-col items-center"
              >
                <FiUpload className="text-3xl text-gray-400 mb-2" />
                <span className="text-gray-600">
                  {cvFile ? cvFile.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX (max 5MB)
                </span>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
