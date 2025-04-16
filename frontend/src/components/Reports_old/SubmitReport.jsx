import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, X, Upload } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import api from '../../services/api';

const SubmitReport = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    report_type: 'weekly',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        toast.error('File size must be less than 25MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        file
      }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('report_type', formData.report_type);
      if (formData.file) {
        data.append('file', formData.file);
      }

      await api.post('/api/reports/submit/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Report submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Failed to submit report';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Submit New Report
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Report Type */}
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

        {/* Title */}
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
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Report Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachments (Optional)
          </label>
          <div className="mt-1 flex items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file').click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload File
            </Button>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName && (
              <span className="ml-3 text-sm text-gray-500">
                {fileName}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Max file size: 25MB
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="inline-flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SubmitReport; 