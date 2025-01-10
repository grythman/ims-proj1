import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userType: 'student',
    // Student specific fields
    studentId: '',
    major: '',
    yearOfStudy: '',
    // Mentor specific fields
    company: '',
    position: '',
    // Teacher specific fields
    departmentName: '',
    facultyId: '',
    subjectArea: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserTypeFields = () => {
    switch (formData.userType) {
      case 'student':
        return (
          <>
            <Input
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
            <Input
              label="Major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
            <Input
              label="Year of Study"
              type="number"
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onChange={handleChange}
              required
            />
          </>
        );
      case 'mentor':
        return (
          <>
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
            <Input
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </>
        );
      case 'teacher':
        return (
          <>
            <Input
              label="Department Name"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              required
            />
            <Input
              label="Faculty ID"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              required
            />
            <Input
              label="Subject Area"
              name="subjectArea"
              value={formData.subjectArea}
              onChange={handleChange}
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {renderUserTypeFields()}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Register
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 