import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    user_type: 'student',
    phone: '',
    // Student specific fields
    student_id: '',
    major: '',
    year_of_study: '',
    // Mentor specific fields
    company: '',
    position: '',
    expertise: [],
    // Teacher specific fields
    department_name: '',
    faculty_id: '',
    subject_area: ''
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

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirm_password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_type: formData.user_type,
        // Include other fields as necessary
      });
      console.log('Registration response:', response);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const renderUserTypeFields = () => {
    switch (formData.user_type) {
      case 'student':
        return (
          <>
            <Input
              label="Student ID"
              name="student_id"
              value={formData.student_id}
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
              name="year_of_study"
              value={formData.year_of_study}
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
              name="department_name"
              value={formData.department_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Faculty ID"
              name="faculty_id"
              value={formData.faculty_id}
              onChange={handleChange}
              required
            />
            <Input
              label="Subject Area"
              name="subject_area"
              value={formData.subject_area}
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
                name="user_type"
                value={formData.user_type}
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
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />

            <Input
              label="Last Name"
              name="last_name"
              value={formData.last_name}
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
              name="confirm_password"
              value={formData.confirm_password}
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