import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  GraduationCap,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  ListChecks,
  FileEdit,
  Home,
  Shield,
  LogOut,
  Menu,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    reports: true,
  });

  const toggleMenu = (menuKey) => {
    if (collapsed) return; // Эвхэгдсэн үед цэсийг нээх боломжгүй
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const getNavItems = () => {
    const roleSpecificItems = {
      student: [
        { 
          name: 'Нүүр хуудас', 
          icon: LayoutDashboard, 
          path: '/student',
          exact: true
        },
        { 
          name: 'Тайлангууд', 
          icon: FileText,
          key: 'reports',
          isExpandable: true,
          children: [
            { name: 'Шинэ тайлан', icon: PlusCircle, path: '/student/reports/submit' },
            { name: 'Миний тайлангууд', icon: ListChecks, path: '/student/reports/review' },
            { name: 'Загварууд', icon: FileEdit, path: '/student/reports/templates' }
          ]
        },
        { name: 'Даалгаврууд', icon: CheckSquare, path: '/student/tasks' },
        { name: 'Хуваарь', icon: Calendar, path: '/student/schedule' },
        { name: 'Өргөдлүүд', icon: ClipboardList, path: '/student/applications' },
        { name: 'Дадлага бүртгүүлэх', icon: Briefcase, path: '/student/apply-internship' }
      ],
      mentor: [
        { name: 'Нүүр хуудас', icon: LayoutDashboard, path: '/mentor' },
        { name: 'Оюутнууд', icon: Users, path: '/mentor/students' },
        { name: 'Тайлангууд', icon: FileText, path: '/mentor/reports/review' },
        { name: 'Үнэлгээнүүд', icon: ClipboardList, path: '/mentor/evaluations' },
        { name: 'Статистик', icon: BarChart, path: '/mentor/analytics' },
        { name: 'Мессежүүд', icon: MessageSquare, path: '/mentor/messages' }
      ],
      teacher: [
        { name: 'Нүүр хуудас', icon: LayoutDashboard, path: '/teacher' },
        { name: 'Оюутнууд', icon: Users, path: '/teacher/students' },
        { name: 'Тайлангууд', icon: FileText, path: '/teacher/reports/review' },
        { name: 'Үнэлгээнүүд', icon: ClipboardList, path: '/teacher/evaluations' },
        { name: 'Статистик', icon: BarChart, path: '/teacher/analytics' }
      ],
      admin: [
        { name: 'Нүүр хуудас', icon: LayoutDashboard, path: '/admin' },
        { name: 'Хэрэглэгчид', icon: Users, path: '/admin/users' },
        { name: 'Тайлангууд', icon: FileText, path: '/admin/reports/review' },
        { name: 'Статистик', icon: BarChart, path: '/admin/analytics' },
        { name: 'Тохиргоо', icon: Settings, path: '/admin/settings' }
      ]
    };

    // User type-ийг аюулгүй авах
    const userType = user?.user_type || 'student';
    
    // roleSpecificItems[userType] массив байгаа эсэхийг шалгаад, байхгүй бол хоосон массив буцаах
    return Array.isArray(roleSpecificItems[userType]) 
      ? roleSpecificItems[userType] 
      : roleSpecificItems.student || [];
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isChildActive = (children) => {
    return children && children.some(child => isActive(child.path));
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    
    if (item.isExpandable) {
      const isExpanded = expandedMenus[item.key];
      const active = isChildActive(item.children);
      
      return (
        <div key={item.name} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.key)}
            className={clsx(
              "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-150",
              active
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center">
              <Icon
                className={clsx(
                  collapsed ? "mx-auto" : "mr-3", 
                  "h-5 w-5 flex-shrink-0",
                  active
                    ? "text-green-600"
                    : "text-gray-500 group-hover:text-gray-600"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </div>
            {!collapsed && (
              isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            )}
          </button>
          
          {isExpanded && !collapsed && item.children && (
            <div className="pl-8 space-y-1">
              {item.children.map(child => {
                const ChildIcon = child.icon;
                const childActive = isActive(child.path);
                
                return (
                  <Link
                    key={child.name}
                    to={child.path}
                    className={clsx(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150",
                      childActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {ChildIcon && (
                      <ChildIcon
                        className={clsx(
                          "mr-3 h-4 w-4 flex-shrink-0",
                          childActive
                            ? "text-green-600"
                            : "text-gray-500 group-hover:text-gray-600"
                        )}
                      />
                    )}
                    <span>{child.name}</span>
                    {childActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600 ml-auto"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    const active = isActive(item.path, item.exact);
    
    return (
      <Link
        key={item.name}
        to={item.path}
        className={clsx(
          "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150",
          active
            ? "bg-green-100 text-green-700"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
          collapsed && "justify-center"
        )}
        title={collapsed ? item.name : ""}
      >
        <Icon
          className={clsx(
            collapsed ? "mx-auto" : "mr-3", 
            "h-5 w-5 flex-shrink-0",
            active
              ? "text-green-600"
              : "text-gray-500 group-hover:text-gray-600"
          )}
        />
        {!collapsed && (
          <>
            <span>{item.name}</span>
            {active && (
              <div className="h-1.5 w-1.5 rounded-full bg-green-600 ml-auto"></div>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`bg-white h-full shadow-xl transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <div className="absolute -right-3 top-20">
        <button
          onClick={toggleSidebar}
          className="bg-white text-gray-600 hover:text-green-600 rounded-full p-1 shadow-md focus:outline-none"
        >
          {collapsed ? 
            <ChevronRight className="h-5 w-5" /> : 
            <ChevronLeft className="h-5 w-5" />
          }
        </button>
      </div>

      <nav className="flex flex-col flex-grow p-4">
        <div className="flex-grow space-y-1">
          {getNavItems().map(renderNavItem)}
        </div>
        
        <div className="pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={clsx(
              "flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Гарах" : ""}
          >
            <LogOut className={clsx(collapsed ? "mx-auto" : "mr-3", "h-5 w-5")} />
            {!collapsed && <span>Гарах</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 