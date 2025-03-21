import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Tabs, Spin, Alert } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  ApartmentOutlined,
  BarChartOutlined 
} from '@ant-design/icons';
import { analyticsService } from '../../services/analyticsApi';
import ChartCard from '../../components/Analytics/ChartCard';
import StatisticsCard from '../../components/Analytics/StatisticsCard';
import PageHeader from '../../components/UI/PageHeader';

const { TabPane } = Tabs;

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Аналитик мэдээлэл
  const [overviewData, setOverviewData] = useState(null);
  const [internshipData, setInternshipData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);
  const [userData, setUserData] = useState(null);

  // Дүн мэдээлэл ачаалах - useCallback ашиглаж хөндлөнгийн шинэчлэлтүүдээс хамгаална
  const fetchData = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    
    try {
      switch (tab) {
        case 'overview':
          if (!overviewData) {
            const data = await analyticsService.getOverview();
            setOverviewData(data);
          }
          break;
        case 'internships':
          if (!internshipData) {
            const data = await analyticsService.getInternshipAnalytics();
            setInternshipData(data);
          }
          break;
        case 'reports':
          if (!reportData) {
            const data = await analyticsService.getReportAnalytics();
            setReportData(data);
          }
          break;
        case 'evaluations':
          if (!evaluationData) {
            const data = await analyticsService.getEvaluationAnalytics();
            setEvaluationData(data);
          }
          break;
        case 'users':
          if (!userData) {
            const data = await analyticsService.getUserAnalytics();
            setUserData(data);
          }
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Аналитик мэдээлэл ачаалахад алдаа гарлаа');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  }, [overviewData, internshipData, reportData, evaluationData, userData]);

  // Таб солигдох үед 
  const handleTabChange = (key) => {
    setActiveTab(key);
    fetchData(key);
  };

  // Анх дуудагдах үед
  useEffect(() => {
    fetchData('overview');
  }, [fetchData]);

  // Ерөнхий хяналтын таб
  const renderOverviewTab = () => {
    if (!overviewData) return <Spin size="large" />;

    return (
      <>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatisticsCard
              title="Нийт оюутан"
              value={overviewData.users.total_students}
              icon={UserOutlined}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatisticsCard
              title="Нийт ментор"
              value={overviewData.users.total_mentors}
              icon={UserOutlined}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatisticsCard
              title="Нийт дадлага"
              value={overviewData.internships.total}
              icon={ApartmentOutlined}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <StatisticsCard
              title="Идэвхтэй дадлага"
              value={overviewData.internships.active}
              icon={ApartmentOutlined}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} sm={12} md={8}>
            <StatisticsCard
              title="Дадлага дуусах хувь"
              value={`${overviewData.internships.completion_rate}%`}
              icon={CheckCircleOutlined}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <StatisticsCard
              title="Нийт тайлан"
              value={overviewData.reports.total}
              icon={FileTextOutlined}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <StatisticsCard
              title="Хүлээгдэж буй тайлан"
              value={overviewData.reports.pending}
              icon={FileTextOutlined}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} md={8}>
            <StatisticsCard
              title="Гүйцэтгэлийн дундаж"
              value={`${overviewData.scores.performance} / 5`}
              icon={BarChartOutlined}
            />
          </Col>
          <Col xs={24} md={8}>
            <StatisticsCard
              title="Ирцийн дундаж"
              value={`${overviewData.scores.attendance} / 5`}
              icon={BarChartOutlined}
            />
          </Col>
          <Col xs={24} md={8}>
            <StatisticsCard
              title="Санаачлагын дундаж"
              value={`${overviewData.scores.initiative} / 5`}
              icon={BarChartOutlined}
            />
          </Col>
        </Row>
      </>
    );
  };

  // Дадлагын аналитик таб
  const renderInternshipsTab = () => {
    if (!internshipData) return <Spin size="large" />;

    const statusData = Object.entries(internshipData.by_status).map(([key, value]) => ({
      name: key === 'active' ? 'Идэвхтэй' : 
            key === 'completed' ? 'Дууссан' : 
            key === 'pending' ? 'Хүлээгдэж буй' : key,
      value
    }));

    return (
      <>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <StatisticsCard
              title="Дадлагын дундаж хугацаа"
              value={`${internshipData.avg_duration} хоног`}
              icon={ApartmentOutlined}
            />
          </Col>
          {Object.entries(internshipData.by_status).map(([status, count]) => (
            <Col xs={24} sm={12} lg={8} key={status}>
              <StatisticsCard
                title={`${status === 'active' ? 'Идэвхтэй' : 
                        status === 'completed' ? 'Дууссан' : 
                        status === 'pending' ? 'Хүлээгдэж буй' : status} дадлага`}
                value={count}
                icon={ApartmentOutlined}
              />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <ChartCard
              title="Сараар дадлага"
              description="Сараар үүсгэсэн дадлагын тоо"
              data={internshipData.by_month}
              type="line"
              dataKey="count"
            />
          </Col>
          <Col xs={24} lg={12}>
            <ChartCard
              title="Дадлагын төлөв"
              description="Дадлагын төлөвийн харьцаа"
              data={statusData}
              type="bar"
              dataKey="value"
              categories={['value']}
            />
          </Col>
        </Row>
      </>
    );
  };

  // Тайлангийн аналитик таб
  const renderReportsTab = () => {
    if (!reportData) return <Spin size="large" />;

    const statusData = Object.entries(reportData.by_status).map(([key, value]) => ({
      name: key === 'pending' ? 'Хүлээгдэж буй' : 
            key === 'approved' ? 'Батлагдсан' : 
            key === 'rejected' ? 'Татгалзсан' : key,
      value
    }));

    return (
      <>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticsCard
              title="Хянах дундаж хугацаа"
              value={`${reportData.avg_review_time} хоног`}
              icon={FileTextOutlined}
            />
          </Col>
          {Object.entries(reportData.by_status).map(([status, count]) => (
            <Col xs={24} sm={12} lg={6} key={status}>
              <StatisticsCard
                title={`${status === 'pending' ? 'Хүлээгдэж буй' : 
                        status === 'approved' ? 'Батлагдсан' : 
                        status === 'rejected' ? 'Татгалзсан' : status} тайлан`}
                value={count}
                icon={FileTextOutlined}
              />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <ChartCard
              title="Сараар тайлан"
              description="Сараар оруулсан тайлангийн тоо"
              data={reportData.by_month}
              type="line"
              dataKey="count"
            />
          </Col>
          <Col xs={24} lg={12}>
            <ChartCard
              title="Тайлангийн төлөв"
              description="Тайлангийн төлөвийн харьцаа"
              data={statusData}
              type="bar"
              dataKey="value"
              categories={['value']}
            />
          </Col>
        </Row>
      </>
    );
  };

  // Үнэлгээний аналитик таб
  const renderEvaluationsTab = () => {
    if (!evaluationData) return <Spin size="large" />;

    const scoreData = Object.entries(evaluationData.avg_scores).map(([key, value]) => ({
      name: key,
      value
    }));

    return (
      <>
        <Row gutter={[16, 16]}>
          {Object.entries(evaluationData.by_type).map(([type, count]) => (
            <Col xs={24} sm={12} lg={8} key={type}>
              <StatisticsCard
                title={`${type === 'mentor' ? 'Менторын' : 
                        type === 'supervisor' ? 'Удирдагчийн' : type} үнэлгээ`}
                value={count}
                icon={CheckCircleOutlined}
              />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <ChartCard
              title="Сараар үнэлгээ"
              description="Сараар хийсэн үнэлгээний тоо"
              data={evaluationData.by_month}
              type="line"
              dataKey="count"
            />
          </Col>
          <Col xs={24} lg={12}>
            <ChartCard
              title="Үнэлгээний дундаж"
              description="Шалгуур бүрийн дундаж үнэлгээ"
              data={scoreData}
              type="bar"
              dataKey="value"
              categories={['value']}
            />
          </Col>
        </Row>
      </>
    );
  };

  // Хэрэглэгчийн аналитик таб
  const renderUsersTab = () => {
    if (!userData) return <Spin size="large" />;

    const typeData = Object.entries(userData.by_type).map(([key, value]) => ({
      name: key === 'student' ? 'Оюутан' : 
            key === 'mentor' ? 'Ментор' : 
            key === 'admin' ? 'Админ' : key,
      value
    }));

    return (
      <>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticsCard
              title="Нийт хэрэглэгч"
              value={userData.total_users}
              icon={UserOutlined}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticsCard
              title="Идэвхтэй хэрэглэгч"
              value={userData.active_users}
              description="Сүүлийн 30 хоногт нэвтэрсэн"
              icon={UserOutlined}
            />
          </Col>
          {Object.entries(userData.by_type).map(([type, count]) => (
            <Col xs={24} sm={12} lg={6} key={type}>
              <StatisticsCard
                title={`${type === 'student' ? 'Оюутан' : 
                        type === 'mentor' ? 'Ментор' : 
                        type === 'admin' ? 'Админ' : type}`}
                value={count}
                icon={UserOutlined}
              />
            </Col>
          )).slice(0, 2)}
        </Row>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <ChartCard
              title="Сараар бүртгэл"
              description="Сараар нэмэгдсэн хэрэглэгчийн тоо"
              data={userData.by_month}
              type="line"
              dataKey="count"
            />
          </Col>
          <Col xs={24} lg={12}>
            <ChartCard
              title="Хэрэглэгчийн төрөл"
              description="Хэрэглэгчийн төрлийн харьцаа"
              data={typeData}
              type="bar"
              dataKey="value"
              categories={['value']}
            />
          </Col>
        </Row>
      </>
    );
  };

  return (
    <div>
      <PageHeader
        title="Аналитик"
        subtitle="Дадлагын систем дэх статистик мэдээлэл болон аналитик"
      />

      {error && (
        <Alert
          message="Алдаа гарлаа"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        className="analytics-tabs"
        loading={loading && !overviewData && !internshipData && !reportData && !evaluationData && !userData}
      >
        <TabPane tab="Ерөнхий" key="overview">
          {loading && !overviewData ? <Spin size="large" /> : renderOverviewTab()}
        </TabPane>
        <TabPane tab="Дадлага" key="internships">
          {loading && !internshipData ? <Spin size="large" /> : renderInternshipsTab()}
        </TabPane>
        <TabPane tab="Тайлан" key="reports">
          {loading && !reportData ? <Spin size="large" /> : renderReportsTab()}
        </TabPane>
        <TabPane tab="Үнэлгээ" key="evaluations">
          {loading && !evaluationData ? <Spin size="large" /> : renderEvaluationsTab()}
        </TabPane>
        <TabPane tab="Хэрэглэгч" key="users">
          {loading && !userData ? <Spin size="large" /> : renderUsersTab()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage; 