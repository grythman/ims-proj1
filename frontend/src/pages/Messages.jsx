import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const Messages = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch messages logic here
        setLoading(false);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                </div>
                <p className="mt-1 text-gray-500">
                    Communicate with mentors and students
                </p>
            </div>

            {/* Messages List */}
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                {/* Add message components here */}
                <div className="p-6 text-center text-gray-500">
                    No messages yet
                </div>
            </div>
        </div>
    );
};

export default Messages; 