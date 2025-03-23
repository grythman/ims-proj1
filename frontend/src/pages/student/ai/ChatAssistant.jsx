import React, { useState } from 'react';
import { Card, Tabs, Button, List, Avatar } from 'antd';
import { MessageCircle, Lightbulb, BookOpen, Code, Server, Database, BookMarked } from 'lucide-react';
import AIChat from '../../../components/AI/AIChat';

const { TabPane } = Tabs;

const ChatAssistant = () => {
  const [activeTab, setActiveTab] = useState('general');

  const topics = [
    {
      title: 'Програмчлалын хэл',
      icon: <Code className="h-5 w-5 text-blue-500" />,
      examples: [
        'Python хэлээр файл уншихад туслаач',
        'JavaScript дээр рекурсив функц хэрхэн бичих вэ?',
        'SQL JOIN төрлүүдийг тайлбарлаж өгнө үү'
      ]
    },
    {
      title: 'Дадлагын удирдлага',
      icon: <BookMarked className="h-5 w-5 text-green-500" />,
      examples: [
        'Дадлагын тайлан бичихэд юу анхаарах вэ?',
        'Менторын үнэлгээнд сайн хариу авахын тулд юу хийх вэ?',
        'Тайлан бичихэд гарсан асуудлыг хэрхэн шийдвэрлэх вэ?'
      ]
    },
    {
      title: 'Техникийн мэдлэг',
      icon: <Server className="h-5 w-5 text-purple-500" />,
      examples: [
        'Docker контейнер гэж юу вэ?',
        'REST API зарчмуудыг тайлбарлана уу',
        'CICD pipeline гэж юу вэ?'
      ]
    },
    {
      title: 'Өгөгдлийн шинжилгээ',
      icon: <Database className="h-5 w-5 text-orange-500" />,
      examples: [
        'Pandas DataFrame-тэй ажиллахад туслаач',
        'Matplotlib ашиглан график хэрхэн үүсгэх вэ?',
        'SQL Group By ашиглан өгөгдөл нэгтгэх жишээ'
      ]
    }
  ];

  const handleTopicExample = (example) => {
    // Here you would normally set the input value of the AIChat component
    // but since we don't have direct access to its internal state,
    // we'll just provide instructions for the user
    console.log('Selected example:', example);
    // In a real implementation, you might use a ref or state lifting to set the AIChat input
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Чат туслах</h1>
        <p className="text-gray-500">
          Дадлагатай холбоотой асуултаа бичиж хариулт авна уу. Та дурын сэдвээр асуулт асууж болно.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Topics */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h2 className="text-lg font-medium mb-4">Санал болгох сэдвүүд</h2>
            <div className="space-y-4">
              {topics.map((topic, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {topic.icon}
                    <h3 className="font-medium">{topic.title}</h3>
                  </div>
                  <List
                    size="small"
                    dataSource={topic.examples}
                    renderItem={(example) => (
                      <List.Item 
                        className="cursor-pointer hover:bg-gray-50 rounded px-2"
                        onClick={() => handleTopicExample(example)}
                      >
                        <Lightbulb className="h-4 w-4 text-yellow-500 mr-2 shrink-0" />
                        <span className="text-sm">{example}</span>
                      </List.Item>
                    )}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-12rem)]">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="h-full"
            >
              <TabPane
                tab={
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ерөнхий туслах
                  </span>
                }
                key="general"
              >
                <div className="h-[calc(100vh-16rem)]">
                  <AIChat
                    role="student"
                    context={{
                      type: 'chat_assistant',
                      topic: 'general'
                    }}
                    placeholder="Асуултаа энд бичнэ үү..."
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Код туслах
                  </span>
                }
                key="code"
              >
                <div className="h-[calc(100vh-16rem)]">
                  <AIChat
                    role="student"
                    context={{
                      type: 'chat_assistant',
                      topic: 'code'
                    }}
                    placeholder="Кодтой холбоотой асуултаа энд бичнэ үү..."
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Судалгаа
                  </span>
                }
                key="research"
              >
                <div className="h-[calc(100vh-16rem)]">
                  <AIChat
                    role="student"
                    context={{
                      type: 'chat_assistant',
                      topic: 'research'
                    }}
                    placeholder="Судалгаатай холбоотой асуултаа энд бичнэ үү..."
                  />
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant; 