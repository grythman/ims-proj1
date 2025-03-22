import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Filter, Download, Search, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Tabs, Input, Select, Spin, Empty, Badge, Dropdown, Menu, Space, Tag, message } from 'antd';
import api from '../../services/api';

const { TabPane } = Tabs;

// Мок тайлангийн дата
const mockReports = [
  {
    id: 1,
    title: 'Долоо хоногийн тайлан #1 - MongoDB хэрэглээ',
    report_type: 'weekly',
    status: 'pending',
    created_at: '2023-08-15',
    feedback: null
  },
  {
    id: 2,
    title: 'Долоо хоногийн тайлан #2 - React хөгжүүлэлт',
    report_type: 'weekly',
    status: 'approved',
    created_at: '2023-08-22',
    feedback: 'Сайн ажилласан байна. Кодын хэсгүүдийг илүү сайн тайлбарлах хэрэгтэй.'
  },
  {
    id: 3,
    title: 'Сарын тайлан - 9-р сар',
    report_type: 'monthly',
    status: 'rejected',
    created_at: '2023-09-30',
    feedback: 'Илүү дэлгэрэнгүй мэдээлэл оруулах шаардлагатай. MongoDB-ийн хэсгийг дахин боловсруулна уу.'
  },
  {
    id: 4,
    title: 'Эцсийн тайлан - Дадлагын дүгнэлт',
    report_type: 'final',
    status: 'pending',
    created_at: '2023-10-15',
    feedback: null
  }
];

const ReportsList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      console.log('Тайлангуудыг ачааллаж байна...');
      
      // API-аас тайлангуудыг авах оролдлого хийх
      try {
        const response = await api.get('/api/v1/reports/list/');
        console.log('API хариу:', response);
        
        if (response.data && Array.isArray(response.data.data)) {
          setReports(response.data.data);
        } else if (Array.isArray(response.data)) {
          setReports(response.data);
        } else {
          // Хэрэв API хариу зөв бүтэцтэй биш бол мок дата ашиглах
          console.log('API хариу буруу бүтэцтэй байна, мок дата ашиглаж байна');
          setReports(mockReports);
        }
      } catch (err) {
        console.error('API алдаа гарлаа:', err);
        // API хүсэлт алдаатай бол мок дата ашиглах
        console.log('Мок тайлангийн дата ашиглаж байна');
        setReports(mockReports);
      }
    } catch (err) {
      console.error('Тайлангууд ачааллахад алдаа гарлаа:', err);
      setError('Тайлангуудыг ачааллахад алдаа гарлаа');
      message.error('Тайлангуудыг авахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'weekly':
        return 'Долоо хоногийн тайлан';
      case 'monthly':
        return 'Сарын тайлан';
      case 'final':
        return 'Эцсийн тайлан';
      default:
        return 'Бусад';
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportToCsv = () => {
    const headers = ['Гарчиг', 'Төрөл', 'Статус', 'Огноо'];
    
    const data = filteredReports.map(report => [
      report.title,
      getTypeLabel(report.report_type),
      report.status,
      new Date(report.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'reports.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Миний тайлангууд</h1>
        <p className="text-gray-600">Дадлагын бүх тайлангуудыг энд харуулж байна</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Тайлан хайх..."
            value={searchQuery}
            onChange={handleSearch}
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            className="w-full sm:w-64"
          />
          
          <Select
            placeholder="Төрлөөр"
            value={typeFilter}
            onChange={handleTypeFilter}
            className="w-full sm:w-40"
            options={[
              { value: 'all', label: 'Бүх төрөл' },
              { value: 'weekly', label: 'Долоо хоногийн' },
              { value: 'monthly', label: 'Сарын' },
              { value: 'final', label: 'Эцсийн' }
            ]}
          />
          
          <Select
            placeholder="Статусаар"
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full sm:w-40"
            options={[
              { value: 'all', label: 'Бүх статус' },
              { value: 'pending', label: 'Хүлээгдэж буй' },
              { value: 'approved', label: 'Баталгаажсан' },
              { value: 'rejected', label: 'Татгалзсан' }
            ]}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={exportToCsv}
            className="sm:flex-grow-0 flex-grow"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспортлох
          </Button>
          
          <Button
            onClick={() => navigate('/student/reports/new')}
            className="sm:flex-grow-0 flex-grow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Шинэ тайлан
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Алдаа гарлаа</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => fetchReports()}>
            Дахин оролдох
          </Button>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card className="p-8 text-center">
          <Empty 
            description={
              searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? "Шүүлтүүрт тохирох тайлан олдсонгүй"
                : "Та одоогоор ямар ч тайлан илгээгээгүй байна"
            } 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          {!(searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
            <Button 
              onClick={() => navigate('/student/reports/new')}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Шинэ тайлан үүсгэх
            </Button>
          )}
        </Card>
      ) : (
        <Card>
          <div className="divide-y">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 hover:bg-gray-50 transition-colors flex items-center cursor-pointer"
                onClick={() => navigate(`/student/reports/view/${report.id}`)}
              >
                <FileText className="h-10 w-10 text-blue-500 mr-4 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{report.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString('mn-MN')}
                    </span>
                    
                    <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
                    
                    <span className="text-sm text-gray-500">
                      {getTypeLabel(report.report_type)}
                    </span>
                    
                    {report.feedback && (
                      <>
                        <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
                        <span className="text-sm text-gray-500 truncate">
                          Санал: {report.feedback.substring(0, 50)}{report.feedback.length > 50 ? '...' : ''}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  {getStatusBadge(report.status)}
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsList; 