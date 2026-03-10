import api from '../config/axios';

const messageService = {
  /**
   * Send a message from the contact form
   * @param {Object} messageData - Message data
   * @returns {Promise} API response
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/alumini/messages', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's messages
   * @param {number} page - Page number
   * @param {number} perPage - Records per page
   * @param {string} search - Search term
   * @param {string} status - Status filter
   * @returns {Promise} API response
   */
  getUserMessages: async (page = 1, perPage = 10, search = '', status = 'all') => {
    try {
      const response = await api.get('/alumini/messages', {
        params: {
          page: page,
          per_page: perPage,
          search: search,
          status: status !== 'all' ? status : undefined
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a message
   * @param {number} messageId - Message ID
   * @returns {Promise} API response
   */
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/alumini/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single message by ID
   * @param {number} messageId - Message ID
   * @returns {Promise} API response
   */
  getMessage: async (messageId) => {
    try {
      const response = await api.get(`/alumini/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send a reply to a message
   * @param {number} messageId - Parent message ID
   * @param {Object} replyData - Reply content
   * @returns {Promise} API response
   */
  sendReply: async (messageId, replyData) => {
    try {
      const response = await api.post(`/alumini/messages/${messageId}/reply`, replyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default messageService;
