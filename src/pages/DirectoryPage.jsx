import React, { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFilter, setExpandedFilter] = useState('faculty');
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
      position: "Senior Structural Engineer",
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
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const handleFacultyChange = (faculty) => {
    setSelectedFilters(prev => ({
      ...prev,
      faculty: prev.faculty.includes(faculty)
        ? prev.faculty.filter(f => f !== faculty)
        : [...prev.faculty, faculty]
    }));
  };

  const removeFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(item => item !== value)
    }));
  };

  return (
    <Layout>
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation Bar (Filters) */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6 bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
              <div>
                <h1 className="text-gray-900 dark:text-white text-lg font-bold">Advanced Filters</h1>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Refine your network search</p>
              </div>
              
              <div className="flex flex-col gap-3">
                {/* Graduation Year Filter */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#002759]/5 hover:to-[#0a519b]/5 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-[#002759]" />
                    <p className="text-gray-900 text-sm font-medium">Graduation Year</p>
                  </div>
                </div>

                {/* Faculty Filter */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-[#002759]/10 to-[#0a519b]/10 border border-[#002759]/20 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FiBookOpen className="text-[#002759]" />
                    <p className="text-[#002759] text-sm font-semibold">Faculty</p>
                  </div>
                </div>

                {/* Faculty Options */}
                <div className="px-10 py-2 flex flex-col gap-2">
                  {faculties.map(faculty => (
                    <label key={faculty} className="flex items-center gap-2 text-sm text-gray-600">
                      <input 
                        checked={selectedFilters.faculty.includes(faculty)}
                        onChange={() => handleFacultyChange(faculty)}
                        className="rounded text-[#002759] focus:ring-[#002759] border-gray-300" 
                        type="checkbox" 
                      />
                      {faculty}
                    </label>
                  ))}
                </div>

                {/* Degree Type Filter */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#002759]/5 hover:to-[#0a519b]/5 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <FiBookOpen className="text-gray-900" />
                    <p className="text-gray-900 text-sm font-medium">Degree Type</p>
                  </div>
                </div>

                {/* Industry Filter */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#002759]/5 hover:to-[#0a519b]/5 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <FiBriefcase className="text-gray-900" />
                    <p className="text-gray-900 text-sm font-medium">Current Industry</p>
                  </div>
                </div>
              </div>

              <button className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Search Bar Section */}
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label className="flex flex-col h-14 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm border-0">
                    <div className="text-gray-600 flex border-none bg-white items-center justify-center pl-4 rounded-l-xl">
                      <FiSearch />
                    </div>
                    <input 
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-full placeholder:text-gray-600 px-4 rounded-r-xl pl-2 text-base font-normal"
                      placeholder="Search by name, company, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </label>
              </div>

              {/* Selected Filters (Chips) */}
              <div className="flex gap-2 flex-wrap items-center">
                <p className="text-sm font-medium text-gray-600 mr-2">Quick tags:</p>
                {selectedFilters.faculty.map(faculty => (
                  <button key={faculty} className="flex h-8 items-center gap-x-2 rounded-full bg-gradient-to-r from-[#002759] to-[#0a519b] text-white border border-[#002759]/20 px-4">
                    <span className="text-xs font-semibold">{faculty}</span>
                    <FiX 
                      className="text-[16px] cursor-pointer" 
                      onClick={() => removeFilter('faculty', faculty)}
                    />
                  </button>
                ))}
                <button className="flex h-8 items-center gap-x-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4">
                  <span className="text-xs font-semibold">Class of 2020</span>
                  <FiChevronDown className="text-[16px]" />
                </button>
                <button className="flex h-8 items-center gap-x-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4">
                  <span className="text-xs font-semibold">Kabul, Afghanistan</span>
                  <FiChevronDown className="text-[16px]" />
                </button>
              </div>
            </div>

            {/* Alumni Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {alumni.map((person) => (
                <div key={person.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center group hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="relative mb-4">
                    <div 
                      className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-full border-4 border-[#002759]/10"
                      style={{ backgroundImage: `url("${person.image}")` }}
                    ></div>
                    {person.online && (
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <h3 className="text-gray-900 text-lg font-bold">{person.name}</h3>
                  <p className="text-[#002759] text-sm font-semibold mb-1">{person.position}</p>
                  <p className="text-gray-600 text-xs mb-4">{person.class}</p>
                  <div className="flex gap-2 w-full mt-auto">
                    <button className="flex-1 bg-gradient-to-r from-[#002759] to-[#0a519b] text-white text-sm font-bold py-2 rounded-lg hover:from-[#0a519b] hover:to-[#003d7a] transition-all transform hover:scale-105">
                      Connect
                    </button>
                    <button className="px-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105">
                      <FiMail className="text-[20px] align-middle" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Area */}
            <div className="flex items-center justify-between py-8 border-t border-gray-200 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#002759] to-[#0a519b] rounded-lg flex items-center justify-center text-white shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1H9zM4 6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V7a1 1 0 00-1-1H4z"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-bold text-[#002759] text-base">124</span> KPU Alumni
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                    currentPage === 1 
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 text-gray-700 hover:bg-[#002759] hover:text-white hover:border-[#002759]'
                  }`}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft />
                </button>
                
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 px-4 items-center justify-center rounded-lg font-bold text-sm transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#002759] to-[#0a519b] text-white shadow-lg transform scale-105'
                        : 'border border-gray-300 text-gray-700 hover:bg-[#002759]/10 hover:text-[#002759] hover:border-[#002759]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-[#002759] hover:text-white hover:border-[#002759] transition-all"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DirectoryPage;
