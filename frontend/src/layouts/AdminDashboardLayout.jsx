import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminDashboardLayout = () => {
  return (
    <div className="flex-1">
      <Outlet />
    </div>
  );
};

export default AdminDashboardLayout; 