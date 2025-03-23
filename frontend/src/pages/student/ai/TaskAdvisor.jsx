import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Tag, Button, Empty, Spin } from 'antd';
import { Calendar, Clock, CheckCircle, HelpCircle } from 'lucide-react';
import AIChat from '../../../components/AI/AIChat';
import api from '../../../services/api';

const { TabPane } = Tabs;

const TaskAdvisor = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/internships/tasks/', {
        params: { status: activeTab === 'upcoming' ? 'pending,in_progress' : 'all' }
      });
      setTasks(response.data || []);
    } catch (error) {
      console.error('Даалгаврууд ачааллахад алдаа гарлаа:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'Хүлээгдэж буй' },
      in_progress: { color: 'blue', text: 'Хийгдэж буй' },
      completed: { color: 'green', text: 'Дууссан' },
      cancelled: { color: 'red', text: 'Цуцлагдсан' }
    };
    
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority) => {
    const priorityConfig = {
      low: { color: 'green', text: 'Бага' },
      medium: { color: 'blue', text: 'Дунд' },
      high: { color: 'red', text: 'Өндөр' }
    };
    
    const config = priorityConfig[priority] || { color: 'default', text: priority };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Хугацаа хэтэрсэн';
    if (diffDays === 0) return 'Өнөөдөр дуусна';
    return `${diffDays} өдөр үлдсэн`;
  };

  const TasksList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="Даалгавар олдсонгүй" 
        />
      );
    }

    return (
      <List
        itemLayout="vertical"
        dataSource={tasks}
        renderItem={task => (
          <List.Item
            key={task.id}
            extra={
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 mb-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{getDaysLeft(task.due_date)}</span>
                </div>
                {getPriorityTag(task.priority)}
              </div>
            }
          >
            <List.Item.Meta
              title={
                <div className="flex items-center justify-between">
                  <span>{task.title}</span>
                  {getTaskStatusTag(task.status)}
                </div>
              }
              description={
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Хугацаа: {task.due_date}</span>
                </div>
              }
            />
            <p className="text-gray-600">{task.description}</p>
          </List.Item>
        )}
      />
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Даалгавар зөвлөгч</h1>
        <p className="text-gray-500">
          AI туслахын тусламжтайгаар даалгавраа үр дүнтэй төлөвлөж, гүйцэтгэнэ үү
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Tasks */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <Tabs activeKey={activeTab} onChange={handleTabChange}>
              <TabPane
                tab={
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Удахгүй дуусах
                  </span>
                }
                key="upcoming"
              >
                <TasksList />
              </TabPane>
              <TabPane
                tab={
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Бүх даалгавар
                  </span>
                }
                key="all"
              >
                <TasksList />
              </TabPane>
            </Tabs>
          </Card>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-12rem)]">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h2 className="text-lg font-medium">Даалгаврын зөвлөгөө</h2>
                <p className="text-sm text-gray-500">
                  Даалгавартай холбоотой асуултаа бичиж, AI туслахаас зөвлөгөө авна уу
                </p>
              </div>
              
              <div className="flex-1">
                <AIChat
                  role="student"
                  context={{
                    type: 'task_advisor',
                    tasks: tasks
                  }}
                  placeholder="Жишээ нь: Өндөр ач холбогдолтой даалгаврыг эхлүүлэхэд туслаач"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskAdvisor; 