import api from './api';

const ENDPOINTS = {
    ANALYTICS: '/api/analytics'
};

// Analytics management
export const analyticsService = {
    // Get overview statistics
    getOverview: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.ANALYTICS}/overview/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching overview analytics:', error);
            throw error;
        }
    },

    // Get internship analytics
    getInternshipAnalytics: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.ANALYTICS}/internships/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching internship analytics:', error);
            throw error;
        }
    },

    // Get report analytics
    getReportAnalytics: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.ANALYTICS}/reports/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching report analytics:', error);
            throw error;
        }
    },

    // Get evaluation analytics
    getEvaluationAnalytics: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.ANALYTICS}/evaluations/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching evaluation analytics:', error);
            throw error;
        }
    },

    // Get user analytics
    getUserAnalytics: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.ANALYTICS}/users/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user analytics:', error);
            throw error;
        }
    }
};

// Error handling wrapper
const withErrorHandling = (apiCall) => async (...args) => {
    try {
        return await apiCall(...args);
    } catch (error) {
        if (error.response?.status === 404) {
            console.warn('Resource not found:', error.config.url);
            return null;
        }
        throw error;
    }
};

// Export wrapped service
export default {
    analytics: Object.keys(analyticsService).reduce((acc, key) => ({
        ...acc,
        [key]: withErrorHandling(analyticsService[key])
    }), {})
}; 