import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Добавлен таймаут для быстрого обнаружения проблем с сетью
  timeout: 10000
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
  ],
  // Mentor Dashboard Data
  mentorDashboard: {
    stats: {
      totalStudents: 15,
      activeInternships: 12,
      completedInternships: 8,
      pendingReports: 4
    },
    students: [
      {
        id: 1,
        name: 'Батболд Дорж',
        email: 'batbold@example.mn',
        internshipTitle: 'Мобайл Апп Хөгжүүлэлт',
        progress: 75,
        status: 'active'
      },
      {
        id: 2,
        name: 'Сарангэрэл Бат',
        email: 'sarangerel@example.mn',
        internshipTitle: 'Веб Хөгжүүлэлт',
        progress: 45,
        status: 'active'
      }
    ],
    reports: [
      {
        id: 1,
        studentName: 'Батболд Дорж',
        type: 'weekly',
        submittedAt: '2023-04-10',
        status: 'pending'
      },
      {
        id: 2,
        studentName: 'Сарангэрэл Бат',
        type: 'monthly',
        submittedAt: '2023-04-05',
        status: 'approved'
      }
    ]
  },
  // Admin Dashboard Data
  adminDashboard: {
    stats: {
      total_users: 324,
      total_reports: 156,
      students_active: 210,
      mentors_active: 45,
      pending_reports: 12
    },
    recentActions: [
      {
        id: 1,
        user: 'Батбаяр Дорж',
        action: 'Бүртгүүлсэн',
        object: 'Дадлага хөтөлбөр',
        time: new Date().toISOString()
      },
      {
        id: 2,
        user: 'Оюунцэцэг Бат',
        action: 'Илгээсэн',
        object: 'Тайлан #45',
        time: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      }
    ]
  }
};

// Store network status
let isOffline = false;

// Check if online
const checkOnlineStatus = () => {
  return navigator.onLine;
};

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  // Check if we're online
  if (!checkOnlineStatus()) {
    isOffline = true;
    console.log('Device is offline, will use mock data');
    // If offline, we will handle in the response interceptor
  }

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Check if the requested URL should return mock data
const shouldUseMockData = (url, status, errorMessage) => {
  return (
    useMockApi || 
    status === 401 || 
    status === 404 || 
    status === 403 ||
    !localStorage.getItem('token') ||
    errorMessage === 'Network Error' ||
    isOffline ||
    errorMessage?.includes('timeout')
  );
};

// Get mock response based on URL
const getMockResponseForUrl = (url) => {
  console.log('Providing mock data for URL:', url);
  
  // STUDENT ENDPOINTS
  if (url.includes('/api/v2/student/dashboard')) {
    return {
      data: mockData.studentDashboard,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  if (url.includes('/api/v2/organizations')) {
    return {
      data: mockData.organizations,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  if (url.includes('/api/v2/mentors')) {
    return {
      data: mockData.mentors,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  // MENTOR ENDPOINTS
  if (url.includes('/api/v2/mentor/dashboard/stats')) {
    return {
      data: mockData.mentorDashboard.stats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  if (url.includes('/api/v2/mentor/students')) {
    return {
      data: mockData.mentorDashboard.students,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  if (url.includes('/api/v2/mentor/reports/recent')) {
    return {
      data: mockData.mentorDashboard.reports,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  // ADMIN ENDPOINTS
  if (url.includes('/admin/dashboard-stats')) {
    return {
      data: mockData.adminDashboard.stats,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  if (url.includes('/admin/recent-actions')) {
    return {
      data: mockData.adminDashboard.recentActions,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    };
  }
  
  // Default mock response if no specific endpoint match
  return {
    data: { message: 'Mock data not available for this endpoint' },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url }
  };
};

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('Device is now online');
  isOffline = false;
});

window.addEventListener('offline', () => {
  console.log('Device is now offline');
  isOffline = true;
});

// Response interceptor with mock data handler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorMessage = error.message || '';
    const status = error.response?.status;
    const url = error.config?.url || '';
    
    console.log('API error:', errorMessage, url, status);
    
    // If device is offline or network error
    if (errorMessage === 'Network Error' || !checkOnlineStatus()) {
      console.warn('Network error or offline detected - using mock data');
      return getMockResponseForUrl(url);
    }
    
    // If mock API is enabled, network error occurs, or we get 401/404 errors
    if (shouldUseMockData(url, status, errorMessage)) {
      console.log('Using mock data for:', url, 'Due to:', errorMessage || status);
      return getMockResponseForUrl(url);
    }
    
    // Handle unauthorized error
    if (status === 401) {
      localStorage.removeItem('token');
      // Only redirect to login if not already there to avoid redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 