import React, { useState } from 'react';
import api from '../../api';

const RegisterInternship = () => {
  const [formData, setFormData] = useState({
    organization: {
      name: '',
      address: '',
      website: '',
      description: '',
    },
    position: '',
    start_date: '',
    end_date: '',
    additionalInfo: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/internships/register/', formData);
  };

  return (
    <div>
      <h1>Register Internship</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Organization Name</label>
          <input
            type="text"
            name="organization.name"
            value={formData.organization.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="organization.address"
            value={formData.organization.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Website</label>
          <input
            type="text"
            name="organization.website"
            value={formData.organization.website}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            name="organization.description"
            value={formData.organization.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Additional Info</label>
          <input
            type="text"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterInternship; 