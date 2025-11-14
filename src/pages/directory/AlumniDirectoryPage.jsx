import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AlumniDirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    graduationYear: '',
    department: '',
    location: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock alumni data
  const alumniData = [
    {
      id: 1,
      name: "John Smith",
      graduationYear: "2010",
      department: "Computer Science",
      location: "San Francisco, CA",
      currentPosition: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      avatar: ""
    },
    {
      id: 2,
      name: "Sarah Johnson",
      graduationYear: "2008",
      department: "Business Administration",
      location: "New York, NY",
      currentPosition: "Marketing Director",
      company: "Global Enterprises",
      avatar: ""
    },
    {
      id: 3,
      name: "Michael Chen",
      graduationYear: "2015",
      department: "Engineering",
      location: "Seattle, WA",
      currentPosition: "Product Manager",
      company: "Innovate Solutions",
      avatar: ""
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      graduationYear: "2012",
      department: "Psychology",
      location: "Miami, FL",
      currentPosition: "Clinical Psychologist",
      company: "Wellness Center",
      avatar: ""
    },
    {
      id: 5,
      name: "David Wilson",
      graduationYear: "2009",
      department: "Finance",
      location: "Chicago, IL",
      currentPosition: "Financial Analyst",
      company: "Investment Group",
      avatar: ""
    },
    {
      id: 6,
      name: "Lisa Anderson",
      graduationYear: "2014",
      department: "Marketing",
      location: "Los Angeles, CA",
      currentPosition: "Brand Manager",
      company: "Creative Agency",
      avatar: ""
    }
  ];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Filter alumni based on search and filters
  const filteredAlumni = alumniData.filter(alumnus => {
    const matchesSearch = alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.currentPosition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGraduationYear = !filters.graduationYear || alumnus.graduationYear === filters.graduationYear;
    const matchesDepartment = !filters.department || alumnus.department === filters.department;
    const matchesLocation = !filters.location || alumnus.location.includes(filters.location);
    
    return matchesSearch && matchesGraduationYear && matchesDepartment && matchesLocation;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Alumni Directory</h1>
          <p className="text-gray-600">Connect with fellow alumni from your university</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, company, or position"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year
              </label>
              <select
                id="graduationYear"
                value={filters.graduationYear}
                onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2012">2012</option>
                <option value="2010">2010</option>
                <option value="2009">2009</option>
                <option value="2008">2008</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Engineering">Engineering</option>
                <option value="Psychology">Psychology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="City, State or Country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'primary' : 'outline'} 
                onClick={() => setViewMode('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline'} 
                onClick={() => setViewMode('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredAlumni.length} of {alumniData.length} alumni
          </p>
        </div>

        {/* Alumni Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map(alumnus => (
              <Card key={alumnus.id}>
                <Card.Body>
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-800">{alumnus.name}</h3>
                      <p className="text-sm text-gray-600">{alumnus.graduationYear} • {alumnus.department}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <span className="font-medium">Position:</span> {alumnus.currentPosition}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Company:</span> {alumnus.company}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {alumnus.location}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlumni.map(alumnus => (
              <Card key={alumnus.id}>
                <Card.Body className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-bold text-gray-800">{alumnus.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Graduated:</span> {alumnus.graduationYear}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Department:</span> {alumnus.department}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {alumnus.location}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Position:</span> {alumnus.currentPosition}
                      </p>
                      <p className="text-sm md:col-span-2">
                        <span className="font-medium">Company:</span> {alumnus.company}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No alumni found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AlumniDirectoryPage;