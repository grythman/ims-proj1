import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/UI/Card';
import { Badge, Rate, Avatar, Collapse, Tooltip, Table, Skeleton } from 'antd';
import { User, Calendar, ClipboardList, Book, Star } from 'lucide-react';
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
        // API-аас үнэлгээний мэдээлэл авах
        const response = await api.get('/api/student/evaluations/mentor');
        setEvaluationData(response.data);
      } catch (error) {
        console.error('Үнэлгээний мэдээлэл авахад алдаа гарлаа:', error);
        setError('Менторын үнэлгээний мэдээлэл авахад алдаа гарлаа');
        
        // Туршилтын өгөгдөл
        setEvaluationData({
          mentor: {
            name: 'Батбаяр Дорж',
            position: 'Ахлах хөгжүүлэгч',
            organization: 'Монгол Апп ХХК',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          },
          latestEvaluation: {
            date: '2023-04-15',
            overallScore: 4.2,
            comment: 'Бат сүүлийн сард сайн ажиллаж байна. Техникийн ур чадвар сайжирч байгаа боловч харилцааны ур чадварыг хөгжүүлэх хэрэгтэй.',
            scores: {
              attendance: 4.5,
              technical: 4.0,
              teamwork: 3.8,
              communication: 3.5,
              problemSolving: 4.2,
            }
          },
          evaluationHistory: [
            {
              id: 1,
              date: '2023-04-15',
              overallScore: 4.2,
              comment: 'Бат сүүлийн сард сайн ажиллаж байна. Техникийн ур чадвар сайжирч байгаа боловч харилцааны ур чадварыг хөгжүүлэх хэрэгтэй.',
              scores: {
                attendance: 4.5,
                technical: 4.0,
                teamwork: 3.8,
                communication: 3.5,
                problemSolving: 4.2,
              }
            },
            {
              id: 2,
              date: '2023-03-15',
              overallScore: 3.8,
              comment: 'Тасралтгүй сайжирч байна. Багийн гишүүдтэй илүү идэвхтэй харилцаж, хурлуудад оролцохыг зөвлөж байна.',
              scores: {
                attendance: 4.0,
                technical: 3.8,
                teamwork: 3.5,
                communication: 3.2,
                problemSolving: 3.9,
              }
            },
            {
              id: 3,
              date: '2023-02-15',
              overallScore: 3.5,
              comment: 'Эхний сарын гүйцэтгэл дунд зэрэг байна. Техникийн мэдлэг, ур чадвар сайн боловч цаг баримтлах, харилцааны ур чадварыг сайжруулах хэрэгтэй.',
              scores: {
                attendance: 3.5,
                technical: 3.8,
                teamwork: 3.2,
                communication: 3.0,
                problemSolving: 3.7,
              }
            }
          ],
          assignedTasks: [
            { id: 1, title: 'Нүүр хуудасны дизайн хөгжүүлэлт', status: 'completed', score: 5.0 },
            { id: 2, title: 'Бүртгэлийн хуудасны алдаа засварлах', status: 'completed', score: 4.0 },
            { id: 3, title: 'Мэдээллийн самбарын диаграм нэмэх', status: 'in-progress', score: null },
            { id: 4, title: 'Хэрэглэгчийн интерфэйсийн сайжруулалтууд', status: 'upcoming', score: null },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, []);

  if (error && !loading) {
    return (
      <ErrorState 
        title="Алдаа гарлаа" 
        subTitle={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const getScoreColor = (score) => {
    if (score >= 4.5) return '#52c41a'; // Маш сайн
    if (score >= 4.0) return '#1890ff'; // Сайн
    if (score >= 3.0) return '#faad14'; // Дунд
    return '#f5222d'; // Хангалтгүй
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

  const tasksColumns = [
    {
      title: 'Даалгаврын нэр',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Төлөв',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getTaskStatusTag(status),
    },
    {
      title: 'Үнэлгээ',
      dataIndex: 'score',
      key: 'score',
      render: (score) => score ? (
        <div style={{ color: getScoreColor(score) }}>
          {score.toFixed(1)} <Star className="inline-block h-4 w-4" />
        </div>
      ) : '—',
    },
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Зүүн талын контент (2 багана) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ерөнхий үнэлгээ */}
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Сүүлийн үнэлгээ</h2>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">{evaluationData.latestEvaluation.date}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">Нийт үнэлгээ:</span>
                  <span 
                    className="text-2xl font-bold" 
                    style={{ color: getScoreColor(evaluationData.latestEvaluation.overallScore) }}
                  >
                    {evaluationData.latestEvaluation.overallScore.toFixed(1)}
                  </span>
                  <span className="ml-2">
                    <Rate 
                      disabled 
                      allowHalf 
                      value={evaluationData.latestEvaluation.overallScore} 
                      className="text-sm"
                    />
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h3 className="text-md font-medium mb-2">Менторын тайлбар:</h3>
                  <p className="text-gray-600">{evaluationData.latestEvaluation.comment}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(evaluationData.latestEvaluation.scores).map(([key, score]) => (
                  <div key={key} className="bg-green-50 p-3 rounded-lg">
                    <p className="text-gray-500 text-sm capitalize mb-1">
                      {key === 'attendance' && 'Ирц'}
                      {key === 'technical' && 'Техникийн ур чадвар'}
                      {key === 'teamwork' && 'Багаар ажиллах'}
                      {key === 'communication' && 'Харилцаа'}
                      {key === 'problemSolving' && 'Асуудал шийдвэрлэх'}
                    </p>
                    <div className="flex items-center">
                      <span 
                        className="text-xl font-bold mr-2" 
                        style={{ color: getScoreColor(score) }}
                      >
                        {score.toFixed(1)}
                      </span>
                      <Rate disabled allowHalf value={score} className="text-xs" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Даалгаврууд */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Даалгаврууд</h2>
              <Table 
                dataSource={Array.isArray(evaluationData.assignedTasks) ? evaluationData.assignedTasks : []} 
                columns={tasksColumns} 
                rowKey="id"
                pagination={false}
              />
            </Card>

            {/* Үнэлгээний түүх */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Үнэлгээний түүх</h2>
              <Collapse>
                {evaluationData.evaluationHistory.map((evaluation) => (
                  <Panel 
                    key={evaluation.id} 
                    header={
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{evaluation.date}</span>
                        <span 
                          className="font-bold" 
                          style={{ color: getScoreColor(evaluation.overallScore) }}
                        >
                          {evaluation.overallScore.toFixed(1)} <Star className="inline-block h-4 w-4" />
                        </span>
                      </div>
                    }
                  >
                    <div className="mb-4">
                      <h3 className="text-md font-medium mb-2">Тайлбар:</h3>
                      <p className="text-gray-600">{evaluation.comment}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(evaluation.scores).map(([key, score]) => (
                        <div key={key} className="flex items-center">
                          <span className="text-gray-500 text-sm mr-2 capitalize">
                            {key === 'attendance' && 'Ирц:'}
                            {key === 'technical' && 'Техникийн ур чадвар:'}
                            {key === 'teamwork' && 'Багаар ажиллах:'}
                            {key === 'communication' && 'Харилцаа:'}
                            {key === 'problemSolving' && 'Асуудал шийдвэрлэх:'}
                          </span>
                          <span 
                            className="font-bold" 
                            style={{ color: getScoreColor(score) }}
                          >
                            {score.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                ))}
              </Collapse>
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