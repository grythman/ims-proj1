import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, message, Select, Input, DatePicker, Form } from 'antd';
import { ArrowLeft, Briefcase, Building, User, Calendar, FileText } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../../components/UI/ErrorState';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ApplyInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [form] = Form.useForm();

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/api/v2/organizations/');
      setOrganizations(response.data.map(org => ({
        value: org.id,
        label: org.name
      })));
    } catch (error) {
      console.error('Error fetching organizations:', error);
      message.warning('Байгууллагуудын жагсаалт ачаалахад алдаа гарлаа. Түр зуурын өгөгдөл харуулж байна.');
      
      // Use fallback data
      setOrganizations([
        { value: 1, label: 'Монгол Апп ХХК' },
        { value: 2, label: 'АйТи Зон ХХК' },
        { value: 3, label: 'Юнител ХХК' }
      ]);
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
      console.error('Error fetching mentors:', error);
      message.warning('Менторуудын жагсаалт ачаалахад алдаа гарлаа. Түр зуурын өгөгдөл харуулж байна.');
      
      // Use fallback data
      setMentors([
        { value: 1, label: 'Батбаяр Дорж' },
        { value: 2, label: 'Болормаа Ган' },
        { value: 3, label: 'Түмэн Жаргал' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchMentors();
  }, []);

  const handleRegisterInternship = async (values) => {
    try {
      setSubmitting(true);
      await api.post('/api/v2/internships/', {
        ...values,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD')
      });
      message.success('Дадлага амжилттай бүртгэгдлээ');
      form.resetFields();
      navigate('/student');
    } catch (error) {
      console.error('Error registering internship:', error);
      message.error('Дадлага бүртгэхэд алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  // If there's a critical network error and no data could be loaded
  if (error && error.type === 'network' && !loading) {
    return (
      <ErrorState 
        title="Сүлжээний алдаа" 
        subTitle="Өгөгдөл ачаалахад алдаа гарлаа. Сүлжээний холболтоо шалгана уу."
        onRetry={() => {
          fetchOrganizations();
          fetchMentors();
        }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center">
        <Button 
          type="text" 
          icon={<ArrowLeft className="h-5 w-5" />} 
          onClick={() => navigate('/student')}
          className="mr-4 flex items-center"
        >
          Буцах
        </Button>
        <div>
          <h1 className="text-2xl font-semibold mb-1">Дадлага бүртгүүлэх</h1>
          <p className="text-gray-500">Дадлагын бүртгэлийн маягт бөглөнө үү.</p>
        </div>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 text-green-600 mr-2" />
              <Title level={4} className="!mb-0">Дадлагын мэдээлэл</Title>
            </div>
            <Text type="secondary">
              Та өөрийн хүсч буй дадлагын талаар мэдээллийг оруулна уу. Мэдээлэл баталгаажсаны дараа дадлагын удирдагч холбогдох болно.
            </Text>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegisterInternship}
            className="space-y-4"
          >
            <Form.Item
              name="organization"
              label={
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Байгууллага</span>
                </div>
              }
              rules={[{ required: true, message: 'Байгууллага сонгоно уу' }]}
            >
              <Select
                placeholder="Байгууллага сонгох"
                options={organizations}
                loading={loading}
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="mentor"
              label={
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Ментор</span>
                </div>
              }
              rules={[{ required: true, message: 'Ментор сонгоно уу' }]}
            >
              <Select
                placeholder="Ментор сонгох"
                options={mentors}
                loading={loading}
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="title"
              label={
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Дадлагын нэр</span>
                </div>
              }
              rules={[{ required: true, message: 'Дадлагын нэр оруулна уу' }]}
            >
              <Input 
                placeholder="Жишээ нь: Програм хөгжүүлэгч" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Тайлбар</span>
                </div>
              }
              rules={[{ required: true, message: 'Тайлбар оруулна уу' }]}
            >
              <TextArea 
                placeholder="Дадлагын үүрэг хариуцлагын талаар бичнэ үү..."
                rows={4}
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="start_date"
                  label={
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Эхлэх огноо</span>
                    </div>
                  }
                  rules={[{ required: true, message: 'Эхлэх огноо оруулна уу' }]}
                >
                  <DatePicker 
                    className="w-full" 
                    placeholder="YYYY-MM-DD" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="end_date"
                  label={
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Дуусах огноо</span>
                    </div>
                  }
                  rules={[{ required: true, message: 'Дуусах огноо оруулна уу' }]}
                >
                  <DatePicker 
                    className="w-full" 
                    placeholder="YYYY-MM-DD"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={() => navigate('/student')}
                className="mr-3"
              >
                Цуцлах
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={submitting}
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                Бүртгүүлэх
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ApplyInternship; 