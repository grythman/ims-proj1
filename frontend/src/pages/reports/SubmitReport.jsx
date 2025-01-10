import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SubmitReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: 'weekly', // or 'monthly', 'final'
    content: '',
    attachment: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'attachment') {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const reportData = new FormData();
    reportData.append('title', formData.title);
    reportData.append('type', formData.type);
    reportData.append('content', formData.content);

    if (formData.attachment) {
      reportData.append('attachment', formData.attachment);
    }

    try {
      await api.post('/reports/', reportData);
      navigate('/dashboard/reports');
    } catch (err) {
      setError('Failed to submit the report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit Report</h1>
        <p className="mt-1 text-gray-500">
          Create and submit your internship report.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            >
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="final">Final Report</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Enter report title"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Write your report content here..."
              required
            />
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attach File (Optional)
            </label>
            <input
              type="file"
              name="attachment"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full text-sm text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              PDF, DOC, or DOCX files up to 10MB.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/reports')}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport; 