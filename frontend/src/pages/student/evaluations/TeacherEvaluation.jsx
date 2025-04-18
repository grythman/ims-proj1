import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/UI/Card';
import { Rate, Avatar, Collapse, Tooltip, Progress, Skeleton, Tag } from 'antd';
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
        const response = await api.get('/api/v1/internships/student/evaluations/teacher/');
        
        if (response.data) {
          setEvaluationData(response.data);
        } else {
          throw new Error('No data received from server');
        }
      } catch (error) {
        console.error('Багшийн үнэлгээний мэдээлэл авахад алдаа гарлаа:', error);
        setError('Багшийн үнэлгээний мэдээлэл авахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <Skeleton active paragraph={{ rows: 1 }} />
        </div>
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
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

  if (!evaluationData || !evaluationData.finalGrade) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Багшийн үнэлгээ</h1>
          <p className="text-gray-500">Одоогоор багшийн үнэлгээ байхгүй байна.</p>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A':
        return '#52c41a';
      case 'B':
        return '#1890ff';
      case 'C':
        return '#faad14';
      case 'D':
        return '#fa8c16';
      case 'F':
        return '#f5222d';
      default:
        return '#1890ff';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
      case 'Хянагдсан':
        return <Tag color="green">Хянагдсан</Tag>;
      case 'pending':
      case 'Хүлээгдэж буй':
        return <Tag color="orange">Хүлээгдэж буй</Tag>;
      case 'rejected':
      case 'Татгалзсан':
        return <Tag color="red">Татгалзсан</Tag>;
      default:
        return <Tag color="blue">{status}</Tag>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Багшийн үнэлгээ</h1>
        <p className="text-gray-500">Дадлагын хөтөлбөрт таны багшийн өгсөн үнэлгээний мэдээлэл.</p>
      </div>

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
          {evaluationData.criteria && evaluationData.criteria.length > 0 && (
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
          )}

          {/* Тайлангийн санал дүгнэлтүүд */}
          {evaluationData.reports && evaluationData.reports.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Тайлангийн санал дүгнэлтүүд</h2>
              
              <Collapse>
                {evaluationData.reports.map(report => (
                  <Panel 
                    key={report.id} 
                    header={
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-medium">{report.title}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-3">{report.submittedDate}</span>
                          {getStatusIcon(report.status)}
                        </div>
                      </div>
                    }
                  >
                    <div className="p-4">
                      <p className="text-gray-600 mb-4">{report.content}</p>
                      {report.feedback && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Багшийн санал:</h4>
                          <p className="text-gray-600">{report.feedback}</p>
                        </div>
                      )}
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          )}
        </div>

        {/* Баруун талын контент (1 багана) */}
        <div className="space-y-6">
          {/* Багшийн мэдээлэл */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Багшийн мэдээлэл</h2>
            
            <div className="flex items-center mb-6">
              <Avatar 
                size={64} 
                src={evaluationData.teacher_avatar || "https://randomuser.me/api/portraits/men/62.jpg"} 
                icon={<User />} 
              />
              <div className="ml-4">
                <h3 className="font-medium text-lg">{evaluationData.teacher_name}</h3>
                <p className="text-gray-500">{evaluationData.teacher_position}</p>
                <p className="text-gray-500">{evaluationData.teacher_department}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherEvaluation; 