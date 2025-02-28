import React from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Star,
  Download,
  User,
  Building,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

const EvaluationDetail = ({
  evaluation,
  onApprove,
  onReject,
  onEdit
}) => {
  if (!evaluation) {
    return (
      <Card className="p-6 text-center text-gray-500">
        Select an evaluation to view details
      </Card>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Evaluation Details
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            getStatusColor(evaluation.status)
          }`}>
            {evaluation.status_display}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Student Info */}
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Student</h4>
                <p className="mt-1 text-sm text-gray-500">
                  {evaluation.internship.student.first_name} {evaluation.internship.student.last_name}
                </p>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Internship</h4>
                <p className="mt-1 text-sm text-gray-500">
                  {evaluation.internship.title} at {evaluation.internship.organization.name}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Evaluator Info */}
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Evaluator</h4>
                <p className="mt-1 text-sm text-gray-500">
                  {evaluation.evaluator.first_name} {evaluation.evaluator.last_name}
                  <span className="ml-1 text-xs text-gray-400">
                    ({evaluation.evaluator_type_display})
                  </span>
                </p>
              </div>
            </div>

            {/* Date Info */}
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {evaluation.submission_date ? 'Submitted' : 'Created'}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {evaluation.submission_date
                    ? format(new Date(evaluation.submission_date), 'PPpp')
                    : format(new Date(evaluation.created_at), 'PPpp')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <h4 className="text-lg font-medium text-gray-900">
              Overall Score: {evaluation.total_score}%
            </h4>
          </div>

          <div className="space-y-4">
            {evaluation.scores.map(score => (
              <div key={score.id} className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">
                      {score.criteria_name}
                    </h5>
                    <p className="text-sm text-gray-500">
                      Weight: {score.criteria_weight}%
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-5 w-5 ${
                          score.score >= rating * 20
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {score.score}%
                    </span>
                  </div>
                </div>
                {score.comments && (
                  <p className="mt-2 text-sm text-gray-500">
                    {score.comments}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Overall Comments */}
        {evaluation.comments && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900">
              Overall Comments
            </h4>
            <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
              {evaluation.comments}
            </p>
          </div>
        )}

        {/* Attachments */}
        {evaluation.attachments?.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Attachments
            </h4>
            <div className="flex flex-wrap gap-2">
              {evaluation.attachments.map(attachment => (
                <a
                  key={attachment.id}
                  href={attachment.file_url}
                  download={attachment.file_name}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="truncate max-w-xs">
                    {attachment.file_name}
                  </span>
                  <Download className="h-4 w-4 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {evaluation.status === 'submitted' && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => onReject(evaluation.id)}
              variant="danger"
              className="inline-flex items-center"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onApprove(evaluation.id)}
              variant="success"
              className="inline-flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      )}

      {evaluation.status === 'draft' && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <Button
              onClick={() => onEdit(evaluation)}
              className="inline-flex items-center"
            >
              Edit Evaluation
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EvaluationDetail; 