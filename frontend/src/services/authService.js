import api from './api';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await api.post('/api/users/login/', {
                username,
                password
            });

            // Store user data
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // If admin, handle admin session
            if (response.data.is_admin) {
                localStorage.setItem('is_admin', 'true');
                // Redirect to Django admin
                window.location.href = response.data.admin_url;
                return;
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/users/logout/');
            localStorage.clear();
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    isAdmin: () => {
        return localStorage.getItem('is_admin') === 'true';
    }
};

export default authService; 