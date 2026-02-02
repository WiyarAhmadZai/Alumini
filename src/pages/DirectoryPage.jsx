import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiCalendar, 
  FiBookOpen, 
  FiBriefcase, 
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import Layout from '../components/Layout';

const DirectoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [expandedFilters, setExpandedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    faculty: ['Civil Engineering'],
    graduationYear: [],
    degreeType: [],
    industry: []
  });
  const [currentPage, setCurrentPage] = useState(1);

  const alumni = [
    {
      id: 1,
      name: "Ahmad Rashid",
      position: "Senior Structural Engineer, the full stack web developer with smart mind, the full stack web developer with smart mind, the full stack web developer with smart mind",
      class: "Class of 2015 — Civil Engineering",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC126DAr5Qw0O932Pa0F2On4dslt3MWS_V3gpBn1Cz1NZ_N-2Y8VlOccwUzND9fm-7ViMYqM4C-LVI6nNrm2H513MmA-nFftbknCRJFqpNzWrXsiDtLBnBgYspv_2CFnttuHxcWL6eSjmZQAEAQc7DBvevDehS-7A-AftbR6VoGfIqdukQ-RRORDocSbRBEtViltUH9cCoFPYOKxUqX0K1I8AFEI4UKSg3-Fu7nvlG-ZwZBxZiMInQ-Bl8B6-yJmvkmA45zu8he7T3B",
      online: true
    },
    {
      id: 2,
      name: "Sara Mohammadi",
      position: "Lead Data Scientist",
      class: "Class of 2018 — Computer Science",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0dUWcNiyn3vjWhg_aU4GGrZNqP2W7qXonUCX8rAV7Gq9g2s6NM7WWoULwrrII12ZgCOatOWePZ4jVn2wMvlBYTnjBTRQPnKT4buVUSMNE9rXaedHzziBWP-gwivhk4GjxDhxwZwin8JRgOSdkzQiKVMuzBYCwza_ILhJqG97kkZ8cp6QpmDwplHbO_kcoO-gqpqFG6--UJylVHImpf-_lY0uiqwxpfNqqBu0liHQFMD4WTF2yxXM3tHj2WXthfJAVQokhVRxKte9B",
      online: false
    },
    {
      id: 3,
      name: "Karim Azizi",
      position: "Project Manager at TABS",
      class: "Class of 2012 — Electromechanics",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjiOmHFEMT5ey2UXQIfni577qO6yZcn98EwHb76Y6_cQekJT0B13oldtHqb6WRZmCMXCAlhoFMZWk21FPv1xeHC5jcmwArdpVHevi0VCbbsZ-I3wQBHxX3Ew_JRautJt37fryCWnYt_R5MHywoAiZTJY5Lmg-BVP9aEZlCRS6_UQg_jczlvmTzzIc3SavvZ7tyNVNTPpGd9XMLfY8cxTXrB9epuOqJRUOPnK-ozxedQwy8ZzAPhMhVrp9ejC0AtXGsR_T4Cf7SFCTq",
      online: false
    },
    {
      id: 4,
      name: "Lina Hakimi",
      position: "Full Stack Developer",
      class: "Class of 2020 — Computer Science",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBI2NjD3ZvCXkEPXfEYhyY_8VFKGKIVux-lXyUgt5V9kEvtPcaqCjzQ0ZLR9TILHeEBYI245WLQrFcel8zxfe3FN1UVHkjfZp9Qc_61W5XiZ8Bo8xz8sm3jPvsZLhlXEfYfaDDuwdgVPK9bWNzMS-KXkVxOq96GKmC6EhUaIjGgqu9IvcaqpXjv9d4LkttZwQduDemXPZ-VsnezMsaC41Tgr_oYVQn0SuH_zW3A8eqXchWmv_RZeqpgJcC4TEI7k9saAz3kZ08YTbAV",
      online: true
    },
    {
      id: 5,
      name: "Omar Farooq",
      position: "Geospatial Analyst",
      class: "Class of 2014 — Geomatics",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpRERhD7Pe6Xw_w9Y3Di452nbjUm5qvhHTppYgtVgfJonvgbV-FaGLgspCUUqikD5OEdh6KxFpOnXN2__l_5_5eLO2TjNfn8NWi65krWP8RTpMIHOxT6gkcq5vcd97tDJOYPnqK87_gHSS2VuXf49Whci3zM_K7AUOXvC2etxKCeP5poLFwTyofUrOg1GT-8SgI3l2OWbIqYSsBUPqomSIimlci7pi2oaDCeUDrIthesrNjic1YsImS8ZXMwfHiZpAPbAuyokFyZX",
      online: false
    },
    {
      id: 6,
      name: "Zainab Sadat",
      position: "Water Resources Engineer",
      class: "Class of 2019 — Civil Engineering",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAAbWZJAPyiSzYoUOzTpK228PZtXdYewafrx7Y5zY8sWeNnPkD13g9CBkJErGcgSoYkb8xdVzs2ZJpJziOUGCD-uNECvpx5VUbQ8PpIn2DwMnJBiL6kmzInT9rn73W64K-PiyGbX9bRobs0tR6kWW8QRBfRrhfI1mppU1oTP5tDs0_rAyLhH1p03kRz1toTyOIMJ4UFiZZ2YX5hgWo0WwjTEkBTbN5PJ7iiNTVpwPJKg8EaiDVOX8mJVyzhjgktsAPSVBYZzw8mMlj",
      online: false
    }
  ];

  const faculties = [
    'Civil Engineering',
    'Computer Science', 
    'Geomatics',
    'Electromechanics'
  ];

  const toggleFilter = (filterName) => {
    // Allow multiple filters to be open at once
    if (expandedFilters.includes(filterName)) {
      // Close this filter
      setExpandedFilters(prev => prev.filter(f => f !== filterName));
    } else {
      // Open this filter
      setExpandedFilters(prev => [...prev, filterName]);
    }
  };

  const handleFacultyChange = (faculty) => {
    if (faculty === 'All') {
      // If 'All' is selected, clear all faculty selections
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full h-64 sm:h-72 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 39, 89, 0.9) 0%, rgba(0, 39, 89, 0.95) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB62RlnCmIlm2ZKXcAjOQzLJhRKZ_U_PfIBqJuGDY0g-7qg90TmCkN2fGhQJcrqRc1yGet8Ts4wcxeYizkeRIOru31TOa_kHxIuJ7GyPxENzMTZxSl_jWiazMK5EdddDcTM6om0s8s0SksSOIqOxNJlwaGhcRFwZ2ooJkkXpHK9_YFR5GjO3VB7DnF1ISuygib9rCU1teyx3Z5Ht78LP69mA_O88P2NrWu3cN_YjR2xOO1yJn2t-M_9oRxPwOzGAXARdTKYtGjE7R_6")',
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
              Connect with 15,000+ KPU alumni worldwide. Find mentors, collaborators, and friends from your alma mater.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
          <div className="w-full lg:flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                className="w-full h-14 pl-12 pr-4 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#002759] focus:ring-2 focus:ring-[#002759]/20 text-base placeholder-gray-500 shadow-sm"
                placeholder="Search by name, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#002759] to-[#0a519b] text-white font-semibold rounded-xl hover:from-[#0a519b] hover:to-[#003d7a] transition-all shadow-md">
            <FiFilter className="text-lg" />
            <span>Filter</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button className="px-6 py-2 bg-gradient-to-r from-[#002759] to-[#0a519b] text-white font-medium rounded-full hover:from-[#0a519b] hover:to-[#003d7a] transition-all shadow-md">
            All Members
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:border-[#002759] hover:text-[#002759] transition-all">
            Faculty
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:border-[#002759] hover:text-[#002759] transition-all">
            Class Year
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:border-[#002759] hover:text-[#002759] transition-all">
            Location
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:border-[#002759] hover:text-[#002759] transition-all">
            Industry
          </button>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {alumni.map((person) => {
            const isExpanded = expandedCards.has(person.id);
            const needsSeeMore = person.position.length > 25;
            
            return (
              <div key={person.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 max-w-[220px] group h-[280px] overflow-hidden">
                <div className="relative mb-4">
                  <div 
                    className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-full border-3 border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300"
                    style={{ backgroundImage: `url("${person.image}")` }}
                  ></div>
                  {person.online && (
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                  )}
                </div>
                <h3 className="text-gray-900 text-sm font-bold mb-3 leading-tight">{person.name}</h3>
                <div className="text-gray-700 text-xs font-medium mb-4 leading-tight flex-grow relative">
                  <div className={isExpanded ? '' : 'line-clamp-2'}>
                    {person.position}
                  </div>
                  {needsSeeMore && !isExpanded && (
                    <span 
                      onClick={() => toggleCardExpansion(person.id)}
                      className="text-blue-600 cursor-pointer hover:text-blue-700 ml-1 font-medium inline"
                    >
                      see more
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full py-2 bg-gradient-to-r from-[#002759] to-[#0a519b] text-white text-sm font-semibold rounded-lg hover:from-[#0a519b] hover:to-[#003d7a] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg mt-auto"
                >
                  View Profile
                </button>
              </div>
            );
          })}
        </div>

        {/* Load More Section */}
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-[#002759] to-[#0a519b] text-white font-semibold rounded-xl hover:from-[#0a519b] hover:to-[#003d7a] transition-all shadow-md">
            Load More Alumni
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DirectoryPage;
