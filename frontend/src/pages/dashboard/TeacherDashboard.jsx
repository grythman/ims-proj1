import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Typography, message } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const { Title } = Typography;

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    completedInternships: 0,
    pendingReports: 0
  });

  const [recentInternships, setRecentInternships] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);

    const fetchDashboardData = async () => {
      try {
      setLoading(true);
      const [statsResponse, internshipsResponse, reportsResponse] = await Promise.all([
        api.get('/api/v2/dashboard/stats/'),
        api.get('/api/v2/internships/recent/'),
        api.get('/api/v2/reports/pending/')
      ]);

      setStats(statsResponse.data);
      setRecentInternships(internshipsResponse.data);
      setPendingReports(reportsResponse.data);
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

  const handleViewInternship = (id) => {
    navigate(`/teacher/internships/${id}`);
  };

  const handleViewReport = (id) => {
    navigate(`/teacher/reports/${id}`);
  };

  const handleViewAllInternships = () => {
    navigate('/teacher/internships');
  };

  const handleViewAllReports = () => {
    navigate('/teacher/reports');
  };

  const internshipColumns = [
    {
      title: 'Оюутан',
      dataIndex: 'student',
      key: 'student',
      width: '20%',
    },
    {
      title: 'Компани',
      dataIndex: 'company',
      key: 'company',
      width: '30%',
    },
    {
      title: 'Эхэлсэн огноо',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '20%',
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'warning'}>
          {status === 'active' ? 'Идэвхтэй' : 'Дууссан'}
        </Tag>
      ),
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewInternship(record.id)}
        >
          Дэлгэрэнгүй
        </Button>
      ),
    }
  ];

  const reportColumns = [
    {
      title: 'Оюутан',
      dataIndex: 'student',
      key: 'student',
      width: '20%',
    },
    {
      title: 'Тайлангийн нэр',
      dataIndex: 'title',
      key: 'title',
      width: '35%',
    },
    {
      title: 'Илгээсэн огноо',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: '15%',
    },
    {
      title: 'Төрөл',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type) => (
        <Tag color={type === 'weekly' ? 'processing' : 'purple'}>
          {type === 'weekly' ? 'Долоо хоног' : 'Сар'}
        </Tag>
      ),
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Button
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewReport(record.id)}
        >
          Хянах
        </Button>
      ),
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px', color: '#1890ff' }}>
        Багшийн хяналтын самбар
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading} className="dashboard-stat-card">
            <Statistic
              title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>Нийт оюутан</span>}
              value={stats.totalStudents}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#262626', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading} className="dashboard-stat-card">
            <Statistic
              title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>Идэвхтэй дадлага</span>}
              value={stats.activeInternships}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading} className="dashboard-stat-card">
            <Statistic
              title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>Дууссан дадлага</span>}
              value={stats.completedInternships}
              prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#262626', fontSize: '24px' }}
            />
        </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable loading={loading} className="dashboard-stat-card">
            <Statistic
              title={<span style={{ fontSize: '16px', color: '#8c8c8c' }}>Хүлээгдэж буй тайлан</span>}
              value={stats.pendingReports}
              prefix={<BookOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d', fontSize: '24px' }}
            />
        </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontSize: '16px', fontWeight: 500 }}>Сүүлийн дадлагууд</span>}
            extra={
              <Button type="link" onClick={handleViewAllInternships}>
                Бүгдийг үзэх
              </Button>
            }
            className="dashboard-table-card"
          >
            <Table
              loading={loading}
              columns={internshipColumns}
              dataSource={Array.isArray(recentInternships) ? recentInternships : []}
              pagination={{
                pageSize: 5,
                total: Array.isArray(recentInternships) ? recentInternships.length : 0,
                showSizeChanger: false,
                size: 'small'
              }}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontSize: '16px', fontWeight: 500 }}>Хүлээгдэж буй тайлангууд</span>}
            extra={
              <Button type="link" onClick={handleViewAllReports}>
                Бүгдийг үзэх
                </Button>
            }
            className="dashboard-table-card"
          >
            <Table
              loading={loading}
              columns={reportColumns}
              dataSource={Array.isArray(pendingReports) ? pendingReports : []}
              pagination={{
                pageSize: 5,
                total: Array.isArray(pendingReports) ? pendingReports.length : 0,
                showSizeChanger: false,
                size: 'small'
              }}
              size="small"
              rowKey="id"
            />
      </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard; 