import React from 'react';

const CompanyList = ({ companies }) => {
  return (
    <div className="company-list">
      <h2>Companies</h2>
      <ul>
        {companies.map(company => (
          <li key={company.id}>
            {company.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList; 