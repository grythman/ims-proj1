import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, Download, Printer, Edit, Trash2, MessageSquare, ChevronLeft, User, Calendar, Share2 } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button'; 
import { Tag, Spin, Empty, Divider, Modal, message, Popconfirm, Tooltip, Steps, Alert } from 'antd';
import api from '../../services/api';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Step } = Steps;

// Мок тайлангийн дата
const mockReportsDetails = {
  1: {
    id: 1,
    title: 'Долоо хоногийн тайлан #1 - MongoDB хэрэглээ',
    report_type: 'weekly',
    status: 'pending',
    created_at: '2023-08-15',
    feedback: null,
    content: `
      <h2>Гүйцэтгэсэн ажлууд</h2>
      <ul>
        <li>MongoDB өгөгдлийн сангийн бүтцийг судлав</li>
        <li>Үндсэн CRUD үйлдлүүдийг хэрэгжүүлж эхлэв</li>
        <li>Mongoose ODM-ийн талаар судалгаа хийв</li>
        <li>Өгөгдлийн сангийн схемүүдийг үүсгэв</li>
      </ul>
      
      <h2>Сурсан чадварууд</h2>
      <p>MongoDB өгөгдлийн сан дээр ажиллах үндсэн чадварууд, NoSQL өгөгдлийн сангийн зарчмууд, Mongoose-ийн онцлогууд, Node.js дээр ажиллах.</p>
      
      <h2>Бэрхшээлүүд</h2>
      <p>Хамгийн том бэрхшээл нь өмнө SQL өгөгдлийн сан ашиглаж байсан учир NoSQL загвар руу шилжихэд бага зэрэг хэцүү байсан. Гэхдээ MongoDB-ийн уян хатан байдал нь зарим үйлдлүүдийг илүү хялбар болгосон.</p>
      
      <h2>Дараагийн долоо хоногийн зорилтууд</h2>
      <ul>
        <li>Хайлтын функцийг сайжруулах</li>
        <li>Индексжүүлэлтийг нэмэх</li>
        <li>Агрегацийн функцуудыг судлах</li>
        <li>Аюулгүй байдлын тохиргоог хийх</li>
      </ul>
    `,
    attachments: [
      { id: 1, filename: 'MongoDB_Notes.pdf', size: 1520000, type: 'application/pdf' },
      { id: 2, filename: 'Database_Schema.png', size: 350000, type: 'image/png' }
    ],
    author: {
      id: 2,
      name: 'Бат-Эрдэнэ Д.',
      avatar: 'https://via.placeholder.com/40',
      role: 'Оюутан'
    },
    comments: [
      {
        id: 1,
        author: {
          id: 3,
          name: 'Болд Б.',
          avatar: 'https://via.placeholder.com/40',
          role: 'Ментор'
        },
        content: 'Судалгаа сайн хийсэн байна. MongoDB дээр индекс, шард үүсгэх талаар дараагийн долоо хоногт анхаарна уу.',
        created_at: '2023-08-16T14:30:00'
      }
    ]
  },
  2: {
    id: 2,
    title: 'Долоо хоногийн тайлан #2 - React хөгжүүлэлт',
    report_type: 'weekly',
    status: 'approved',
    created_at: '2023-08-22',
    feedback: 'Сайн ажилласан байна. Кодын хэсгүүдийг илүү сайн тайлбарлах хэрэгтэй.',
    content: `
      <h2>Гүйцэтгэсэн ажлууд</h2>
      <ul>
        <li>React компонентуудыг үүсгэв</li>
        <li>Хэрэглэгчийн интерфейсийг бүрэн хэрэгжүүлэв</li>
        <li>State management-ийг Redux ашиглан хийв</li>
        <li>Responsive дизайныг Bootstrap ашиглан хийв</li>
      </ul>
      
      <h2>Сурсан чадварууд</h2>
      <p>React Hooks, Context API, Redux, React Router, Styled Components зэрэг технологиудыг ашиглаж сурсан.</p>
      
      <h2>Бэрхшээлүүд</h2>
      <p>Redux-ийн боловсронгуй хэрэглээ болон performance optimization дээр ажиллахад хэцүү байсан. Мөн компонентын бүтцийг оновчтой болгоход анхаарах хэрэгтэй.</p>
      
      <h2>Дараагийн долоо хоногийн зорилтууд</h2>
      <ul>
        <li>Тестүүдийг бичих</li>
        <li>Аюулгүй байдлыг сайжруулах</li>
        <li>Бүрэн responsive болгох</li>
        <li>Кодыг цэвэрлэх, оновчлох</li>
      </ul>
    `,
    attachments: [
      { id: 3, filename: 'React_Components.jsx', size: 23500, type: 'application/javascript' },
      { id: 4, filename: 'UI_Screenshots.zip', size: 5340000, type: 'application/zip' }
    ],
    author: {
      id: 2,
      name: 'Бат-Эрдэнэ Д.',
      avatar: 'https://via.placeholder.com/40',
      role: 'Оюутан'
    },
    comments: [
      {
        id: 2,
        author: {
          id: 3,
          name: 'Болд Б.',
          avatar: 'https://via.placeholder.com/40',
          role: 'Ментор'
        },
        content: 'React компонентууд сайн зохион байгуулалттай байна. Дараагийн удаа Redux-ийн тухай тодруулж ярилцъя.',
        created_at: '2023-08-23T10:15:00'
      },
      {
        id: 3,
        author: {
          id: 4,
          name: 'Сарнай Г.',
          avatar: 'https://via.placeholder.com/40',
          role: 'Багш'
        },
        content: 'Тайлан маш сайн бичигдсэн байна. Redux middleware-ийн хэрэглээг судалж үзээрэй.',
        created_at: '2023-08-24T16:20:00'
      }
    ]
  }
};

// PDF үүсгэх загвар
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5
  },
  footer: {
    marginTop: 25,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  }
});

const ReportPDF = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{report.title}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Тайлангийн төрөл:</Text>
        <Text style={styles.content}>
          {report.report_type === 'weekly' ? 'Долоо хоногийн тайлан' : 
           report.report_type === 'monthly' ? 'Сарын тайлан' : 'Эцсийн тайлан'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Огноо:</Text>
        <Text style={styles.content}>
          {new Date(report.created_at).toLocaleDateString('mn-MN')}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Агуулга:</Text>
        <Text style={styles.content}>
          {report.content.replace(/<[^>]*>?/gm, '')}
        </Text>
      </View>
      
      <Text style={styles.footer}>
        {`"Дадлагын менежментийн систем" - ${new Date().toLocaleDateString('mn-MN')}`}
      </Text>
    </Page>
  </Document>
);

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/api/v1/reports/${id}/`);
        setReport(response.data);
      } catch (err) {
        console.error('API-аас тайлан авах үед алдаа гарлаа:', err);
        
        // Мок дата ашиглах
        if (mockReportsDetails[id]) {
          setReport(mockReportsDetails[id]);
        } else {
          throw new Error('Тайлан олдсонгүй');
        }
      }
    } catch (err) {
      console.error('Тайлан авахад алдаа гарлаа:', err);
      setError(err.message || 'Тайлан авахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async () => {
    try {
      // await api.delete(`/api/v1/reports/${id}/`);
      message.success('Тайлан амжилттай устгагдлаа');
      navigate('/student/reports/my');
    } catch (error) {
      console.error('Тайлан устгахад алдаа гарлаа:', error);
      message.error('Тайлан устгахад алдаа гарлаа');
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      message.warning('Сэтгэгдэл оруулна уу');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // API руу хүсэлт явуулах
      /* const response = await api.post(`/api/v1/reports/${id}/comments/`, {
        content: newComment
      }); */
      
      // Мок дата ашиглах
      const comment = {
        id: report.comments.length + 1,
        author: {
          id: 2,
          name: 'Бат-Эрдэнэ Д.',
          avatar: 'https://via.placeholder.com/40',
          role: 'Оюутан'
        },
        content: newComment,
        created_at: new Date().toISOString()
      };
      
      setReport({
        ...report,
        comments: [...report.comments, comment]
      });
      
      setNewComment('');
      setCommentModalVisible(false);
      message.success('Сэтгэгдэл амжилттай нэмэгдлээ');
    } catch (error) {
      console.error('Сэтгэгдэл нэмэхэд алдаа гарлаа:', error);
      message.error('Сэтгэгдэл нэмэхэд алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  const generatePDF = () => {
    const reportElement = document.getElementById('report-content');
    
    html2canvas(reportElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${report.title}.pdf`);
    });
    
    setPrintModalVisible(false);
  };

  const printReport = () => {
    window.print();
    setPrintModalVisible(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="warning" icon={<Clock className="h-3 w-3 mr-1" />}>Хүлээгдэж буй</Tag>;
      case 'approved':
        return <Tag color="success" icon={<CheckCircle className="h-3 w-3 mr-1" />}>Баталгаажсан</Tag>;
      case 'rejected':
        return <Tag color="error" icon={<XCircle className="h-3 w-3 mr-1" />}>Татгалзсан</Tag>;
      default:
        return <Tag color="default">Тодорхойгүй</Tag>;
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'approved':
        return 2;
      case 'rejected':
        return 1;
      default:
        return 0;
    }
  };
  
  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('zip')) return '📦';
    if (type.includes('javascript') || type.includes('text')) return '📝';
    return '📎';
  };

  const getFormattedFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Тайлан олдсонгүй</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Хүсэлт илгээсэн тайлан олдсонгүй эсвэл хандах эрх байхгүй байна.'}
          </p>
          <Button onClick={() => navigate('/student/reports/my')}>
            Тайлангуудын жагсаалт руу буцах
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
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{report.title}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(report.created_at).toLocaleDateString('mn-MN')}
                    </span>
                    <Tag color={
                      report.report_type === 'weekly' ? 'blue' :
                      report.report_type === 'monthly' ? 'purple' : 'green'
                    }>
                      {report.report_type === 'weekly' ? 'Долоо хоногийн' :
                       report.report_type === 'monthly' ? 'Сарын' : 'Эцсийн'} тайлан
                    </Tag>
                    {getStatusBadge(report.status)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Tooltip title="Хэвлэх/PDF татах">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPrintModalVisible(true)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Засах">
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => navigate(`/student/reports/edit/${report.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Устгах">
                    <Popconfirm
                      title="Тайланг устгах"
                      description="Энэ тайланг устгахдаа итгэлтэй байна уу?"
                      onConfirm={handleDeleteReport}
                      okText="Тийм"
                      cancelText="Үгүй"
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                </div>
              </div>
              
              <Divider className="my-4" />
              
              <div className="mb-6">
                <Steps 
                  current={getStatusStep(report.status)} 
                  status={report.status === 'rejected' ? 'error' : 'process'}
                >
                  <Step title="Илгээсэн" description={new Date(report.created_at).toLocaleDateString('mn-MN')} />
                  <Step title="Шалгаж буй" description="Багш/Ментор" />
                  <Step title="Баталгаажсан" description={report.status === 'approved' ? 'Амжилттай' : ''} />
                </Steps>
              </div>
              
              {report.feedback && (
                <div className={`mb-6 p-4 rounded-lg ${
                  report.status === 'approved' ? 'bg-green-50 border border-green-200' :
                  report.status === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <h3 className="font-medium mb-2">
                    {report.status === 'approved' ? 'Санал шүүмж:' :
                     report.status === 'rejected' ? 'Татгалзсан шалтгаан:' : 'Тэмдэглэл:'}
                  </h3>
                  <p>{report.feedback}</p>
                </div>
              )}
              
              <div id="report-content" className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: report.content }}></div>
              </div>
              
              {report.attachments?.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-lg font-medium mb-4">Хавсралтууд</h2>
                  <div className="space-y-2">
                    {report.attachments.map(attachment => (
                      <div 
                        key={attachment.id} 
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-2xl mr-3">{getFileIcon(attachment.type)}</span>
                        <div className="flex-1">
                          <p className="font-medium">{attachment.filename}</p>
                          <p className="text-sm text-gray-500">{getFormattedFileSize(attachment.size)}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Татах
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Сэтгэгдлүүд ({report.comments?.length || 0})</h2>
                <Button onClick={() => setCommentModalVisible(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Сэтгэгдэл нэмэх
                </Button>
              </div>
              
              {report.comments?.length > 0 ? (
                <div className="space-y-4">
                  {report.comments.map(comment => (
                    <div key={comment.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-10 h-10 rounded-full bg-cover bg-center mr-3"
                          style={{ backgroundImage: `url(${comment.author.avatar})` }}
                        ></div>
                        <div>
                          <p className="font-medium">{comment.author.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Tag color="blue" className="mr-2">{comment.author.role}</Tag>
                            {new Date(comment.created_at).toLocaleString('mn-MN')}
                          </p>
                        </div>
                      </div>
                      <div className="ml-13 pl-12">
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty description="Сэтгэгдэл байхгүй байна" />
              )}
            </div>
          </Card>
        </div>
        
        <div className="w-full lg:w-1/4">
          <Card className="p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Тайлангийн мэдээлэл</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Төрөл</p>
                <p className="font-medium">
                  {report.report_type === 'weekly' ? 'Долоо хоногийн тайлан' :
                   report.report_type === 'monthly' ? 'Сарын тайлан' : 'Эцсийн тайлан'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Статус</p>
                <div>{getStatusBadge(report.status)}</div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Үүсгэсэн огноо</p>
                <p className="font-medium">
                  {new Date(report.created_at).toLocaleDateString('mn-MN')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Оруулсан</p>
                <div className="flex items-center mt-1">
                  <div 
                    className="w-8 h-8 rounded-full bg-cover bg-center mr-2"
                    style={{ backgroundImage: `url(${report.author.avatar})` }}
                  ></div>
                  <div>
                    <p className="font-medium">{report.author.name}</p>
                    <p className="text-xs text-gray-500">{report.author.role}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Хавсралтууд</p>
                <p className="font-medium">{report.attachments?.length || 0} файл</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Сэтгэгдлүүд</p>
                <p className="font-medium">{report.comments?.length || 0} сэтгэгдэл</p>
              </div>
            </div>
            
            <Divider className="my-4" />
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setPrintModalVisible(true)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Хэвлэх / PDF татах
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/student/reports/edit/${report.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Засах
              </Button>
              
              <Popconfirm
                title="Тайланг устгах"
                description="Энэ тайланг устгахдаа итгэлтэй байна уу?"
                onConfirm={handleDeleteReport}
                okText="Тийм"
                cancelText="Үгүй"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  variant="danger" 
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Устгах
                </Button>
              </Popconfirm>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Үйлдлүүд</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/reports/my')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Бүх тайлангууд
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/student/reports/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Шинэ тайлан
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setCommentModalVisible(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Сэтгэгдэл нэмэх
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Хуваалцах
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Сэтгэгдэл нэмэх modal */}
      <Modal
        title="Сэтгэгдэл нэмэх"
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        footer={[
          <Button 
            key="cancel" 
            variant="outline"
            onClick={() => setCommentModalVisible(false)}
          >
            Цуцлах
          </Button>,
          <Button
            key="submit"
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Илгээж байна...' : 'Илгээх'}
          </Button>
        ]}
      >
        <div className="mt-4">
          <textarea
            className="w-full border rounded-md p-2 min-h-[120px]"
            placeholder="Сэтгэгдлээ бичнэ үү..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
        </div>
      </Modal>
      
      {/* Хэвлэх / PDF Modal */}
      <Modal
        title="Тайланг татах"
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        footer={null}
      >
        <div className="py-4 space-y-6">
          <div className="flex gap-4">
            <Button
              className="flex-1 h-20 flex-col"
              onClick={printReport}
            >
              <Printer className="h-6 w-6 mb-2" />
              <span>Хэвлэх</span>
            </Button>
            
            <Button
              className="flex-1 h-20 flex-col"
              onClick={generatePDF}
            >
              <Download className="h-6 w-6 mb-2" />
              <span>PDF Татах</span>
            </Button>
          </div>
          
          <Alert
            message="Тайлбар"
            description="Хэвлэх үед зөвхөн тайлангийн агуулга хэвлэгдэх болно. Сэтгэгдлүүд болон бусад мэдээлэл багтахгүй."
            type="info"
            showIcon
          />
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setPrintModalVisible(false)}
            >
              Хаах
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportView; 