import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const ViewInternship = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();

  // Replace this with actual data fetched from your API
  const internship = {
    id: internshipId,
    title: `Internship Position ${internshipId}`,
    company: 'Example Company',
    location: 'City, State',
    description: 'Detailed internship description goes here.',
    requirements: 'List of requirements for the internship.',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Briefcase className="h-8 w-8 text-emerald-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">{internship.title}</h2>
        </div>
        <button
          onClick={() => navigate('/dashboard/internship')}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Internships
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <p className="text-lg font-medium text-gray-900">{internship.company}</p>
          <p className="text-sm text-gray-500">{internship.location}</p>
        </div>
        <div className="prose max-w-none">
          <h3>Description</h3>
          <p>{internship.description}</p>
          <h3>Requirements</h3>
          <p>{internship.requirements}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate(`/dashboard/internship/apply?position=${internship.title}`)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Apply for this Internship
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInternship; 