import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../UI/Button';
import { Card, CardHeader, CardContent, CardTitle } from '../UI/Card';
import api from '../../services/api';
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (sectionTitle, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [sectionTitle]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 25 * 1024 * 1024) { // 25MB limit
      toast.error('Total file size must be less than 25MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      const template = getTemplate(formData.report_type);
      const missingFields = template.sections
        .filter(section => !formData.content[section.title])
        .map(section => section.title);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following sections: ${missingFields.join(', ')}`);
      }

      // Create FormData object
      const data = new FormData();
      data.append('title', formData.title);
      data.append('report_type', formData.report_type);
      data.append('content', JSON.stringify(formData.content));
      
      if (internship && internship.id) {
        data.append('internship', internship.id);
      }

      formData.attachments.forEach(file => {
        data.append('attachments', file);
      });

      // Submit report
      const response = await api.post('/api/reports/submit/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Report submitted successfully!');
      
      // Reset form after successful submission
      setFormData({
        title: '',
        report_type: 'weekly',
        content: {},
        attachments: []
      });
      
      // Call success callbacks
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report');
      setError('Тайлан илгээхэд алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  const getTemplate = (type) => {
    switch (type) {
      case 'weekly':
        return {
          sections: [
            {
              title: 'Tasks Completed',
              type: 'list'
            },
            {
              title: 'Skills Learned',
              type: 'text'
            },
            {
              title: 'Challenges',
              type: 'text'
            },
            {
              title: 'Next Week Goals',
              type: 'list'
            }
          ]
        };
      case 'monthly':
        return {
          sections: [
            {
              title: 'Major Achievements',
              type: 'list'
            },
            {
              title: 'Project Progress',
              type: 'text'
            },
            {
              title: 'Skills Development',
              type: 'text'
            },
            {
              title: 'Feedback & Improvements',
              type: 'text'
            },
            {
              title: 'Next Month Goals',
              type: 'list'
            }
          ]
        };
      case 'final':
        return {
          sections: [
            {
              title: 'Internship Overview',
              type: 'text'
            },
            {
              title: 'Key Projects',
              type: 'list'
            },
            {
              title: 'Skills Acquired',
              type: 'list'
            },
            {
              title: 'Challenges & Solutions',
              type: 'text'
            },
            {
              title: 'Professional Growth',
              type: 'text'
            },
            {
              title: 'Future Plans',
              type: 'text'
            }
          ]
        };
      default:
        return { sections: [] };
    }
  };

  return (
    <Card>
      <CardHeader bordered>
        <CardTitle>Шинэ тайлан илгээх</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                <option value="weekly">7 хоног</option>
                <option value="monthly">Сарын</option>
                <option value="final">Эцсийн</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тайлангийн агуулга
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) => handleSectionChange(e.target.name, e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={6}
                placeholder="Тайлангийн дэлгэрэнгүй тайлбар"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Хавсралт
              </label>
              <input
                type="file"
                name="attachments"
                onChange={handleFileChange}
                multiple
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOCX, XLSX файлууд хавсаргах боломжтой.
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Илгээж байна...' : 'Тайлан илгээх'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm; 