import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EvaluationForm = ({ internshipId, studentId }) => {
    const [criteria, setCriteria] = useState([]);
    const [scores, setScores] = useState({});
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCriteria();
    }, []);

    const fetchCriteria = async () => {
        try {
            const response = await api.get('/api/v1/evaluations/criteria/');
            setCriteria(response.data);
            // Initialize scores with default value of 5
            const initialScores = response.data.reduce((acc, item) => {
                acc[item.id] = 5;
                return acc;
            }, {});
            setScores(initialScores);
        } catch (err) {
            setError('Үнэлгээний шалгуур ачаалахад алдаа гарлаа');
            console.error('Error fetching criteria:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (criteriaId, value) => {
        setScores(prev => ({
            ...prev,
            [criteriaId]: parseFloat(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const evaluationData = {
                internship: internshipId,
                evaluated_student: studentId,
                comments,
                scores: Object.entries(scores).map(([criteriaId, score]) => ({
                    criteria: criteriaId,
                    score
                }))
            };

            await api.post('/api/v1/evaluations/', evaluationData);
            // Show success message or redirect
        } catch (err) {
            setError('Үнэлгээ илгээхэд алдаа гарлаа');
            console.error('Error submitting evaluation:', err);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {criteria.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            <span className="text-sm text-gray-500">
                                {item.category}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        
                        <div className="flex items-center space-x-4">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.5"
                                value={scores[item.id]}
                                onChange={(e) => handleScoreChange(item.id, e.target.value)}
                                className="w-full"
                            />
                            <span className="text-lg font-bold">
                                {scores[item.id]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Нэмэлт тайлбар
                </label>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
                Үнэлгээ илгээх
            </button>
        </form>
    );
};

export default EvaluationForm; 