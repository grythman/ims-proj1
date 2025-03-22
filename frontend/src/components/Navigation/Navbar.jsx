import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
    { name: 'Хуваарь', href: '/schedule' },
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
                      Б. Төгөлдөр
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
                      Баатарсүрэн
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
                    <p className="text-sm font-semibold text-gray-900">Б. Төгөлдөр</p>
                    <p className="text-xs text-gray-600">19B1NUM0295@stud.num.edu.mn</p>
                    <div className="flex items-center mt-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                        Оюутан
                      </span>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        Бакалавр
                      </span>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      role="menuitem"
                    >
                      <User className="mr-3 h-4 w-4 text-green-500" />
                      Хувийн мэдээлэл
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      role="menuitem"
                    >
                      <Home className="mr-3 h-4 w-4 text-green-500" />
                      Нүүр хэсэг
                    </Link>
                    <Link
                      to="/applications"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      role="menuitem"
                    >
                      <ClipboardList className="mr-3 h-4 w-4 text-green-500" />
                      Миний өргөдлүүд
                    </Link>
                  </div>
                  
                  <div className="py-1 border-t border-gray-100">
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