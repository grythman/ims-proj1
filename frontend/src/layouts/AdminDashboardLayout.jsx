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
  Activity
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
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-red-600">
              {initials.toUpperCase()}
            </span>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Profile Settings
          </Link>
          <Link
            to="/dashboard/security"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Security Settings
          </Link>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign out
          </button>
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
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-red-600" />
                <span className="hidden text-xl font-bold text-gray-900 sm:inline-block">
                  IMS Admin
                </span>
              </Link>
              <nav className="hidden md:ml-8 md:flex md:space-x-4">
                {adminNavigation.map((item) => (
                  <Button
                    key={item.name}
                    as={Link}
                    to={item.path}
                    variant={location.pathname === item.path ? "primary" : "ghost"}
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users, reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  5
                </span>
              </Button>
              <ProfileMenu user={user} onLogout={logout} />
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
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
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-3 space-y-1">
            {adminNavigation.map((item) => (
              <Button
                key={item.name}
                as={Link}
                to={item.path}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Role Badge */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium">
            Administrator Dashboard • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminDashboardLayout; 