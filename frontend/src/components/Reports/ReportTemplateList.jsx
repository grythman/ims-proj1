import React from 'react';
import { format } from 'date-fns';
import { FileText, Copy, Archive } from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

const ReportTemplateList = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onTemplateDuplicate,
  onTemplateArchive,
  onTemplateEdit
}) => {
  if (!templates?.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No templates found
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map(template => (
        <div
          key={template.id}
          onClick={() => onTemplateSelect(template)}
          className={`cursor-pointer transition-all ${
            selectedTemplate?.id === template.id
              ? 'ring-2 ring-emerald-500'
              : 'hover:shadow-md'
          }`}
        >
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">
                    {template.name}
                  </h3>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {template.report_type_display}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {template.description}
                </p>

                <div className="mt-2 text-sm text-gray-500">
                  Created by {template.created_by_name} on{' '}
                  {format(new Date(template.created_at), 'MMM d, yyyy')}
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Sections ({template.sections.length}):
                  </h4>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {template.sections.map((section, index) => (
                      <div key={index} className="text-sm text-gray-500">
                        • {section.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ml-4 flex flex-col space-y-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTemplateEdit(template);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Edit
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTemplateDuplicate(template.id);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTemplateArchive(template.id);
                  }}
                  variant="danger"
                  className="w-full"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ReportTemplateList; 