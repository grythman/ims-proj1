import React from 'react';
import { Outlet } from 'react-router-dom';

const MentorDashboardLayout = () => {
  return (
    <div className="flex-1">
      <Outlet />
    </div>
  );
};

export default MentorDashboardLayout; 