import api from './api';

const studentApi = {
    dashboard: {
        // Dashboard Overview
        getOverview: async () => {
            try {
                const response = await api.get('/api/dashboard/student/');
                return response.data;
            } catch (error) {
                console.error('Error fetching student dashboard:', error);
                throw error;
            }
        },

        // Dashboard Stats
        getStats: async () => {
            try {
                const response = await api.get('/api/users/stats/');
                return response.data;
            } catch (error) {
                console.error('Error fetching student stats:', error);
                throw error;
            }
        },

        // Recent Activities
        getActivities: async () => {
            try {
                const response = await api.get('/api/dashboard/student/activities/');
                if (response.data?.status === 'success') {
                    return response.data.data || [];
                }
                return [];
            } catch (error) {
                console.error('Error fetching recent activities:', error);
                return [];
            }
        }
    },

    internships: {
        // Get Current/Active Internship
        getCurrent: async () => {
            try {
                const response = await api.get('/api/internships/my-internship/');
                return response.data?.data || null;
            } catch (error) {
                console.error('Error fetching current internship:', error);
                return null;
            }
        },

        // Register New Internship
        register: async (internshipData) => {
            try {
                const response = await api.post('/api/internships/register/', internshipData);
                return response.data;
            } catch (error) {
                console.error('Error registering internship:', error);
                throw error;
            }
        },

        // Get Companies
        getCompanies: async () => {
            try {
                const response = await api.get('/api/companies/');
                return response.data;
            } catch (error) {
                console.error('Error fetching companies:', error);
                throw error;
            }
        },

        // Get Mentors for a Company
        getMentors: async (companyId) => {
            try {
                const response = await api.get(`/api/companies/${companyId}/mentors/`);
                return response.data;
            } catch (error) {
                console.error('Error fetching mentors:', error);
                throw error;
            }
        }
    },

    reports: {
        // Get All Reports
        getAll: async () => {
            try {
                const response = await api.get('/api/reports/');
                return response.data?.data || [];
            } catch (error) {
                console.error('Error fetching reports:', error);
                return [];
            }
        },

        // Create Report
        create: async (reportData) => {
            try {
                const response = await api.post('/api/reports/create/', reportData);
                return response.data;
            } catch (error) {
                console.error('Error creating report:', error);
                throw error;
            }
        },

        // Submit Report
        submit: async (reportId) => {
            try {
                const response = await api.post(`/api/reports/${reportId}/submit/`);
                return response.data;
            } catch (error) {
                console.error('Error submitting report:', error);
                throw error;
            }
        }
    }
};

export default studentApi;
  