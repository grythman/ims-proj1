import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';

const ReportTemplateForm = ({
  template,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    report_type: template?.report_type || 'weekly',
    sections: template?.sections || [
      {
        title: '',
        description: '',
        type: 'text'
      }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          description: '',
          type: 'text'
        }
      ]
    }));
  };

  const removeSection = (index) => {
    if (formData.sections.length === 1) {
      toast.error('Template must have at least one section');
      return;
    }

    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate sections
    const invalidSections = formData.sections.filter(
      section => !section.title || !section.description
    );
    if (invalidSections.length > 0) {
      toast.error('All sections must have a title and description');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {template ? 'Edit Template' : 'New Template'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create a template for report submissions
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-6">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              required
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            >
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="final">Final Report</option>
            </select>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Template Sections
            </h4>
            <Button
              type="button"
              onClick={addSection}
              className="inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          {formData.sections.map((section, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-4 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Section Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Section Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={section.description}
                      onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      required
                    />
                  </div>

                  {/* Section Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      value={section.type}
                      onChange={(e) => handleSectionChange(index, 'type', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeSection(index)}
                  className="ml-4"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">
            {template ? 'Update' : 'Create'} Template
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReportTemplateForm; 