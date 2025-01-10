import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DocumentTextIcon,
    AcademicCapIcon,
    UserIcon,
    ClipboardDocumentCheckIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const StudentLayout = ({ children }) => {
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: DocumentTextIcon,
            label: 'Submit Report',
            onClick: () => navigate('/student/submit-report')
        },
        {
            icon: AcademicCapIcon,
            label: 'Register Internship',
            onClick: () => navigate('/student/register-internship')
        },
        {
            icon: UserIcon,
            label: 'Profile',
            onClick: () => navigate('/student/profile')
        },
        {
            icon: ClipboardDocumentCheckIcon,
            label: 'Evaluations',
            onClick: () => navigate('/student/evaluations')
        },
        {
            icon: ChartBarIcon,
            label: 'Progress',
            onClick: () => navigate('/student/progress')
        },
        {
            icon: ChatBubbleLeftRightIcon,
            label: 'Messages',
            onClick: () => navigate('/student/messages')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Student Dashboard
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-3">
                        <div className="bg-white shadow rounded-lg p-4">
                            <nav className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={item.onClick}
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-span-9">
                        <div className="bg-white shadow rounded-lg p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentLayout; 