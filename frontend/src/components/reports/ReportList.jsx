import React, { useState, useEffect } from 'react';
import { fetchReports } from '../../services/api';
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
                const data = await fetchReports();
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
                                <p className="text-sm text-gray-600 mt-1">{report.created_at}</p>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="mt-2"
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

export default ReportList; 