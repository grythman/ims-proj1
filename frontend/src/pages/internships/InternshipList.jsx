import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ClipboardList } from 'lucide-react';
import api from '../../services/api';

const InternshipList = () => {
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await api.get('/internships/my-internship/');
        setInternship(response.data);
      } catch (err) {
        console.error('Error fetching internship:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, []);

  if (loading) {
    return <p>Loading internship details...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Internship</h2>
        {!internship && (
          <Link
            to="register"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <ClipboardList className="h-5 w-5 mr-2" />
            Register for Internship
          </Link>
        )}
      </div>

      {internship ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900">{internship.position}</h3>
            <p className="text-sm text-gray-500">{internship.companyName}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Start Date</p>
              <p className="text-lg text-gray-900">{internship.startDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">End Date</p>
              <p className="text-lg text-gray-900">{internship.endDate}</p>
            </div>
          </div>
          {internship.additionalInfo && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700">Additional Information</p>
              <p className="text-gray-900">{internship.additionalInfo}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">You have not registered for an internship yet.</p>
      )}
    </div>
  );
};

export default InternshipList; 