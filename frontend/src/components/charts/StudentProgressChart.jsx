import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const StudentProgressChart = ({ data }) => {
    // Transform data for the chart
    const chartData = data.map(student => ({
        name: student.full_name,
        progress: student.completion_percentage || 0,
        tasks: student.completed_tasks || 0,
        reports: student.submitted_reports || 0
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                    dataKey="progress" 
                    name="Overall Progress" 
                    fill="#4F46E5"
                    radius={[4, 4, 0, 0]}
                />
                <Bar 
                    dataKey="tasks" 
                    name="Completed Tasks" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                />
                <Bar 
                    dataKey="reports" 
                    name="Submitted Reports" 
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StudentProgressChart; 