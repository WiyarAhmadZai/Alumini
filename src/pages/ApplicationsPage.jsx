import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiBriefcase, FiCalendar, FiTrash2, FiArrowLeft, FiExternalLink, FiMapPin, FiClock, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Swal from 'sweetalert2';
import jobService from '../services/jobService';
import ApplyModal from '../components/job/ApplyModal';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, recordsPerPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await jobService.getUserApplications(currentPage, recordsPerPage);
      setApplications(response.data.applications || []);
      setPagination(response.data.pagination || null);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing records per page
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

  if (loading) {
    return (
      <Layout>
        {/* Hero Section Skeleton */}
        <section className="relative w-full h-64 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%), url("/depositphotos_463234794-stock-photo-engineer-use-digital-tablet-construction.jpg")',
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
            <div className="text-center">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Applications Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                <div className="h-full flex flex-col">
                  {/* Header Skeleton */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Details Skeleton */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-14 animate-pulse"></div>
                  </div>

                  {/* Status Skeleton */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>

                  {/* Description Skeleton */}
                  <div className="mb-3 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                  </div>

                  {/* Actions Skeleton */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-5 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%), url("/depositphotos_463234794-stock-photo-engineer-use-digital-tablet-construction.jpg")',
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {applications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full">
                <div className="p-4 h-full flex flex-col">
                  {/* Header with fixed height */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <FiBriefcase className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                        <Link 
                          to={`/job/${application.job?.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {application.job?.title || 'Job Title'}
                        </Link>
                      </h3>
                      <p className="text-blue-600 font-semibold text-sm truncate">
                        {application.job?.company || 'Company'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Job details with fixed height */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                    {application.job?.location && (
                      <div className="flex items-center gap-1">
                        <FiMapPin className="text-gray-400" />
                        <span className="truncate max-w-[80px]">{application.job.location}</span>
                      </div>
                    )}
                    {application.job?.type && (
                      <div className="flex items-center gap-1">
                        <FiBriefcase className="text-gray-400" />
                        <span className="truncate max-w-[60px]">{application.job.type}</span>
                      </div>
                    )}
                    {application.job?.salary && (
                      <div className="flex items-center gap-1">
                        <FiDollarSign className="text-gray-400" />
                        <span className="truncate max-w-[60px]">{application.job.salary}</span>
                      </div>
                    )}
                  </div>

                  {/* Status and date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FiCalendar className="text-gray-400" />
                      {new Date(application.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
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

                  {/* Description preview with fixed height */}
                  {application.job?.description && (
                    <div className="mb-3 flex-1">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {application.job.description.substring(0, 80)}...
                      </p>
                    </div>
                  )}

                  {/* Actions section with fixed positioning */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Link 
                      to={`/job/${application.job?.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                    >
                      See More
                    </Link>
                    <button
                      onClick={() => handleRemoveApplication(application.id, application.job?.title)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove application"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-5 mt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-gray-900 text-lg">{pagination.total}</span> applications
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black font-medium">Show:</span>
                  <select 
                    value={recordsPerPage}
                    onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={999999}>All</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50 transition-all duration-300 hover:scale-105"
                  disabled={pagination.current_page === 1 || loading}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`flex h-10 px-5 items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
                      page === pagination.current_page
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50 transition-all duration-300 hover:scale-105"
                  disabled={pagination.current_page === pagination.last_page || loading}
                  onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ApplicationsPage;
