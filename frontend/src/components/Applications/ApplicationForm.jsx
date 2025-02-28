import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Upload, Send } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import api from '../../services/api';

const ApplicationForm = ({ internship, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cover_letter: '',
    cv: null
  });
  const [loading, setLoading] = useState(false);
  const [cvName, setCvName] = useState('');

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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('CV file size must be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        cv: file
      }));
      setCvName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData object
      const data = new FormData();
      data.append('internship', internship.id);
      data.append('cover_letter', formData.cover_letter);
      if (formData.cv) {
        data.append('cv', formData.cv);
      }

      // Submit application
      const response = await api.post('/api/internships/applications/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Application submitted successfully!');
      if (onSuccess) {
        onSuccess(response.data);
      }
      navigate('/student/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          'Failed to submit application';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Apply for {internship.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            at {internship.organization?.name}
          </p>
        </div>

        {/* Cover Letter */}
        <div>
          <label 
            htmlFor="cover_letter" 
            className="block text-sm font-medium text-gray-700"
          >
            Cover Letter
          </label>
          <div className="mt-1">
            <textarea
              id="cover_letter"
              name="cover_letter"
              rows={6}
              className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Tell us why you're interested in this internship..."
              value={formData.cover_letter}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* CV Upload */}
        <div>
          <label 
            htmlFor="cv" 
            className="block text-sm font-medium text-gray-700"
          >
            CV/Resume
          </label>
          <div className="mt-1 flex items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('cv').click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload CV
            </Button>
            <input
              type="file"
              id="cv"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            {cvName && (
              <span className="ml-3 text-sm text-gray-500">
                {cvName}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            PDF, DOC, or DOCX up to 5MB
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
                Submit Application
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ApplicationForm; 