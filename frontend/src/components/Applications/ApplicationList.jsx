import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../UI/Card';

const statusIcons = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  under_review: <AlertCircle className="h-5 w-5 text-blue-500" />,
  accepted: <CheckCircle className="h-5 w-5 text-green-500" />,
  rejected: <XCircle className="h-5 w-5 text-red-500" />
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const ApplicationList = ({ applications }) => {
  if (!applications?.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No applications found
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {application.internship_title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                  {statusIcons[application.status]}
                  <span className="ml-1">{application.status_display}</span>
                </span>
              </div>
              
              <p className="mt-1 text-sm text-gray-500">
                at {application.company_name}
              </p>
              
              <div className="mt-2 text-sm text-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1" />
                    <span>
                      {application.cv ? (
                        <a 
                          href={application.cv_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          View CV
                        </a>
                      ) : (
                        'No CV attached'
                      )}
                    </span>
                  </div>
                  <div>
                    Applied on {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {application.feedback && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Feedback: </span>
                    {application.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="ml-4">
              <Link
                to={`/internships/${application.internship}/details`}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                View Internship
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationList; 