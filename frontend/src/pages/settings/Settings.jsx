import React, { useState } from 'react';
import { useRole } from '../../hooks/useRole';
import {
    Cog6ToothIcon,
    BellIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
    const { getTheme } = useRole();
    const theme = getTheme();
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', name: 'General', icon: Cog6ToothIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'users', name: 'Users', icon: UserGroupIcon },
        { id: 'organizations', name: 'Organizations', icon: BuildingOfficeIcon },
        { id: 'reports', name: 'Reports', icon: DocumentTextIcon },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`bg-gradient-to-r ${theme.gradient} rounded-lg shadow-lg p-6 text-white`}>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="mt-2 text-white/80">
                    Manage system settings and configurations
                </p>
            </div>

            {/* Settings Navigation */}
            <div className="bg-white shadow rounded-lg">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? `border-${theme.primary}-500 text-${theme.primary}-600`
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className={`-ml-1 mr-2 h-5 w-5 ${
                                        activeTab === tab.id
                                            ? `text-${theme.primary}-500`
                                            : 'text-gray-400 group-hover:text-gray-500'
                                    }`} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="p-6">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">System Information</h3>
                                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            System Name
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            defaultValue="Internship Management System"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            defaultValue="admin@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900">System Preferences</h3>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="maintenance"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-900">
                                            Maintenance Mode
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="registration"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            defaultChecked
                                        />
                                        <label htmlFor="registration" className="ml-2 block text-sm text-gray-900">
                                            Allow User Registration
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${theme.primary}-600 hover:bg-${theme.primary}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme.primary}-500`}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Add other tab contents */}
                </div>
            </div>
        </div>
    );
};

export default Settings; 