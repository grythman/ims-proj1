import React, { useState } from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import AIChat from '../../../components/AI/AIChat';
import { UserCheck, Wand2, Lightbulb, MessageSquare, Users } from 'lucide-react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const EvaluationAssistant = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('suggestions');

  const evaluationContext = {
    type: 'evaluation_assistant',
    studentId: selectedStudent?.id,
    studentName: selectedStudent?.name,
    previousEvaluations: [], // Could load previous evaluations for context
  };

  const features = [
    {
      key: 'suggestions',
      icon: Lightbulb,
      title: 'Үнэлгээний зөвлөмж',
      description: 'Оюутны үнэлгээний талаар зөвлөгөө авах',
      placeholder: 'Жишээ нь: Оюутны ур чадварыг хэрхэн үнэлэх вэ?'
    },
    {
      key: 'improvement',
      icon: Wand2,
      title: 'Үнэлгээ сайжруулах',
      description: 'Өгсөн үнэлгээгээ сайжруулах, засах',
      placeholder: 'Үнэлгээний текстээ оруулаад, хэрхэн сайжруулах талаар асууна уу'
    },
    {
      key: 'feedback',
      icon: MessageSquare,
      title: 'Санал хүсэлт',
      description: 'Оюутанд өгөх санал хүсэлтийн талаар зөвлөгөө авах',
      placeholder: 'Оюутны гүйцэтгэлийн талаар санал хүсэлт бичихэд туслана уу'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Үнэлгээний туслах</h1>
        <p className="text-gray-500">
          AI туслах ашиглан оюутны үнэлгээг илүү үр дүнтэй, бодитой хийх боломжтой
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Student selection */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4">Оюутны жагсаалт</h2>
            <div className="space-y-2">
              {/* This could be loaded from your students API */}
              <button
                onClick={() => setSelectedStudent({
                  id: 1,
                  name: 'Бат-Эрдэнэ',
                  major: 'Програм хангамж',
                  year: '3-р курс'
                })}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium">Бат-Эрдэнэ</div>
                    <div className="text-sm text-gray-500">Програм хангамж, 3-р курс</div>
                  </div>
                </div>
              </button>
              {/* Add more students here */}
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
              {features.map(feature => (
                <TabPane
                  tab={
                    <span className="flex items-center">
                      <feature.icon className="h-4 w-4 mr-2" />
                      {feature.title}
                    </span>
                  }
                  key={feature.key}
                >
                  <div className="h-[calc(100vh-16rem)]">
                    <AIChat
                      role="mentor"
                      context={{
                        ...evaluationContext,
                        feature: feature.key
                      }}
                      placeholder={feature.placeholder}
                    />
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EvaluationAssistant; 