import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiArrowLeft, FiCalendar, FiUser, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import jobService from '../services/jobService';
import ApplyModal from '../components/job/ApplyModal';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkIfApplied();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      console.log('Job response:', response); // Debug log
      if (response.status === 'success' && response.data) {
        setJob(response.data);
      } else {
        setError('Job not found');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!isAuthenticated()) return;
    try {
      const res = await jobService.getUserApplications(1, 100);
      const apps = res?.data?.applications || [];
      setHasApplied(apps.some(a => String(a.job_id) === String(id)));
    } catch {}
  };

  const handleApplyClick = () => {
    if (!isAuthenticated()) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to apply for this job.',
        icon: 'warning',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }
    
    setShowApplyModal(true);
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    Swal.fire({
      icon: 'success',
      title: 'Application Submitted!',
      text: 'Your job application has been submitted successfully.',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Great!',
      timer: 3000,
      timerProgressBar: true,
      position: 'center',
      backdrop: 'rgba(0, 0, 0, 0.4)'
    });
  };

  if (loading) {
    return (
      <Layout>
        {/* Hero Section Skeleton */}
        <section className="relative w-full h-64 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("/depositphotos_29295323-stock-photo-architect-working-on-blueprint.jpg")',
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

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-300 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="h-5 bg-gray-300 rounded w-24 animate-pulse"></div>
                    <div className="h-5 bg-gray-300 rounded w-20 animate-pulse"></div>
                    <div className="h-5 bg-gray-300 rounded w-28 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <div className="h-7 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="h-6 bg-gray-300 rounded w-24 mb-4 animate-pulse"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        {/* Hero Section */}
        <section className="relative w-full h-64 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("/depositphotos_205029014-stock-photo-asian-man-civil-engineer-woman.jpg")',
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
            <div className="text-center text-white max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
                Job Not Found
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                The job you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The job you\'re looking for doesn\'t exist.'}</p>
            <div className="flex gap-4 justify-center">
              <Link to="/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <FiArrowLeft className="text-lg" />
                Back to Jobs
              </Link>
              <Link to="/applications" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View Your Applications
              </Link>
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
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("/depositphotos_463234794-stock-photo-engineer-use-digital-tablet-construction.jpg")',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              {job.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {job.company}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/jobs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <FiArrowLeft className="text-lg" />
            Back to Jobs
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Job Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <FiBriefcase className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                    <p className="text-xl text-blue-600 font-semibold">{job.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.type && (
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="text-gray-400" />
                      <span>{job.type}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-gray-400" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  {job.posted_at && (
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      <span>Posted {new Date(job.posted_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <FiExternalLink className="text-lg" />
                  See More Jobs
                </Link>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {job.requirements}
                      </p>
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {job.benefits}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Job Info Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Job Information</h3>
                  <div className="space-y-4">
                    {job.experience_level && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Experience Level</p>
                        <p className="font-medium text-gray-900">{job.experience_level}</p>
                      </div>
                    )}
                    {job.industry && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Industry</p>
                        <p className="font-medium text-gray-900">{job.industry}</p>
                      </div>
                    )}
                    {job.application_deadline && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Application Deadline</p>
                        <p className="font-medium text-gray-900">
                          {new Date(job.application_deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {job.posted_by_alumnus && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <FiUser className="text-sm" />
                          <span>Posted by KPU Alumnus</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {hasApplied ? (
                      <button
                        disabled
                        className="block w-full text-center px-4 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-70 font-medium"
                      >
                        Already Applied
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyClick}
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium"
                      >
                        Apply for This Job
                      </button>
                    )}
                    <Link 
                      to="/jobs"
                      className="block w-full text-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      Browse Similar Jobs
                    </Link>
                    <Link 
                      to="/applications"
                      className="block w-full text-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      View Your Applications
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal 
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={job}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </Layout>
  );
};

export default JobDetailsPage;
