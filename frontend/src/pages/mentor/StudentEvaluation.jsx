import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    UserIcon,
    StarIcon,
    DocumentCheckIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const StudentEvaluation = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [evaluation, setEvaluation] = useState({
        performance_rating: 3,
        attendance_rating: 3,
        initiative_rating: 3,
        teamwork_rating: 3,
        technical_skills_rating: 3,
        comments: ''
    });

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            const response = await api.get(`/api/internships/mentor/students/${studentId}/`);
            setStudentData(response.data);
            if (response.data.current_evaluation) {
                setEvaluation(response.data.current_evaluation);
            }
        } catch (err) {
            setError('Failed to fetch student data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/api/internships/mentor/students/${studentId}/evaluate/`, evaluation);
            setSuccess('Evaluation submitted successfully');
            setTimeout(() => navigate('/mentor/students'), 2000);
        } catch (err) {
            setError('Failed to submit evaluation');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const RatingInput = ({ label, name, value }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => setEvaluation(prev => ({
                            ...prev,
                            [name]: rating
                        }))}
                        className={`p-2 rounded-full focus:outline-none ${
                            value >= rating 
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-300 hover:text-gray-400'
                        }`}
                    >
                        <StarIcon className="h-6 w-6" />
                    </button>
                ))}
            </div>
        </div>
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            {success && <SuccessMessage message={success} />}

            {/* Student Info */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 rounded-full p-3">
                        <UserIcon className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {studentData.full_name}
                        </h2>
                        <p className="text-gray-500">
                            Internship Progress: {studentData.completion_percentage}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Evaluation Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                    Student Evaluation
                </h3>

                <RatingInput 
                    label="Performance Rating"
                    name="performance_rating"
                    value={evaluation.performance_rating}
                />

                <RatingInput 
                    label="Attendance Rating"
                    name="attendance_rating"
                    value={evaluation.attendance_rating}
                />

                <RatingInput 
                    label="Initiative Rating"
                    name="initiative_rating"
                    value={evaluation.initiative_rating}
                />

                <RatingInput 
                    label="Teamwork Rating"
                    name="teamwork_rating"
                    value={evaluation.teamwork_rating}
                />

                <RatingInput 
                    label="Technical Skills Rating"
                    name="technical_skills_rating"
                    value={evaluation.technical_skills_rating}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Comments and Feedback
                    </label>
                    <textarea
                        value={evaluation.comments}
                        onChange={(e) => setEvaluation(prev => ({
                            ...prev,
                            comments: e.target.value
                        }))}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Provide detailed feedback about the student's performance..."
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/mentor/students')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Submit Evaluation
                    </button>
                </div>
            </form>

            {/* Previous Evaluations */}
            {studentData.previous_evaluations?.length > 0 && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Previous Evaluations
                    </h3>
                    <div className="space-y-4">
                        {studentData.previous_evaluations.map((eval, index) => (
                            <div key={index} className="border-t pt-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Evaluation from {new Date(eval.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {eval.comments}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Average Rating: {eval.average_rating.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentEvaluation; 