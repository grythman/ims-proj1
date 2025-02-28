import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Filter } from 'lucide-react';
import ApplicationList from '../../components/Applications/ApplicationList';
import { Card } from '../../components/UI/Card';
import api from '../../services/api';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/internships/applications/');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Failed to load applications';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = (
        app.internship_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Applications
          </h2>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-200 pt-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {applications.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pending</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">
                {applications.filter(a => a.status === 'pending').length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Accepted</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {applications.filter(a => a.status === 'accepted').length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rejected</dt>
              <dd className="mt-1 text-3xl font-semibold text-red-600">
                {applications.filter(a => a.status === 'rejected').length}
              </dd>
            </div>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      <ApplicationList applications={filteredApplications} />
    </div>
  );
};

export default ApplicationsPage; 