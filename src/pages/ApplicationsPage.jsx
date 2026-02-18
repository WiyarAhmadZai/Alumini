import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FiBriefcase, FiCalendar, FiTrash2, FiArrowLeft, FiExternalLink, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import jobService from '../services/jobService';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await jobService.getUserApplications();
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveApplication = async (applicationId, jobTitle) => {
    try {
      const result = await Swal.fire({
        title: 'Remove Application?',
        html: `Are you sure you want to remove your application for <strong>${jobTitle}</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await jobService.removeApplication(applicationId);
        await fetchApplications();
        
        Swal.fire({
          icon: 'success',
          title: 'Application Removed',
          text: 'Your job application has been removed successfully.',
          timer: 2000,
          timerProgressBar: true,
          position: 'center',
          backdrop: 'rgba(0, 0, 0, 0.4)'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove application. Please try again.',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("https://images.unsplash.com/photo-1454161308049-f3cf10e601ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              My Job Applications
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Track and manage all your job applications in one place
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/profile"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <FiArrowLeft className="text-lg" />
            Back to Profile
          </Link>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FiBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Job Applications Yet</h3>
            <p className="text-gray-600 mb-6">You haven't applied to any jobs yet. Start browsing and apply to your dream jobs!</p>
            <Link 
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Jobs
              <FiBriefcase className="text-lg" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <FiBriefcase className="text-white text-xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {application.job?.title || 'Job Title'}
                          </h3>
                          <p className="text-blue-600 font-semibold text-base">
                            {application.job?.company || 'Company'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        {application.job?.location && (
                          <div className="flex items-center gap-2">
                            <FiMapPin className="text-gray-400" />
                            <span>{application.job.location}</span>
                          </div>
                        )}
                        {application.job?.type && (
                          <div className="flex items-center gap-2">
                            <FiBriefcase className="text-gray-400" />
                            <span>{application.job.type}</span>
                          </div>
                        )}
                        {application.job?.salary && (
                          <div className="flex items-center gap-2">
                            <FiDollarSign className="text-gray-400" />
                            <span>{application.job.salary}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <FiCalendar className="text-sm" />
                          Applied on {new Date(application.created_at).toLocaleDateString()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          application.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : application.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-700'
                            : application.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {application.status || 'pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {application.job?.id && (
                        <Link 
                          to={`/job/${application.job.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          <FiExternalLink className="text-sm" />
                          See More Details
                        </Link>
                      )}
                      <button
                        onClick={() => handleRemoveApplication(application.id, application.job?.title)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove application"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Quick Job Preview */}
                {application.job?.description && (
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {application.job.description.substring(0, 150)}...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApplicationsPage;
