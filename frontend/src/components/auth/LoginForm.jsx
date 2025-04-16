import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../UI/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../UI/Card';
import Input from '../UI/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to dashboard
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Хэрэглэгчийн нэр оруулна уу';
    }
    
    if (!formData.password) {
      newErrors.password = 'Нууц үг оруулна уу';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await login(formData.username, formData.password);
      
      if (success) {
        console.log('Login successful, redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error('Login form error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader bordered>
        <CardTitle>Системд нэвтрэх</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Хэрэглэгчийн нэр"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <Input
              label="Нууц үг"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Намайг сана
              </label>
            </div>
            
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                Нууц үгээ мартсан?
              </a>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </Button>
          </div>
        </form>
      </CardContent>
      
      <CardFooter bordered className="flex justify-center">
        <p className="text-sm text-gray-600">
          Бүртгэлгүй юу? {' '}
          <a href="/register" className="font-medium text-green-600 hover:text-green-500">
            Бүртгүүлэх
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm; 