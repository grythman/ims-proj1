import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import teacherApi from '../../services/teacherApi';

const MonitorMentorEvaluation = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        try {
            const response = await teacherApi.evaluations.getMentorEvaluations();
            // Ensure we're setting an array, even if empty
            setEvaluations(response?.data?.data || []);
        } catch (error) {
            console.error('Error fetching mentor evaluations:', error);
            toast.error('Failed to load mentor evaluations');
            setEvaluations([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleReviewEvaluation = async (evaluationId) => {
        try {
            await teacherApi.evaluations.reviewEvaluation(evaluationId);
            toast.success('Evaluation reviewed successfully');
            fetchEvaluations(); // Refresh the list
        } catch (error) {
            console.error('Error reviewing evaluation:', error);
            toast.error('Failed to review evaluation');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!evaluations.length) {
        return (
            <div className="text-center p-4">
                <p className="text-gray-500">No mentor evaluations available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {evaluations.map((evaluation) => (
                <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {evaluation.student?.username || 'Unknown Student'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Evaluated by: {evaluation.evaluator?.username || 'Unknown Mentor'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Status: {evaluation.status_display}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Type: {evaluation.evaluation_type_display}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReviewEvaluation(evaluation.id)}
                                >
                                    Review
                                </Button>
                            </div>
                        </div>
                        {evaluation.feedback && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900">Feedback:</h4>
                                <p className="text-sm text-gray-500">{evaluation.feedback}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default MonitorMentorEvaluation; 