import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  BarChartOutlined,
  CalendarOutlined,
  SettingOutlined,
  ApiOutlined
} from '@ant-design/icons';

const Navigation = ({ user }) => {
  const location = useLocation();

  // Define all possible menu items
  const menuItems = [];

  // Add teacher menu items if user is a teacher
  if (user?.is_teacher) {
    menuItems.push(
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: <Link to="/teacher">Хяналтын самбар</Link>,
      },
      {
        key: 'students',
        icon: <UserOutlined />,
        label: <Link to="/teacher/students">Оюутнууд</Link>,
      },
      {
        key: 'evaluations',
        icon: <CheckSquareOutlined />,
        label: <Link to="/teacher/evaluations">Үнэлгээ</Link>,
      },
      {
        key: 'reports',
        icon: <FileTextOutlined />,
        label: <Link to="/teacher/reports">Тайлан</Link>,
      },
      {
        key: 'analytics',
        icon: <BarChartOutlined />,
        label: <Link to="/teacher/analytics">Статистик</Link>,
      },
      {
        key: 'calendar',
        icon: <CalendarOutlined />,
        label: <Link to="/teacher/calendar">Хуанли</Link>,
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: <Link to="/teacher/settings">Тохиргоо</Link>,
      }
    );
  }

  // Add admin menu items if user is staff
  if (user?.is_staff) {
    menuItems.push(
      {
        key: 'webhooks',
        icon: <ApiOutlined />,
        label: <Link to="/webhooks">Webhooks</Link>,
      }
    );
  }

  // Get the current selected key based on the path
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
      theme="light"
    />
  );
};

export default Navigation; 