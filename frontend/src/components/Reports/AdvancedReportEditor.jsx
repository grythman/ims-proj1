import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { CheckSquare, X, Save, Eye, Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Input, Tabs, Spin, message, Upload as AntUpload, Divider, Collapse } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Panel } = Collapse;
const { Dragger } = AntUpload;
const { TabPane } = Tabs;

const AdvancedReportEditor = ({ 
  reportType, 
  template, 
  initialValues = {}, 
  onSave,
  onSubmit,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [title, setTitle] = useState(initialValues.title || '');
  const [expanded, setExpanded] = useState({});
  const [sections, setSections] = useState(initialValues.sections || {});
  const [files, setFiles] = useState(initialValues.files || []);

  const handleSectionChange = (sectionId, content) => {
    setSections({
      ...sections,
      [sectionId]: content
    });
  };

  const toggleSection = (sectionId) => {
    setExpanded({
      ...expanded,
      [sectionId]: !expanded[sectionId]
    });
  };

  const handleFilesChange = ({ fileList }) => {
    // 10MB хязгаар
    const oversizeFiles = fileList.filter(file => 
      file.size && file.size > 10 * 1024 * 1024
    );
    
    if (oversizeFiles.length > 0) {
      message.error('Файлын хэмжээ 10MB-с хэтрэхгүй байх ёстой');
      return;
    }
    
    // 5 файлаас ихгүй байх
    if (fileList.length > 5) {
      message.error('Дээд тал нь 5 файл оруулах боломжтой');
      return;
    }
    
    setFiles(fileList);
  };

  const handleSave = () => {
    if (!title.trim()) {
      message.error('Тайлангийн гарчиг оруулна уу');
      return;
    }
    
    const emptySections = Object.keys(sections).filter(
      sectionId => !sections[sectionId] || sections[sectionId].trim() === ''
    );
    
    if (emptySections.length > 0) {
      message.warning('Бүх хэсгийг бөглөнө үү');
      return;
    }
    
    if (onSave) {
      onSave({
        title,
        sections,
        files,
        reportType
      });
    }
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      message.error('Тайлангийн гарчиг оруулна уу');
      return;
    }
    
    const emptySections = Object.keys(sections).filter(
      sectionId => !sections[sectionId] || sections[sectionId].trim() === ''
    );
    
    if (emptySections.length > 0) {
      message.warning('Бүх хэсгийг бөглөнө үү');
      return;
    }
    
    if (onSubmit) {
      onSubmit({
        title,
        sections,
        files,
        reportType
      });
    }
  };

  const renderQuillEditor = (sectionId, placeholder) => {
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'code-block'],
        ['clean']
      ],
    };

    return (
      <ReactQuill
        theme="snow"
        value={sections[sectionId] || ''}
        onChange={(content) => handleSectionChange(sectionId, content)}
        modules={modules}
        placeholder={placeholder}
        className="mb-6"
      />
    );
  };

  const renderSectionForm = () => {
    if (!template || !template.sections || template.sections.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          Тайлангийн загвар олдсонгүй
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {template.sections.map((section, index) => (
          <Card key={index} className="overflow-hidden border-gray-200">
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection(section.id || index)}
            >
              <div className="flex items-center">
                {section.type === 'list' ? (
                  <CheckSquare className="h-5 w-5 text-blue-500 mr-2" />
                ) : (
                  <FileText className="h-5 w-5 text-green-500 mr-2" />
                )}
                <h4 className="font-medium">{section.title}</h4>
              </div>
              {expanded[section.id || index] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
            {expanded[section.id || index] && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  {section.description}
                </p>
                {renderQuillEditor(section.id || index, `${section.title} бөглөх...`)}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">{title || 'Тайлангийн гарчиг'}</h2>
          <div className="flex items-center text-gray-500 text-sm mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {reportType === 'weekly' ? 'Долоо хоногийн тайлан' : 
               reportType === 'monthly' ? 'Сарын тайлан' : 'Эцсийн тайлан'}
            </span>
            <span className="ml-2">
              {new Date().toLocaleDateString('mn-MN')}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {template?.sections?.map((section, index) => (
            <div key={index} className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">{section.title}</h3>
              {sections[section.id || index] ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sections[section.id || index] }} />
              ) : (
                <p className="text-gray-400 italic">Энэ хэсэг хоосон байна</p>
              )}
            </div>
          ))}
        </div>

        {files.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Хавсралтууд</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{file.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тайлангийн гарчиг
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Тайлангийн гарчиг оруулах..."
            size="large"
          />
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane
            tab={
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Тайлан бэлтгэх
              </span>
            }
            key="edit"
          >
            {renderSectionForm()}
          </TabPane>
          <TabPane
            tab={
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Урьдчилан харах
              </span>
            }
            key="preview"
          >
            {renderPreview()}
          </TabPane>
        </Tabs>

        <Divider />

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Хавсралт файл нэмэх
          </label>
          <Dragger
            name="files"
            fileList={files}
            onChange={handleFilesChange}
            multiple
            beforeUpload={() => false} // Upload manually
            maxCount={5}
          >
            <p className="flex justify-center">
              <Upload className="h-6 w-6" />
            </p>
            <p className="text-sm text-gray-500 mt-2">Файл сонгох эсвэл чирч оруулах</p>
            <p className="text-xs text-gray-400 mt-1">
              Дээд тал нь 5 файл, файл тус бүр 10MB-с ихгүй
            </p>
          </Dragger>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button 
            variant="outline" 
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Ноорог хадгалах
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spin className="mr-2" />
                Илгээж байна...
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                Тайлан илгээх
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedReportEditor; 