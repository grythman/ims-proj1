import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Check if we should use mock data
const useMockApi = process.env.REACT_APP_MOCK_API === 'true';

// Mock data for development when API is not available
const mockData = {
  // Student Dashboard Data
  studentDashboard: {
    reportsSubmitted: 5,
    daysRemaining: 45,
    overallProgress: 68,
    tasksCompleted: '12/15',
    upcomingDeadlines: [
      {
        id: 1,
        title: '7 хоногийн тайлан',
        dueDate: '2023-03-25',
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Сарын тайлан',
        dueDate: '2023-04-01',
        status: 'upcoming'
      }
    ]
  },
  // Organizations Data
  organizations: [
    { id: 1, name: 'Монгол Апп ХХК' },
    { id: 2, name: 'АйТи Зон ХХК' },
    { id: 3, name: 'ЮнителХХК' }
  ],
  // Mentors Data
  mentors: [
    { id: 1, first_name: 'Батбаяр', last_name: 'Дорж' },
    { id: 2, first_name: 'Болормаа', last_name: 'Ган' },
    { id: 3, first_name: 'Түмэн', last_name: 'Жаргал' }
  ]
};

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with mock data handler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If mock API is enabled and we have a network error or 404
    if (useMockApi && (error.message === 'Network Error' || error.response?.status === 404)) {
      console.log('Using mock data for:', error.config.url);
      
      // Mock different API endpoints
      if (error.config.url.includes('/api/v2/student/dashboard')) {
        return {
          data: mockData.studentDashboard,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        };
      }
      
      if (error.config.url.includes('/api/v2/organizations')) {
        return {
          data: mockData.organizations,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        };
      }
      
      if (error.config.url.includes('/api/v2/mentors')) {
        return {
          data: mockData.mentors,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        };
      }
      
      // Default mock response if no specific endpoint match
      return {
        data: { message: 'Mock data not available for this endpoint' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      };
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 