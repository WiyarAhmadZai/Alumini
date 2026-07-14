import api from '../config/axios';

const messageService = {
  /**
   * Send a message from the contact form
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
   * Get a single message with replies
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
   * Get replies for a specific message
   */
  getReplies: async (messageId) => {
    try {
      const response = await api.get(`/alumini/messages/${messageId}/replies`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reply to a message
   */
  replyToMessage: async (messageId, content, parentId = null) => {
    try {
      const response = await api.post(`/alumini/messages/${messageId}/reply`, {
        content,
        parent_id: parentId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a message
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
