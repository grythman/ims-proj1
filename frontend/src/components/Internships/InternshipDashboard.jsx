import React from 'react';

const InternshipDashboard = ({ internships }) => {
  return (
    <div className="internship-dashboard">
      <h2>Internships</h2>
      <ul>
        {internships.map(internship => (
          <li key={internship.id}>
            {internship.title} - {internship.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InternshipDashboard; 