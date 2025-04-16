import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, Send } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import ReportTemplate from './ReportTemplate';
import api from '../../services/api';

const ReportForm = ({ internship, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    report_type: 'weekly',
    content: {},
    attachments: []
  });
  const [loading, setLoading] = useState(false);

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
      data.append('internship', internship.id);

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
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report');
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
    <Card className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Submit Report
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the report form below based on the selected template.
          </p>
        </div>

        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Report Type
          </label>
          <select
            name="report_type"
            value={formData.report_type}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
          >
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="final">Final Report</option>
          </select>
        </div>

        {/* Report Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Report Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="Enter report title..."
            required
          />
        </div>

        {/* Report Template */}
        <div>
          <ReportTemplate type={formData.report_type} />
        </div>

        {/* Report Sections */}
        <div className="space-y-6">
          {getTemplate(formData.report_type).sections.map((section, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                {section.title}
              </label>
              {section.type === 'list' ? (
                <textarea
                  value={formData.content[section.title] || ''}
                  onChange={(e) => handleSectionChange(section.title, e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Enter items separated by new lines..."
                />
              ) : (
                <textarea
                  value={formData.content[section.title] || ''}
                  onChange={(e) => handleSectionChange(section.title, e.target.value)}
                  rows={6}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Write your response here..."
                />
              )}
            </div>
          ))}
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachments (Optional)
          </label>
          <div className="mt-1 flex items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('attachments').click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300"
            >
              <FileText className="h-5 w-5 mr-2" />
              Upload Files
            </Button>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.attachments.length > 0 && (
              <span className="ml-3 text-sm text-gray-500">
                {formData.attachments.length} file(s) selected
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Maximum 5 files, total size up to 25MB
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReportForm; 