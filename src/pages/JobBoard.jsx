import React, { useState } from 'react';
import Layout from '../components/Layout';
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
  FiX
} from 'react-icons/fi';

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobType: {
      fullTime: true,
      contract: false,
      remote: false
    },
    industry: {
      construction: false,
      softwareEngineering: true,
      energy: false
    },
    experienceLevel: 'senior'
  });

  const jobs = [
    {
      id: 1,
      title: 'Senior Civil Engineer',
      company: 'Afghan Construction & Management (ACM)',
      location: 'Kabul, Afghanistan',
      type: 'Full-time',
      posted: '2 days ago',
      salary: 'Competitive Salary',
      icon: FiHome,
      color: 'green',
      postedByAlumnus: true
    },
    {
      id: 2,
      title: 'Project Manager (Hydropower)',
      company: 'National Energy Authority',
      location: 'Herat, Afghanistan',
      type: 'Contract',
      posted: '5 days ago',
      icon: FiZap,
      color: 'blue',
      postedByAlumnus: false
    },
    {
      id: 3,
      title: 'Lead Full Stack Developer',
      company: 'CodeKabul Tech',
      location: 'Worldwide (Remote)',
      type: 'Remote',
      posted: '1 week ago',
      icon: FiCode,
      color: 'purple',
      postedByAlumnus: true
    },
    {
      id: 4,
      title: 'Structural Design Lead',
      company: 'Urban Design Group',
      location: 'Mazar-i-Sharif',
      type: 'Full-time',
      posted: '2 weeks ago',
      icon: FiHome,
      color: 'green',
      postedByAlumnus: false
    }
  ];

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: category === 'experienceLevel' 
        ? value 
        : { ...prev[category], [value]: !prev[category][value] }
    }));
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
      experienceLevel: 'entry'
    });
    setSearchTerm('');
    setLocation('');
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Full-time': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Contract': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Remote': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700';
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
        ></div>
        
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
                  />
                  <span className="font-medium">Full-time</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <input 
                    checked={filters.jobType.contract}
                    onChange={() => handleFilterChange('jobType', 'contract')}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  <span className="font-medium">Contract</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <input 
                    checked={filters.jobType.remote}
                    onChange={() => handleFilterChange('jobType', 'remote')}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
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
                  />
                  <span className="font-medium">Construction</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <input 
                    checked={filters.industry.softwareEngineering}
                    onChange={() => handleFilterChange('industry', 'softwareEngineering')}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  <span className="font-medium">Software Engineering</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <input 
                    checked={filters.industry.energy}
                    onChange={() => handleFilterChange('industry', 'energy')}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
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
                className="w-full rounded-lg border-gray-300 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 transition-all"
              >
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="senior">Senior Level</option>
                <option value="director">Director / Lead</option>
              </select>
            </div>

            <button 
              onClick={resetFilters}
              className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 text-sm font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex w-full items-stretch rounded-xl h-14 bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <div className="text-gray-400 flex items-center justify-center pl-4">
                    <FiSearch className="text-xl" />
                  </div>
                  <input 
                    className="w-full border-none bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400 px-4 text-base font-medium"
                    placeholder="Job title, company, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <div className="flex w-full items-stretch rounded-xl h-14 bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <div className="text-gray-400 flex items-center justify-center pl-4">
                    <FiMapPin className="text-xl" />
                  </div>
                  <input 
                    className="w-full border-none bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400 px-4 text-base font-medium"
                    placeholder="Location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <button className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Search Jobs
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex flex-col gap-4">
            {jobs.map((job) => {
              const Icon = job.icon;
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 hover:border-blue-200 group">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-blue-600 text-4xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-gray-900 text-xl font-bold group-hover:text-blue-600 transition-colors">{job.title}</h3>
                        <span className={`${getTypeColor(job.type)} text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-sm`}>
                          {job.type}
                        </span>
                        {job.postedByAlumnus && (
                          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">
                            <FiBriefcase className="text-sm" />
                            Posted by Alumnus
                          </div>
                        )}
                      </div>
                      <p className="text-blue-600 font-semibold text-lg mb-4">{job.company}</p>
                      <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-[20px] text-gray-400" />
                          <span className="font-medium">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-[20px] text-gray-400" />
                          <span className="font-medium">{job.posted}</span>
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
                      <button className="flex-1 md:w-36 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Apply Now
                      </button>
                      <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                        <FiBookmark className="text-[24px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900 text-lg">42</span> matching jobs
              </p>
              <div className="flex gap-2">
                <button 
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50 transition-all duration-300 hover:scale-105"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button className="flex h-12 px-6 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm transition-all duration-300 shadow-lg">
                  1
                </button>
                <button className="flex h-12 px-6 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all duration-300 hover:scale-105">
                  2
                </button>
                <button 
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-all duration-300 hover:scale-105"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </Layout>
  );
};

export default JobBoard;
