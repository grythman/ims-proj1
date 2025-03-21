import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import NotificationBell from '../Notifications/NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    const redirectPath = logout();
    navigate(redirectPath);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button 
                onClick={toggleMenu}
                className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle sidebar menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-emerald-600">IMS</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationBell />

            {/* Profile dropdown */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user?.user_type}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <User className="h-5 w-5" />
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu for small screens */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 bg-emerald-50"
            >
              Dashboard
            </a>
            <a 
              href="/reports" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Reports
            </a>
            <a 
              href="/settings" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Settings
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 