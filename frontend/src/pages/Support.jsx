import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Support = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Support</h1>
                </div>
                <p className="mt-1 text-gray-500">
                    Get help and support for the platform
                </p>
            </div>

            {/* Support Content */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Contact Support</h2>
                        <p className="mt-1 text-gray-500">
                            Need help? Contact our support team.
                        </p>
                        <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Contact Support
                        </button>
                    </div>

                    <div>
                        <h2 className="text-lg font-medium text-gray-900">FAQs</h2>
                        <div className="mt-4 space-y-4">
                            {/* Add FAQ items here */}
                            <p className="text-gray-500">No FAQs available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support; 