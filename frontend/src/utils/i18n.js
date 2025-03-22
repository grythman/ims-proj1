import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Монгол хэлний орчуулгууд
const resourcesMN = {
  translation: {
    // Ерөнхий
    dashboard: 'Хянах самбар',
    reports: 'Тайлангууд',
    settings: 'Тохиргоо',
    profile: 'Хэрэглэгчийн профайл',
    login: 'Нэвтрэх',
    logout: 'Гарах',
    register: 'Бүртгүүлэх',
    
    // Дадлагатай холбоотой
    internships: 'Дадлагууд',
    internshipListings: 'Дадлагын зарууд',
    application: 'Өргөдөл',
    apply: 'Өргөдөл гаргах',
    bookmark: 'Хадгалах',
    share: 'Хуваалцах',
    
    // Статусууд
    pending: 'Хүлээгдэж байна',
    approved: 'Зөвшөөрөгдсөн',
    rejected: 'Татгалзсан',
    completed: 'Дууссан',
    
    // Формын талбарууд
    name: 'Нэр',
    email: 'Имэйл',
    password: 'Нууц үг',
    confirm: 'Баталгаажуулах',
    submit: 'Илгээх',
    cancel: 'Цуцлах',
    
    // Алдааны мессежүүд
    required: 'Шаардлагатай',
    invalidEmail: 'Буруу имэйл',
    passwordMismatch: 'Нууц үгнүүд таарахгүй байна',
    
    // Амжилттай мессежүүд
    success: 'Амжилттай!',
    applicationSubmitted: 'Таны өргөдөл амжилттай илгээгдлээ!'
  }
};

// Англи хэлний орчуулгууд
const resourcesEN = {
  translation: {
    // General
    dashboard: 'Dashboard',
    reports: 'Reports',
    settings: 'Settings',
    profile: 'User Profile',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    
    // Internship related
    internships: 'Internships',
    internshipListings: 'Internship Listings',
    application: 'Application',
    apply: 'Apply',
    bookmark: 'Bookmark',
    share: 'Share',
    
    // Statuses
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    
    // Form fields
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirm: 'Confirm',
    submit: 'Submit',
    cancel: 'Cancel',
    
    // Error messages
    required: 'Required',
    invalidEmail: 'Invalid email',
    passwordMismatch: 'Passwords do not match',
    
    // Success messages
    success: 'Success!',
    applicationSubmitted: 'Your application has been submitted successfully!'
  }
};

// i18next тохиргоо
i18n
  .use(initReactI18next)
  .init({
    resources: {
      mn: resourcesMN,
      en: resourcesEN
    },
    lng: 'mn', // Үндсэн хэл
    fallbackLng: 'en', // Нөөц хэл
    interpolation: {
      escapeValue: false // React-д XSS халдлагаас хамгаалалт байгаа тул
    }
  });

export default i18n; 