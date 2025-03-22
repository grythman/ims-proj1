import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Calendar, FileText, Upload, Check, XCircle, ChevronLeft } from 'lucide-react';
import { Input, Select, Spin, Tabs, message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import ReportForm from '../../components/Reports/ReportForm';
import api from '../../services/api';

const { TabPane } = Tabs;
const { TextArea } = Input;

const SubmitReportPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeInternship, setActiveInternship] = useState(null);
  const [reportType, setReportType] = useState('weekly');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchActiveInternship();
    fetchTemplates();
  }, []);

  const fetchActiveInternship = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/internships/my-internship/');
      setActiveInternship(response.data);
    } catch (error) {
      console.error('Идэвхтэй дадлага олох үед алдаа гарлаа:', error);
      message.error('Идэвхтэй дадлагын мэдээлэл авахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/api/v1/reports/templates/', {
        params: {
          is_active: true
        }
      });
      setAvailableTemplates(response.data?.data || []);
    } catch (error) {
      console.error('Тайлангийн загварууд авах үед алдаа гарлаа:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
    
    const validFiles = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    
    if (validFiles.length !== selectedFiles.length) {
      message.warning('Зарим файлууд хэтэрхий том байна (25MB хязгаарлалт)');
    }
    
    setFiles(validFiles);
  };

  const handleTemplateSelect = (templateId) => {
    const template = availableTemplates.find(t => t.id === parseInt(templateId));
    setSelectedTemplate(template);
    if (template) {
      setReportType(template.report_type);
      setTitle(title || template.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      message.error('Тайлангийн гарчиг оруулна уу');
      return;
    }
    
    if (!content.trim()) {
      message.error('Тайлангийн агуулга оруулна уу');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('report_type', reportType);
      
      if (activeInternship?.id) {
        formData.append('internship', activeInternship.id);
      }
      
      files.forEach(file => {
        formData.append('attachments', file);
      });
      
      const response = await api.post('/api/v1/reports/submit/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      message.success('Тайлан амжилттай илгээгдлээ');
      navigate('/student/reports/my');
    } catch (error) {
      console.error('Тайлан илгээхэд алдаа гарлаа:', error);
      message.error('Тайлан илгээхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  if (!activeInternship) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Идэвхтэй дадлага олдсонгүй</h2>
          <p className="text-gray-600 mb-6">
            Тайлан оруулахын тулд та идэвхтэй дадлагатай байх ёстой.
          </p>
          <Button onClick={() => navigate('/student/internship-listings')}>
            Дадлага хайх
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Буцах
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Шинэ тайлан үүсгэх</h1>
        <p className="text-gray-600">Дадлагын тайлангаа бөглөн багш, ментор нарт илгээнэ үү</p>
      </div>
      
      <Card className="mb-6 p-4">
        <h3 className="text-lg font-medium mb-2">Дадлагын мэдээлэл</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Байгууллага</p>
            <p className="font-medium">{activeInternship.organization}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Албан тушаал</p>
            <p className="font-medium">{activeInternship.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ментор</p>
            <p className="font-medium">{activeInternship.mentor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Багш</p>
            <p className="font-medium">{activeInternship.teacher}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тайлангийн төрөл
              </label>
              <Select
                value={reportType}
                onChange={setReportType}
                className="w-full"
                options={[
                  { value: 'weekly', label: 'Долоо хоногийн тайлан' },
                  { value: 'monthly', label: 'Сарын тайлан' },
                  { value: 'final', label: 'Эцсийн тайлан' }
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тайлангийн загвар (заавал биш)
              </label>
              <Select
                value={selectedTemplate?.id}
                onChange={handleTemplateSelect}
                className="w-full"
                placeholder="Загвар сонгох..."
                allowClear
                options={availableTemplates.map(template => ({
                  value: template.id,
                  label: template.name
                }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тайлангийн гарчиг
              </label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Тайлангийн гарчиг оруулах..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тайлангийн агуулга
              </label>
              <TextArea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Тайлангийн дэлгэрэнгүй агуулга бичих..."
                rows={12}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Хавсралт файл (заавал биш)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Файл сонгох</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">эсвэл чирч оруулах</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, XLSX, PNG файлууд (25MB хүртэл)
                  </p>
                  {files.length > 0 && (
                    <div className="mt-2 text-left">
                      <p className="text-sm font-medium">Сонгосон файлууд:</p>
                      <ul className="mt-1 text-sm text-gray-500">
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Цуцлах
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spin className="mr-2" />
                    Илгээж байна...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Тайлан илгээх
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SubmitReportPage; 