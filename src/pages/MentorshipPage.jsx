import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  FiSearch, 
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiBookOpen,
  FiMapPin,
  FiClock,
  FiStar,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiUsers
} from 'react-icons/fi';

const MentorshipPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState({
    civilEngineering: true,
    computerScience: false,
    electromechanics: false,
    geomatics: false
  });

  const [experienceLevel, setExperienceLevel] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState(['Structural']);

  const mentors = [
    {
      id: 1,
      name: "Ahmad Rashid",
      title: "Senior Structural Engineer",
      company: "At Kabul Construction Group",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC126DAr5Qw0O932Pa0F2On4dslt3MWS_V3gpBn1Cz1NZ_N-2Y8VlOccwUzND9fm-7ViMYqM4C-LVI6nNrm2H513MmA-nFftbknCRJFqpNzWrXsiDtLBnBgYspv_2CFnttuHxcWL6eSjmZQAEAQc7DBvevDehS-7A-AftbR6VoGfIqdukQ-RRORDocSbRBEtViltUH9cCoFPYOKxUqX0K1I8AFEI4UKSg3-Fu7nvlG-ZwZBxZiMInQ-Bl8B6-yJmvkmA45zu8he7T3B",
      isOnline: true,
      quote: "I have 12 years of experience in high-rise building design. Happy to help junior engineers with career planning and technical growth.",
      mentoredCount: "15+ Alumni",
      graduationYear: "Class of 2012",
      expertise: ["Structural Design", "Seismic Analysis"]
    },
    {
      id: 2,
      name: "Sara Mohammadi",
      title: "Lead Data Scientist",
      company: "At TechNode Innovations",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0dUWcNiyn3vjWhg_aU4GGrZNqP2W7qXonUCX8rAV7Gq9g2s6NM7WWoULwrrII12ZgCOatOWePZ4jVn2wMvlBYTnjBTRQPnKT4buVUSMNE9rXaedHzziBWP-gwivhk4GjxDhxwZwin8JRgOSdkzQiKVMuzBYCwza_ILhJqG97kkZ8cp6QpmDwplHbO_kcoO-gqpqFG6--UJylVHImpf-_lY0uiqwxpfNqqBu0liHQFMD4WTF2yxXM3tHj2WXthfJAVQokhVRxKte9B",
      isOnline: false,
      quote: "Expert in developing AI solutions for infrastructure. I can provide guidance on transitioning from engineering to data science.",
      mentoredCount: "8 Alumni",
      graduationYear: "Class of 2018",
      expertise: ["Machine Learning", "Python"]
    },
    {
      id: 3,
      name: "Zainab Sadat",
      title: "Water Resources Manager",
      company: "At Ministry of Energy & Water",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAAbWZJAPyiSzYoUOzTpK228PZtXdYewafrx7Y5zY8sWeNnPkD13g9CBkJErGcgSoYkb8xdVzs2ZJpJziOUGCD-uNECvpx5VUbQ8PpIn2DwMnJBiL6kmzInT9rn73W64K-PiyGbX9bRobs0tR6kWW8QRBfRrhfI1mppU1oTP5tDs0_rAyLhH1p03kRz1toTyOIMJ4UFiZZ2YX5hgWo0WwjTEkBTbN5PJ7iiNTVpwPJKg8EaiDVOX8mJVyzhjgktsAPSVBYZzw8mMlj",
      isOnline: false,
      quote: "Passionate about sustainable water management. Offering mentorship for public sector career paths and hydraulics research.",
      mentoredCount: "22 Alumni",
      graduationYear: "Class of 2010",
      expertise: ["Hydraulics", "Irrigation Systems"]
    },
    {
      id: 4,
      name: "Omar Farooq",
      title: "GIS Lead",
      company: "At Global Survey Solutions",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpRERhD7Pe6Xw_w9Y3Di452nbjUm5qvhHTppYgtVgfJonvgbV-FaGLgspCUUqikD5OEdh6KxFpOnXN2__l_5_5eLO2TjNfn8NWi65krWP8RTpMIHOxT6gkcq5vcd97tDJOYPnqK87_gHSS2VuXf49Whci3zM_K7AUOXvC2etxKCeP5poLFwTyofUrOg1GT-8SgI3l2OWbIqYSsBUPqomSIimlci7pi2oaDCeUDrIthesrNjic1YsImS8ZXMwfHiZpAPbAuyokFyZX",
      isOnline: true,
      quote: "I can help you master advanced GIS software and guide you through the latest surveying technologies in the industry.",
      mentoredCount: "5 Alumni",
      graduationYear: "Class of 2015",
      expertise: ["Geomatics", "Remote Sensing"]
    }
  ];

  const expertiseOptions = ["Structural", "Hydraulics", "AI/ML", "Project Mgmt"];

  const handleFacultyChange = (faculty) => {
    setSelectedFaculty(prev => ({
      ...prev,
      [faculty]: !prev[faculty]
    }));
  };

  const handleExpertiseToggle = (expertise) => {
    setSelectedExpertise(prev => 
      prev.includes(expertise) 
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    );
  };

  const resetFilters = () => {
    setSelectedFaculty({
      civilEngineering: false,
      computerScience: false,
      electromechanics: false,
      geomatics: false
    });
    setExperienceLevel('all');
    setSelectedExpertise([]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Guide the next generation or find your own path</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Connect with experienced KPU alumni for career guidance, technical skill development, and professional networking.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-blue-600 text-white rounded-2xl p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <FiUsers className="text-4xl mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Become a Mentor</h3>
                  <p className="text-white/80 mb-6">
                    Share your industry expertise and help shape the careers of fellow KPU alumni and students.
                  </p>
                  <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition-all">
                    Join as Mentor
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10 scale-150 group-hover:rotate-12 transition-transform duration-500">
                  <FiBookOpen className="text-[200px]" />
                </div>
              </div>
              <div className="bg-white border-2 border-blue-600/20 rounded-2xl p-8 flex flex-col gap-6 shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                  <FiSearch className="text-4xl text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Find a Mentor</h3>
                  <p className="text-gray-600 mb-6">
                    Connect with industry leaders who graduated from KPU and can help you navigate your professional journey.
                  </p>
                  <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">
                    Browse Mentors
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-5 scale-150 group-hover:-rotate-12 transition-transform duration-500">
                  <FiTrendingUp className="text-[200px] text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-12 gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-gray-900 text-lg font-bold">Filter Mentors</h2>
                <p className="text-gray-600 text-sm">Find your perfect match</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-900">Faculty</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input 
                      checked={selectedFaculty.civilEngineering}
                      onChange={() => handleFacultyChange('civilEngineering')}
                      className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                      type="checkbox"
                    />
                    <span>Civil Engineering</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input 
                      checked={selectedFaculty.computerScience}
                      onChange={() => handleFacultyChange('computerScience')}
                      className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                      type="checkbox"
                    />
                    <span>Computer Science</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input 
                      checked={selectedFaculty.electromechanics}
                      onChange={() => handleFacultyChange('electromechanics')}
                      className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                      type="checkbox"
                    />
                    <span>Electromechanics</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input 
                      checked={selectedFaculty.geomatics}
                      onChange={() => handleFacultyChange('geomatics')}
                      className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" 
                      type="checkbox"
                    />
                    <span>Geomatics</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-900">Years of Experience</p>
                <select 
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-lg border-gray-200 bg-white text-sm text-gray-900 focus:ring-blue-500"
                >
                  <option value="all">All experience levels</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10-15">10-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-900">Expertise Area</p>
                <div className="flex flex-wrap gap-2">
                  {expertiseOptions.map((expertise) => (
                    <button
                      key={expertise}
                      onClick={() => handleExpertiseToggle(expertise)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                        selectedExpertise.includes(expertise)
                          ? 'bg-blue-100 text-blue-600 border-blue-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {expertise}
                    </button>
                  ))}
                </div>
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
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Mentors</h2>
                <p className="text-gray-600">Handpicked mentors based on your background</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                <span>View All</span>
                <FiChevronRight className="text-[18px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
                  <div className="relative z-10">
                    <div className="flex gap-4">
                      <div className="relative">
                        <div 
                          className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-xl border-2 border-blue-600/20" 
                          style={{ backgroundImage: `url("${mentor.image}")` }}
                        ></div>
                        {mentor.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                        <p className="text-blue-600 text-sm font-semibold">{mentor.title}</p>
                        <p className="text-gray-600 text-xs">{mentor.company}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {mentor.expertise.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{mentor.quote}</p>
                    <div className="flex items-center gap-6 py-3 border-y border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Mentored</span>
                        <span className="text-sm font-bold">{mentor.mentoredCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Graduation</span>
                        <span className="text-sm font-bold">{mentor.graduationYear}</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                      Request Mentorship
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-6 border-t border-gray-200 mt-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">42</span> available mentors
              </p>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900">
                  <FiChevronLeft />
                </button>
                <button className="flex h-10 px-4 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                  1
                </button>
                <button className="flex h-10 px-4 items-center justify-center rounded-lg hover:bg-gray-50 text-gray-900 font-bold text-sm">
                  2
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900">
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default MentorshipPage;
