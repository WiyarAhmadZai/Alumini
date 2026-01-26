import React, { useState } from 'react';
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
  FiBuilding,
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
      icon: FiBuilding,
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
      icon: FiBuilding,
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-64 sm:h-80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 39, 89, 0.8) 0%, rgba(10, 81, 155, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              KPU Alumni Job Board
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Discover career opportunities posted by fellow alumni and trusted employers
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-6 gap-6 flex flex-col lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <h1 className="text-gray-900 text-lg font-bold">Filter Jobs</h1>
              <p className="text-gray-600 text-sm">Find your next opportunity</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Job Type</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    checked={filters.jobType.fullTime}
                    onChange={() => handleFilterChange('jobType', 'fullTime')}
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  Full-time
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    checked={filters.jobType.contract}
                    onChange={() => handleFilterChange('jobType', 'contract')}
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  Contract
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    checked={filters.jobType.remote}
                    onChange={() => handleFilterChange('jobType', 'remote')}
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  Remote
                </label>
              </div>
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Industry</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    checked={filters.industry.construction}
                    onChange={() => handleFilterChange('industry', 'construction')}
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  Construction
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    checked={filters.industry.softwareEngineering}
                    onChange={() => handleFilterChange('industry', 'softwareEngineering')}
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  Software Engineering
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    checked={filters.industry.energy}
                    onChange={() => handleFilterChange('industry', 'energy')}
                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                    type="checkbox" 
                  />
                  Energy
                </label>
              </div>
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Experience Level</h3>
              <select 
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="rounded-lg border-gray-200 bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="senior">Senior Level</option>
                <option value="director">Director / Lead</option>
              </select>
            </div>

            <button 
              onClick={resetFilters}
              className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-100 text-gray-900 text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="flex w-full items-stretch rounded-xl h-14 bg-white border border-gray-200 shadow-sm">
                <div className="text-gray-500 flex items-center justify-center pl-4">
                  <FiSearch className="text-xl" />
                </div>
                <input 
                  className="w-full border-none bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-500 px-4 text-base"
                  placeholder="Job title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <div className="flex w-full items-stretch rounded-xl h-14 bg-white border border-gray-200 shadow-sm">
                <div className="text-gray-500 flex items-center justify-center pl-4">
                  <FiMapPin className="text-xl" />
                </div>
                <input 
                  className="w-full border-none bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-500 px-4 text-base"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <button className="h-14 px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
              Search
            </button>
          </div>

          {/* Job Listings */}
          <div className="flex flex-col gap-4">
            {jobs.map((job) => {
              const Icon = job.icon;
              return (
                <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-blue-600 text-3xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-gray-900 text-lg font-bold">{job.title}</h3>
                        <span className={`${getTypeColor(job.type)} text-[10px] font-bold px-2 py-1 rounded-full uppercase`}>
                          {job.type}
                        </span>
                        {job.postedByAlumnus && (
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-200">
                            <FiBriefcase className="text-xs" />
                            Posted by Alumnus
                          </div>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium text-sm">{job.company}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <FiMapPin className="text-[18px]" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="text-[18px]" />
                          {job.posted}
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <FiDollarSign className="text-[18px]" />
                            {job.salary}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                      <button className="flex-1 md:w-32 bg-blue-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                        Apply Now
                      </button>
                      <button className="p-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <FiBookmark className="text-[22px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-6 border-t border-gray-200 mt-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">42</span> matching jobs
            </p>
            <div className="flex gap-2">
              <button 
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <FiChevronLeft />
              </button>
              <button className="flex h-10 px-4 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                1
              </button>
              <button className="flex h-10 px-4 items-center justify-center rounded-lg hover:bg-gray-50 text-gray-700 font-bold text-sm">
                2
              </button>
              <button 
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
