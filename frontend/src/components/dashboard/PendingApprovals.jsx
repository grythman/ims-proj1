import React from 'react';
import api from '../../services/api';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const PendingApprovals = () => {
    const { data, loading, error, setData } = useApi('/dashboard/pending-approvals/');

    const handleApprove = async (id) => {
        try {
            await api.post(`/dashboard/approve/${id}/`);
            setData(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Failed to approve:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/dashboard/reject/${id}/`);
            setData(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Failed to reject:', err);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Pending Approvals</h2>
            <div className="space-y-4">
                {data?.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-l-4 border-yellow-500 pl-4">
                        <div>
                            <p className="font-medium">{item.type}: {item.name}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleApprove(item.id)}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleReject(item.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
                {data?.length === 0 && (
                    <p className="text-gray-500 text-center">No pending approvals</p>
                )}
            </div>
        </div>
    );
};

export default PendingApprovals; 