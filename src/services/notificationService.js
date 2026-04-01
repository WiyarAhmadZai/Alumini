import api from '../config/axios';

const notificationService = {
  getAll: () => api.get('/alumini/notifications'),
  getUnreadCount: () => api.get('/alumini/notifications/unread-count'),
  markAllRead: () => api.post('/alumini/notifications/mark-read'),
  markRead: (id) => api.post(`/alumini/notifications/${id}/read`),
};

export default notificationService;
