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
  MessageSquare
} from 'lucide-react';

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
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.path)
                      ? 'text-emerald-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 