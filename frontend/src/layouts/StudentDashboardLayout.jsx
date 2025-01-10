import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Menu,
  Settings,
  UserCheck,
  User
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Reports from '../pages/reports/Reports';
import Internship from '../pages/internship/Internship';
import Evaluations from '../pages/evaluations/Evaluations';

// Navigation configuration for student
const studentNavigation = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
  { name: 'Internship', icon: Briefcase, path: '/dashboard/internship' },
  { 
    name: 'Evaluations', 
    icon: CheckCircle, 
    path: '/dashboard/evaluations',
    children: [
      { name: 'Mentor Evaluation', icon: UserCheck, path: '/dashboard/evaluations/mentor' },
      { name: 'Teacher Evaluation', icon: User, path: '/dashboard/evaluations/teacher' },
    ],
  },
  { name: 'Calendar', icon: Calendar, path: '/dashboard/calendar' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  { name: 'Help', icon: HelpCircle, path: '/dashboard/help' },
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
          <p className="text-xs text-emerald-500">Student</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Link
            to="/dashboard/profile"
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

const StudentDashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;

    for (let item of studentNavigation) {
      if (item.children) {
        for (let subItem of item.children) {
          if (path.startsWith(subItem.path)) {
            return subItem.name;
          }
        }
        if (path.startsWith(item.path)) {
          return item.name;
        }
      } else if (path === item.path) {
        return item.name;
      }
    }
    return 'Dashboard';
  };

  const toggleMenu = (menuName) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

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
          {studentNavigation.map((item) =>
            item.children ? (
              <div key={item.name} className="space-y-1">
                {/* Parent Menu Item */}
                <button
                  type="button"
                  onClick={() => toggleMenu(item.name)}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  <span className="ml-auto">
                    {openMenus[item.name] ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </span>
                </button>
                {/* Sub-menu */}
                {openMenus[item.name] && (
                  <div className="ml-8 space-y-1">
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                          location.pathname.startsWith(subItem.path)
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <subItem.icon className="h-5 w-5 mr-3" />
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
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
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center px-6">
          <div className="flex-1 flex items-center">
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-800 md:ml-4">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right side actions */}
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
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setOpenMenus({});
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <nav className="px-4 py-4 space-y-1">
                {studentNavigation.map((item) =>
                  item.children ? (
                    <div key={item.name} className="space-y-1">
                      {/* Parent Menu Item */}
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.name)}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                        <span className="ml-auto">
                          {openMenus[item.name] ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </span>
                      </button>
                      {/* Sub-menu */}
                      {openMenus[item.name] && (
                        <div className="ml-8 space-y-1">
                          {item.children.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                                location.pathname.startsWith(subItem.path)
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setOpenMenus({});
                              }}
                            >
                              <subItem.icon className="h-5 w-5 mr-3" />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
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
                  )
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/reports/*" element={<Reports />} />
            <Route path="/internship/*" element={<Internship />} />
            <Route path="/evaluations/*" element={<Evaluations />} />
            {/* Default route for other content */}
            <Route path="*" element={children} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout; 