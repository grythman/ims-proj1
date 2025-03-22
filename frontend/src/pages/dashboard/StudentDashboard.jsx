import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, message, Select, Input, DatePicker, Form } from 'antd';
import {
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BuildOutlined
} from '@ant-design/icons';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FileText, Calendar, CheckCircle, Clock, FileEdit } from 'lucide-react';
import StatisticsCard from '../../components/Analytics/StatisticsCard';
import { Button as CustomButton } from '../../components/UI/Button';

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Тавтай морил! 👋</h1>
        <p className="text-gray-500">Өнөөдрийн дадлагын явц.</p>
        
        <div className="mt-5 flex gap-3">
          <CustomButton 
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/reports/submit')}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Шинэ тайлан
          </CustomButton>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={() => setShowRegisterForm(true)}
            className="text-gray-700 border-gray-300"
          >
            Дадлага бүртгүүлэх
          </CustomButton>
        </div>
      </div>

      {showRegisterForm ? (
        <RegisterInternshipForm />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatisticsCard
              icon={FileText}
              title="Нийт тайлан"
              value={stats.reportsSubmitted}
              colorScheme="violet"
            />
            <StatisticsCard
              icon={Calendar}
              title="Үлдсэн хоног"
              value={stats.daysRemaining}
              colorScheme="green"
            />
            <StatisticsCard
              icon={CheckCircle}
              title="Явц"
              value={`${stats.overallProgress}%`}
              colorScheme="purple"
            />
            <StatisticsCard
              icon={Clock}
              title="Даалгавар"
              value={stats.tasksCompleted}
              colorScheme="amber"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <Card title="Дадлагын явц" className="border border-gray-100 shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Нийт явц</span>
                    <span className="text-sm font-medium">{stats.overallProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
                    <div 
                      className="h-full bg-violet-500 rounded-full" 
                      style={{ width: `${stats.overallProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-4">
                    <div className="pb-2">
                      <span>Нийт явц</span>
                      <div className="mt-1 h-2 w-full bg-gray-100 rounded-full">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="col-span-1">
              <Card 
                title="Ойрын хугацаанууд" 
                className="border border-gray-100 shadow-sm"
                extra={<a href="#" className="text-violet-600 text-xs">Бүгдийг үзэх</a>}
              >
                <div className="p-2">
                  <div className="p-3 border border-gray-100 rounded-md mb-2 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">7 хоногийн тайлан</div>
                        <div className="text-xs text-gray-500 mt-1">Дуусах хугацаа: 2023-03-25</div>
                      </div>
                      <div className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                        Удахгүй
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;