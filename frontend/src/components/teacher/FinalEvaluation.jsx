import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  Star, 
  CheckCircle, 
  FileText, 
  AlertCircle,
  Download,
  Upload,
  PenTool
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import teacherApi from '../../services/teacherApi';

const EvaluationForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    overallScore: 0,
    technicalSkills: 0,
    softSkills: 0,
    attendance: 0,
    projectQuality: 0,
    comments: '',
    recommendations: '',
    areasOfImprovement: '',
    signature: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.signature) {
      toast.error('Please confirm your electronic signature');
      return;
    }
    onSubmit(formData);
  };

  const renderStarRating = (name, value) => (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer ${
            star <= value
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
          onClick={() => handleChange({ target: { name, value: star } })}
        />
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Overall Performance</label>
          {renderStarRating('overallScore', formData.overallScore)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Technical Skills</label>
          {renderStarRating('technicalSkills', formData.technicalSkills)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Soft Skills</label>
          {renderStarRating('softSkills', formData.softSkills)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Attendance & Punctuality</label>
          {renderStarRating('attendance', formData.attendance)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project Quality</label>
          {renderStarRating('projectQuality', formData.projectQuality)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recommendations</label>
          <textarea
            name="recommendations"
            value={formData.recommendations}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Areas for Improvement</label>
          <textarea
            name="areasOfImprovement"
            value={formData.areasOfImprovement}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="signature"
            checked={formData.signature}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">
            I confirm this is my final evaluation and electronic signature
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Submit Final Evaluation
        </Button>
      </div>
    </form>
  );
};

const FinalEvaluation = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await teacherApi.evaluations.getStudentsForFinalEvaluation();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvaluation = async (evaluationData) => {
    try {
      await teacherApi.evaluations.submitFinalEvaluation(selectedStudent.id, evaluationData);
      toast.success('Final evaluation submitted successfully');
      setShowForm(false);
      fetchStudents(); // Refresh the list
    } catch (error) {
      toast.error('Failed to submit evaluation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Final Evaluation for {selectedStudent.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <EvaluationForm
              student={selectedStudent}
              onSubmit={handleSubmitEvaluation}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.student_id}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-sm ${
                    student.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {student.status}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Internship Progress</span>
                    <span className="font-medium">{student.progress}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reports Submitted</span>
                    <span className="font-medium">{student.reports_submitted}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowForm(true);
                  }}
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Provide Final Evaluation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinalEvaluation; 