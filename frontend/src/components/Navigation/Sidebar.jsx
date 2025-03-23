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
  ChevronRight,
  Bell,
  Brain,
  Bot,
  Sparkles,
  Search,
  LineChart
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    reports: true,
    evaluations: true,
    internships: true
  });

  const toggleMenu = (menuKey) => {
    if (collapsed) return;
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
          name: 'Дадлага',
          icon: Briefcase,
          key: 'internships',
          isExpandable: true,
          children: [
            { name: 'Дадлагын зар', icon: ListChecks, path: '/student/internship-listings' },
            { name: 'Дадлага бүртгүүлэх', icon: PlusCircle, path: '/student/apply-internship' },
            { name: 'Өргөдлүүд', icon: ClipboardList, path: '/student/applications' }
          ]
        },
        { 
          name: 'Тайлан', 
          icon: FileText,
          key: 'reports',
          isExpandable: true,
          children: [
            { name: 'Тайлан бичих', icon: FileEdit, path: '/student/reports/submit' },
            { name: 'Миний тайлангууд', icon: ClipboardList, path: '/student/reports/my' },
            { name: 'Тайлангийн загвар', icon: FileText, path: '/student/reports/templates' }
          ]
        },
        { 
          name: 'Үнэлгээнүүд', 
          icon: CheckSquare,
          key: 'evaluations',
          isExpandable: true,
          children: [
            { name: 'Менторын үнэлгээ', icon: Users, path: '/student/evaluations/mentor' },
            { name: 'Багшийн үнэлгээ', icon: GraduationCap, path: '/student/evaluations/teacher' }
          ]
        },
        { name: 'Даалгаврууд', icon: ClipboardList, path: '/student/tasks' },
        { name: 'Хуваарь', icon: Calendar, path: '/student/schedule' },
        {
          name: 'AI Туслах',
          icon: Brain,
          key: 'ai',
          isExpandable: true,
          children: [
            { name: 'Тайлан туслах', icon: Bot, path: '/student/ai/report-assistant' },
            { name: 'Даалгавар зөвлөгч', icon: Sparkles, path: '/student/ai/task-advisor' },
            { name: 'Чат туслах', icon: MessageSquare, path: '/student/ai/chat' }
          ]
        }
      ],
      mentor: [
        { name: 'Нүүр хуудас', icon: LayoutDashboard, path: '/mentor' },
        { name: 'Оюутнууд', icon: Users, path: '/mentor/students' },
        {
          name: 'Тайлангууд',
          icon: FileText,
          key: 'reports',
          isExpandable: true,
          children: [
            { name: 'Ирсэн тайлангууд', icon: ClipboardList, path: '/mentor/reports/submitted' },
            { name: 'Тайлангийн загвар', icon: FileText, path: '/mentor/reports/templates' }
          ]
        },
        { name: 'Үнэлгээнүүд', icon: CheckSquare, path: '/mentor/evaluations' },
        { name: 'Статистик', icon: BarChart, path: '/mentor/analytics' },
        { name: 'Мессеж', icon: MessageSquare, path: '/mentor/chat' },
        { name: 'Хуваарь', icon: Calendar, path: '/mentor/schedule' },
        {
          name: 'AI Туслах',
          icon: Brain,
          key: 'ai',
          isExpandable: true,
          children: [
            { name: 'Тайлан шинжилгээ', icon: Search, path: '/mentor/ai/report-analysis' },
            { name: 'Үнэлгээ зөвлөмж', icon: Sparkles, path: '/mentor/ai/evaluation-advisor' },
            { name: 'Чат туслах', icon: MessageSquare, path: '/mentor/ai/chat' }
          ]
        }
      ],
      teacher: [
        { name: 'Нүүр хуудас', icon: LayoutDashboard, path: '/teacher' },
        { name: 'Оюутнууд', icon: Users, path: '/teacher/students' },
        {
          name: 'Тайлангууд',
          icon: FileText,
          key: 'reports',
          isExpandable: true,
          children: [
            { name: 'Хянах тайлангууд', icon: ClipboardList, path: '/teacher/reports/review' },
            { name: 'Тайлангийн загвар', icon: FileText, path: '/teacher/reports/templates' }
          ]
        },
        { name: 'Үнэлгээнүүд', icon: CheckSquare, path: '/teacher/evaluations' },
        { name: 'Статистик', icon: BarChart, path: '/teacher/analytics' },
        { name: 'Хуваарь', icon: Calendar, path: '/teacher/schedule' },
        {
          name: 'AI Туслах',
          icon: Brain,
          key: 'ai',
          isExpandable: true,
          children: [
            { name: 'Оюутан шинжилгээ', icon: Search, path: '/teacher/ai/student-analysis' },
            { name: 'Явц таамаглал', icon: LineChart, path: '/teacher/ai/progress-prediction' },
            { name: 'Чат туслах', icon: MessageSquare, path: '/teacher/ai/chat' }
          ]
        }
      ],
      admin: [
        { name: 'Нүүр хуудас', icon: LayoutDashboard, path: '/admin' },
        { name: 'Хэрэглэгчид', icon: Users, path: '/admin/users' },
        {
          name: 'Дадлага',
          icon: Briefcase,
          key: 'internships',
          isExpandable: true,
          children: [
            { name: 'Бүх дадлага', icon: ListChecks, path: '/admin/internships' },
            { name: 'Дадлагын зар', icon: PlusCircle, path: '/admin/internship-listings' },
            { name: 'Өргөдлүүд', icon: ClipboardList, path: '/admin/applications' }
          ]
        },
        {
          name: 'Тайлангууд',
          icon: FileText,
          key: 'reports',
          isExpandable: true,
          children: [
            { name: 'Бүх тайлан', icon: ClipboardList, path: '/admin/reports' },
            { name: 'Тайлангийн загвар', icon: FileText, path: '/admin/reports/templates' }
          ]
        },
        { name: 'Статистик', icon: BarChart, path: '/admin/analytics' },
        { name: 'Мэдэгдэл', icon: Bell, path: '/admin/notifications' },
        { name: 'Тохиргоо', icon: Settings, path: '/admin/settings' },
        {
          name: 'AI Удирдлага',
          icon: Brain,
          key: 'ai',
          isExpandable: true,
          children: [
            { name: 'AI Тохиргоо', icon: Settings, path: '/admin/ai/settings' },
            { name: 'Системийн шинжилгээ', icon: Search, path: '/admin/ai/system-analysis' },
            { name: 'Чат лог', icon: MessageSquare, path: '/admin/ai/chat-logs' }
          ]
        }
      ]
    };

    // User type-ийг аюулгүй авах
    const userType = user?.role || user?.user_type || 'student';
    
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
      </nav>
    </div>
  );
};

export default Sidebar; 