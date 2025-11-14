import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const EventManagementPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock events data
  const eventsData = [
    {
      id: 1,
      title: "Annual Alumni Reunion",
      date: "2024-02-15",
      time: "18:00",
      location: "Main Campus, Grand Hall",
      description: "Join us for our annual reunion event where we celebrate our achievements and reconnect with old friends.",
      attendees: 120,
      image: ""
    },
    {
      id: 2,
      title: "Career Development Workshop",
      date: "2024-03-10",
      time: "14:00",
      location: "Online",
      description: "Enhance your professional skills with our expert-led workshop on modern career development strategies.",
      attendees: 85,
      image: ""
    },
    {
      id: 3,
      title: "Industry Networking Night",
      date: "2024-03-22",
      time: "19:00",
      location: "Downtown Convention Center",
      description: "Network with industry professionals and fellow alumni in our exclusive networking event.",
      attendees: 200,
      image: ""
    },
    {
      id: 4,
      title: "Tech Innovation Seminar",
      date: "2024-04-05",
      time: "10:00",
      location: "Engineering Building, Room 101",
      description: "Learn about the latest trends in technology and innovation from leading experts in the field.",
      attendees: 95,
      image: ""
    },
    {
      id: 5,
      title: "Mentorship Program Launch",
      date: "2024-04-18",
      time: "15:00",
      location: "Student Center",
      description: "Join us for the official launch of our new alumni mentorship program connecting students with professionals.",
      attendees: 60,
      image: ""
    }
  ];

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Events</h1>
              <p className="text-gray-600">Stay connected through our upcoming events</p>
            </div>
            <Button variant="primary">
              <Link to="/create-event">Create Event</Link>
            </Button>
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="space-y-6">
          {eventsData.map(event => (
            <Card key={event.id}>
              <Card.Body>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32" />
                  </div>
                  <div className="md:w-3/4 md:pl-6">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {event.date}
                          </span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.time}
                          </span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {event.attendees} attending
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Button variant="outline" onClick={() => openEventDetails(event)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{event.description}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </main>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.title}</h2>
                <button 
                  onClick={closeEventDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedEvent.date} at {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{selectedEvent.attendees} people attending</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Register for Event</Button>
                  <Button variant="outline">Add to Calendar</Button>
                  <Button variant="outline">Share Event</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventManagementPage;