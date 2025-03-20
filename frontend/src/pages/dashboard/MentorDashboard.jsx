import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Table, Tag, Avatar, Progress, Tooltip, message, Spin } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  EyeOutlined
} from '@ant-design/icons';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './MentorDashboard.css';

const { Title, Text } = Typography;

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    completedInternships: 0,
    pendingReports: 0
  });
  const [students, setStudents] = useState([]);
  const [recentReports, setRecentReports] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, studentsResponse, reportsResponse] = await Promise.all([
        api.get('/api/v2/mentor/dashboard/stats/'),
        api.get('/api/v2/mentor/students/'),
        api.get('/api/v2/mentor/reports/recent/')
      ]);

      setStats(statsResponse.data);
      setStudents(studentsResponse.data);
      setRecentReports(reportsResponse.data);
    } catch (error) {
      message.error('Өгөгдөл ачаалахад алдаа гарлаа');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card hoverable className="stat-card">
      <div className="stat-content">
        <div className={`icon-wrapper ${color}`}>
          <Icon />
        </div>
        <div className="stat-text">
          <Text className="stat-value">{value}</Text>
          <Text className="stat-title">{title}</Text>
        </div>
      </div>
    </Card>
  );

  const studentColumns = [
    {
      title: 'Оюутан',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="student-info">
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <Text type="secondary" className="student-email">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Дадлагын нэр',
      dataIndex: 'internshipTitle',
      key: 'internshipTitle',
    },
    {
      title: 'Явц',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Tooltip title={`${progress}%`}>
          <Progress percent={progress} size="small" />
        </Tooltip>
      ),
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          active: { color: 'green', text: 'Идэвхтэй' },
          completed: { color: 'blue', text: 'Дууссан' },
          pending: { color: 'orange', text: 'Хүлээгдэж буй' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/mentor/students/${record.id}`)}
        >
          Дэлгэрэнгүй
        </Button>
      ),
    },
  ];

  const reportColumns = [
    {
      title: 'Оюутан',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Төрөл',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'weekly' ? 'blue' : 'purple'}>
          {type === 'weekly' ? '7 хоног' : 'Сар'}
        </Tag>
      ),
    },
    {
      title: 'Огноо',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'Хүлээгдэж буй' },
          approved: { color: 'green', text: 'Зөвшөөрсөн' },
          rejected: { color: 'red', text: 'Татгалзсан' }
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/mentor/reports/${record.id}`)}
        >
          Харах
        </Button>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <Title level={2}>Ментор хяналтын самбар</Title>
          <Text type="secondary">Таны хариуцсан оюутнуудын дадлагын явц.</Text>
        </div>
      </div>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={TeamOutlined}
            title="Нийт оюутан"
            value={stats.totalStudents}
            color="blue"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={ClockCircleOutlined}
            title="Идэвхтэй дадлага"
            value={stats.activeInternships}
            color="green"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={CheckCircleOutlined}
            title="Дууссан дадлага"
            value={stats.completedInternships}
            color="purple"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            icon={FileTextOutlined}
            title="Хүлээгдэж буй тайлан"
            value={stats.pendingReports}
            color="orange"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="content-row">
        <Col span={24}>
          <Card title="Оюутнууд" className="students-card">
            <Table 
              columns={studentColumns} 
              dataSource={students}
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="content-row">
        <Col span={24}>
          <Card title="Сүүлийн тайлангууд" className="reports-card">
            <Table 
              columns={reportColumns} 
              dataSource={recentReports}
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MentorDashboard; 