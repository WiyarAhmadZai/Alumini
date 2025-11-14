import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DashboardPage = () => {
  // Mock data for profile summary
  const profileSummary = {
    name: "John Doe",
    graduationYear: "2015",
    department: "Computer Science",
    currentPosition: "Senior Software Engineer",
    company: "Tech Corp"
  };

  // Mock data for latest events
  const latestEvents = [
    { id: 1, title: "Annual Alumni Reunion", date: "2024-02-15", location: "Main Campus" },
    { id: 2, title: "Career Development Workshop", date: "2024-03-10", location: "Online" },
    { id: 3, title: "Industry Networking Night", date: "2024-03-22", location: "Downtown Convention Center" }
  ];

  // Mock data for recent announcements
  const recentAnnouncements = [
    { id: 1, title: "New Mentorship Program Launch", date: "2024-01-15", excerpt: "We're excited to announce our new alumni mentorship program..." },
    { id: 2, title: "Scholarship Opportunities", date: "2024-01-10", excerpt: "Several scholarship opportunities are now available for current students..." },
    { id: 3, title: "Campus Upgrades", date: "2024-01-05", excerpt: "Major upgrades to campus facilities will begin this spring..." }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {profileSummary.name}</h1>
          <p className="text-gray-600">Here's what's happening with your alumni network today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Profile Summary</h2>
              </Card.Header>
              <Card.Body>
                <div className="flex items-center mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">{profileSummary.name}</h3>
                    <p className="text-gray-600">{profileSummary.graduationYear} • {profileSummary.department}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Current Position</p>
                    <p className="font-medium">{profileSummary.currentPosition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{profileSummary.company}</p>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <Button variant="outline" className="w-full">
                  <Link to="/profile">View Full Profile</Link>
                </Button>
              </Card.Footer>
            </Card>
          </div>

          {/* Latest Events and Recent Announcements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest Events */}
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Latest Events</h2>
                <Button variant="outline" size="sm">
                  <Link to="/events">View All</Link>
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {latestEvents.map(event => (
                    <div key={event.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-gray-800">{event.title}</h3>
                      <div className="flex text-sm text-gray-600 mt-1">
                        <span className="mr-4">{event.date}</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Announcements</h2>
                <Button variant="outline" size="sm">View All</Button>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {recentAnnouncements.map(announcement => (
                    <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{announcement.excerpt}</p>
                      <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center justify-center h-32">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Directory</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-32">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Events</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-32">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resources</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-32">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;