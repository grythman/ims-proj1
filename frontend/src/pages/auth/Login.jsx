import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card';
import { toast } from 'react-hot-toast';
import { UserCircle, Lock, GraduationCap } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
        if (!credentials.username || !credentials.password) {
            toast.error('Хэрэглэгчийн нэр болон нууц үгээ оруулна уу');
            setLoading(false);
            return;
        }
        
        const { redirectPath } = await login(credentials.username, credentials.password);
        navigate(redirectPath);
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.message || 'Нэвтрэх үйлдэл амжилтгүй боллоо. Мэдээллээ шалгана уу.';
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center shadow-lg">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          <span className="text-green-600">ДУС</span>-д тавтай морил
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Системд нэвтрэх эсвэл{' '}
          <Link 
            to="/register" 
            className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
          >
            шинээр бүртгүүлэх
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white shadow-xl border border-gray-100 overflow-hidden rounded-xl">
          <CardHeader className="px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardTitle className="text-xl font-semibold text-center">Нэвтрэх</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Хэрэглэгчийн нэр
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Хэрэглэгчийн нэрээ оруулна уу"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Нууц үг
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Нууц үгээ оруулна уу"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor="remember-me" 
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Намайг сана
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                  >
                    Нууц үгээ мартсан уу?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>Тусламж хэрэгтэй бол: support@dus.mn</p>
                <p className="mt-1">Туршилтын хаягууд: admin/admin123, student/student123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 