import authService from './authService';

const eventService = {
  // Get all events with filtering
  async getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/alumini/events?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  },

  // Get featured event for hero section
  async getFeaturedEvent() {
    const response = await fetch('/api/alumini/events/featured', {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured event');
    }

    return response.json();
  },

  // Get event details
  async getEventDetails(eventId) {
    const response = await fetch(`/api/alumini/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }

    return response.json();
  },

  // Register for an event
  async registerForEvent(eventId, specialRequirements = '') {
    const response = await fetch(`/api/alumini/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        special_requirements: specialRequirements,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register for event');
    }

    return response.json();
  },

  // Cancel event registration
  async cancelRegistration(eventId) {
    const response = await fetch(`/api/alumini/events/${eventId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel registration');
    }

    return response.json();
  },

  // Get user's event registrations
  async getMyRegistrations() {
    const response = await fetch('/api/alumini/events/my-registrations', {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch registrations');
    }

    return response.json();
  },

  // Get event statistics
  async getEventStatistics() {
    const response = await fetch('/api/alumini/events/statistics', {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event statistics');
    }

    return response.json();
  },

  // Upload event image
  async uploadEventImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/alumini/events/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json();
  },

  // Get event categories with counts
  async getEventCategories() {
    try {
      const statsResponse = await this.getEventStatistics();
      const stats = statsResponse.data;
      
      const categories = [
        { name: 'Reunions', type: 'reunion', count: stats.by_type?.reunion || 0 },
        { name: 'Workshops', type: 'workshop', count: stats.by_type?.workshop || 0 },
        { name: 'Webinars', type: 'webinar', count: stats.by_type?.webinar || 0 },
        { name: 'Sports', type: 'sports', count: stats.by_type?.sports || 0 },
        { name: 'Career Fairs', type: 'career_fair', count: stats.by_type?.career_fair || 0 },
        { name: 'Conferences', type: 'conference', count: stats.by_type?.conference || 0 },
        { name: 'Seminars', type: 'seminar', count: stats.by_type?.seminar || 0 },
        { name: 'Networking', type: 'networking', count: stats.by_type?.networking || 0 },
      ];

      return categories.filter(cat => cat.count > 0);
    } catch (error) {
      console.error('Failed to fetch event categories:', error);
      return [];
    }
  },
};

export default eventService;
