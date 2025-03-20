import api from '../api/axios';

export const webhookService = {
  // Get all webhook endpoints
  getWebhooks: async () => {
    const response = await api.get('/api/v2/webhooks/');
    return response.data;
  },

  // Get a single webhook endpoint
  getWebhook: async (id) => {
    const response = await api.get(`/api/v2/webhooks/${id}/`);
    return response.data;
  },

  // Create a new webhook endpoint
  createWebhook: async (data) => {
    const response = await api.post('/api/v2/webhooks/', data);
    return response.data;
  },

  // Update a webhook endpoint
  updateWebhook: async (id, data) => {
    const response = await api.patch(`/api/v2/webhooks/${id}/`, data);
    return response.data;
  },

  // Delete a webhook endpoint
  deleteWebhook: async (id) => {
    await api.delete(`/api/v2/webhooks/${id}/`);
  },

  // Get webhook delivery history
  getWebhookDeliveries: async (webhookId) => {
    const response = await api.get(`/api/v2/webhooks/${webhookId}/deliveries/`);
    return response.data;
  },

  // Retry failed webhook delivery
  retryDelivery: async (deliveryId) => {
    const response = await api.post(`/api/v2/webhook-deliveries/${deliveryId}/retry/`);
    return response.data;
  },

  // Get webhook statistics
  getWebhookStats: async () => {
    const response = await api.get('/api/v2/webhooks/statistics/');
    return response.data;
  }
}; 