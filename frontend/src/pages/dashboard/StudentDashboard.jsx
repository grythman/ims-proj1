import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, message, Skeleton, Progress, List, Badge, Tag } from 'antd';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FileText, Calendar, CheckCircle, Clock, FileEdit, PlusCircle, ListChecks, Book, AlertTriangle } from 'lucide-react';
import StatisticsCard from '../../components/Analytics/StatisticsCard';
import { Button as CustomButton } from '../../components/UI/Button';
import ErrorState from '../../components/UI/ErrorState';

const { Title, Text } = Typography;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    reportsSubmitted: 0,
    daysRemaining: 0,
    overallProgress: 0,
    tasksCompleted: '12/15',
    upcomingDeadlines: []
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/v2/student/dashboard/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      
      if (error.message === 'Network Error') {
        setError({
          type: 'network',
          message: 'Сүлжээний алдаа гарлаа'
        });
      } else {
        message.warning('Өгөгдөл ачаалахад алдаа гарлаа. Түр зуурын өгөгдөл харуулж байна.');
        
        // Use fallback data from mock endpoint
        setStats({
          reportsSubmitted: 5,
          daysRemaining: 45,
          overallProgress: 68,
          tasksCompleted: '12/15',
          upcomingDeadlines: [
            {
              id: 1,
              title: '7 хоногийн тайлан',
              dueDate: '2023-03-25',
              status: 'upcoming'
            },
            {
              id: 2,
              title: 'Сарын тайлан',
              dueDate: '2023-04-01',
              status: 'upcoming'
            }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // If there's a critical network error and no data could be loaded
  if (error && error.type === 'network' && !loading) {
    return (
      <ErrorState 
        title="Сүлжээний алдаа" 
        subTitle="Өгөгдөл ачаалахад алдаа гарлаа. Сүлжээний холболтоо шалгана уу."
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Тавтай морил! 👋</h1>
        <p className="text-gray-500">Таны дадлагын хураангуй мэдээлэл.</p>
      </div>

      {/* Статистик */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatisticsCard
          icon={FileText}
          title="Нийт тайлан"
          value={stats.reportsSubmitted}
          colorScheme="green"
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
          colorScheme="green"
        />
        <StatisticsCard
          icon={Clock}
          title="Даалгавар"
          value={stats.tasksCompleted}
          colorScheme="green"
        />
      </div>

      {/* Үндсэн хэсэг */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Зүүн баган (2-н багана эзэлнэ) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Дадлагын явцын мэдээлэл */}
          <Card 
            title="Дадлагын явц" 
            className="border border-gray-100 shadow-sm"
          >
            <div className="p-4">
              {loading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-medium">Нийт дадлагын явц</h3>
                      <p className="text-gray-500 text-sm">Дадлагын хөтөлбөрийн дагуу</p>
                    </div>
                    <div className="text-2xl font-semibold text-green-600">{stats.overallProgress}%</div>
                  </div>
                  
                  <Progress 
                    percent={stats.overallProgress} 
                    showInfo={false} 
                    strokeColor={{
                      '0%': '#22c55e',
                      '100%': '#16a34a',
                    }}
                    className="mb-4"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Тайлан</span>
                      </div>
                      <div className="text-2xl font-semibold">{stats.reportsSubmitted}/8</div>
                      <Progress 
                        percent={stats.reportsSubmitted/8*100} 
                        showInfo={false} 
                        strokeColor="#22c55e"
                        size="small"
                      />
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Цаг</span>
                      </div>
                      <div className="text-2xl font-semibold">120/240</div>
                      <Progress 
                        percent={50} 
                        showInfo={false} 
                        strokeColor="#10b981"
                        size="small"
                      />
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Book className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Даалгавар</span>
                      </div>
                      <div className="text-2xl font-semibold">{stats.tasksCompleted}</div>
                      <Progress 
                        percent={12/15*100} 
                        showInfo={false} 
                        strokeColor="#f59e0b"
                        size="small"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
          
          {/* Миний үйл ажиллагаа */}
          <Card 
            title="Миний үйл ажиллагаа" 
            className="border border-gray-100 shadow-sm"
            extra={<a href="#" className="text-green-600 text-sm">Бүгд</a>}
          >
            <div className="p-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton active paragraph={{ rows: 1 }} />
                  <Skeleton active paragraph={{ rows: 1 }} />
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className="mr-3 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Тайлан илгээлээ</div>
                      <div className="text-xs text-gray-500">2023-04-01 12:30</div>
                    </div>
                    <Tag color="success">Амжилттай</Tag>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className="mr-3 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Даалгавар хийгдсэн</div>
                      <div className="text-xs text-gray-500">2023-03-28 16:45</div>
                    </div>
                    <Tag color="warning">Хүлээгдэж буй</Tag>
                  </div>
                  
                  <div className="flex items-center p-3 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className="mr-3 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Уулзалт тохирсон</div>
                      <div className="text-xs text-gray-500">2023-03-25 09:15</div>
                    </div>
                    <Tag color="processing">Товлогдсон</Tag>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Баруун баган */}
        <div className="col-span-1 space-y-6">
          {/* Дадлагын статус */}
          <Card
            title="Дадлагын мэдээлэл"
            className="border border-gray-100 shadow-sm"
          >
            <div className="p-4">
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Төлөв:</div>
                    <Tag color="success">Идэвхтэй</Tag>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Байгууллага:</div>
                    <div className="font-medium">Монгол Апп ХХК</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Ментор:</div>
                    <div className="font-medium">Батбаяр Дорж</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Эхэлсэн:</div>
                    <div className="font-medium">2023-02-15</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Дуусах:</div>
                    <div className="font-medium">2023-05-15</div>
                  </div>
                  
                  <div className="pt-2">
                    <CustomButton
                      variant="outline"
                      icon={<FileEdit className="h-4 w-4" />}
                      onClick={() => navigate('/student/reports/my')}
                      className="w-full justify-center text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Дэлгэрэнгүй
                    </CustomButton>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Ойрын хугацаанууд */}
          <Card 
            title="Ойрын хугацаанууд" 
            className="border border-gray-100 shadow-sm"
          >
            <div className="p-4">
              {loading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : stats.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                <List
                  dataSource={stats.upcomingDeadlines}
                  renderItem={deadline => (
                    <List.Item className="px-0 border-b last:border-0">
                      <div className="w-full p-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            status="warning" 
                            className="w-2.5 h-2.5 animate-pulse" 
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{deadline.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Дуусах хугацаа: {deadline.dueDate}
                            </div>
                          </div>
                          <Tag color="warning">Удахгүй</Tag>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex justify-center items-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <AlertTriangle className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Ойрын хугацаанд хийх зүйл алга</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Хурдан үйлдлүүд */}
          <Card title="Хурдан үйлдлүүд" className="border border-gray-100 shadow-sm">
            <div className="p-4 space-y-3">
              <CustomButton
                variant="outline"
                size="sm"
                icon={<ListChecks className="h-4 w-4" />}
                onClick={() => navigate('/student/reports/my')}
                className="w-full justify-start text-left"
              >
                Миний тайлангууд
              </CustomButton>
              
              <CustomButton
                variant="outline"
                size="sm"
                icon={<Clock className="h-4 w-4" />}
                onClick={() => navigate('/student/tasks')}
                className="w-full justify-start text-left"
              >
                Даалгавар шалгах
              </CustomButton>
              
              <CustomButton
                variant="primary"
                size="sm"
                icon={<FileEdit className="h-4 w-4" />}
                onClick={() => navigate('/student/apply-internship')}
                className="w-full bg-green-600 hover:bg-green-700 text-white justify-start text-left"
              >
                Дадлага бүртгүүлэх
              </CustomButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;