import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../Navigation/Navbar';
import Sidebar from '../Navigation/Sidebar';
import { ChevronLeft, Menu } from 'lucide-react';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar with collapsible state */}
        <div 
          className={`fixed left-0 z-20 transition-all duration-300 ease-in-out h-screen ${
            sidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          <Sidebar collapsed={!sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        
        {/* Main content with margin that adjusts based on sidebar state */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          } p-6`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 