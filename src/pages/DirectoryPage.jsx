import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiSearch, FiCalendar, FiBookOpen, FiBriefcase, FiFilter, FiChevronDown, FiChevronUp, FiMail, FiX, FiChevronLeft, FiChevronRight, FiUser, FiMapPin, FiLinkedin, FiExternalLink } from 'react-icons/fi';
import alumniService from '../services/alumniService';

const DirectoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [expandedFilters, setExpandedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    faculty: [],
    graduationYear: [],
    degreeType: [],
    industry: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await alumniService.getAll();
        setAlumni(response.data);
      } catch (err) {
        setError('Failed to load alumni directory.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter(alumnus => {
    const matchesSearch = !searchTerm || 
      alumnus.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.current_job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.current_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.bio?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = selectedFilters.faculty.length === 0 || selectedFilters.faculty.includes(alumnus.faculty_name);
    const matchesYear = selectedFilters.graduationYear.length === 0 || selectedFilters.graduationYear.includes(alumnus.graduation_year);

    return matchesSearch && matchesFaculty && matchesYear;
  });

  const faculties = [
    'Engineering',
    'Computer Science', 
    'Geomatics',
    'Electromechanics',
    'Architecture',
    'Business Administration',
    'Law',
    'Pharmacy'
  ];
  const years = [...new Set(alumni.map(a => a.graduation_year).filter(Boolean))].sort((a, b) => b - a);

  const toggleFilter = (filterName) => {
    if (expandedFilters.includes(filterName)) {
      setExpandedFilters(prev => prev.filter(f => f !== filterName));
    } else {
      setExpandedFilters(prev => [...prev, filterName]);
    }
  };

  const handleFacultyChange = (faculty) => {
    if (faculty === 'All') {
      setSelectedFilters(prev => ({
        ...prev,
        faculty: []
      }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        faculty: prev.faculty.includes(faculty)
          ? prev.faculty.filter(f => f !== faculty)
          : [...prev.faculty, faculty]
      }));
    }
  };

  const handleYearChange = (year) => {
    if (year === 'All') {
      setSelectedFilters(prev => ({
        ...prev,
        graduationYear: []
      }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        graduationYear: prev.graduationYear.includes(year)
          ? prev.graduationYear.filter(y => y !== year)
          : [...prev.graduationYear, year]
      }));
    }
  };

  const resetFilters = () => {
    setSelectedFilters({
      faculty: [],
      graduationYear: [],
      degreeType: [],
      industry: []
    });
    setExpandedFilters([]);
  };

  const removeFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(item => item !== value)
    }));
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading alumni directory...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg">{error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-64 sm:h-72 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgba(0, 39, 89, 0.8) 100%), url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              Alumni Directory
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Connect with our distinguished alumni network
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, company, or bio..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
              <select
                value={expandedFilters.includes('faculty') ? 'All' : selectedFilters.faculty.join(',')}
                onChange={(e) => handleFacultyChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="">All Faculties</option>
                {faculties.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
              <select
                value={expandedFilters.includes('graduationYear') ? 'All' : selectedFilters.graduationYear.join(',')}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  resetFilters();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumnus) => (
              <div key={alumnus.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-[400px]">
                {/* Profile Header */}
                <div className="relative flex-shrink-0">
                  {alumnus.cover_image ? (
                    <img
                      src={alumnus.cover_image}
                      alt="Cover"
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  )}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    {alumnus.profile_image || alumnus.student_photo ? (
                      <img
                        src={alumnus.profile_image || alumnus.student_photo}
                        alt={alumnus.first_name}
                        className="w-20 h-20 rounded-full border-4 border-white object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                        <FiUser className="text-2xl text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Content */}
                <div className="px-6 pt-12 pb-4 flex-1 flex flex-col">
                  <div className="text-center flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {alumnus.first_name} {alumnus.last_name}
                    </h3>
                    {alumnus.current_job_title && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                        <FiBriefcase className="text-xs" />
                        <span>{alumnus.current_job_title}</span>
                      </div>
                    )}
                    {alumnus.current_company && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                        <FiMapPin className="text-xs" />
                        <span>{alumnus.current_company}</span>
                      </div>
                    )}
                    {alumnus.graduation_year && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                        <FiCalendar className="text-xs" />
                        <span>Class of {alumnus.graduation_year}</span>
                      </div>
                    )}
                    {alumnus.faculty_name && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                        <FiBookOpen className="text-xs" />
                        <span>{alumnus.faculty_name}</span>
                      </div>
                    )}
                    {alumnus.bio && (
                      <p className="text-sm text-gray-700 mb-2">
                        {expandedCards.has(alumnus.id) 
                          ? alumnus.bio 
                          : alumnus.bio.length > 80 
                            ? `${alumnus.bio.substring(0, 80)}...` 
                            : alumnus.bio
                        }
                        {alumnus.bio.length > 80 && (
                          <span 
                            onClick={() => toggleCardExpansion(alumnus.id)}
                            className="text-blue-600 cursor-pointer hover:text-blue-700 ml-1 font-medium"
                          >
                            {expandedCards.has(alumnus.id) ? ' see less' : ' see more'}
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/profile/${alumnus.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FiExternalLink className="text-sm" />
                      <span className="text-sm font-medium">View Profile</span>
                    </button>
                    {alumnus.linkedin_profile && (
                      <a
                        href={alumnus.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
                      >
                        <FiLinkedin className="text-sm" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DirectoryPage;
