import React from 'react';
import { format } from 'date-fns';
import { FileText, Star, Download } from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

const EvaluationList = ({
  evaluations,
  selectedEvaluation,
  onEvaluationSelect,
  onEvaluationEdit
}) => {
  if (!evaluations?.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No evaluations found
      </Card>
    );
  }

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
    <div className="space-y-4">
      {evaluations.map(evaluation => (
        <div
          key={evaluation.id}
          onClick={() => onEvaluationSelect(evaluation)}
          className={`cursor-pointer transition-all ${
            selectedEvaluation?.id === evaluation.id
              ? 'ring-2 ring-emerald-500'
              : 'hover:shadow-md'
          }`}
        >
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {evaluation.internship.student.first_name} {evaluation.internship.student.last_name}
                  </h3>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusColor(evaluation.status)
                  }`}>
                    {evaluation.status_display}
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  <p>
                    {evaluation.internship.title} at {evaluation.internship.organization.name}
                  </p>
                  <p className="mt-1">
                    Evaluated by: {evaluation.evaluator.first_name} {evaluation.evaluator.last_name}
                  </p>
                </div>

                {/* Scores Summary */}
                <div className="mt-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {evaluation.total_score}%
                    </span>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {evaluation.scores.map(score => (
                      <div key={score.id} className="text-sm">
                        <span className="text-gray-500">{score.criteria_name}:</span>
                        <span className="ml-1 font-medium">{score.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                {evaluation.attachments?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {evaluation.attachments.map(attachment => (
                      <a
                        key={attachment.id}
                        href={attachment.file_url}
                        download={attachment.file_name}
                        className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        <span className="truncate max-w-xs">
                          {attachment.file_name}
                        </span>
                        <Download className="h-4 w-4 ml-1" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-col items-end">
                <div className="text-sm text-gray-500">
                  {evaluation.submission_date
                    ? format(new Date(evaluation.submission_date), 'MMM d, yyyy')
                    : format(new Date(evaluation.created_at), 'MMM d, yyyy')}
                </div>
                {evaluation.status === 'draft' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEvaluationEdit(evaluation);
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default EvaluationList; 