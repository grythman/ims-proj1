import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { BookOpen, Building, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import studentApi from '../../services/studentApi';

const RegisterInternship = () => {
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    startDate: '',
    endDate: '',
    supervisorName: '',
    supervisorEmail: '',
    position: '',
    department: '',
    workSchedule: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today) {
      return 'Start date cannot be in the past';
    }
    if (end <= start) {
      return 'End date must be after start date';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);

    const dateError = validateDates(formData.startDate, formData.endDate);
    if (dateError) {
      toast.error(dateError);
      setRegistering(false);
      return;
    }

    try {
      await studentApi.internships.register(formData);
      toast.success('Internship registered successfully');
      // Reset form or redirect
    } catch (err) {
      toast.error('Failed to register internship');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="rounded-lg bg-green-500/10 p-2 w-fit">
          <Building className="h-6 w-6 text-green-500" />
        </div>
        <CardTitle>Register Internship</CardTitle>
        <CardDescription>Register for a new internship position</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supervisor Name
              </label>
              <input
                type="text"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supervisor Email
              </label>
              <input
                type="email"
                name="supervisorEmail"
                value={formData.supervisorEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Work Schedule
            </label>
            <input
              type="text"
              name="workSchedule"
              value={formData.workSchedule}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="e.g., Monday-Friday, 9:00 AM - 5:00 PM"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Describe your role and responsibilities..."
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={registering}
            loading={registering}
          >
            {registering ? 'Registering...' : 'Register Internship'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterInternship;