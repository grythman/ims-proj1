import React from 'react';
import { BookOpenIcon, DocumentTextIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const Resources = () => {
    const resources = [
        {
            title: 'Getting Started Guide',
            description: 'Essential information for new interns',
            type: 'document',
            icon: <DocumentTextIcon className="h-6 w-6" />,
            link: '#'
        },
        {
            title: 'Training Videos',
            description: 'Video tutorials and learning materials',
            type: 'video',
            icon: <VideoCameraIcon className="h-6 w-6" />,
            link: '#'
        },
        {
            title: 'Best Practices',
            description: 'Guidelines and recommendations',
            type: 'document',
            icon: <BookOpenIcon className="h-6 w-6" />,
            link: '#'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <BookOpenIcon className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Access training materials and documentation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                    <div
                        key={index}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-blue-500">
                                {resource.icon}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {resource.title}
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            {resource.description}
                        </p>
                        <a
                            href={resource.link}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Access Resource →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources; 