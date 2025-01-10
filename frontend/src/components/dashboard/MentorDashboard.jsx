import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../services/api';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';

const MentorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Active Interns">
          <div className="text-3xl font-bold text-indigo-600">
            {data?.activeInterns || 0}
          </div>
        </Card>

        <Card title="Pending Reviews">
          <div className="text-3xl font-bold text-orange-500">
            {data?.pendingReviews || 0}
          </div>
        </Card>

        <Card title="Total Reports">
          <div className="text-3xl font-bold text-green-500">
            {data?.totalReports || 0}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Assigned Students">
          {data?.assignedStudents?.map((student, index) => (
            <div key={index} className="py-2 border-b last:border-0">
              <p className="font-semibold">{student.name}</p>
              <p className="text-sm text-gray-600">{student.internshipStatus}</p>
            </div>
          ))}
        </Card>

        <Card title="Recent Reports">
          {data?.recentReports?.map((report, index) => (
            <div key={index} className="py-2 border-b last:border-0">
              <p className="font-semibold">{report.title}</p>
              <p className="text-sm text-gray-600">By: {report.student}</p>
              <p className="text-xs text-gray-400">{report.date}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard; 