import React, { useState, useEffect } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { FileText, Plus, FileEdit, Copy, Archive, Download } from 'lucide-react';
import { Tabs, Empty, Spin, Select, message } from 'antd';
import api from '../../services/api';
import ReportTemplate from '../../components/reports/ReportTemplate';
import ReportTemplateList from '../../components/reports/ReportTemplateList';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const ReportTemplatesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/reports/templates/');
      setTemplates(response.data?.data || []);
    } catch (error) {
      console.error('Загварууд ачааллахад алдаа гарлаа:', error);
      message.error('Тайлангийн загваруудыг авахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (template) => {
    try {
      const response = await api.post(`/api/v1/reports/templates/${template.id}/duplicate/`);
      message.success('Загвар амжилттай хуулагдлаа');
      fetchTemplates();
    } catch (error) {
      console.error('Загвар хуулахад алдаа гарлаа:', error);
      message.error('Загвар хуулахад алдаа гарлаа');
    }
  };

  const handleArchive = async (template) => {
    try {
      await api.patch(`/api/v1/reports/templates/${template.id}/`, {
        is_active: false
      });
      message.success('Загвар архивлагдлаа');
      fetchTemplates();
    } catch (error) {
      console.error('Загвар архивлахад алдаа гарлаа:', error);
      message.error('Загвар архивлахад алдаа гарлаа');
    }
  };

  const handleDownload = (template) => {
    // Загварыг JSON болгон татаж авах
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(template, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `template-${template.id}-${template.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredTemplates = templates.filter(template => {
    if (typeFilter === 'all') return true;
    return template.report_type === typeFilter;
  });

  const tabItems = [
    {
      key: '1',
      label: 'Тайлангийн загварууд',
      children: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="w-64">
              <Select
                className="w-full"
                placeholder="Төрлөөр шүүх"
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: 'all', label: 'Бүх төрөл' },
                  { value: 'weekly', label: 'Долоо хоногийн тайлан' },
                  { value: 'monthly', label: 'Сарын тайлан' },
                  { value: 'final', label: 'Эцсийн тайлан' }
                ]}
              />
            </div>
            <Button onClick={() => navigate('/student/reports/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Шинэ тайлан үүсгэх
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <Empty description="Одоогоор тайлангийн загвар байхгүй байна" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Загварын жагсаалт</h3>
                <ReportTemplateList
                  templates={filteredTemplates}
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                  onTemplateDuplicate={handleDuplicate}
                  onTemplateArchive={handleArchive}
                  onTemplateEdit={() => {}}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Сонгосон загварын харагдац</h3>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium">{selectedTemplate.name}</h4>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleDuplicate(selectedTemplate)}>
                            <Copy className="h-4 w-4 mr-1" />
                            Хуулах
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownload(selectedTemplate)}>
                            <Download className="h-4 w-4 mr-1" />
                            Татах
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleArchive(selectedTemplate)}>
                            <Archive className="h-4 w-4 mr-1" />
                            Архивлах
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                      <ReportTemplate type={selectedTemplate.report_type} />
                    </Card>
                  </div>
                ) : (
                  <Card className="p-6 text-center text-gray-500">
                    Загвар сонгоно уу
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Миний тайлангууд',
      children: (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => navigate('/student/reports/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Шинэ тайлан үүсгэх
            </Button>
          </div>
          
          <Card className="divide-y">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : (
              <div>
                <div className="p-4 flex items-center">
                  <FileText className="h-6 w-6 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium">Долоо хоногийн тайлан #1 - MongoDB хэрэглээ</h3>
                    <p className="text-sm text-gray-500">Илгээсэн огноо: 2023-08-15</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    Хүлээгдэж буй
                  </span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 flex items-center">
                  <FileText className="h-6 w-6 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium">Долоо хоногийн тайлан #2 - React хөгжүүлэлт</h3>
                    <p className="text-sm text-gray-500">Илгээсэн огноо: 2023-08-22</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    Баталгаажсан
                  </span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 flex items-center">
                  <FileText className="h-6 w-6 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium">Сарын тайлан - 9-р сар</h3>
                    <p className="text-sm text-gray-500">Илгээсэн огноо: 2023-09-30</p>
                  </div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    Буцаасан
                  </span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Тайлангийн менежмент</h1>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={tabItems}
        className="bg-white p-4 rounded-lg shadow-sm"
      />
    </div>
  );
};

export default ReportTemplatesPage; 