import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/UI/Card';
import { Rate, Avatar, Collapse, Tooltip, Progress, Skeleton } from 'antd';
import { User, Calendar, File, Check, XCircle, Star, Award } from 'lucide-react';
import ErrorState from '../../../components/UI/ErrorState';
import api from '../../../services/api';

const { Panel } = Collapse;

const TeacherEvaluation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        setLoading(true);
        // API-аас багшийн үнэлгээний мэдээлэл авах
        const response = await api.get('/api/student/evaluations/teacher');
        setEvaluationData(response.data);
      } catch (error) {
        console.error('Багшийн үнэлгээний мэдээлэл авахад алдаа гарлаа:', error);
        setError('Багшийн үнэлгээний мэдээлэл авахад алдаа гарлаа');
        
        // Туршилтын өгөгдөл
        setEvaluationData({
          teacher: {
            name: 'Б. Баярхүү',
            position: 'Дадлагын удирдагч',
            department: 'Програм хангамж, Мэдээллийн системийн тэнхим',
            avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
          },
          finalGrade: {
            letterGrade: 'A',
            percentage: 92,
            gpa: 4.0,
            comment: 'Оюутан дадлагын хугацаанд маш сайн ажилласан. Тавьсан зорилтуудыг амжилттай биелүүлж, дадлагын үр дүнгээр сайн тайлан гаргаж өгсөн. Цаашид мэргэжлийн чиглэлээр өсөж хөгжих боломжтой.',
          },
          criteria: [
            { 
              name: 'Дадлагын тайлан', 
              score: 35, 
              maxScore: 40,
              comment: 'Тайлан бүрэн гүйцэд, дэлгэрэнгүй бичигдсэн боловч зарим хэсэгт дүгнэлт хийх нь дутуу.'
            },
            { 
              name: 'Ирц, идэвх', 
              score: 18, 
              maxScore: 20,
              comment: 'Ирц сайн, төлөвлөсөн хуваариар ажилласан.'
            },
            { 
              name: 'Менторын үнэлгээ', 
              score: 24, 
              maxScore: 25,
              comment: 'Менторын өгсөн үнэлгээ маш өндөр. Зарим санал хүсэлтүүдийг тооцов.'
            },
            { 
              name: 'Бүтээлийн чанар', 
              score: 15, 
              maxScore: 15,
              comment: 'Дадлагын үеэр хийсэн бүтээл маш чанартай, бүрэн функционалтай.'
            }
          ],
          reportFeedback: [
            { 
              id: 1, 
              title: 'Дадлагын эцсийн тайлан', 
              date: '2023-05-10',
              status: 'approved',
              feedback: 'Маш сайн бичигдсэн тайлан. Дүгнэлт хэсгийг илүү дэлгэрэнгүй бичих боломжтой байсан.',
              score: 35,
              maxScore: 40 
            },
            { 
              id: 2, 
              title: 'Дундын тайлан', 
              date: '2023-03-20',
              status: 'approved',
              feedback: 'Дундын тайлан хангалттай сайн бичигдсэн. Техникийн хэсгийг илүү дэлгэрэнгүй тайлбарлах хэрэгтэй.',
              score: 18,
              maxScore: 20 
            },
            { 
              id: 3, 
              title: 'Эхний тайлан', 
              date: '2023-02-15',
              status: 'approved',
              feedback: 'Эхний тайлан сайн, дадлагын зорилго, зорилтууд тодорхой тусгагдсан.',
              score: 15,
              maxScore: 15 
            }
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

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A':
        return '#52c41a'; // Маш сайн
      case 'B':
        return '#1890ff'; // Сайн
      case 'C':
        return '#faad14'; // Дунд
      case 'D':
        return '#fa8c16'; // Хангалттай
      case 'F':
        return '#f5222d'; // Хангалтгүй
      default:
        return '#1890ff';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <Check className="text-green-600 h-5 w-5" />;
      case 'rejected':
        return <XCircle className="text-red-600 h-5 w-5" />;
      case 'pending':
        return <div className="h-5 w-5 bg-yellow-500 rounded-full animate-pulse"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Багшийн үнэлгээ</h1>
        <p className="text-gray-500">Дадлагын хөтөлбөрт таны багшийн өгсөн үнэлгээний мэдээлэл.</p>
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
            {/* Эцсийн үнэлгээ */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Эцсийн үнэлгээ</h2>

              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="flex flex-col items-center">
                    <div 
                      className="text-7xl font-bold mb-2" 
                      style={{ color: getGradeColor(evaluationData.finalGrade.letterGrade) }}
                    >
                      {evaluationData.finalGrade.letterGrade}
                    </div>
                    <div className="text-lg text-gray-600 mb-1">{evaluationData.finalGrade.percentage}%</div>
                    <div className="text-lg text-gray-600">GPA: {evaluationData.finalGrade.gpa.toFixed(1)}</div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-md font-medium mb-2">Багшийн тайлбар:</h3>
                    <p className="text-gray-600">{evaluationData.finalGrade.comment}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Award className="text-green-600 h-6 w-6 mr-2" />
                    <span className="text-green-600 font-medium">Дадлага амжилттай хийгдсэн</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Үнэлгээний үзүүлэлтүүд */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Үнэлгээний үзүүлэлтүүд</h2>
              
              <div className="space-y-6">
                {evaluationData.criteria.map((criterion, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{criterion.name}</div>
                      <div className="text-green-600 font-medium">
                        {criterion.score}/{criterion.maxScore} оноо
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <Progress 
                        percent={(criterion.score / criterion.maxScore) * 100} 
                        showInfo={false} 
                        strokeColor="#16a34a"
                      />
                    </div>
                    
                    {criterion.comment && (
                      <p className="text-sm text-gray-500">{criterion.comment}</p>
                    )}
                    
                    {index < evaluationData.criteria.length - 1 && (
                      <div className="border-b border-gray-100 my-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Тайлангийн санал дүгнэлтүүд */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Тайлангийн санал дүгнэлтүүд</h2>
              
              <Collapse>
                {evaluationData.reportFeedback.map(report => (
                  <Panel 
                    key={report.id} 
                    header={
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-medium">{report.title}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-3">{report.date}</span>
                          <div className="flex items-center">
                            {getStatusIcon(report.status)}
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1 text-gray-500">Санал дүгнэлт:</h3>
                        <p className="text-gray-600">{report.feedback}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1 text-gray-500">Оноо:</h3>
                        <div className="flex items-center">
                          <span 
                            className="text-lg font-bold mr-2" 
                            style={{ color: report.score > (report.maxScore * 0.8) ? '#52c41a' : '#faad14' }}
                          >
                            {report.score}/{report.maxScore}
                          </span>
                          <Progress 
                            percent={(report.score / report.maxScore) * 100} 
                            size="small"
                            strokeColor={report.score > (report.maxScore * 0.8) ? '#52c41a' : '#faad14'}
                            style={{ width: '120px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          </div>
          
          {/* Баруун талын контент */}
          <div className="space-y-6">
            {/* Багшийн мэдээлэл */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Багшийн мэдээлэл</h2>
              <div className="flex flex-col items-center mb-4">
                <Avatar 
                  size={80} 
                  src={evaluationData.teacher.avatar}
                  alt={evaluationData.teacher.name}
                />
                <h3 className="text-lg font-medium mt-4">{evaluationData.teacher.name}</h3>
                <p className="text-gray-500">{evaluationData.teacher.position}</p>
                <p className="text-gray-500 text-center">{evaluationData.teacher.department}</p>
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
                <Tooltip title="Уулзалт авах">
                  <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </Card>

            {/* Ерөнхий статистик */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Дүгнэлт</h2>
              
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="text-gray-600">Нийт оноо:</span>
                  <span className="font-medium text-green-600">
                    {evaluationData.criteria.reduce((total, item) => total + item.score, 0)}/
                    {evaluationData.criteria.reduce((total, item) => total + item.maxScore, 0)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-600">Кредит:</span>
                  <span className="font-medium text-green-600">3.0</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-600">Үсгэн үнэлгээ:</span>
                  <span 
                    className="font-bold text-lg"
                    style={{ color: getGradeColor(evaluationData.finalGrade.letterGrade) }}
                  >
                    {evaluationData.finalGrade.letterGrade}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-gray-600">Төлөв:</span>
                  <span className="font-medium text-green-600">Амжилттай</span>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Нийт үнэлгээ:</span>
                  <span className="text-lg font-medium text-green-600">{evaluationData.finalGrade.percentage}%</span>
                </div>
                <Progress 
                  percent={evaluationData.finalGrade.percentage} 
                  strokeColor="#16a34a"
                />
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Одоогоор үнэлгээний мэдээлэл байхгүй байна.</p>
          <p className="text-gray-500 mt-2">Дадлага дууссаны дараа багш таны дадлагын ажлыг үнэлэх болно.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherEvaluation; 