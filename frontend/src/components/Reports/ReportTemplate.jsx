import React from 'react';
import { Card } from '../UI/Card';

const ReportTemplate = ({ type }) => {
  const getTemplate = () => {
    switch (type) {
      case 'weekly':
        return {
          sections: [
            {
              title: 'Tasks Completed',
              description: 'List the main tasks you completed this week',
              type: 'list'
            },
            {
              title: 'Skills Learned',
              description: 'What new skills or knowledge did you gain?',
              type: 'text'
            },
            {
              title: 'Challenges',
              description: 'What challenges did you face and how did you overcome them?',
              type: 'text'
            },
            {
              title: 'Next Week Goals',
              description: 'What do you plan to achieve next week?',
              type: 'list'
            }
          ]
        };
      case 'monthly':
        return {
          sections: [
            {
              title: 'Major Achievements',
              description: 'List your major achievements this month',
              type: 'list'
            },
            {
              title: 'Project Progress',
              description: 'Describe your progress on assigned projects',
              type: 'text'
            },
            {
              title: 'Skills Development',
              description: 'How have your skills improved this month?',
              type: 'text'
            },
            {
              title: 'Feedback & Improvements',
              description: 'What feedback did you receive and how will you improve?',
              type: 'text'
            },
            {
              title: 'Next Month Goals',
              description: 'What are your goals for next month?',
              type: 'list'
            }
          ]
        };
      case 'final':
        return {
          sections: [
            {
              title: 'Internship Overview',
              description: 'Provide a summary of your internship experience',
              type: 'text'
            },
            {
              title: 'Key Projects',
              description: 'Describe the main projects you worked on',
              type: 'list'
            },
            {
              title: 'Skills Acquired',
              description: 'What skills and knowledge have you gained?',
              type: 'list'
            },
            {
              title: 'Challenges & Solutions',
              description: 'Major challenges faced and how you overcame them',
              type: 'text'
            },
            {
              title: 'Professional Growth',
              description: 'How has this internship contributed to your professional development?',
              type: 'text'
            },
            {
              title: 'Future Plans',
              description: 'How will you apply what you learned in your future career?',
              type: 'text'
            }
          ]
        };
      default:
        return { sections: [] };
    }
  };

  const template = getTemplate();

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {type.charAt(0).toUpperCase() + type.slice(1)} Report Template
        </h3>
        <div className="space-y-6">
          {template.sections.map((section, index) => (
            <div key={index} className="border-t border-gray-200 pt-4">
              <h4 className="text-base font-medium text-gray-900">
                {section.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {section.description}
              </p>
              {section.type === 'list' ? (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                  <li className="text-gray-400">
                    <span className="text-gray-600">Add your points here...</span>
                  </li>
                </ul>
              ) : (
                <div className="mt-2 text-sm text-gray-600 italic">
                  Write your response here...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ReportTemplate; 