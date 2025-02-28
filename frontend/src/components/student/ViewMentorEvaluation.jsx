import React from 'react';
import { Star, User } from 'lucide-react';
import { Card } from '../UI/Card';

const ViewMentorEvaluation = ({ detailed, onClose }) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              Mentor Evaluation
            </h3>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-900">4.5</span>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Performance</p>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-4 w-4 ${
                    rating <= 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Attendance</p>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-4 w-4 ${
                    rating <= 5 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Initiative</p>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-4 w-4 ${
                    rating <= 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teamwork</p>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-4 w-4 ${
                    rating <= 5 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Technical Skills</p>
            <div className="mt-1 flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`h-4 w-4 ${
                    rating <= 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Comments</p>
            <p className="mt-1 text-sm text-gray-900">
              Shows great potential and enthusiasm for learning. Has made significant progress in technical skills and teamwork.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ViewMentorEvaluation;