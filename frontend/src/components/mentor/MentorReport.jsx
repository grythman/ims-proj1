import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  FileText, 
  Download, 
  Save,
  ChartBar,
  User,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import mentorApi from '../../services/mentorApi';
import Progress from '../UI/Progress';

const PerformanceMetric = ({ label, value, maxValue = 5 }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}/{maxValue}</span>
    </div>
    <Progress 
      value={(value / maxValue) * 100} 
      color="blue"
      size="sm"
    />
  </div>
);

const MentorReport = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await mentorApi.students.getAllAssigned();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    try {
      const data = await mentorApi.reports.getStudentReport(student.id);
      setReportData(data);
    } catch (error) {
      toast.error('Failed to load student report');
    }
  };

  const handleSaveReport = async () => {
    setSaving(true);
    try {
      await mentorApi.reports.saveReport(selectedStudent.id, reportData);
      toast.success('Report saved successfully');
    } catch (error) {
      toast.error('Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await mentorApi.reports.generateReport(selectedStudent.id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedStudent.name}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to generate report');
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
      {/* Student Selection */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card
            key={student.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedStudent?.id === student.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleStudentSelect(student)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {student.profile_picture ? (
                    <img
                      src={student.profile_picture}
                      alt={student.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.internship_position}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Content */}
      {selectedStudent && reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Internship Performance Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Student Information</h4>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">Name: {selectedStudent.name}</p>
                  <p className="text-sm">ID: {selectedStudent.student_id}</p>
                  <p className="text-sm">Position: {selectedStudent.internship_position}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Internship Period</h4>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">Start Date: {reportData.start_date}</p>
                  <p className="text-sm">End Date: {reportData.end_date}</p>
                  <p className="text-sm">Duration: {reportData.duration} days</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Performance Metrics</h4>
              <div className="space-y-4">
                <PerformanceMetric label="Technical Skills" value={reportData.technical_skills} />
                <PerformanceMetric label="Communication" value={reportData.communication} />
                <PerformanceMetric label="Problem Solving" value={reportData.problem_solving} />
                <PerformanceMetric label="Initiative" value={reportData.initiative} />
                <PerformanceMetric label="Team Work" value={reportData.team_work} />
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Achievements</h4>
              <ul className="list-disc list-inside space-y-1">
                {reportData.achievements.map((achievement, index) => (
                  <li key={index} className="text-sm text-gray-600">{achievement}</li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h4>
              <ul className="list-disc list-inside space-y-1">
                {reportData.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-gray-600">{improvement}</li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleSaveReport}
                loading={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MentorReport; 