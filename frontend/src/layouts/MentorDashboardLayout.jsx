import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Menu,
  Bell,
  User,
  FileText,
  Users,
  CheckCircle,
  BarChart3,
  Calendar,
  Home,
  Settings,
  HelpCircle,
  Briefcase,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '../components/UI/Button';

// Navigation configuration for mentor
const mentorNavigation = [
  { name: 'Dashboard', icon: Home, path: '/mentor/dashboard' },
  { name: 'My Students', icon: Users, path: '/mentor/students' },
  { name: 'Evaluations', icon: CheckCircle, path: '/mentor/evaluations' },
  { name: 'Reports Review', icon: FileText, path: '/mentor/reports' },
  { name: 'Tasks', icon: ClipboardCheck, path: '/mentor/tasks' },
  { name: 'Calendar', icon: Calendar, path: '/mentor/calendar' },
  { name: 'Analytics', icon: BarChart3, path: '/mentor/analytics' },
  { name: 'Settings', icon: Settings, path: '/mentor/settings' }
];

// Profile Menu Component
const ProfileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`
    : user?.username?.[0] || '?';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-emerald-600">
              {initials.toUpperCase()}
            </span>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-emerald-500">Mentor</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Link
            to="/mentor/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Profile Settings
          </Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const MentorDashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">IMS</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {mentorNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                location.pathname === item.path
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center px-6">
          <div className="flex-1 flex items-center">
            {/* Mobile menu button - Left aligned */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Page Title - Center aligned */}
            <h1 className="text-xl font-semibold text-gray-800 md:ml-4">
              {mentorNavigation.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          {/* Right side actions - Right aligned */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 relative p-2 hover:bg-gray-50 rounded-full">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="border-l h-8 mx-2"></div>
            <ProfileMenu user={user} onLogout={logout} />
          </div>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-white">
              <div className="h-16 flex items-center justify-between px-6 border-b">
                <Link to="/" className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-emerald-600" />
                  <span className="text-xl font-bold text-gray-900">IMS</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <nav className="px-4 py-4 space-y-1">
                {mentorNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MentorDashboardLayout; 