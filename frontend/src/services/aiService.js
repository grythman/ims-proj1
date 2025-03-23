import api from './api';

const aiService = {
  async sendMessage(message, context = {}, role = 'student') {
    try {
      const response = await api.post('/api/v1/ai/chat/', {
        message,
        context,
        role
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  }
};

export default aiService; 