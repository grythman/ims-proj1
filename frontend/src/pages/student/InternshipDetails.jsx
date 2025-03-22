import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { FileEdit, Calendar, User, Building, CheckSquare, MapPin, Briefcase, Clock, Award, Star, FileText, UserRound, GraduationCap, ChevronLeft, Bookmark, Share2, Flag, Mail, ArrowLeft, ExternalLink, Upload } from 'lucide-react';
import { Divider, Tag, Empty, Badge, Skeleton, notification, Steps, Modal, Form, Input, Upload as AntUpload, Tooltip } from 'antd';
import ErrorState from '../../components/UI/ErrorState';
import { getInternshipListingById, applyForInternship, bookmarkInternship } from '../../services/api';

const { Step } = Steps;
const { TextArea } = Input;

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internship, setInternship] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Өгөгдөл татах
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getInternshipListingById(id);
        setInternship(data);
        setIsBookmarked(data.is_bookmarked);
      } catch (error) {
        console.error('Дадлагын мэдээлэл авахад алдаа гарлаа:', error);
        setError('Дадлагын мэдээлэл авахад алдаа гарлаа');
        
        // Туршилтад зориулсан дата
        setInternship({
          id: id,
          organization: 'Монгол Апп ХХК',
          position: 'Веб хөгжүүлэгч',
          location: 'Улаанбаатар',
          type: 'Бүтэн цагийн',
          duration: '3 сар',
          salary: '1,500,000₮',
          category: 'Програм хангамж',
          description: 'React, NodeJS ашиглан веб аппликейшн хөгжүүлэх дадлага. Тогтмол үнэлгээтэй.',
          requirements: ['React эсвэл Angular', 'JavaScript/TypeScript', 'HTML/CSS', 'Git'],
          benefits: ['Цалинтай', 'Ажилд орох боломж', 'Mentor дагалдуулах', 'Уян хатан цаг'],
          responsibilities: [
            'Фронтенд хөгжүүлэлт хийх',
            'UI/UX дизайны хэрэгжилт',
            'API интеграц бий болгох',
            'Багт нэвтрэх дадлага'
          ],
          applyDeadline: '2023-06-30',
          postedDate: '2023-06-01',
          logo: 'https://via.placeholder.com/80',
          featured: true,
          is_bookmarked: false,
          contact_person_name: 'Бат-Эрдэнэ Дорж',
          applications_count: 15
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  
  // Хадгалах функц
  const handleBookmark = async () => {
    try {
      const response = await bookmarkInternship(id);
      setIsBookmarked(!isBookmarked);
      
      notification.success({
        message: 'Амжилттай',
        description: isBookmarked ? 'Дадлага хадгалагдсанаас хасагдлаа' : 'Дадлага амжилттай хадгалагдлаа',
        placement: 'bottomRight'
      });
    } catch (error) {
      notification.error({
        message: 'Алдаа',
        description: 'Хадгалахад алдаа гарлаа, дахин оролдоно уу',
        placement: 'bottomRight'
      });
    }
  };
  
  // Хуваалцах функц
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    notification.success({
      message: 'Амжилттай',
      description: 'Холбоос амжилттай хуулагдлаа',
      placement: 'bottomRight'
    });
  };
  
  // Хүсэлт илгээх функц
  const handleApply = () => {
    setIsApplyModalOpen(true);
  };
  
  // Хүсэлт илгээх модал хаах
  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
    applyForm.resetFields();
  };
  
  // Хүсэлт илгээх үйлдэл
  const submitApplication = async (values) => {
    try {
      setIsSubmitting(true);
      
      const applicationData = {
        cover_letter: values.cover_letter,
        resume: values.resume ? values.resume.file : null
      };
      
      await applyForInternship(id, applicationData);
      
      notification.success({
        message: 'Амжилттай',
        description: 'Таны дадлагын хүсэлт амжилттай илгээгдлээ!',
        placement: 'bottomRight'
      });
      
      closeApplyModal();
    } catch (error) {
      let errorMessage = 'Хүсэлт илгээхэд алдаа гарлаа';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      notification.error({
        message: 'Алдаа',
        description: errorMessage,
        placement: 'bottomRight'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Хүсэлт илгээх модал
  const ApplyModal = () => (
    <Modal
      title="Дадлагын хүсэлт илгээх"
      open={isApplyModalOpen}
      onCancel={closeApplyModal}
      footer={null}
      width={600}
    >
      <Form
        form={applyForm}
        layout="vertical"
        onFinish={submitApplication}
        initialValues={{ cover_letter: '' }}
      >
        <div className="mb-4">
          <h3 className="font-medium mb-2">Хүсэлт илгээх явц:</h3>
          <Steps
            size="small"
            current={0}
            items={[
              { title: 'Хүсэлт илгээх' },
              { title: 'Хянагдаж буй' },
              { title: 'Ярилцлага' },
              { title: 'Баталгаажуулах' }
            ]}
          />
        </div>
        
        <Form.Item
          name="cover_letter"
          label="Товч танилцуулга"
          rules={[{ required: true, message: 'Товч танилцуулга шаардлагатай' }]}
        >
          <TextArea 
            rows={6} 
            placeholder="Өөрийн тухай болон энэ дадлагыг хийх зорилгынхоо талаар товч бичнэ үү..."
          />
        </Form.Item>
        
        <Form.Item
          name="resume"
          label="CV (PDF, DOCX)"
          rules={[{ required: true, message: 'CV файл шаардлагатай' }]}
        >
          <AntUpload.Dragger
            name="resume"
            accept=".pdf,.docx"
            maxCount={1}
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <Upload size={24} />
            </p>
            <p className="ant-upload-text">Энд CV файлаа зөөж тавина уу</p>
            <p className="ant-upload-hint text-xs">
              PDF, DOCX файл дэмжигдэнэ. Хэмжээ 5MB-ээс бага байна.
            </p>
          </AntUpload.Dragger>
        </Form.Item>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={closeApplyModal}
          >
            Цуцлах
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Илгээж байна...' : 'Хүсэлт илгээх'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
  
  // Скелетон ачаалж байх үед
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton.Button active shape="square" style={{ width: 32 }} />
          <Skeleton.Input active style={{ width: 240 }} />
        </div>
        
        <Card>
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton.Image active style={{ width: 120, height: 120 }} />
            
            <div className="flex-1">
              <Skeleton active paragraph={{ rows: 2 }} />
              <div className="mt-4">
                <Skeleton.Button active style={{ width: 80, marginRight: 12 }} />
                <Skeleton.Button active style={{ width: 80, marginRight: 12 }} />
                <Skeleton.Button active style={{ width: 80 }} />
              </div>
            </div>
          </div>
          
          <Divider />
          
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }
  
  // Алдаа гарсан үед
  if (error && !internship) {
    return <ErrorState message={error} />;
  }
  
  // Дадлагын мэдээлэл байхгүй үед
  if (!internship) {
    return (
      <div className="p-6">
        <Empty 
          description="Дадлагын мэдээлэл олдсонгүй" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/student/internship-listings')}
            className="flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Дадлагын жагсаалт руу буцах
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Буцах
        </Button>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Дадлагын дэлгэрэнгүй мэдээлэл</h1>
          
          <div className="flex gap-2">
            <Tooltip title="Хадгалах">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBookmark}
              >
                <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
              </Button>
            </Tooltip>
            
            <Tooltip title="Хуваалцах">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            <Tooltip title="Асуудал мэдэгдэх">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => notification.info({ message: 'Асуудал мэдэгдэх', description: 'Энэ функцийг удахгүй нэмэх болно' })}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      
      <Card>
        {internship.featured && (
          <div className="bg-blue-500 text-white text-sm font-medium py-1 px-3 text-center">
            Онцлох дадлага
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="bg-white border rounded-lg p-4 shadow-sm w-[120px] h-[120px] flex items-center justify-center">
                {internship.logo ? (
                  <img 
                    src={internship.logo} 
                    alt={internship.organization} 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Building className="h-16 w-16 text-gray-300" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{internship.position}</h2>
              <p className="text-lg text-gray-700 mb-3">{internship.organization}</p>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {internship.location}
                </Badge>
                <Badge className="flex items-center gap-1" color="blue">
                  <Briefcase className="h-3.5 w-3.5" /> {internship.type}
                </Badge>
                <Badge className="flex items-center gap-1" color="purple">
                  <Clock className="h-3.5 w-3.5" /> {internship.duration}
                </Badge>
                <Badge className="flex items-center gap-1" color="orange">
                  <Award className="h-3.5 w-3.5" /> {internship.category}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-500 text-sm">Хүсэлт хүлээн авах эцсийн хугацаа:</span>
                <span className="font-medium">{internship.applyDeadline}</span>
                
                <span className="mx-2 text-gray-300">|</span>
                
                <span className="text-gray-500 text-sm">Нийтэлсэн:</span>
                <span className="font-medium">{internship.postedDate}</span>
                
                <span className="mx-2 text-gray-300">|</span>
                
                <span className="text-gray-500 text-sm">Нийт бүртгүүлсэн:</span>
                <span className="font-medium">{internship.applications_count || 0} оюутан</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
            <p className="font-bold text-xl text-blue-600">{internship.salary}</p>
            
            <Button 
              size="lg"
              onClick={handleApply}
              className="w-full sm:w-auto"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Дадлагад бүртгүүлэх
            </Button>
          </div>
          
          <Divider />
          
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-3">Дадлагын тодорхойлолт</h3>
              <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-3">Шаардлагууд</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {internship.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>
            
            {internship.responsibilities && internship.responsibilities.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-3">Хариуцах ажлууд</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {internship.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </section>
            )}
            
            <section>
              <h3 className="text-lg font-semibold mb-3">Давуу талууд</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {internship.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-3">Холбоо барих</h3>
              <div className="flex flex-col space-y-2">
                {internship.contact_person_name && (
                  <p className="flex items-center text-gray-700">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {internship.contact_person_name}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center w-max"
                  onClick={() => notification.info({ message: 'Мэдэгдэл', description: 'Энэ функцийг удахгүй нэмэх болно' })}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Имэйл илгээх
                </Button>
              </div>
            </section>
          </div>
          
          <Divider />
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center w-full sm:w-auto"
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(internship.organization)}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Байгууллагын талаар судлах
            </Button>
            
            <Button 
              onClick={handleApply}
              className="w-full sm:w-auto"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Дадлагад бүртгүүлэх
            </Button>
          </div>
        </div>
      </Card>
      
      <ApplyModal />
    </div>
  );
};

export default InternshipDetails; 