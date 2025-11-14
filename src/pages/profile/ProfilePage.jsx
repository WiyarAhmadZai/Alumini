import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    graduationYear: "2015",
    department: "Computer Science",
    currentPosition: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    bio: "Passionate software engineer with 8 years of experience in developing scalable web applications. Alumni mentor for current computer science students.",
    education: [
      {
        id: 1,
        degree: "Master of Science",
        field: "Computer Science",
        institution: "University Name",
        graduationYear: "2015",
        gpa: "3.8"
      },
      {
        id: 2,
        degree: "Bachelor of Science",
        field: "Computer Engineering",
        institution: "University Name",
        graduationYear: "2013",
        gpa: "3.7"
      }
    ],
    career: [
      {
        id: 1,
        position: "Senior Software Engineer",
        company: "Tech Innovations Inc.",
        startDate: "2020-01-15",
        endDate: null,
        description: "Lead development of cloud-based applications using React and Node.js. Manage a team of 5 developers."
      },
      {
        id: 2,
        position: "Software Engineer",
        company: "Digital Solutions LLC",
        startDate: "2017-03-10",
        endDate: "2019-12-31",
        description: "Developed and maintained web applications using JavaScript frameworks. Collaborated with UX designers."
      }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleCareerChange = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      career: prev.career.map(job => 
        job.id === id ? { ...job, [field]: value } : job
      )
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveProfile = () => {
    // Save profile logic would go here
    console.log("Profile saved:", profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600">Manage your personal and professional information</p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={toggleEdit}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={saveProfile}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={toggleEdit}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </Card.Header>
              <Card.Body>
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-4" />
                  {isEditing ? (
                    <Button variant="outline" size="sm">Change Photo</Button>
                  ) : null}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{profileData.firstName} {profileData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profileData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{profileData.location}</p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Professional Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Bio</h2>
              </Card.Header>
              <Card.Body>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.bio}</p>
                )}
              </Card.Body>
            </Card>

            {/* Education History */}
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Education History</h2>
                {isEditing && (
                  <Button variant="outline" size="sm">Add Education</Button>
                )}
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {profileData.education.map(edu => (
                    <div key={edu.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => handleEducationChange(edu.id, 'field', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                              <input
                                type="text"
                                value={edu.graduationYear}
                                onChange={(e) => handleEducationChange(edu.id, 'graduationYear', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-gray-800">{edu.degree} in {edu.field}</h3>
                          <p className="text-gray-600">{edu.institution} • {edu.graduationYear}</p>
                          <p className="text-gray-600">GPA: {edu.gpa}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Career History */}
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Career History</h2>
                {isEditing && (
                  <Button variant="outline" size="sm">Add Job</Button>
                )}
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {profileData.career.map(job => (
                    <div key={job.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <input
                              type="text"
                              value={job.position}
                              onChange={(e) => handleCareerChange(job.id, 'position', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input
                              type="text"
                              value={job.company}
                              onChange={(e) => handleCareerChange(job.id, 'company', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={job.startDate}
                                onChange={(e) => handleCareerChange(job.id, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                              <input
                                type="date"
                                value={job.endDate || ''}
                                onChange={(e) => handleCareerChange(job.id, 'endDate', e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={job.description}
                              onChange={(e) => handleCareerChange(job.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-gray-800">{job.position}</h3>
                          <p className="text-gray-600">{job.company}</p>
                          <p className="text-gray-600">
                            {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
                          </p>
                          <p className="text-gray-600 mt-2">{job.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;