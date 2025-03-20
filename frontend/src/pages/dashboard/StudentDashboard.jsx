import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, message, Select, Input, DatePicker, Form } from 'antd';
import {
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BuildOutlined
} from '@ant-design/icons';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    reportsSubmitted: 0,
    daysRemaining: 0,
    overallProgress: 0,
    tasksCompleted: '12/15'
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v2/student/dashboard/');
      setStats(response.data);
    } catch (error) {
      message.error('Өгөгдөл ачаалахад алдаа гарлаа');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/api/v2/organizations/');
      setOrganizations(response.data.map(org => ({
        value: org.id,
        label: org.name
      })));
    } catch (error) {
      message.error('Байгууллагуудын жагсаалт ачаалахад алдаа гарлаа');
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await api.get('/api/v2/mentors/');
      setMentors(response.data.map(mentor => ({
        value: mentor.id,
        label: `${mentor.first_name} ${mentor.last_name}`
      })));
    } catch (error) {
      message.error('Менторуудын жагсаалт ачаалахад алдаа гарлаа');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (showRegisterForm) {
      fetchOrganizations();
      fetchMentors();
    }
  }, [showRegisterForm]);

  const handleRegisterInternship = async (values) => {
    try {
      await api.post('/api/v2/internships/', {
        ...values,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD')
      });
      message.success('Дадлага амжилттай бүртгэгдлээ');
      setShowRegisterForm(false);
      form.resetFields();
      fetchDashboardData();
    } catch (error) {
      message.error('Дадлага бүртгэхэд алдаа гарлаа');
    }
  };

  const RegisterInternshipForm = () => (
    <Card className="register-internship-form">
      <Title level={4}>Дадлага бүртгүүлэх</Title>
      <Text type="secondary" className="mb-4 block">
        Дадлагын мэдээллээ оруулна уу
      </Text>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleRegisterInternship}
        className="form-content"
      >
        <Form.Item
          name="organization"
          label="Байгууллага"
          rules={[{ required: true, message: 'Байгууллага сонгоно уу' }]}
        >
          <Select
            placeholder="Байгууллага сонгох"
            options={organizations}
            loading={loading}
          />
        </Form.Item>

        <Form.Item
          name="mentor"
          label="Ментор"
          rules={[{ required: true, message: 'Ментор сонгоно уу' }]}
        >
          <Select
            placeholder="Ментор сонгох"
            options={mentors}
            loading={loading}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Дадлагын нэр"
          rules={[{ required: true, message: 'Дадлагын нэр оруулна уу' }]}
        >
          <Input placeholder="Жишээ нь: Програм хөгжүүлэгч" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Тайлбар"
          rules={[{ required: true, message: 'Тайлбар оруулна уу' }]}
        >
          <TextArea 
            placeholder="Дадлагын үүрэг хариуцлагын талаар бичнэ үү..."
            rows={4}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="start_date"
              label="Эхлэх огноо"
              rules={[{ required: true, message: 'Эхлэх огноо оруулна уу' }]}
            >
              <DatePicker className="w-full" placeholder="YYYY/MM/DD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="end_date"
              label="Дуусах огноо"
              rules={[{ required: true, message: 'Дуусах огноо оруулна уу' }]}
            >
              <DatePicker className="w-full" placeholder="YYYY/MM/DD" />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-actions">
          <Button onClick={() => setShowRegisterForm(false)}>
            Цуцлах
          </Button>
          <Button type="primary" htmlType="submit">
            Бүртгүүлэх
          </Button>
        </div>
      </Form>
    </Card>
  );

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <Title level={2}>Тавтай морил! 👋</Title>
          <Text type="secondary">Өнөөдрийн дадлагын явц.</Text>
        </div>
        <div className="header-actions">
          <Button 
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => navigate('/dashboard/reports/submit')}
          >
            Шинэ тайлан
          </Button>
          <Button
            icon={<BuildOutlined />}
            onClick={() => setShowRegisterForm(true)}
          >
            Дадлага бүртгүүлэх
          </Button>
        </div>
      </div>

      {showRegisterForm ? (
        <RegisterInternshipForm />
      ) : (
        <>
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={FileTextOutlined}
                title="Нийт тайлан"
                value={stats.reportsSubmitted}
                color="blue"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={CalendarOutlined}
                title="Үлдсэн хоног"
                value={stats.daysRemaining}
                color="green"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={CheckCircleOutlined}
                title="Явц"
                value={`${stats.overallProgress}%`}
                color="purple"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                icon={ClockCircleOutlined}
                title="Даалгавар"
                value={stats.tasksCompleted}
                color="orange"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="content-row">
            <Col xs={24} lg={16}>
              <Card title="Дадлагын явц" className="progress-card">
                <div className="progress-bar-container">
                  <div className="progress-info">
                    <Text>Нийт явц</Text>
                    <Text strong>{stats.overallProgress}%</Text>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${stats.overallProgress}%` }}
                    />
                  </div>
                </div>
                <div className="progress-details">
                  {/* Add more progress details here */}
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Ойрын хугацаанууд" className="deadlines-card">
                {/* Add deadlines content here */}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;