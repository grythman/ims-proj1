import React from 'react';

const ActionCard = ({ title, description, icon, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow duration-200 w-full"
    >
        <div className="text-2xl mb-2">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
    </button>
);

export default ActionCard; 