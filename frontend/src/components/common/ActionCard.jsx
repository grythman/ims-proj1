import React from 'react';

const ActionCard = ({ title, description, icon, onClick, urgent }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-lg border ${
                urgent ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
            } transition-colors duration-200`}
        >
            <div className="flex items-center">
                <span className="text-2xl mr-3">{icon}</span>
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </button>
    );
};

export default ActionCard; 