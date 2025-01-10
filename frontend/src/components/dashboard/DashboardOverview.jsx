import React from 'react';

const DashboardOverview = ({ stats }) => {
  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat">
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview; 