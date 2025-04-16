import React, { useState } from 'react';
import ReportForm from '../components/reports/ReportForm';
import ReportList from '../components/reports/ReportList';
import { Card, CardContent } from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { useAuth } from '../contexts/AuthContext';

const ReportsPage = () => {
    const { user } = useAuth();
    const [refreshList, setRefreshList] = useState(0);

    const handleSubmitSuccess = () => {
        setRefreshList(prev => prev + 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader 
                title="Тайлангууд" 
                description="Дадлагын тайлангууд, илгээсэн тайлангийн жагсаалт"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent>
                            <h2 className="text-xl font-semibold mb-4">Шинэ тайлан илгээх</h2>
                            <ReportForm 
                                internship={user?.current_internship} 
                                onSubmitSuccess={handleSubmitSuccess} 
                            />
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent>
                            <h2 className="text-xl font-semibold mb-4">Илгээсэн тайлангууд</h2>
                            <ReportList refreshTrigger={refreshList} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage; 