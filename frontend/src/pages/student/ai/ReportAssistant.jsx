import React, { useState } from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import AIChat from '../../../components/AI/AIChat';
import { FileText, Wand2, Lightbulb, MessageSquare } from 'lucide-react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const ReportAssistant = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('suggestions');

  const reportContext = {
    type: 'report_assistant',
    reportType: selectedReport?.type,
    reportContent: selectedReport?.content,
    previousReports: [], // Could load previous reports for context
  };

  const features = [
    {
      key: 'suggestions',
      icon: Lightbulb,
      title: 'Санал зөвлөмж',
      description: 'Тайлангийн агуулга, бүтцийн талаар зөвлөгөө авах',
      placeholder: 'Жишээ нь: Долоо хоногийн тайлан хэрхэн бичих вэ?'
    },
    {
      key: 'improvement',
      icon: Wand2,
      title: 'Сайжруулалт',
      description: 'Бичсэн тайлангаа сайжруулах, засах',
      placeholder: 'Тайлангийн текстээ оруулаад, хэрхэн сайжруулах талаар асууна уу'
    },
    {
      key: 'qa',
      icon: MessageSquare,
      title: 'Асуулт хариулт',
      description: 'Тайлан бичихтэй холбоотой асуултууд асуух',
      placeholder: 'Тайлантай холбоотой асуултаа бичнэ үү'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Тайлан туслах</h1>
        <p className="text-gray-500">
          AI туслах ашиглан тайлангаа илүү үр дүнтэй, чанартай бичих боломжтой
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Report selection */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4">Тайлангийн жагсаалт</h2>
            <div className="space-y-2">
              {/* This could be loaded from your reports API */}
              <button
                onClick={() => setSelectedReport({
                  id: 1,
                  title: 'Долоо хоногийн тайлан #5',
                  type: 'weekly',
                  content: 'Энэ долоо хоногт...'
                })}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium">Долоо хоногийн тайлан #5</div>
                    <div className="text-sm text-gray-500">Ноорог</div>
                  </div>
                </div>
              </button>
              {/* Add more reports here */}
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
                      role="student"
                      context={{
                        ...reportContext,
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

export default ReportAssistant; 