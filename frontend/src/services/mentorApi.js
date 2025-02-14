import api from './api';

const ENDPOINTS = {
    EVALUATIONS: '/api/evaluations',
    INTERNSHIPS: '/api/internships',
    REPORTS: '/api/reports',
    DASHBOARD: '/api/internships/mentor/dashboard'
};

// Dashboard management
export const dashboardService = {
    // Get dashboard overview
    getOverview: async () => {
        try {
            const response = await api.get(ENDPOINTS.DASHBOARD);
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            throw error;
        }
    },

    // Get dashboard stats
    getStats: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.DASHBOARD}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    // Get dashboard activities
    getActivities: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.DASHBOARD}/activities`);
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard activities:', error);
            throw error;
        }
    }
};

// Evaluation management
export const evaluationService = {
    // Get mentor evaluation
    getMentorEvaluation: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.EVALUATIONS}/mentor/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching mentor evaluation:', error);
            throw error;
        }
    },

    // Get teacher evaluation
    getTeacherEvaluation: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.EVALUATIONS}/teacher/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching teacher evaluation:', error);
            throw error;
        }
    },

    // Submit evaluation
    submitEvaluation: async (evaluationData) => {
        try {
            const response = await api.post(`${ENDPOINTS.EVALUATIONS}/`, evaluationData);
            return response.data;
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            throw error;
        }
    },

    // Get evaluation history
    getEvaluationHistory: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.EVALUATIONS}/history/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching evaluation history:', error);
            throw error;
        }
    }
};

// Internship management
export const internshipService = {
    // Get internship duration
    getDuration: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.INTERNSHIPS}/duration/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching internship duration:', error);
            throw error;
        }
    },

    // Get current internship
    getCurrent: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.INTERNSHIPS}/current/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching current internship:', error);
            throw error;
        }
    }
};

// Report management
export const reportService = {
    // Get preliminary report status
    getPreliminaryStatus: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.REPORTS}/preliminary/status/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching preliminary status:', error);
            throw error;
        }
    },

    // Submit preliminary report
    submitPreliminary: async (reportData) => {
        try {
            const response = await api.post(`${ENDPOINTS.REPORTS}/preliminary/`, reportData);
            return response.data;
        } catch (error) {
            console.error('Error submitting preliminary report:', error);
            throw error;
        }
    },

    // Get pending reports
    getPendingReports: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.REPORTS}/pending/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pending reports:', error);
            throw error;
        }
    },

    // Submit report review
    submitReview: async (reportId, reviewData) => {
        try {
            const response = await api.post(`${ENDPOINTS.REPORTS}/${reportId}/review/`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Error submitting report review:', error);
            throw error;
        }
    }
};

// Student management
export const studentService = {
    // Get all assigned students
    getAllAssigned: async () => {
        try {
            const response = await api.get(`${ENDPOINTS.INTERNSHIPS}/mentor/students/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching assigned students:', error);
            throw error;
        }
    },

    // Get student details
    getStudentDetails: async (studentId) => {
        try {
            const response = await api.get(`${ENDPOINTS.INTERNSHIPS}/mentor/students/${studentId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching student details:', error);
            throw error;
        }
    }
};

// Error handling wrapper
const withErrorHandling = (apiCall) => async (...args) => {
    try {
        const response = await apiCall(...args);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.warn('Resource not found:', error.config.url);
            return null;
        }
        throw error;
    }
};

// Export wrapped services
export default {
    evaluations: Object.keys(evaluationService).reduce((acc, key) => ({
        ...acc,
        [key]: withErrorHandling(evaluationService[key])
    }), {}),
    internships: Object.keys(internshipService).reduce((acc, key) => ({
        ...acc,
        [key]: withErrorHandling(internshipService[key])
    }), {}),
    reports: Object.keys(reportService).reduce((acc, key) => ({
        ...acc,
        [key]: withErrorHandling(reportService[key])
    }), {}),
    dashboard: Object.keys(dashboardService).reduce((acc, key) => ({
        ...acc,
        [key]: withErrorHandling(dashboardService[key])
    }), {}),
    students: Object.keys(studentService).reduce((acc, key) => ({
        ...acc,
        [key]: withErrorHandling(studentService[key])
    }), {})
}; 