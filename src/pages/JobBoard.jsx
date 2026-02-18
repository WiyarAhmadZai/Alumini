import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ApplyModal from '../components/job/ApplyModal';
import { 
  FiSearch, 
  FiMapPin, 
  FiClock, 
  FiDollarSign,
  FiBookmark,
  FiChevronLeft,
  FiChevronRight,
  FiBriefcase,
  FiCode,
  FiZap,
  FiHome,
  FiFilter,
  FiX,
  FiLoader
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const JobBoard = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobType: {
      fullTime: false,
      contract: false,
      remote: false
    },
    industry: {
      construction: false,
      softwareEngineering: false,
      energy: false
    },
    experienceLevel: 'all'
  });
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState(null);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { default: jobService } = await import('../services/jobService');
      
      const params = {
        page: currentPage,
        per_page: 10,
      };

      // Add search filters
      if (searchTerm) params.search = searchTerm;
      if (location) params.location = location;

      // Add job type filters
      const activeJobTypes = Object.entries(filters.jobType)
        .filter(([_, checked]) => checked)
        .map(([type, _]) => type);
      
      if (activeJobTypes.length > 0) {
        params.job_type = {};
        activeJobTypes.forEach(type => {
          params.job_type[type] = true;
        });
      }

      // Add industry filters
      const activeIndustries = Object.entries(filters.industry)
        .filter(([_, checked]) => checked)
        .map(([industry, _]) => industry);
      
      if (activeIndustries.length > 0) {
        params.industry = {};
        activeIndustries.forEach(industry => {
          params.industry[industry] = true;
        });
      }

      // Add experience level filter
      if (filters.experienceLevel && filters.experienceLevel !== 'all') {
        params.experience_level = filters.experienceLevel;
      }

      const response = await jobService.getJobs(params);
      
      if (response.status === 'success') {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const { default: jobService } = await import('../services/jobService');
      const response = await jobService.getFilterOptions();
      
      if (response.status === 'success') {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchFilterOptions();
  }, [currentPage, searchTerm, location, filters]);

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: category === 'experienceLevel' 
        ? value 
        : { ...prev[category], [value]: !prev[category][value] }
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      jobType: {
        fullTime: false,
        contract: false,
        remote: false
      },
      industry: {
        construction: false,
        softwareEngineering: false,
        energy: false
      },
      experienceLevel: 'all'
    });
    setSearchTerm('');
    setLocation('');
    setCurrentPage(1);
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated()) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }
    
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleApplicationSuccess = () => {
    // Show success message or redirect
    alert('Application submitted successfully!');
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Full-time': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Contract': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Remote': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Part-time': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Internship': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getJobIcon = (industry) => {
    switch(industry) {
      case 'construction': return FiHome;
      case 'software_engineering': return FiCode;
      case 'energy': return FiZap;
      default: return FiBriefcase;
    }
  };

  const getIndustryColor = (industry) => {
    switch(industry) {
      case 'construction': return 'green';
      case 'software_engineering': return 'purple';
      case 'energy': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative w-full h-80 sm:h-96 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
            <div className="text-center text-white max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
                KPU Alumni Job Board
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                Discover career opportunities posted by fellow alumni and trusted employers
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-24 flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div>
                  <h1 className="text-gray-900 text-xl font-bold mb-2">Filter Jobs</h1>
                  <p className="text-gray-600 text-sm">Find your next opportunity</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Job Type</h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <input 
                        checked={filters.jobType.fullTime}
                        onChange={() => handleFilterChange('jobType', 'fullTime')}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                        type="checkbox" 
                        disabled={loading}
                      />
                      <span className="font-medium">Full-time</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <input 
                        checked={filters.jobType.contract}
                        onChange={() => handleFilterChange('jobType', 'contract')}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                        type="checkbox" 
                        disabled={loading}
                      />
                      <span className="font-medium">Contract</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <input 
                        checked={filters.jobType.remote}
                        onChange={() => handleFilterChange('jobType', 'remote')}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                        type="checkbox" 
                        disabled={loading}
                      />
                      <span className="font-medium">Remote</span>
                    </label>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-gray-200 to-gray-300"></div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Industry</h3>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <input 
                        checked={filters.industry.construction}
                        onChange={() => handleFilterChange('industry', 'construction')}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                        type="checkbox" 
                        disabled={loading}
                      />
                      <span className="font-medium">Construction</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <input 
                        checked={filters.industry.softwareEngineering}
                        onChange={() => handleFilterChange('industry', 'softwareEngineering')}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                        type="checkbox" 
                        disabled={loading}
                      />
                      <span className="font-medium">Software Engineering</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <input 
                        checked={filters.industry.energy}
                        onChange={() => handleFilterChange('industry', 'energy')}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                        type="checkbox" 
                        disabled={loading}
                      />
                      <span className="font-medium">Energy</span>
                    </label>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-gray-200 to-gray-300"></div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">Experience Level</h3>
                  <select 
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="w-full rounded-lg border-gray-300 bg-white text-black text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all"
                    disabled={loading}
                  >
                    <option value="all">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="senior">Senior Level</option>
                    <option value="director">Director / Lead</option>
                  </select>
                </div>

                <button 
                  onClick={resetFilters}
                  disabled={loading}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 text-sm font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-xl p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex w-full items-stretch rounded-xl h-12 bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                      <div className="text-gray-400 flex items-center justify-center pl-4">
                        <FiSearch className="text-lg" />
                      </div>
                      <input 
                        className="w-full border-none bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400 px-4 text-sm font-medium"
                        placeholder="Job title, company, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-64">
                    <div className="flex w-full items-stretch rounded-xl h-12 bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                      <div className="text-gray-400 flex items-center justify-center pl-4">
                        <FiMapPin className="text-lg" />
                      </div>
                      <input 
                        className="w-full border-none bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400 px-4 text-sm font-medium"
                        placeholder="Location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={fetchJobs}
                    disabled={loading}
                    className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : null}
                    {loading ? 'Searching...' : 'Search Jobs'}
                  </button>
                </div>
              </div>

              {/* Job Listings */}
              <div className="flex flex-col gap-3">
                {loading && jobs.length === 0 ? (
                  // Show skeleton loaders while maintaining structure
                  Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
                      <div className="flex flex-col md:flex-row gap-5 items-start">
                        <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className="h-6 bg-gray-200 rounded w-48"></div>
                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-64 mb-3"></div>
                          <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                        <div className="flex md:flex-col gap-3 w-full md:w-auto">
                          <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
                          <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : jobs.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-600">No jobs found matching your criteria.</p>
                  </div>
                ) : (
                  jobs.map((job) => {
                    const Icon = getJobIcon(job.industry);
                    return (
                      <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-2xl transition-all duration-300 hover:border-blue-200 group">
                        <div className="flex flex-col md:flex-row gap-5 items-start">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${getIndustryColor(job.industry)}-50 to-${getIndustryColor(job.industry)}-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`text-${getIndustryColor(job.industry)}-600 text-3xl`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-gray-900 text-lg font-bold group-hover:text-blue-600 transition-colors">{job.title}</h3>
                              <span className={`${getTypeColor(job.type)} text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-sm`}>
                                {job.type}
                              </span>
                              {job.posted_by_alumnus && (
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
                                  <FiBriefcase className="text-sm" />
                                  Posted by Alumnus
                                </div>
                              )}
                            </div>
                            <p className="text-blue-600 font-semibold text-base mb-3">{job.company}</p>
                            <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                              <div className="flex items-center gap-2">
                                <FiMapPin className="text-[20px] text-gray-400" />
                                <span className="font-medium">{job.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FiClock className="text-[20px] text-gray-400" />
                                <span className="font-medium">{job.posted_time_ago}</span>
                              </div>
                              {job.salary && (
                                <div className="flex items-center gap-2">
                                  <FiDollarSign className="text-[20px] text-gray-400" />
                                  <span className="font-medium">{job.salary}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex md:flex-col gap-3 w-full md:w-auto">
                            <button 
                              onClick={() => handleApplyClick(job)}
                              className="flex-1 md:w-32 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              Apply Now
                            </button>
                            <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                              <FiBookmark className="text-[22px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {pagination && pagination.total > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-bold text-gray-900 text-lg">{pagination.total}</span> matching jobs
                    </p>
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
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={selectedJob}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </Layout>
  );
};

export default JobBoard;
