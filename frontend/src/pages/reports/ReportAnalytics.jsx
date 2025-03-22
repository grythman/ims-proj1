import React, { useState, useEffect } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Calendar, Clock, CheckCircle, XCircle, FileText, BarChart2, PieChart, Download, RefreshCw } from 'lucide-react';
import { Table, Select, DatePicker, Spin, Empty, Tabs, Tag, message, Tooltip, Divider, Progress, Segmented } from 'antd';
import api from '../../services/api';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  ArcElement,
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

// Chart.js компонентуудыг бүртгэх
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Мок дата - тайлангуудын статистик
const mockAnalyticsData = {
  overview: {
    total_reports: 157,
    pending_reports: 23,
    approved_reports: 124,
    rejected_reports: 10,
    percentage_approved: 78.9,
    average_review_time: 2.3, // days
    weekly_reports: 95,
    monthly_reports: 42,
    final_reports: 20
  },
  by_week: [
    { week: '2023-W32', total: 12, pending: 0, approved: 11, rejected: 1 },
    { week: '2023-W33', total: 15, pending: 0, approved: 13, rejected: 2 },
    { week: '2023-W34', total: 18, pending: 0, approved: 17, rejected: 1 },
    { week: '2023-W35', total: 14, pending: 1, approved: 12, rejected: 1 },
    { week: '2023-W36', total: 16, pending: 0, approved: 15, rejected: 1 },
    { week: '2023-W37', total: 19, pending: 2, approved: 16, rejected: 1 },
    { week: '2023-W38', total: 17, pending: 4, approved: 12, rejected: 1 },
    { week: '2023-W39', total: 21, pending: 16, approved: 5, rejected: 0 }
  ],
  by_type: [
    { type: 'weekly', total: 95, pending: 14, approved: 75, rejected: 6 },
    { type: 'monthly', total: 42, pending: 7, approved: 32, rejected: 3 },
    { type: 'final', total: 20, pending: 2, approved: 17, rejected: 1 }
  ],
  recent_reports: [
    { id: 1, title: 'Долоо хоногийн тайлан #8 - Нэгдсэн тестүүд', report_type: 'weekly', status: 'pending', created_at: '2023-09-28', created_by_name: 'Бат-Эрдэнэ Д.', comments_count: 2 },
    { id: 2, title: 'Сарын тайлан #2 - API хөгжүүлэлт', report_type: 'monthly', status: 'approved', created_at: '2023-09-27', created_by_name: 'Тэмүүлэн Н.', comments_count: 5 },
    { id: 3, title: 'Долоо хоногийн тайлан #8 - UI дизайн', report_type: 'weekly', status: 'approved', created_at: '2023-09-27', created_by_name: 'Анхбаяр Т.', comments_count: 3 },
    { id: 4, title: 'Долоо хоногийн тайлан #8 - CI/CD', report_type: 'weekly', status: 'rejected', created_at: '2023-09-26', created_by_name: 'Дэлгэрмаа С.', comments_count: 4 },
    { id: 5, title: 'Долоо хоногийн тайлан #7 - Database Optimization', report_type: 'weekly', status: 'approved', created_at: '2023-09-25', created_by_name: 'Ганбаатар М.', comments_count: 1 }
  ],
  by_student: [
    { id: 1, name: 'Бат-Эрдэнэ Д.', total: 12, pending: 1, approved: 10, rejected: 1, avg_review_time: 1.8, avg_comments: 3.5 },
    { id: 2, name: 'Тэмүүлэн Н.', total: 10, pending: 0, approved: 9, rejected: 1, avg_review_time: 2.2, avg_comments: 4.1 },
    { id: 3, name: 'Анхбаяр Т.', total: 11, pending: 2, approved: 9, rejected: 0, avg_review_time: 2.5, avg_comments: 2.8 },
    { id: 4, name: 'Дэлгэрмаа С.', total: 9, pending: 1, approved: 7, rejected: 1, avg_review_time: 3.1, avg_comments: 2.2 },
    { id: 5, name: 'Ганбаатар М.', total: 10, pending: 0, approved: 8, rejected: 2, avg_review_time: 1.9, avg_comments: 3.7 }
  ]
};

const ReportAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(3, 'month'), dayjs()]);
  const [reportTypes, setReportTypes] = useState(['weekly', 'monthly', 'final']);
  const [statuses, setStatuses] = useState(['pending', 'approved', 'rejected']);
  const [viewMode, setViewMode] = useState('weekly');
  const [topStudents, setTopStudents] = useState(5);
  const [chartType, setChartType] = useState('bar');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, reportTypes, statuses]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // API-аас өгөгдөл авах үйлдэл
        /* const response = await api.get('/api/v1/reports/analytics/', {
          params: {
            start_date: dateRange[0]?.format('YYYY-MM-DD'),
            end_date: dateRange[1]?.format('YYYY-MM-DD'),
            report_types: reportTypes.join(','),
            statuses: statuses.join(',')
          }
        }); */
        
        // Мок дата ашиглах
        await new Promise(resolve => setTimeout(resolve, 1000)); // Хүсэлт илгээж буй дуурайлт
        setAnalyticsData(mockAnalyticsData);
      } catch (err) {
        console.error('API-аас өгөгдөл авах үед алдаа гарлаа:', err);
        
        // Мок дата ашиглах
        setAnalyticsData(mockAnalyticsData);
      }
    } catch (err) {
      console.error('Статистик өгөгдөл авахад алдаа гарлаа:', err);
      setError(err.message || 'Статистик өгөгдөл авахад алдаа гарлаа');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  const getStatusTag = (status) => {
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

  const getReportTypeTag = (type) => {
    switch (type) {
      case 'weekly':
        return <Tag color="blue">Долоо хоногийн</Tag>;
      case 'monthly':
        return <Tag color="purple">Сарын</Tag>;
      case 'final':
        return <Tag color="green">Эцсийн</Tag>;
      default:
        return <Tag color="default">Тодорхойгүй</Tag>;
    }
  };

  // Bar Chart өгөгдөл
  const getBarChartData = () => {
    const labels = analyticsData.by_week.map(item => {
      const weekNumber = item.week.split('-W')[1];
      return `${weekNumber}-р 7 хоног`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Нийт',
          data: analyticsData.by_week.map(item => item.total),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Баталгаажсан',
          data: analyticsData.by_week.map(item => item.approved),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        },
        {
          label: 'Хүлээгдэж буй',
          data: analyticsData.by_week.map(item => item.pending),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgb(255, 206, 86)',
          borderWidth: 1
        },
        {
          label: 'Татгалзсан',
          data: analyticsData.by_week.map(item => item.rejected),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    };
  };

  // Pie Chart өгөгдөл
  const getPieChartData = () => {
    return {
      labels: ['Долоо хоногийн', 'Сарын', 'Эцсийн'],
      datasets: [
        {
          data: [
            analyticsData.overview.weekly_reports,
            analyticsData.overview.monthly_reports,
            analyticsData.overview.final_reports
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(75, 192, 192)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Line Chart өгөгдөл
  const getLineChartData = () => {
    const labels = analyticsData.by_week.map(item => {
      const weekNumber = item.week.split('-W')[1];
      return `${weekNumber}-р 7 хоног`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Нийт тайлан',
          data: analyticsData.by_week.map(item => item.total),
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  // Status Pie Chart өгөгдөл
  const getStatusPieChartData = () => {
    return {
      labels: ['Хүлээгдэж буй', 'Баталгаажсан', 'Татгалзсан'],
      datasets: [
        {
          data: [
            analyticsData.overview.pending_reports,
            analyticsData.overview.approved_reports,
            analyticsData.overview.rejected_reports
          ],
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Chart.js тохиргоо
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Тайлангийн статистик',
        font: {
          size: 16
        }
      }
    }
  };

  // CSVLink-д зориулсан өгөгдөл бэлтгэх
  const getCSVData = () => {
    const csvData = [
      ['Огноо', 'Нийт тайлан', 'Хүлээгдэж буй', 'Баталгаажсан', 'Татгалзсан'],
      ...analyticsData.by_week.map(item => [
        item.week,
        item.total,
        item.pending,
        item.approved,
        item.rejected
      ])
    ];
    return csvData;
  };

  // Recent reports хүснэгт
  const recentReportsColumns = [
    {
      title: 'Гарчиг',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-blue-500 mr-2" />
          <a href={`/reports/${record.id}`} className="text-blue-600 hover:underline font-medium">
            {text}
          </a>
        </div>
      )
    },
    {
      title: 'Төрөл',
      dataIndex: 'report_type',
      key: 'report_type',
      render: type => getReportTypeTag(type),
      width: 140
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: status => getStatusTag(status),
      width: 150
    },
    {
      title: 'Илгээсэн огноо',
      dataIndex: 'created_at',
      key: 'created_at',
      render: date => (
        <span className="text-gray-600">
          {dayjs(date).format('YYYY-MM-DD')}
        </span>
      ),
      width: 150
    },
    {
      title: 'Оюутан',
      dataIndex: 'created_by_name',
      key: 'created_by_name',
      width: 150
    },
    {
      title: 'Сэтгэгдэл',
      dataIndex: 'comments_count',
      key: 'comments_count',
      render: count => (
        <Tag color="blue">{count}</Tag>
      ),
      width: 100
    }
  ];

  // Students statistics table
  const studentStatsColumns = [
    {
      title: 'Оюутны нэр',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a href={`/students/${record.id}`} className="text-blue-600 hover:underline font-medium">
          {text}
        </a>
      )
    },
    {
      title: 'Нийт тайлан',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      width: 120
    },
    {
      title: 'Баталгаажсан',
      dataIndex: 'approved',
      key: 'approved',
      render: (text, record) => (
        <div>
          <span className="mr-2">{text}</span>
          <Progress 
            percent={Math.round((record.approved / record.total) * 100)} 
            size="small" 
            status="success"
            showInfo={false}
            style={{ width: 80 }}
          />
        </div>
      ),
      width: 150
    },
    {
      title: 'Хүлээгдэж буй',
      dataIndex: 'pending',
      key: 'pending',
      render: text => (
        <Tag color="warning">{text}</Tag>
      ),
      width: 140
    },
    {
      title: 'Татгалзсан',
      dataIndex: 'rejected',
      key: 'rejected',
      render: text => (
        <Tag color="error">{text}</Tag>
      ),
      width: 140
    },
    {
      title: 'Дундаж шалгах хугацаа',
      dataIndex: 'avg_review_time',
      key: 'avg_review_time',
      render: days => `${days} өдөр`,
      sorter: (a, b) => a.avg_review_time - b.avg_review_time,
      width: 170
    },
    {
      title: 'Дундаж сэтгэгдэл',
      dataIndex: 'avg_comments',
      key: 'avg_comments',
      render: count => `${count.toFixed(1)}`,
      sorter: (a, b) => a.avg_comments - b.avg_comments,
      width: 150
    }
  ];

  if (loading && !analyticsData) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Empty
          description={error}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart2 className="h-6 w-6 mr-2 text-blue-500" />
            Тайлангийн статистик
          </h1>
          
          <div className="flex flex-col md:flex-row gap-3">
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
              allowClear={false}
              className="w-full md:w-auto"
            />
            
            <Select
              mode="multiple"
              value={reportTypes}
              onChange={setReportTypes}
              placeholder="Тайлангийн төрөл"
              maxTagCount="responsive"
              className="w-full md:w-52"
            >
              <Option value="weekly">Долоо хоногийн</Option>
              <Option value="monthly">Сарын</Option>
              <Option value="final">Эцсийн</Option>
            </Select>
            
            <Select
              mode="multiple"
              value={statuses}
              onChange={setStatuses}
              placeholder="Статус"
              maxTagCount="responsive"
              className="w-full md:w-52"
            >
              <Option value="pending">Хүлээгдэж буй</Option>
              <Option value="approved">Баталгаажсан</Option>
              <Option value="rejected">Татгалзсан</Option>
            </Select>
            
            <Tooltip title="Шинэчлэх">
              <Button
                variant="outline"
                onClick={refreshData}
                className="h-[32px] px-3"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </Tooltip>
            
            <CSVLink
              data={getCSVData()}
              filename={`reports-analytics-${dateRange[0]?.format('YYYY-MM-DD')}-${dateRange[1]?.format('YYYY-MM-DD')}.csv`}
              className="h-[32px] px-3 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV татах
            </CSVLink>
          </div>
        </div>
      </div>
      
      {analyticsData && (
        <>
          {/* Overview statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Нийт тайлан</p>
                  <h3 className="text-3xl font-bold">{analyticsData.overview.total_reports}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-full">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Сүүлийн {dateRange && dateRange[0] && dateRange[1] ? 
                  dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day') : 90} өдөр</span>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Баталгаажсан</p>
                  <h3 className="text-3xl font-bold">{analyticsData.overview.approved_reports}</h3>
                </div>
                <div className="p-2 bg-green-50 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  percent={analyticsData.overview.percentage_approved} 
                  size="small" 
                  status="success"
                  format={percent => `${percent.toFixed(1)}%`}
                />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Хүлээгдэж буй</p>
                  <h3 className="text-3xl font-bold">{analyticsData.overview.pending_reports}</h3>
                </div>
                <div className="p-2 bg-yellow-50 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  percent={(analyticsData.overview.pending_reports / analyticsData.overview.total_reports) * 100} 
                  size="small" 
                  status="normal"
                  format={percent => `${percent.toFixed(1)}%`}
                />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Дундаж шалгах хугацаа</p>
                  <h3 className="text-3xl font-bold">{analyticsData.overview.average_review_time}</h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-full">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <span>өдөр</span>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Chart - Report types */}
            <Card className="lg:col-span-2">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Тайлангийн статистик</h3>
                  <div className="flex gap-2">
                    <Segmented
                      options={[
                        { value: 'weekly', label: '7 хоногоор' },
                        { value: 'monthly', label: 'Сараар' }
                      ]}
                      value={viewMode}
                      onChange={setViewMode}
                      size="small"
                    />
                    <Segmented
                      options={[
                        { value: 'bar', label: 'Bar' },
                        { value: 'line', label: 'Line' }
                      ]}
                      value={chartType}
                      onChange={setChartType}
                      size="small"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div style={{ height: '300px' }}>
                  {chartType === 'bar' ? (
                    <Bar 
                      data={getBarChartData()} 
                      options={chartOptions} 
                    />
                  ) : (
                    <Line 
                      data={getLineChartData()} 
                      options={chartOptions} 
                    />
                  )}
                </div>
              </div>
            </Card>
            
            {/* Pie charts */}
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">Тайлангийн төрөл ба статус</h3>
              </div>
              <div className="p-4">
                <div style={{ height: '150px' }} className="mb-4">
                  <Pie 
                    data={getPieChartData()} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          ...chartOptions.plugins.title,
                          text: 'Тайлангийн төрөл'
                        }
                      }
                    }} 
                  />
                </div>
                <Divider />
                <div style={{ height: '150px' }}>
                  <Pie 
                    data={getStatusPieChartData()} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          ...chartOptions.plugins.title,
                          text: 'Тайлангийн статус'
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </Card>
          </div>
          
          <Tabs defaultActiveKey="recent_reports" className="bg-white rounded-lg shadow">
            <TabPane tab="Сүүлийн тайлангууд" key="recent_reports">
              <div className="p-4">
                <Table 
                  columns={recentReportsColumns} 
                  dataSource={analyticsData.recent_reports} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </div>
            </TabPane>
            
            <TabPane tab="Оюутнуудын статистик" key="student_stats">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Оюутнуудын тайлангийн статистик</h3>
                  <Select
                    value={topStudents}
                    onChange={setTopStudents}
                    className="w-48"
                  >
                    <Option value={5}>Топ 5 оюутан</Option>
                    <Option value={10}>Топ 10 оюутан</Option>
                    <Option value={20}>Топ 20 оюутан</Option>
                    <Option value={0}>Бүх оюутан</Option>
                  </Select>
                </div>
                <Table 
                  columns={studentStatsColumns} 
                  dataSource={topStudents > 0 ? analyticsData.by_student.slice(0, topStudents) : analyticsData.by_student} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </div>
            </TabPane>
            
            <TabPane tab="Тайлангийн төрлөөр" key="report_types">
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {analyticsData.by_type.map(typeData => (
                    <Card key={typeData.type} className="p-4">
                      <h3 className="text-lg font-medium flex items-center mb-3">
                        {getReportTypeTag(typeData.type)}
                        <span className="ml-2">
                          {typeData.type === 'weekly' ? 'Долоо хоногийн тайлан' : 
                           typeData.type === 'monthly' ? 'Сарын тайлан' : 'Эцсийн тайлан'}
                        </span>
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Нийт:</span>
                          <span className="font-medium">{typeData.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Баталгаажсан:</span>
                          <span className="text-green-600 font-medium">{typeData.approved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Хүлээгдэж буй:</span>
                          <span className="text-yellow-600 font-medium">{typeData.pending}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Татгалзсан:</span>
                          <span className="text-red-600 font-medium">{typeData.rejected}</span>
                        </div>
                      </div>
                      
                      <Divider className="my-3" />
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Баталгаажсан хувь:</p>
                        <Progress 
                          percent={Math.round((typeData.approved / typeData.total) * 100)} 
                          status="success"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ReportAnalytics; 