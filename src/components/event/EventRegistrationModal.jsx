import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiX, FiUser, FiMail, FiPhone, FiFileText, FiCalendar } from 'react-icons/fi';

const EventRegistrationModal = ({ isOpen, onClose, event, onRegistrationSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    special_requirements: '',
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Import eventService dynamically to avoid circular dependencies
      const { default: eventService } = await import('../../services/eventService');
      
      await eventService.registerForEvent(event.id, formData.special_requirements);
      
      onRegistrationSuccess();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      phone: '',
      email: '',
      special_requirements: '',
    });
    setError('');
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Register for Event</h2>
              <p className="text-gray-600 mt-1">{event.title}</p>
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

          {/* Event Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiCalendar className="text-xl" />
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(event.start_date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(event.start_date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  })} - {new Date(event.end_date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {event.location}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Mode:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {event.mode === 'online' ? 'Online' : 'In-Person'}
                </span>
              </div>
            </div>
            {event.registration_fee > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-600">Registration Fee:</span>
                <span className="ml-2 font-medium text-green-600">
                  ${event.registration_fee}
                </span>
              </div>
            )}
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

          {/* Special Requirements */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline mr-2" />
              Special Requirements (Optional)
            </label>
            <textarea
              name="special_requirements"
              value={formData.special_requirements}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Any special requirements, accommodations, or dietary restrictions..."
            />
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
              {loading ? 'Registering...' : 'Register for Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationModal;
