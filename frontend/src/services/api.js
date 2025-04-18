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
    
    // Internship listings
    if (url.includes('/internships/listings') || url.includes('/internship-listings')) {
        return [
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
        ];
    }
    
    // Mentor evaluation
    if (url.includes('/internships/student/evaluations/mentor')) {
        return {
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
        };
    }
    
    // Teacher evaluation
    if (url.includes('/internships/student/evaluations/teacher')) {
        return {
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
        };
    }
    
    // My internship
    if (url.includes('/my-internship')) {
        return {
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
        };
    }
    
    // Dashboard
    if (url.includes('/dashboard')) {
        return {
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
        };
    }
    
    // Default empty response
    return null;
};

// Add API request interceptor to automatically add auth token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            // Check if token is expired
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
                
                if (Date.now() >= expirationTime) {
                    // Token is expired, try to refresh
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        return api.post('/api/v1/token/refresh/', { refresh: refreshToken })
                            .then(response => {
                                localStorage.setItem('token', response.data.access);
                                config.headers['Authorization'] = `Bearer ${response.data.access}`;
                                return config;
                            })
                            .catch(error => {
                                // If refresh fails, redirect to login
                                localStorage.removeItem('token');
                                localStorage.removeItem('refreshToken');
                                window.location.href = '/login';
                                return Promise.reject(error);
                            });
                    }
                }
            } catch (error) {
                console.error('Token validation error:', error);
            }
            
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('API request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and mock data
api.interceptors.response.use(
    response => response,
    error => {
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

// Auth related API calls
export const login = async (credentials) => {
    try {
        console.log('Attempting login with:', { username: credentials.username });
        
        if (useMockApi) {
            console.log('Using mock login');
            const mockUser = mockUsers.find(user => 
                user.username === credentials.username && user.password === credentials.password
            );
            
            if (mockUser) {
                const mockToken = `mock_token_${mockUser.username}_${Date.now()}`;
                return {
                    status: 'success',
                    data: {
                        access_token: mockToken,
                        refresh_token: `mock_refresh_${mockUser.username}_${Date.now()}`,
                        user: {
                            id: mockUser.id,
                            username: mockUser.username,
                            first_name: mockUser.first_name,
                            last_name: mockUser.last_name,
                            email: mockUser.email,
                            user_type: mockUser.user_type
                        }
                    }
                };
            }
            throw new Error('Invalid credentials');
        }

        const response = await api.post('/api/v1/token/', {
            username: credentials.username,
            password: credentials.password
        });

        console.log('Login response:', response.data);

        if (!response.data || !response.data.status === 'success' || !response.data.data?.access_token) {
            console.error('Invalid response format:', response.data);
            throw new Error('Invalid response format');
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getMe = async () => {
    try {
        if (useMockApi) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('User not found');
            return user;
        }
        
        const response = await api.get('/api/v1/users/me/');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа');
    }
};

export const register = async (userData) => {
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
};

// Password reset functions
export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/api/v1/users/password-reset/', { email });
        return response.data;
    } catch (error) {
        console.error('Password reset error:', error.response?.data || error.message);
        throw error;
    }
};

export const resetPassword = async (token, password) => {
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
};

// Дадлагын жагсаалтын API хүсэлтүүд
export const getInternshipListings = async (filters = {}) => {
  let queryParams = new URLSearchParams();
  
  // Шүүлтүүрүүдийг query params болгож хөрвүүлэх
  Object.keys(filters).forEach(key => {
    if (Array.isArray(filters[key])) {
      // Массив бол олон утгатай параметр болгоно
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
    console.error('Дадлагын жагсаалт авахад алдаа гарлаа:', error);
    throw error;
  }
};

export const getInternshipListingById = async (id) => {
  try {
    const response = await api.get(`/api/v1/internships/listings/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Дадлагын дэлгэрэнгүй мэдээлэл авахад алдаа гарлаа (ID: ${id}):`, error);
    throw error;
  }
};

export const applyForInternship = async (id, applicationData) => {
  try {
    const response = await api.post(`/api/v1/internships/listings/${id}/apply/`, applicationData);
    return response.data;
  } catch (error) {
    console.error(`Дадлагад бүртгүүлэхэд алдаа гарлаа (ID: ${id}):`, error);
    throw error;
  }
};

export const bookmarkInternship = async (id) => {
  try {
    const response = await api.post(`/api/v1/internships/listings/${id}/bookmark/`);
    return response.data;
  } catch (error) {
    console.error(`Дадлага хадгалахад алдаа гарлаа (ID: ${id}):`, error);
    throw error;
  }
};

export const getBookmarkedInternships = async () => {
  try {
    const response = await api.get('/api/v1/internships/listings/bookmarked/');
    return response.data;
  } catch (error) {
    console.error('Хадгалсан дадлагын жагсаалт авахад алдаа гарлаа:', error);
    throw error;
  }
};

// Reports API
export const fetchReports = async () => {
  try {
    if (useMockApi) {
      return mockReportsData;
    }
    
    const response = await api.get('/api/v1/reports/');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error('Тайлан авахад алдаа гарлаа');
  }
};

// Mock data for reports
const mockReportsData = [
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
];

export const getApplications = async () => {
    try {
        const response = await api.get('/api/v1/internships/applications/');
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        if (shouldUseMockData(error?.response?.status, error?.message)) {
            return getMockResponseForUrl('/internships/applications');
        }
        throw error;
    }
};

export const submitApplication = async (applicationData) => {
    try {
        const response = await api.post('/api/v1/internships/applications/', applicationData);
        return response.data;
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};

export default api;