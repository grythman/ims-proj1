import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Menu,
  Search,
  Bell,
  Settings,
  User,
  FileText,
  Users,
  BarChart3,
  Shield,
  Database,
  Cog,
  Activity,
  ChevronDown
} from 'lucide-react';
import { Button } from '../components/UI/Button';

// Navigation configuration for admin
const adminNavigation = [
  { name: 'Dashboard', icon: Activity, path: '/dashboard' },
  { name: 'User Management', icon: Users, path: '/dashboard/users' },
  { name: 'Reports Overview', icon: FileText, path: '/dashboard/reports' },
  { name: 'System Settings', icon: Settings, path: '/dashboard/settings' },
  { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { name: 'Security', icon: Shield, path: '/dashboard/security' }
];

const quickActions = [
  { name: 'Manage Users', icon: Users, path: '/dashboard/users' },
  { name: 'System Settings', icon: Cog, path: '/dashboard/settings' },
  { name: 'Database', icon: Database, path: '/dashboard/database' }
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
        className="flex items-center space-x-3 focus:outline-none transition-all duration-300 hover:opacity-80"
      >
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              {/* Using both User icon and initials for better fallback */}
              {initials.length <= 2 ? (
                <span className="text-sm font-medium text-white">{initials}</span>
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
          )}
        </div>
        <div className="hidden md:flex md:flex-col md:items-start">
          <p className="text-sm font-medium text-gray-900">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 transform origin-top-right transition-all duration-200 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link
              to="/dashboard/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            <Link
              to="/dashboard/security"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              Security Settings
            </Link>
          </div>
          <div className="py-1 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="hidden text-xl font-bold text-gray-900 sm:inline-block">
                  IMS <span className="text-indigo-600">Admin</span>
                </span>
              </Link>
              <nav className="hidden md:ml-10 md:flex md:space-x-4">
                {adminNavigation.map((item) => (
                  <Button
                    key={item.name}
                    as={Link}
                    to={item.path}
                    variant={location.pathname === item.path ? "primary" : "ghost"}
                    size="sm"
                    className={`text-sm font-medium ${
                      location.pathname === item.path
                        ? "text-indigo-700 bg-indigo-50 border-indigo-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    } transition-all duration-200`}
                  >
                    <item.icon className={`h-4 w-4 mr-2 ${
                      location.pathname === item.path ? "text-indigo-500" : "text-gray-400"
                    }`} />
                    {item.name}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 lg:w-64 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                </div>
              </div>
              <button className="relative inline-flex items-center p-2 text-gray-600 rounded-full hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:bg-indigo-100 transition-colors duration-200">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">5</span>
              </button>
              <ProfileMenu user={user} onLogout={logout} />
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="px-4 py-3 space-y-1">
            {adminNavigation.map((item) => (
              <Button
                key={item.name}
                as={Link}
                to={item.path}
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-sm font-medium ${
                  location.pathname === item.path
                    ? "text-indigo-700 bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } transition-colors duration-150`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className={`h-5 w-5 mr-2 ${
                  location.pathname === item.path ? "text-indigo-500" : "text-gray-400"
                }`} />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Role Badge */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm font-medium">
            Administrator Dashboard • {new Date().toLocaleDateString()}
          </p>
          <span className="text-xs px-2 py-1 bg-white/20 rounded-full">Version 1.0</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 text-indigo-500 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                as={Link}
                to={action.path}
                variant="outline"
                className="flex items-center justify-center py-4 bg-white hover:bg-indigo-50 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 transition-all duration-200 rounded-lg shadow-sm hover:shadow"
              >
                <action.icon className="h-5 w-5 mr-2 text-indigo-500" />
                {action.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Page content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout; 