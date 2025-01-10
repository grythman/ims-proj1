import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import api from '../../services/api';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports/');
        setReports(response.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Reports</h2>
        <Link
          to="submit"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Report
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {reports.length === 0 ? (
          <p className="p-6 text-gray-500">You have not submitted any reports yet.</p>
        ) : (
          <div className="divide-y">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={`${report.id}`}
                className="flex items-center p-4 hover:bg-gray-50"
              >
                <FileText className="h-6 w-6 text-emerald-600 mr-4" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.submitted_at}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    report.status === 'evaluated'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {report.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList; 