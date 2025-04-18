import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Building, Calendar, User, Briefcase } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import api from '../../services/api';

const RegisterInternship = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    organization_id: '',
    mentor_id: '',
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [mentors, setMentors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch mentors when organization is selected
    if (name === 'organization_id') {
      fetchMentors(value);
    }
  };

  const fetchMentors = async (organizationId) => {
    try {
      const response = await api.get(`/api/v1/users/mentors/`, {
        params: { organization: organizationId }
      });
      setMentors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Менторуудын жагсаалтыг ачаалж чадсангүй');
      setMentors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/internships/register/', formData);
      toast.success('Internship registered successfully!');
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error registering internship:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Failed to register internship';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch organizations on component mount
    const fetchOrganizations = async () => {
      try {
        const response = await api.get('/api/companies/');
        if (response.data?.data) {
          setOrganizations(response.data.data);
        } else {
          setOrganizations([]);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast.error('Failed to load organizations');
        setOrganizations([]);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Register New Internship
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details to register your internship
          </p>
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organization
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="organization_id"
              value={formData.organization_id}
              onChange={handleInputChange}
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="">Select Organization</option>
              {Array.isArray(organizations) && organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mentor */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mentor
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="mentor_id"
              value={formData.mentor_id}
              onChange={handleInputChange}
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              required
              disabled={!formData.organization_id}
            >
              <option value="">Select Mentor</option>
              {Array.isArray(mentors) && mentors.map(mentor => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.first_name} {mentor.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Internship Title
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. Software Development Intern"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Describe your internship role and responsibilities..."
              required
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                required
                min={formData.start_date}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="inline-flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Registering...
              </>
            ) : (
              'Register Internship'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RegisterInternship; 