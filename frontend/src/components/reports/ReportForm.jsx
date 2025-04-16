import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../UI/Button';
import { Card, CardHeader, CardContent, CardTitle } from '../UI/Card';
import { reportsApi } from '../../services/api';
import Input from '../UI/Input';

const ReportForm = ({ internship, onSuccess, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    report_type: 'weekly',
    content: {},
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSectionChange = (sectionName, value) => {
    setFormData(prevState => ({
      ...prevState,
      content: {
        ...prevState.content,
        [sectionName]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      attachments: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Тайлангийн гарчиг оруулна уу');
      }

      if (Object.keys(formData.content).length === 0) {
        throw new Error('Тайлангийн агуулга оруулна уу');
      }

      // Submit the report
      const response = await reportsApi.submit({
        title: formData.title,
        report_type: formData.report_type,
        content: formData.content,
        internship: internship?.id,
        attachments: formData.attachments
      });

      toast.success('Тайлан амжилттай илгээгдлээ!');
      
      // Reset form after successful submission
      setFormData({
        title: '',
        report_type: 'weekly',
        content: {},
        attachments: []
      });
      
      // Call success callbacks
      if (onSuccess) {
        onSuccess(response);
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess(response);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(error.message || 'Тайлан илгээхэд алдаа гарлаа. Дахин оролдоно уу.');
      toast.error(error.message || 'Тайлан илгээхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  // Template options based on report type
  const getTemplate = (type) => {
    const templates = {
      weekly: {
        title: 'Долоо хоногийн тайлан',
        sections: [
          { title: 'Хийсэн ажлууд', type: 'list' },
          { title: 'Сурсан зүйлс', type: 'text' },
          { title: 'Тулгарсан бэрхшээлүүд', type: 'text' },
          { title: 'Дараагийн долоо хоногт хийх ажлууд', type: 'list' }
        ]
      },
      monthly: {
        title: 'Сарын тайлан',
        sections: [
          { title: 'Хийсэн ажлын товч тайлан', type: 'text' },
          { title: 'Үндсэн үр дүнгүүд', type: 'list' },
          { title: 'Сурсан ур чадварууд', type: 'list' },
          { title: 'Хувийн хөгжил', type: 'text' },
          { title: 'Санал хүсэлт', type: 'text' }
        ]
      },
      final: {
        title: 'Эцсийн тайлан',
        sections: [
          { title: 'Дадлагын товч тайлбар', type: 'text' },
          { title: 'Сурсан ур чадварууд', type: 'list' },
          { title: 'Хүрсэн үр дүнгүүд', type: 'list' },
          { title: 'Хэрэгжүүлсэн төслүүд', type: 'text' },
          { title: 'Тулгарсан бэрхшээлүүд ба шийдэл', type: 'text' },
          { title: 'Хувийн хөгжил', type: 'text' },
          { title: 'Дүгнэлт', type: 'text' }
        ]
      }
    };
    
    return templates[type] || templates.weekly;
  };

  return (
    <Card>
      <CardHeader bordered>
        <CardTitle>Тайлан илгээх</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тайлангийн төрөл
            </label>
            <select
              name="report_type"
              value={formData.report_type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="weekly">Долоо хоногийн</option>
              <option value="monthly">Сарын</option>
              <option value="final">Эцсийн</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тайлангийн гарчиг
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Тайлангийн нэр"
              className="w-full"
            />
          </div>

          {/* Report sections based on template */}
          <div className="space-y-4">
            {getTemplate(formData.report_type).sections.map((section, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {section.title}
                </label>
                <textarea
                  value={formData.content[section.title] || ''}
                  onChange={(e) => handleSectionChange(section.title, e.target.value)}
                  rows={section.type === 'list' ? 4 : 6}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={section.type === 'list' ? 'Жагсаалтыг мөр тус бүрт тусгайлан бичнэ үү' : 'Энд бичнэ үү...'}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Хавсралт файлууд
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Нийт хэмжээ 10MB-с хэтрэхгүй байх ёстой. Зөвшөөрөгдөх формат: .pdf, .doc, .docx, .jpg, .png
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Илгээж байна...' : 'Тайлан илгээх'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm; 