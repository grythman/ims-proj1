import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <div className="p-4">
        <nav className="space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 