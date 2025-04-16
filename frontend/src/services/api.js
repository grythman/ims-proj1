import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000, // 10 second timeout
});

// Mock data for development when API is not available
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        user_type: 'admin'
    },
    {
        id: 2,
        username: 'student',
        password: 'student123',
        first_name: 'Student',
        last_name: 'User',
        email: 'student@example.com',
        user_type: 'student'
    },
    {
        id: 3,
        username: 'mentor',
        password: 'mentor123',
        first_name: 'Mentor',
        last_name: 'User',
        email: 'mentor@example.com',
        user_type: 'mentor'
    },
    {
        id: 4,
        username: 'teacher',
        password: 'teacher123',
        first_name: 'Teacher',
        last_name: 'User',
        email: 'teacher@example.com',
        user_type: 'teacher'
    }
];

// Check if we should use mock data
const useMockApi = process.env.REACT_APP_MOCK_API === 'true';

// ------------------------------
// API Helper Functions
// ------------------------------

// Helper function to decide if we should provide mock data for a failed request
const shouldUseMockData = (url, status, errorMessage) => {
    // Always use mock data in development or when MOCK_API is enabled
    if (useMockApi || process.env.NODE_ENV === 'development') {
        console.log('Мок дата ашиглаж байна:', url);
        return true;
    }
    
    // For specific error cases, we might want to use mock data
    if (status === 404 || status === 401 || status === 403) {
        console.log('Алдаа гарсан учир мок дата ашиглаж байна:', status);
        return true;
    }
    
    // If it's a network error, we definitely want to use mock data
    if (errorMessage === 'Network Error') {
        console.log('Сүлжээний алдаа гарсан учир мок дата ашиглаж байна');
        return true;
    }
    
    return false;
};

// Provide mock responses based on the requested URL
const getMockResponseForUrl = (url) => {
    console.log('Providing mock data for URL:', url);
    
    if (url.includes('/internships/listings') || url.includes('/internship-listings')) {
        return mockData.internshipListings;
    }
    
    if (url.includes('/internships/student/evaluations/mentor')) {
        return mockData.mentorEvaluation;
    }
    
    if (url.includes('/internships/student/evaluations/teacher')) {
        return mockData.teacherEvaluation;
    }
    
    if (url.includes('/my-internship')) {
        return mockData.myInternship;
    }
    
    if (url.includes('/dashboard')) {
        return mockData.dashboard;
    }
    
    if (url.includes('/api/v1/reports/')) {
        return mockData.reports;
    }
    
    // Default empty response
    return null;
};

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
        throw new Error('Refresh token not available');
    }
    
    try {
        if (useMockApi) {
            // For mock API, just create a new token
            const storedUser = localStorage.getItem('user');
            if (!storedUser) throw new Error('User information not found');
            
            const user = JSON.parse(storedUser);
            const newToken = `mock-token-${user.id}-${Date.now()}`;
            
            localStorage.setItem('token', newToken);
            return { access: newToken };
        }
        
        // Real API call to refresh token
        const response = await axios.post(
            `${api.defaults.baseURL}/api/v1/token/refresh/`,
            { refresh: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data && response.data.access) {
            localStorage.setItem('token', response.data.access);
            return response.data;
        }
        
        throw new Error('Failed to refresh token');
    } catch (error) {
        console.error('Token refresh error:', error);
        // Clear auth data on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        throw error;
    }
};

// ------------------------------
// API Interceptors
// ------------------------------

// Add API request interceptor to automatically add auth token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('API request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling, token refresh and mock data
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // Token expired error and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Try to refresh the token
                const newToken = await refreshAccessToken();
                
                // Update the Authorization header
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken.access}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken.access}`;
                
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Continue with mock data or reject
            }
        }
        
        console.error('API алдаа:', error.message, error.response?.status, error.config?.url);
        
        // Check if we should use mock data when there's an error
        if (error.config) {
            // Decide whether to use mock data based on the error
            if (shouldUseMockData(error.config.url, error.response?.status, error.message)) {
                console.log('Мок дата ашиглаж байна:', error.config.url, 'Шалтгаан:', error.message);
                const mockData = getMockResponseForUrl(error.config.url);
                
                if (mockData) {
                    return Promise.resolve({ data: mockData, status: 200, statusText: 'OK (Mock)' });
                }
            }
        }
        
        return Promise.reject(error);
    }
);

// ------------------------------
// API Modules
// ------------------------------

// Authentication API
export const authApi = {
    // Login function with enhanced error handling
    login: async (username, password) => {
        console.log(`Attempting to log in with username: ${username}`);
        
        try {
            if (useMockApi) {
                console.log('Using mock authentication');
                // Find user in mock data
                const mockUser = mockUsers.find(u => u.username === username && u.password === password);
                
                if (!mockUser) {
                    console.error('Invalid credentials in mock authentication');
                    throw new Error('Нэвтрэх нэр эсвэл нууц үг буруу байна');
                }
                
                // Create mock token
                const mockToken = `mock-token-${mockUser.id}-${Date.now()}`;
                
                // Save to localStorage for persistence
                localStorage.setItem('token', mockToken);
                localStorage.setItem('refreshToken', `refresh-${mockToken}`);
                localStorage.setItem('user', JSON.stringify({...mockUser, password: undefined}));
                
                return {
                    token: mockToken,
                    user: {...mockUser, password: undefined}
                };
            }
            
            // Real API call
            const response = await api.post('/api/v1/token/', {
                username,
                password
            });
            
            // Check if we have valid data in the response
            if (!response.data || !response.data.access || !response.data.refresh) {
                console.error('Invalid response format from token endpoint', response.data);
                throw new Error('Сервер алдаатай хариу буцаалаа');
            }
            
            // Extract user data from token payload
            const userData = response.data.user || {
                id: null,
                username,
                user_type: 'unknown'
            };
            
            // Store token and user data
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Set token for future API calls
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            
            return {
                token: response.data.access,
                user: userData
            };
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle different error types
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const status = error.response.status;
                const errorData = error.response.data;
                
                if (status === 401) {
                    throw new Error('Нэвтрэх нэр эсвэл нууц үг буруу байна');
                } else if (status === 403) {
                    throw new Error('Таны эрх хүрэлцэхгүй байна');
                } else if (errorData && errorData.detail) {
                    throw new Error(errorData.detail);
                } else {
                    throw new Error(`Серверийн алдаа (${status})`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                throw new Error('Сервертэй холбогдоход алдаа гарлаа. Интернэт холболтоо шалгана уу.');
            } else {
                // Something happened in setting up the request that triggered an Error
                throw error;
            }
        }
    },

    // Get current user data
    getMe: async () => {
        try {
            // Check for token first
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Хэрэглэгч нэвтрээгүй байна');
            }

            if (useMockApi) {
                console.log('Using mock user data');
                const userStorage = localStorage.getItem('user');
                if (userStorage) {
                    const user = JSON.parse(userStorage);
                    
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    return user;
                }
                throw new Error('Хэрэглэгчийн мэдээлэл хадгалагдаагүй байна');
            }

            // API request to get current user info with token already set by interceptor
            const response = await api.get('/api/v1/users/me/');
            
            if (!response.data) {
                throw new Error('Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа');
            }
            
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.data));
            
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            
            if (error.response) {
                const status = error.response.status;
                
                // Handle different status codes
                if (status === 401 || status === 403) {
                    // Clear invalid auth data
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    
                    throw new Error('Таны нэвтрэх эрх дууссан байна. Дахин нэвтэрнэ үү');
                } else {
                    throw new Error('Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа');
                }
            } else if (error.request) {
                throw new Error('Сервертэй холбогдоход алдаа гарлаа');
            } else {
                throw error;
            }
        }
    },

    // Register a new user
    register: async (userData) => {
        try {
            console.log('Sending registration request with data:', userData);
            
            // Use mock data in development when API is not available
            if (useMockApi) {
                console.log('Using mock registration');
                
                // Check if username already exists
                if (mockUsers.some(u => u.username === userData.username)) {
                    throw new Error('Username already exists');
                }
                
                // Create new mock user
                const newUser = {
                    id: mockUsers.length + 1,
                    username: userData.username,
                    password: userData.password,
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    user_type: userData.user_type || 'student'
                };
                
                // Add to mock users (would persist in a real backend)
                mockUsers.push(newUser);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                return {
                    status: 'success',
                    message: 'Registration successful',
                    data: {
                        ...newUser,
                        password: undefined
                    }
                };
            }
            
            const response = await api.post('/api/v1/users/register/', userData);
            console.log('Registration API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration API error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    // Password reset request
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/api/v1/users/password-reset/', { email });
            return response.data;
        } catch (error) {
            console.error('Password reset error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Reset password with token
    resetPassword: async (token, password) => {
        try {
            const response = await api.post('/api/v1/users/password-reset/confirm/', {
                token,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Password reset confirm error:', error.response?.data || error.message);
            throw error;
        }
    }
};

// Internships API
export const internshipsApi = {
    // Get all internship listings with optional filters
    getListings: async (filters = {}) => {
        let queryParams = new URLSearchParams();
        
        // Convert filters to query params
        Object.keys(filters).forEach(key => {
            if (Array.isArray(filters[key])) {
                // For array values, add multiple entries
                filters[key].forEach(value => {
                    queryParams.append(key, value);
                });
            } else if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                queryParams.append(key, filters[key]);
            }
        });
        
        try {
            const response = await api.get(`/api/v1/internships/listings/?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching internship listings:', error);
            throw error;
        }
    },

    // Get details of specific internship
    getListingById: async (id) => {
        try {
            const response = await api.get(`/api/v1/internships/listings/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching internship details (ID: ${id}):`, error);
            throw error;
        }
    },

    // Apply for an internship
    apply: async (id, applicationData) => {
        try {
            const response = await api.post(`/api/v1/internships/listings/${id}/apply/`, applicationData);
            return response.data;
        } catch (error) {
            console.error(`Error applying for internship (ID: ${id}):`, error);
            throw error;
        }
    },

    // Bookmark an internship
    bookmark: async (id) => {
        try {
            const response = await api.post(`/api/v1/internships/listings/${id}/bookmark/`);
            return response.data;
        } catch (error) {
            console.error(`Error bookmarking internship (ID: ${id}):`, error);
            throw error;
        }
    },

    // Get bookmarked internships
    getBookmarked: async () => {
        try {
            const response = await api.get('/api/v1/internships/listings/bookmarked/');
            return response.data;
        } catch (error) {
            console.error('Error fetching bookmarked internships:', error);
            throw error;
        }
    }
};

// Reports API
export const reportsApi = {
    // Get all reports
    getAll: async () => {
        try {
            const response = await api.get('/api/v1/reports/');
            return response.data;
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw new Error('Тайлан авахад алдаа гарлаа');
        }
    },

    // Get a specific report
    getById: async (id) => {
        try {
            const response = await api.get(`/api/v1/reports/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching report (ID: ${id}):`, error);
            throw error;
        }
    },

    // Submit a new report
    submit: async (reportData) => {
        try {
            const formData = new FormData();
            
            // Add text fields
            Object.keys(reportData).forEach(key => {
                if (key !== 'attachments') {
                    if (typeof reportData[key] === 'object') {
                        formData.append(key, JSON.stringify(reportData[key]));
                    } else {
                        formData.append(key, reportData[key]);
                    }
                }
            });
            
            // Add attachments if any
            if (reportData.attachments) {
                reportData.attachments.forEach(file => {
                    formData.append('attachments', file);
                });
            }
            
            const response = await api.post('/api/v1/reports/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error submitting report:', error);
            throw error;
        }
    }
};

// Mock data organized by category
const mockData = {
    // Internship listings mock data
    internshipListings: [
            {
                id: 1,
                organization: 'Монгол Апп ХХК',
                position: 'Веб хөгжүүлэгч',
                location: 'Улаанбаатар',
                type: 'Бүтэн цагийн',
                duration: '3 сар',
                salary: '1,500,000₮',
                category: 'Програм хангамж',
                description: 'React, NodeJS ашиглан веб аппликейшн хөгжүүлэх дадлага. Тогтмол үнэлгээтэй.',
                requirements: ['React эсвэл Angular', 'JavaScript/TypeScript', 'HTML/CSS', 'Git'],
                benefits: ['Цалинтай', 'Ажилд орох боломж', 'Mentor дагалдуулах', 'Уян хатан цаг'],
                applyDeadline: '2023-06-30',
                postedDate: '2023-06-01',
                logo: 'https://via.placeholder.com/80',
                featured: true
            },
            {
                id: 2,
                organization: 'Дата Аналитикс ХХК',
                position: 'Дата аналист',
                location: 'Улаанбаатар',
                type: 'Хагас цагийн',
                duration: '4 сар',
                salary: 'Сарын 800,000₮',
                category: 'Дата шинжилгээ',
                description: 'Бодит дата дээр ажиллаж, шинжилгээ хийх, дата визуалчлал бэлтгэх дадлага.',
                requirements: ['Python/R', 'SQL', 'Статистик мэдлэг', 'Excel/PowerBI'],
                benefits: ['Цалинтай', 'Мэргэжлийн хөгжил', 'Бодит төслүүд', 'Гэрчилгээ'],
                applyDeadline: '2023-07-15',
                postedDate: '2023-06-05',
                logo: 'https://via.placeholder.com/80',
                featured: false
            },
            {
                id: 3,
                organization: 'Fintech Solutions',
                position: 'Mobile Developer',
                location: 'Улаанбаатар',
                type: 'Бүтэн цагийн',
                duration: '6 сар',
                salary: 'Сарын 1,800,000₮',
                category: 'Програм хангамж',
                description: 'Fintech компанид Flutter ашиглан мобайл апп хөгжүүлэх туршлага.',
                requirements: ['Flutter/React Native', 'Dart/JavaScript', 'Mobile app development', 'UI/UX'],
                benefits: ['Өндөр цалин', 'Ажилд орох боломж', 'Олон улсын туршлага', 'Үнэ төлбөргүй хоол'],
                applyDeadline: '2023-07-30',
                postedDate: '2023-06-10',
                logo: 'https://via.placeholder.com/80',
                featured: true
            }
    ],
    
    // Mentor evaluation mock data
    mentorEvaluation: {
          mentor: {
              name: 'Батбаяр Дорж',
              position: 'Ахлах хөгжүүлэгч',
              organization: 'Монгол Апп ХХК',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          },
          latestEvaluation: {
              date: '2023-04-15',
              overallScore: 4.2,
              comment: 'Бат сүүлийн сард сайн ажиллаж байна. Техникийн ур чадвар сайжирч байгаа боловч харилцааны ур чадварыг хөгжүүлэх хэрэгтэй.',
              scores: {
                  attendance: 4.5,
                  technical: 4.0,
                  teamwork: 3.8,
                  communication: 3.5,
                  problemSolving: 4.2,
              }
          },
          evaluationHistory: [
              {
                  id: 1,
                  date: '2023-04-15',
                  overallScore: 4.2,
                  comment: 'Сүүлийн сард сайн ажиллаж байна. Техникийн ур чадвар сайжирч байгаа боловч харилцааны ур чадварыг хөгжүүлэх хэрэгтэй.'
              },
              {
                  id: 2,
                  date: '2023-03-15',
                  overallScore: 3.8,
                  comment: 'Техникийн ур чадвар дунд зэрэг. Идэвх сонирхолтой ажиллаж байгаа нь сайшаалтай. Код бичих дадалаа сайжруулах хэрэгтэй.'
              },
              {
                  id: 3,
                  date: '2023-02-15',
                  overallScore: 3.5,
                  comment: 'Дадлага эхэлсэн. Суурь мэдлэгтэй боловч практик туршлага дутмаг байна. Идэвхтэй суралцаж байгаа нь сайшаалтай.'
              }
          ],
          competencies: [
              { name: 'Техникийн ур чадвар', value: 80 },
              { name: 'Харилцааны ур чадвар', value: 70 },
              { name: 'Багаар ажиллах чадвар', value: 85 },
              { name: 'Асуудал шийдвэрлэх', value: 75 },
              { name: 'Цаг баримтлалт', value: 90 }
          ],
          feedback: [
              { 
                  date: '2023-04-10', 
                  type: 'positive', 
                  comment: 'Хэрэглэгчийн интерфэйсийн загварыг маш сайн гүйцэтгэсэн.' 
              },
              { 
                  date: '2023-04-05', 
                  type: 'improvement', 
                  comment: 'Хүсэлтийн хариу үйлдлийг удаан гүйцэтгэж байна. Шуурхай ажиллах хэрэгтэй.' 
              },
              { 
                  date: '2023-03-25', 
                  type: 'positive', 
                  comment: 'REST API-тай ажиллах чадвар сайжирсан.' 
              }
          ]
    },
    
    // Teacher evaluation mock data
    teacherEvaluation: {
          teacher: {
              name: 'Б. Баярхүү',
              position: 'Дадлагын удирдагч',
              department: 'Програм хангамж, Мэдээллийн системийн тэнхим',
              avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
          },
          finalGrade: {
              letterGrade: 'A',
              percentage: 92,
              gpa: 4.0,
              comment: 'Оюутан дадлагын хугацаанд маш сайн ажилласан. Тавьсан зорилтуудыг амжилттай биелүүлж, дадлагын үр дүнгээр сайн тайлан гаргаж өгсөн. Цаашид мэргэжлийн чиглэлээр өсөж хөгжих боломжтой.',
          },
          criteria: [
              { 
                  name: 'Дадлагын тайлан', 
                  score: 35, 
                  maxScore: 40,
                  comment: 'Тайлан бүрэн гүйцэд, дэлгэрэнгүй бичигдсэн боловч зарим хэсэгт дүгнэлт хийх нь дутуу.'
              },
              { 
                  name: 'Ирц, идэвх', 
                  score: 18, 
                  maxScore: 20,
                  comment: 'Бүх хичээл, уулзалтад оролцсон.'
              },
              { 
                  name: 'Техникийн чадвар', 
                  score: 25, 
                  maxScore: 25,
                  comment: 'Техникийн даалгаврыг бүрэн гүйцэтгэсэн.'
              },
              { 
                  name: 'Хамтын ажиллагаа', 
                  score: 15, 
                  maxScore: 15,
                  comment: 'Багийн гишүүдтэй сайн хамтран ажилласан.'
              }
          ],
          progress: [
              { week: 1, grade: 'B+', comment: 'Эхний долоо хоногт сайн дасан зохицсон.' },
              { week: 2, grade: 'A-', comment: 'Даалгаврыг цагт нь гүйцэтгэсэн.' },
              { week: 3, grade: 'A', comment: 'Шинэ технологи судлахдаа идэвхтэй байлаа.' },
              { week: 4, grade: 'A', comment: 'Firebase мэдээллийн сантай ажиллах чадвар сайжирсан.' },
              { week: 5, grade: 'A+', comment: 'Төслийн хүрээнд шинэлэг санаа гаргаж хэрэгжүүлсэн.' }
          ]
    },
    
    // My internship mock data
    myInternship: {
            id: 1,
            status: 'active',
            organization: 'Монгол Апп ХХК',
            position: 'Веб хөгжүүлэгч',
            mentor: 'Батбаяр Дорж',
            mentorPosition: 'Ахлах хөгжүүлэгч',
            teacher: 'Б. Баярхүү',
            teacherDepartment: 'Програм хангамж, Мэдээллийн системийн тэнхим',
            startDate: '2023-02-15',
            endDate: '2023-05-15',
            totalHours: 240,
            completedHours: 120,
            daysRemaining: 45,
            totalDays: 90,
            completedDays: 45,
            progressPercent: 68,
            credits: 3,
            mentorRating: 4.2,
            teacherRating: 'B+',
            tasksCompleted: 8,
            totalTasks: 12,
            reportsSubmitted: 2,
            totalReports: 3
    },
    
    // Dashboard mock data
    dashboard: {
            stats: {
                active_internships: 1,
                completed_internships: 2,
                pending_reports: 1,
                submitted_reports: 8
            },
            recent_activity: [
                {
                    id: 1,
                    type: 'report_submission',
                    title: 'Долоо хоногийн тайлан илгээгдлээ',
                    date: '2023-05-10',
                    status: 'pending'
                },
                {
                    id: 2,
                    type: 'task_completion',
                    title: 'Нүүр хуудасны UI загвар хийх',
                    date: '2023-05-08',
                    status: 'completed'
                }
            ],
            upcoming_deadlines: [
                {
                    id: 1,
                    title: 'Эцсийн тайлан илгээх',
                    date: '2023-05-20',
                    days_left: 10
                }
            ]
    },
    
    // Reports mock data
    reports: [
        {
            id: 1,
            title: 'Долоо хоногийн тайлан - 1',
            content: 'Энэ долоо хоногт хийсэн ажлын тайлан.',
            created_at: '2023-11-15',
            type: 'weekly'
        },
        {
            id: 2,
            title: 'Сарын тайлан - 10 сар',
            content: 'Аравдугаар сарын тайлан.',
            created_at: '2023-10-31',
            type: 'monthly'
        },
        {
            id: 3,
            title: 'Эцсийн тайлан',
            content: 'Дадлагын эцсийн тайлан.',
            created_at: '2023-12-01',
            type: 'final'
        }
    ]
};

// For backwards compatibility
export const login = authApi.login;
export const getMe = authApi.getMe;
export const register = authApi.register;
export const forgotPassword = authApi.forgotPassword;
export const resetPassword = authApi.resetPassword;
export const getInternshipListings = internshipsApi.getListings;
export const getInternshipListingById = internshipsApi.getListingById;
export const applyForInternship = internshipsApi.apply;
export const bookmarkInternship = internshipsApi.bookmark;
export const getBookmarkedInternships = internshipsApi.getBookmarked;
export const fetchReports = reportsApi.getAll;

export default api;