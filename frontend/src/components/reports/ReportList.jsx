import React, { useState, useEffect } from 'react';
import { reportsApi } from '../../services/api';
import { Card, CardHeader, CardContent, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ReportList = ({ refreshTrigger }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getReports = async () => {
            setLoading(true);
            try {
                const data = await reportsApi.getAll();
                setReports(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError('Тайлангуудыг ачааллахад алдаа гарлаа.');
            } finally {
                setLoading(false);
            }
        };

        getReports();
    }, [refreshTrigger]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <Card className="mt-4">
            <CardHeader bordered>
                <CardTitle>Тайлангууд</CardTitle>
            </CardHeader>
            <CardContent>
                {reports.length === 0 ? (
                    <p className="text-gray-500">Тайланууд байхгүй байна.</p>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report.id} className="border p-4 rounded-lg">
                                <h3 className="font-medium">{report.title}</h3>
                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(report.status)}`}></span>
                                    {formatStatus(report.status)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {formatDate(report.created_at)}
                                </p>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => handleViewReport(report.id)}
                                >
                                    Дэлгэрэнгүй
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Helper functions
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

const formatStatus = (status) => {
    const statusMap = {
        'pending': 'Хүлээгдэж байгаа',
        'approved': 'Зөвшөөрөгдсөн',
        'rejected': 'Татгалзсан',
        'draft': 'Ноорог'
    };
    return statusMap[status] || status;
};

const getStatusColor = (status) => {
    const colorMap = {
        'pending': 'bg-yellow-500',
        'approved': 'bg-green-500',
        'rejected': 'bg-red-500',
        'draft': 'bg-gray-500'
    };
    return colorMap[status] || 'bg-gray-500';
};

const handleViewReport = (id) => {
    // Navigate to report details page or open modal
    console.log(`View report ${id}`);
    // TODO: Implement navigation or modal display
};

export default ReportList; 