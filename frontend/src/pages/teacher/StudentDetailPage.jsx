import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Typography,
  Button,
  Tabs,
  Table,
  Tag,
  Spin,
  Alert,
  Space,
  Divider,
  Timeline,
  Row,
  Col,
  Statistic,
  message
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BookOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import api from '../../api/axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [internship, setInternship] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [studentResponse, internshipResponse, reportsResponse] = await Promise.all([
        api.get(`/api/v1/users/${studentId}/`),
        api.get(`/api/v1/users/${studentId}/internship/`).catch(() => ({ data: null })),
        api.get(`/api/v1/users/${studentId}/reports/`).catch(() => ({ data: [] }))
      ]);

      setStudent(studentResponse.data);
      setInternship(internshipResponse.data);
      setReports(reportsResponse.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Оюутны мэдээлэл ачаалахад алдаа гарлаа');
      message.error('Оюутны мэдээлэл ачаалахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (reportId) => {
    navigate(`/teacher/reports/${reportId}`);
  };

  const handleViewInternship = (internshipId) => {
    navigate(`/teacher/internships/${internshipId}`);
  };

  const reportColumns = [
    {
      title: 'Тайлангийн нэр',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Төрөл',
      dataIndex: 'report_type',
      key: 'type',
      render: type => {
        let color = 'blue';
        let text = type;
        
        if (type === 'weekly') {
          text = 'Долоо хоногийн';
        } else if (type === 'monthly') {
          text = 'Сарын';
        } else if (type === 'final') {
          text = 'Төгсгөлийн';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Илгээсэн огноо',
      dataIndex: 'submission_date',
      key: 'date',
      render: date => date ? new Date(date).toLocaleDateString() : 'Тодорхойгүй',
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'default';
        let text = 'Тодорхойгүй';
        
        if (status === 'pending') {
          color = 'orange';
          text = 'Хүлээгдэж буй';
        } else if (status === 'approved') {
          color = 'green';
          text = 'Баталсан';
        } else if (status === 'rejected') {
          color = 'red';
          text = 'Татгалзсан';
        } else if (status === 'draft') {
          color = 'default';
          text = 'Ноорог';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Үйлдэл',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          onClick={() => handleViewReport(record.id)}
          icon={<FileTextOutlined />}
        >
          Харах
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: '16px' }}>Оюутны мэдээлэл ачаалж байна...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Алдаа"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/teacher/students')}>
              Буцах
            </Button>
          }
        />
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Оюутан олдсонгүй"
          description="Оюутны мэдээлэл олдсонгүй"
          type="warning"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/teacher/students')}>
              Буцах
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/teacher/students')}
            style={{ marginBottom: '16px', padding: 0 }}
          >
            Оюутнууд руу буцах
          </Button>
          <Title level={2}>{student.first_name} {student.last_name}</Title>
        </div>
        
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card title="Оюутны хувийн мэдээлэл" bordered={false}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label={<><UserOutlined /> Нэр</>}>
                  {student.first_name} {student.last_name}
                </Descriptions.Item>
                <Descriptions.Item label={<><MailOutlined /> И-мэйл</>}>
                  {student.email}
                </Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined /> Утас</>}>
                  {student.phone || 'Тодорхойгүй'}
                </Descriptions.Item>
                <Descriptions.Item label={<><EnvironmentOutlined /> Хаяг</>}>
                  {student.address || 'Тодорхойгүй'}
                </Descriptions.Item>
                <Descriptions.Item label={<><BookOutlined /> Хөтөлбөр</>}>
                  {student.program || 'Тодорхойгүй'}
                </Descriptions.Item>
                <Descriptions.Item label="Бүртгүүлсэн огноо">
                  {student.date_joined ? new Date(student.date_joined).toLocaleDateString() : 'Тодорхойгүй'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          
          <Col span={8}>
            <Card title="Дадлагын мэдээлэл" bordered={false}>
              {internship ? (
                <>
                  <Statistic 
                    title="Дадлагын төлөв" 
                    value={internship.status === 'active' ? 'Идэвхтэй' : 
                           internship.status === 'completed' ? 'Дууссан' : 
                           internship.status === 'pending' ? 'Хүлээгдэж буй' : 'Тодорхойгүй'} 
                    valueStyle={{
                      color: 
                        internship.status === 'active' ? '#52c41a' : 
                        internship.status === 'completed' ? '#1890ff' : 
                        internship.status === 'pending' ? '#faad14' : '#000000',
                    }}
                    prefix={internship.status === 'active' ? <ClockCircleOutlined /> : 
                            internship.status === 'completed' ? <CheckCircleOutlined /> : 
                            internship.status === 'pending' ? <ClockCircleOutlined /> : <CloseCircleOutlined />}
                  />
                  
                  <Divider />
                  
                  <Descriptions column={1}>
                    <Descriptions.Item label="Байгууллага">
                      {internship.employer?.name || 'Тодорхойгүй'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Менторын нэр">
                      {internship.mentor ? `${internship.mentor.first_name} ${internship.mentor.last_name}` : 'Тодорхойгүй'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Эхэлсэн огноо">
                      {internship.start_date ? new Date(internship.start_date).toLocaleDateString() : 'Тодорхойгүй'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дуусах огноо">
                      {internship.end_date ? new Date(internship.end_date).toLocaleDateString() : 'Тодорхойгүй'}
                    </Descriptions.Item>
                  </Descriptions>
                  
                  <Divider />
                  
                  <Button 
                    type="primary" 
                    onClick={() => handleViewInternship(internship.id)}
                    style={{ width: '100%' }}
                  >
                    Дадлагын дэлгэрэнгүй
                  </Button>
                </>
              ) : (
                <Alert
                  message="Дадлага олдсонгүй"
                  description="Энэ оюутанд одоогоор идэвхтэй дадлага байхгүй байна."
                  type="info"
                  showIcon
                />
              )}
            </Card>
          </Col>
        </Row>
        
        <Card title="Дэлгэрэнгүй мэдээлэл" bordered={false}>
          <Tabs defaultActiveKey="reports">
            <TabPane tab="Тайлангууд" key="reports">
              {reports && reports.length > 0 ? (
                <Table
                  columns={reportColumns}
                  dataSource={reports}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              ) : (
                <Alert
                  message="Тайлан олдсонгүй"
                  description="Энэ оюутан одоогоор ямар ч тайлан илгээгээгүй байна."
                  type="info"
                  showIcon
                />
              )}
            </TabPane>
            
            <TabPane tab="Явц" key="progress">
              <Timeline>
                {student.date_joined && (
                  <Timeline.Item>
                    <p><strong>Системд бүртгүүлсэн</strong></p>
                    <p>{new Date(student.date_joined).toLocaleDateString()}</p>
                  </Timeline.Item>
                )}
                
                {internship && (
                  <>
                    <Timeline.Item>
                      <p><strong>Дадлага эхэлсэн</strong></p>
                      <p>{internship.start_date ? new Date(internship.start_date).toLocaleDateString() : 'Тодорхойгүй'}</p>
                    </Timeline.Item>
                    
                    {reports && reports.length > 0 && (
                      <Timeline.Item>
                        <p><strong>Тайлан илгээсэн</strong></p>
                        <p>Нийт {reports.length} тайлан</p>
                      </Timeline.Item>
                    )}
                    
                    {internship.status === 'completed' && (
                      <Timeline.Item>
                        <p><strong>Дадлага дууссан</strong></p>
                        <p>{internship.end_date ? new Date(internship.end_date).toLocaleDateString() : 'Тодорхойгүй'}</p>
                      </Timeline.Item>
                    )}
                  </>
                )}
              </Timeline>
            </TabPane>
          </Tabs>
        </Card>
      </Space>
    </div>
  );
};

export default StudentDetailPage; 