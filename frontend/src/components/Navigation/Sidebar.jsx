import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FileText,
  Settings,
  Calendar,
  CheckSquare,
  BarChart,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const roleSpecificItems = {
      student: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/student' },
        { name: 'Reports', icon: FileText, path: '/student/reports/submit' },
        { name: 'Tasks', icon: CheckSquare, path: '/student/tasks' },
        { name: 'Schedule', icon: Calendar, path: '/student/schedule' },
        { name: 'Applications', icon: ClipboardList, path: '/student/applications' }
      ],
      mentor: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/mentor' },
        { name: 'Students', icon: Users, path: '/mentor/students' },
        { name: 'Reports', icon: FileText, path: '/mentor/reports/review' },
        { name: 'Evaluations', icon: ClipboardList, path: '/mentor/evaluations' },
        { name: 'Analytics', icon: BarChart, path: '/mentor/analytics' },
        { name: 'Messages', icon: MessageSquare, path: '/mentor/messages' }
      ],
      teacher: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
        { name: 'Students', icon: Users, path: '/teacher/students' },
        { name: 'Reports', icon: FileText, path: '/teacher/reports/review' },
        { name: 'Evaluations', icon: ClipboardList, path: '/teacher/evaluations' },
        { name: 'Analytics', icon: BarChart, path: '/teacher/analytics' }
      ],
      admin: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Reports', icon: FileText, path: '/admin/reports/review' },
        { name: 'Analytics', icon: BarChart, path: '/admin/analytics' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' }
      ]
    };

    return roleSpecificItems[user?.user_type] || [];
  };

  const isActive = (path) => {
    if (path === `/${user?.user_type}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white h-[calc(100vh-4rem)] flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center">
        <div className="h-8 w-8 rounded-md bg-violet-600 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="ml-3">
          <h2 className="font-semibold text-lg text-gray-900">
            IMS <span className="text-violet-600">Систем</span>
          </h2>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-5 px-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150",
                  active
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={clsx(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    active
                      ? "text-violet-600"
                      : "text-gray-500 group-hover:text-gray-600"
                  )}
                />
                <span>{item.name}</span>
                {active && (
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-600 ml-auto"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* User info */}
      <div className="p-3 mt-auto">
        <div className="px-3 py-2 bg-gray-50 rounded-md">
          <div className="text-xs font-medium text-gray-500 uppercase">
            {user?.user_type || 'user'}
          </div>
          <div className="text-sm font-medium text-gray-700">
            {user?.first_name} {user?.last_name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 