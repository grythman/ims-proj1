import api from './api';

export const adminService = {
    getDashboardStats: () => api.get('/users/admin/dashboard/'),
    
    approveUser: (userId) => api.post('/users/admin/approve_user/', {
        user_id: userId
    }),
    
    approveOrganization: (orgId) => api.post('/users/admin/approve_organization/', {
        organization_id: orgId
    }),

    getSystemLogs: () => api.get('/users/admin/logs/'),

    sendSystemMessage: (data) => api.post('/users/admin/system-message/', data),

    getAdminMetrics: () => api.get('/users/admin/metrics/'),

    updateSystemSettings: (settings) => api.post('/users/admin/settings/', settings)
};

export default adminService; 