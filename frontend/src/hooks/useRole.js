import { useAuth } from '../contexts/AuthContext';

export const useRole = () => {
    const { user } = useAuth();

    const isAdmin = user?.user_type === 'admin';
    const isTeacher = user?.user_type === 'teacher';
    const isMentor = user?.user_type === 'mentor';
    const isStudent = user?.user_type === 'student';
    const isEmployer = user?.user_type === 'employer';

    const getTheme = () => {
        switch (user?.user_type) {
            case 'admin':
                return {
                    primary: 'blue',
                    gradient: 'from-blue-600 to-blue-800',
                    accent: 'border-blue-600'
                };
            case 'teacher':
                return {
                    primary: 'indigo',
                    gradient: 'from-indigo-600 to-indigo-800',
                    accent: 'border-indigo-600'
                };
            case 'mentor':
                return {
                    primary: 'purple',
                    gradient: 'from-purple-600 to-purple-800',
                    accent: 'border-purple-600'
                };
            case 'student':
                return {
                    primary: 'green',
                    gradient: 'from-green-600 to-green-800',
                    accent: 'border-green-600'
                };
            case 'employer':
                return {
                    primary: 'orange',
                    gradient: 'from-orange-600 to-orange-800',
                    accent: 'border-orange-600'
                };
            default:
                return {
                    primary: 'gray',
                    gradient: 'from-gray-600 to-gray-800',
                    accent: 'border-gray-600'
                };
        }
    };

    return {
        isAdmin,
        isTeacher,
        isMentor,
        isStudent,
        isEmployer,
        getTheme,
        userType: user?.user_type
    };
}; 