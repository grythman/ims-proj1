import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Filter } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import ReportReview from '../../components/Reports/ReportReview';
import api from '../../services/api';

const ReviewReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/api/reports/', {
          params: {
            search: searchTerm || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            type: typeFilter !== 'all' ? typeFilter : undefined
          }
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message ||
                            'Failed to load reports';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [searchTerm, statusFilter, typeFilter]);

  const handleSearch = () => {
    // Дахин хайх шаардлагагүй - dependencies автоматаар ажиллана
  };

  const handleReview = (updatedReport) => {
    setReports(reports.map(report => 
      report.id === updatedReport.id ? updatedReport : report
    ));
    setSelectedReport(null);
    toast.success('Report reviewed successfully');
  };

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
            Review Reports
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Reports List */}
        <div className="space-y-6">
          <Card className="p-4 sm:p-6">
            {/* Search and Filter */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Status Filter */}
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
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="weekly">Weekly Reports</option>
                  <option value="monthly">Monthly Reports</option>
                  <option value="final">Final Reports</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <dt className="text-sm font-medium text-gray-500">Pending Review</dt>
                <dd className="mt-1 text-3xl font-semibold text-yellow-600">
                  {reports.filter(r => r.status === 'pending').length}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {reports.length}
                </dd>
              </div>
            </div>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                No reports found
              </Card>
            ) : (
              reports.map(report => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`cursor-pointer transition-all ${
                    selectedReport?.id === report.id
                      ? 'ring-2 ring-emerald-500'
                      : 'hover:shadow-md'
                  }`}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {report.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          by {report.student_name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Submitted on {new Date(report.submission_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : report.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {report.status_display}
                      </span>
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Report Review */}
        <div className="lg:sticky lg:top-6">
          {selectedReport ? (
            <ReportReview
              report={selectedReport}
              onReview={handleReview}
            />
          ) : (
            <Card className="p-6 text-center text-gray-500">
              Select a report to review
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewReportsPage; 