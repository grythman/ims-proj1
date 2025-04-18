import React, { useState } from 'react';
import ReportForm from '../components/reports/ReportForm';
import ReportList from '../components/reports/ReportList';
import PageHeader from '../components/UI/PageHeader';

const ReportsPage = () => {
    const [refreshList, setRefreshList] = useState(false);

    const handleSubmitSuccess = () => {
        setRefreshList(prev => !prev);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader 
                title="Тайлангууд" 
                description="Тайлангууд зохицуулах хуудас"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-1">
                    <ReportForm onSubmitSuccess={handleSubmitSuccess} />
                </div>
                
                <div className="lg:col-span-2">
                    <ReportList refreshTrigger={refreshList} />
                </div>
            </div>
        </div>
    );
};

export default ReportsPage; 