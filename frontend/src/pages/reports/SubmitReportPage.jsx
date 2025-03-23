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

// тайлангийн төрлүүд
const REPORT_TYPES = [
  { value: 'weekly', label: 'Долоо хоногийн тайлан' },
  { value: 'monthly', label: 'Сарын тайлан' },
  { value: 'final', label: 'Эцсийн тайлан' }
];

// жишээ загвар
const TEMPLATE_EXAMPLES = [
  { id: 1, name: 'Долоо хоногийн тайлан', report_type: 'weekly', content: '# Долоо хоногийн тайлан\n\n## Хийсэн ажлууд\n- \n- \n- \n\n## Сурсан зүйлс\n- \n- \n- \n\n## Тулгарсан асуудлууд\n- \n- \n- \n\n## Дараа долоо хоногт хийх ажлууд\n- \n- \n- \n' },
  { id: 2, name: 'Сарын тайлан', report_type: 'monthly', content: '# Сарын тайлан\n\n## Хийсэн ажлууд\n- \n- \n- \n\n## Сурсан зүйлс\n- \n- \n- \n\n## Тулгарсан асуудлууд\n- \n- \n- \n\n## Дараагийн сард хийх ажлууд\n- \n- \n- \n\n## Шийдвэрлэсэн асуудлууд\n- \n- \n- \n' },
  { id: 3, name: 'Эцсийн тайлан', report_type: 'final', content: '# Эцсийн тайлан\n\n## Дадлагын тойм\n\n## Хийсэн ажлуудын жагсаалт\n- \n- \n- \n\n## Сурсан шинэ технологи, арга барилууд\n- \n- \n- \n\n## Олж авсан туршлага, ур чадварууд\n- \n- \n- \n\n## Дүгнэлт\n\n' }
];

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
  const [availableTemplates, setAvailableTemplates] = useState(TEMPLATE_EXAMPLES);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // шат
  const [previewMode, setPreviewMode] = useState(false); // урьдчилан харах горим

  // Шатууд
  const steps = [
    { key: 1, title: 'Тайлангийн төрөл сонгох' },
    { key: 2, title: 'Тайлангийн мэдээлэл оруулах' },
    { key: 3, title: 'Файл хавсаргах' },
    { key: 4, title: 'Үзэх болон илгээх' }
  ];

  useEffect(() => {
    fetchActiveInternship();
    fetchTemplates();
    // Хуудас ачаалагдахад лог харуулах
    console.log('SubmitReportPage ачаалагдлаа');
  }, []);

  const fetchActiveInternship = async () => {
    try {
      setLoading(true);
      console.log('Идэвхтэй дадлага хайж байна...');
      const response = await api.get('/api/v1/internships/my-internship/');
      console.log('Идэвхтэй дадлага:', response.data);
      setActiveInternship(response.data);
    } catch (error) {
      console.error('Идэвхтэй дадлага олох үед алдаа гарлаа:', error);
      message.error('Идэвхтэй дадлагын мэдээлэл авахад алдаа гарлаа');
      
      // Туршилтын өгөгдөл
      setActiveInternship({
        id: 1,
        organization: 'Монгол Апп ХХК',
        position: 'Веб хөгжүүлэгч',
        mentor: 'Батбаяр Дорж',
        teacher: 'Б. Баярхүү',
        status: 'active'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      console.log('Тайлангийн загварууд хайж байна...');
      const response = await api.get('/api/v1/reports/templates/', {
        params: {
          is_active: true
        }
      });
      
      if (response.data?.data?.length > 0) {
        console.log('Тайлангийн загварууд:', response.data.data);
        setAvailableTemplates(response.data.data);
      } else {
        console.log('Загвар олдсонгүй, жишээ загваруудыг ашиглаж байна');
      }
    } catch (error) {
      console.error('Тайлангийн загварууд авах үед алдаа гарлаа:', error);
      console.log('Жишээ загваруудыг ашиглаж байна');
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
    console.log('Сонгосон файлууд:', validFiles.map(f => f.name));
  };

  const handleTemplateSelect = (templateId) => {
    console.log('Сонгосон загварын ID:', templateId);
    const template = availableTemplates.find(t => t.id === parseInt(templateId));
    setSelectedTemplate(template);
    if (template) {
      setReportType(template.report_type);
      setTitle(title || template.name);
      setContent(template.content || '');
      console.log('Загвар амжилттай сонгогдлоо:', template.name);
    }
  };

  // Дараагийн шат руу шилжих
  const nextStep = () => {
    // Шалгалт хийх
    if (currentStep === 1 && !reportType) {
      message.error('Тайлангийн төрөл сонгоно уу');
      return;
    }
    
    if (currentStep === 2) {
      if (!title.trim()) {
        message.error('Тайлангийн гарчиг оруулна уу');
        return;
      }
      
      if (!content.trim()) {
        message.error('Тайлангийн агуулга оруулна уу');
        return;
      }
    }
    
    // Дараагийн шат руу шилжих
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      console.log('Шат өөрчлөгдөв:', currentStep + 1);
    }
  };

  // Өмнөх шат руу буцах
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      console.log('Шат өөрчлөгдөв:', currentStep - 1);
    }
  };

  const handleSubmit = async () => {
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
      console.log('Тайлан илгээж байна...');
      
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
      
      // Хүсэлт-ийн лог
      console.log('Хүсэлтийн мэдээлэл:', {
        title,
        report_type: reportType,
        internship: activeInternship?.id,
        content: content.substring(0, 100) + '...',
        files: files.map(f => f.name)
      });
      
      const response = await api.post('/api/v1/reports/submit/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Амжилттай хариу:', response.data);
      message.success('Тайлан амжилттай илгээгдлээ');
      navigate('/student/reports/my');
    } catch (error) {
      console.error('Тайлан илгээхэд алдаа гарлаа:', error);
      message.error('Тайлан илгээхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setSubmitting(false);
    }
  };

  // Урьдчилан харах горимыг асаах/унтраах
  const togglePreview = () => {
    setPreviewMode(!previewMode);
    console.log('Урьдчилан харах горим:', !previewMode);
  };

  // Шат бүрийн агуулгыг харуулах
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Тайлангийн төрөл сонгох
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тайлангийн төрөл
              </label>
              <Select
                value={reportType}
                onChange={val => {
                  setReportType(val);
                  console.log('Сонгосон тайлангийн төрөл:', val);
                }}
                className="w-full"
                options={REPORT_TYPES}
                size="large"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тайлангийн загвар (заавал биш)
              </label>
              <Select
                value={selectedTemplate?.id}
                onChange={handleTemplateSelect}
                className="w-full"
                placeholder="Загвар сонгох..."
                allowClear
                options={availableTemplates
                  .filter(t => t.report_type === reportType)
                  .map(template => ({
                    value: template.id,
                    label: template.name
                  }))}
                size="large"
              />
            </div>
          </div>
        );
      
      case 2: // Тайлангийн мэдээлэл оруулах
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тайлангийн гарчиг
              </label>
              <Input
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  console.log('Гарчиг өөрчлөгдөв:', e.target.value);
                }}
                placeholder="Тайлангийн гарчиг оруулах..."
                required
                size="large"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тайлангийн агуулга
              </label>
              <TextArea
                value={content}
                onChange={e => {
                  setContent(e.target.value);
                  console.log('Агуулга өөрчлөгдөв');
                }}
                placeholder="Тайлангийн дэлгэрэнгүй агуулга бичих..."
                rows={12}
                required
              />
            </div>
          </div>
        );
      
      case 3: // Файл хавсаргах
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
          </div>
        );
      
      case 4: // Урьдчилан харах болон илгээх
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{title}</h3>
                <span className="text-sm bg-green-100 text-green-800 rounded-full px-3 py-1">
                  {REPORT_TYPES.find(t => t.value === reportType)?.label}
                </span>
              </div>
              
              <div className="border rounded-md p-4 bg-white">
                <pre className="whitespace-pre-wrap">{content}</pre>
              </div>
              
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Хавсралт файлууд:</h4>
                  <ul className="text-sm text-gray-600">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center mb-1">
                        <FileText className="h-4 w-4 mr-1 text-gray-500" />
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
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

      {/* Дадлагын мэдээлэл */}
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
      
      {/* Алхамууд */}
      <div className="mb-6">
        <div className="flex mb-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep >= step.key 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.key}
              </div>
              <div 
                className={`text-sm ml-2 ${
                  currentStep === step.key ? 'font-medium' : 'text-gray-500'
                }`}
              >
                {step.title}
              </div>
              {index < steps.length - 1 && (
                <div className="mx-2 h-1 w-10 bg-gray-200">
                  <div 
                    className="h-1 bg-green-600" 
                    style={{ 
                      width: currentStep > step.key ? '100%' : '0%',
                      transition: 'width 0.3s'
                    }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Шатны агуулга */}
      <Card className="p-6">
        {renderStepContent()}
        
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? () => navigate(-1) : prevStep}
            disabled={submitting}
          >
            {currentStep === 1 ? 'Цуцлах' : 'Өмнөх'}
          </Button>
          <div className="flex space-x-3">
            {currentStep === steps.length && (
              <Button
                type="button"
                variant="outline"
                onClick={togglePreview}
              >
                {previewMode ? 'Засах' : 'Урьдчилан харах'}
              </Button>
            )}
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
              >
                Дараагийх
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
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
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubmitReportPage; 