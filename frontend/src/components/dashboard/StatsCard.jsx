import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
    return (
        <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                {icon && (
                    <div className="text-white opacity-80 text-3xl">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard; 