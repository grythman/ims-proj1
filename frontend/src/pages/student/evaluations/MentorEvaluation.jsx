import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/UI/Card';
import { Badge, Rate, Avatar, Collapse, Tooltip, Table, Skeleton, Progress, Tag } from 'antd';
import { User, Calendar, ClipboardList, Book } from 'lucide-react';
import ErrorState from '../../../components/UI/ErrorState';
import api from '../../../services/api';

const { Panel } = Collapse;

const MentorEvaluation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/internships/student/evaluations/mentor/');
        console.log('API Response:', response.data); // Debug log
        
        if (!response.data || !Array.isArray(response.data.data)) {
          setEvaluationData(null);
          return;
        }

        // Transform API data
        const evaluations = response.data.data;
        const latestEvaluation = evaluations[0];
        
        const transformedData = {
          mentor: latestEvaluation?.evaluator || {},
          latestEvaluation: latestEvaluation ? {
            date: latestEvaluation.created_at,
            overallScore: latestEvaluation.overall_score || 0,
            comment: latestEvaluation.comments,
            weekNumber: latestEvaluation.week_number,
            scores: latestEvaluation.scores?.reduce((acc, score) => {
              acc[score.criteria.toLowerCase()] = score.score;
              return acc;
            }, {}) || {}
          } : null,
          evaluationHistory: evaluations.map(evaluation => ({
            id: evaluation.id,
            date: evaluation.created_at,
            overallScore: evaluation.overall_score || 0,
            comment: evaluation.comments,
            weekNumber: evaluation.week_number,
            scores: evaluation.scores?.reduce((acc, score) => {
              acc[score.criteria.toLowerCase()] = score.score;
              return acc;
            }, {}) || {}
          })),
          skillRatings: latestEvaluation?.skill_ratings?.map(rating => ({
            name: rating.skill,
            rating: rating.score
          })) || [],
          assignedTasks: latestEvaluation?.tasks?.map(task => ({
            id: task.id,
            title: task.title,
            status: task.status,
            dueDate: task.due_date,
            score: task.score
          })) || []
        };

        setEvaluationData(transformedData);
      } catch (error) {
        console.error('Үнэлгээний мэдээлэл авахад алдаа гарлаа:', error);
        setError('Менторын үнэлгээний мэдээлэл авахад алдаа гарлаа. Дахин оролдоно уу.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, []);

  if (loading) {
    return (
      <Card>
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Алдаа гарлаа" 
        subTitle={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!evaluationData || !evaluationData.mentor) {
    return (
      <ErrorState 
        title="Мэдээлэл олдсонгүй" 
        subTitle="Менторын үнэлгээний мэдээлэл олдсонгүй"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const getScoreColor = (score) => {
    if (score >= 9) return '#52c41a';  // Маш сайн - ногоон
    if (score >= 7) return '#1890ff';  // Сайн - цэнхэр
    if (score >= 5) return '#faad14';  // Дундаж - шар
    if (score >= 3) return '#fa8c16';  // Сул - улбар шар
    return '#f5222d';                  // Муу - улаан
  };

  const getTaskStatusTag = (status) => {
    switch(status) {
      case 'completed':
        return <Badge status="success" text="Дууссан" />;
      case 'in-progress':
        return <Badge status="processing" text="Хийгдэж байгаа" />;
      case 'upcoming':
        return <Badge status="default" text="Удахгүй эхлэх" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
      case 'Гүйцэтгэсэн':
        return <Tag color="green">Гүйцэтгэсэн</Tag>;
      case 'in_progress':
      case 'Хийгдэж буй':
        return <Tag color="blue">Хийгдэж буй</Tag>;
      case 'pending':
      case 'Хүлээгдэж буй':
        return <Tag color="orange">Хүлээгдэж буй</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const tasksColumns = [
    {
      title: 'Даалгаврын нэр',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusIcon(status)
    },
    {
      title: 'Эцсийн хугацаа',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Үнэлгээ',
      dataIndex: 'score',
      key: 'score',
      render: (score) => score ? (
        <div style={{ color: getScoreColor(score) }}>
          {score.toFixed(1)}
        </div>
      ) : '—',
    },
  ];

  const getCategoryName = (key) => {
    const categoryNames = {
      attendance: 'Ирц',
      technical: 'Техникийн ур чадвар',
      teamwork: 'Багаар ажиллах',
      communication: 'Харилцаа',
      problemSolving: 'Асуудал шийдвэрлэх'
    };
    return categoryNames[key] || key;
  };

  const getProgressColor = (rating) => {
    if (rating >= 4.5) return '#52c41a'; // Маш сайн - ногоон
    if (rating >= 4.0) return '#1890ff'; // Сайн - цэнхэр
    if (rating >= 3.0) return '#faad14'; // Дундаж - шар
    if (rating >= 2.0) return '#fa8c16'; // Сул - улбар шар
    return '#f5222d';                    // Муу - улаан
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Менторын үнэлгээ</h1>
        <p className="text-gray-500">Дадлагын хөтөлбөрийн хүрээнд таны менторын өгсөн үнэлгээний мэдээлэл.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : evaluationData ? (
        <div className="flex flex-col-reverse md:flex-row md:space-x-4">
          <div className="md:w-2/3">
            <Card className="mb-6 p-6">
              <h2 className="text-xl font-semibold mb-4">Сүүлийн үнэлгээ</h2>
              {evaluationData.latestEvaluation ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-2">
                    <div className="mr-4">
                      <span className="text-5xl font-bold" style={{ color: getScoreColor(evaluationData.latestEvaluation.overallScore) }}>
                        {evaluationData.latestEvaluation.overallScore}/10
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Үнэлгээний огноо: {evaluationData.latestEvaluation.date}</p>
                      <p className="text-gray-600">Дадлагын {evaluationData.latestEvaluation.weekNumber}-р долоо хоног</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Дэлгэрэнгүй үнэлгээ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {evaluationData.latestEvaluation && evaluationData.latestEvaluation.scores && Object.entries(evaluationData.latestEvaluation.scores).map(([key, score]) => (
                        <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-700">{getCategoryName(key)}</span>
                          <span 
                            className="font-semibold" 
                            style={{ color: getScoreColor(score) }}
                          >
                            {score}/10
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Тайлбар & санал</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{evaluationData.latestEvaluation.comment}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Үнэлгээ одоогоор байхгүй байна</p>
                </div>
              )}
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-xl font-semibold mb-4">Чадварын үнэлгээ</h2>
              {evaluationData.skillRatings && evaluationData.skillRatings.length > 0 ? (
                <div className="space-y-4">
                  {evaluationData.skillRatings.map((skill, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700">{skill.name}</span>
                        <Rate disabled value={skill.rating} />
                      </div>
                      <Progress 
                        percent={skill.rating * 20} 
                        showInfo={false} 
                        strokeColor={getProgressColor(skill.rating)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Чадварын үнэлгээ одоогоор байхгүй байна</p>
                </div>
              )}
            </Card>

            <Card className="mb-6 p-6">
              <h2 className="text-xl font-semibold mb-4">Үнэлгээний түүх</h2>
              {evaluationData.evaluationHistory && evaluationData.evaluationHistory.length > 0 ? (
                <Collapse className="bg-white border-0">
                  {evaluationData.evaluationHistory.map((evaluation, index) => (
                    <Panel
                      key={index}
                      header={
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{evaluation.weekNumber}-р долоо хоног</span>
                            <span className="text-gray-500 text-sm">{evaluation.date}</span>
                          </div>
                          <span 
                            className="font-bold" 
                            style={{ color: getScoreColor(evaluation.overallScore) }}
                          >
                            {evaluation.overallScore}/10
                          </span>
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {evaluation.scores && Object.entries(evaluation.scores).map(([key, score]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="text-gray-700">{getCategoryName(key)}</span>
                              <span 
                                className="font-semibold" 
                                style={{ color: getScoreColor(score) }}
                              >
                                {score}/10
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{evaluation.comment}</p>
                        </div>
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Үнэлгээний түүх одоогоор байхгүй байна</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Гүйцэтгэсэн даалгаврууд</h2>
              {evaluationData.assignedTasks && evaluationData.assignedTasks.length > 0 ? (
                <Table 
                  dataSource={evaluationData.assignedTasks && Array.isArray(evaluationData.assignedTasks) ? evaluationData.assignedTasks : []} 
                  columns={tasksColumns} 
                  rowKey="id"
                  pagination={false}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Даалгаврын мэдээлэл одоогоор байхгүй байна</p>
                </div>
              )}
            </Card>
          </div>
          
          {/* Баруун талын контент */}
          <div className="space-y-6">
            {/* Менторын мэдээлэл */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Менторын мэдээлэл</h2>
              <div className="flex flex-col items-center mb-4">
                <Avatar 
                  size={80} 
                  src={evaluationData.mentor.avatar}
                  alt={evaluationData.mentor.name}
                />
                <h3 className="text-lg font-medium mt-4">{evaluationData.mentor.name}</h3>
                <p className="text-gray-500">{evaluationData.mentor.position}</p>
                <p className="text-gray-500">{evaluationData.mentor.organization}</p>
              </div>
              <div className="flex justify-center space-x-3 pt-4 border-t">
                <Tooltip title="Email">
                  <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </button>
                </Tooltip>
                <Tooltip title="Хуваарь харах">
                  <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </button>
                </Tooltip>
                <Tooltip title="Чат">
                  <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </Card>

            {/* Нэмэлт мэдээлэл */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Удахгүй болох үйл явдлууд</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-lg mr-4">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Дундын үнэлгээ</h3>
                    <p className="text-sm text-gray-500">2023-04-30</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-lg mr-4">
                    <ClipboardList className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Төслийн тайлангийн хугацаа</h3>
                    <p className="text-sm text-gray-500">2023-05-10</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-lg mr-4">
                    <Book className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Сургалт</h3>
                    <p className="text-sm text-gray-500">2023-05-15, 14:00</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Одоогоор үнэлгээний мэдээлэл байхгүй байна.</p>
          <p className="text-gray-500 mt-2">Ментор таныг үнэлсний дараа энд харагдах болно.</p>
        </div>
      )}
    </div>
  );
};

export default MentorEvaluation; 