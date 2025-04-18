import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, Bell, LogOut, Search, ChevronDown, Home, ClipboardList, BookOpen, FileText } from 'lucide-react';
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

  const navigationLinks = [
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded flex items-center justify-center text-white font-bold">
                ДУС
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800"></span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-md",
                  item.active
                    ? "bg-green-100 text-green-800"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Notification bell */}
            <button className="p-1 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50 focus:outline-none relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
            </button>
            
            {/* User profile */}
            <div className="relative">
              <button
                className="flex items-center focus:outline-none p-1.5 rounded-md hover:bg-gray-50"
                onClick={toggleProfileMenu}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden shadow-sm">
                    {user?.profile_picture ? (
                      <img
                        className="h-full w-full rounded-full object-cover"
                        src={user.profile_picture}
                        alt="Хэрэглэгчийн зураг"
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  <div className="ml-2 hidden md:block">
                    <div className="text-sm font-medium text-gray-800">
                      {user?.first_name ? `${user.first_name.charAt(0)}. ${user.last_name}` : user?.username || 'Хэрэглэгч'}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
                      {user?.user_type === 'student' ? 'Оюутан' :
                       user?.user_type === 'mentor' ? 'Ментор' :
                       user?.user_type === 'teacher' ? 'Багш' :
                       user?.user_type === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                    </div>
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </div>
              </button>
              
              {/* Profile dropdown menu */}
              {profileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-10"
                  role="menu"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.first_name ? `${user.first_name.charAt(0)}. ${user.last_name}` : user?.username || 'Хэрэглэгч'}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-500" />
                      Гарах
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 