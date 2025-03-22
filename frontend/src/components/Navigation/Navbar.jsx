import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, User, Bell, LogOut, Search } from 'lucide-react';
import { Button } from '../UI/Button';
import clsx from 'clsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    const redirectPath = logout();
    navigate(redirectPath);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '?';
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    return user.username?.charAt(0).toUpperCase() || '?';
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-14">
          {/* Left section - Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          {/* Middle section - Search */}
          <div className="flex flex-1 justify-center mx-4 items-center">
            <div className="w-full max-w-md relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-indigo-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-indigo-100 rounded-full text-sm bg-indigo-50
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                placeholder="Хайх..."
              />
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Notification bell */}
            <button className="p-1 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-indigo-500"></span>
            </button>
            
            {/* User profile */}
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={toggleProfileMenu}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden shadow-sm">
                    {user?.profile_picture ? (
                      <img
                        className="h-full w-full rounded-full object-cover"
                        src={user.profile_picture}
                        alt="User avatar"
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">
                    {user?.user_type === 'student' ? 'Student' : user?.user_type} User
                  </span>
                </div>
              </button>
              
              {/* Profile dropdown menu */}
              {profileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-10"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'student'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'student@example.com'}</p>
                  </div>
                  
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                    role="menuitem"
                  >
                    <User className="mr-2 h-4 w-4 text-indigo-500" />
                    My Profile
                  </a>
                  
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 bg-indigo-50"
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
              href="/tasks" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Tasks
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 