import React, { useEffect, useState } from 'react';
import { getInternshipDuration } from '../../services/api';

const ViewInternshipDuration = ({ internshipId }) => {
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const fetchDuration = async () => {
      const data = await getInternshipDuration(internshipId);
      setDuration(data);
    };
    fetchDuration();
  }, [internshipId]);

  return (
    <div className="internship-duration">
      <h2>Internship Duration</h2>
      {duration ? (
        <div>
          <p>Start Date: {duration.startDate}</p>
          <p>End Date: {duration.endDate}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewInternshipDuration; 