import api from './api';

const teacherApi = {
    dashboard: {
        // Dashboard Overview
        getOverview: async () => {
            try {
                const response = await api.get('/api/dashboard/teacher/');
                return response.data;
            } catch (error) {
                console.error('Error fetching teacher dashboard:', error);
                throw error;
            }
        },

        // Get Students
        getStudents: async () => {
            try {
                const response = await api.get('/api/dashboard/teacher/students/');
                return response.data;
            } catch (error) {
                console.error('Error fetching students:', error);
                throw error;
            }
        }
    },

    evaluations: {
        // Get All Evaluations
        getAll: async () => {
            try {
                const response = await api.get('/api/evaluations/teacher/evaluations/');
                return response.data;
            } catch (error) {
                console.error('Error fetching evaluations:', error);
                throw error;
            }
        },

        // Get Mentor Evaluations
        getMentorEvaluations: async () => {
            try {
                const response = await api.get('/api/evaluations/teacher/mentor/all/');
                return response.data;
            } catch (error) {
                console.error('Error fetching mentor evaluations:', error);
                throw error;
            }
        },

        // Review Evaluation
        reviewEvaluation: async (evaluationId, data) => {
            try {
                const response = await api.post(`/api/evaluations/${evaluationId}/review/`, data);
                return response.data;
            } catch (error) {
                console.error('Error reviewing evaluation:', error);
                throw error;
            }
        }
    },

    reports: {
        // Get All Reports
        getAll: async () => {
            try {
                const response = await api.get('/api/dashboard/teacher/reports/');
                return response.data;
            } catch (error) {
                console.error('Error fetching reports:', error);
                throw error;
            }
        },

        // Review Report
        reviewReport: async (reportId, data) => {
            try {
                const response = await api.post(`/api/reports/${reportId}/review/`, data);
                return response.data;
            } catch (error) {
                console.error('Error reviewing report:', error);
                throw error;
            }
        }
    }
};

export default teacherApi; 