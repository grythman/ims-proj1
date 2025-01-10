import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  MessageSquare, 
  User, 
  Send, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import mentorApi from '../../services/mentorApi';

const AdviceThread = ({ student, onSendAdvice }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      await onSendAdvice(student.id, message);
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Student Info */}
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

          {/* Previous Messages */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {student.advice_history.map((advice, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  advice.from_mentor
                    ? 'bg-blue-50 ml-8'
                    : 'bg-gray-50 mr-8'
                }`}
              >
                <p className="text-sm">{advice.message}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(advice.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* New Message Form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your advice here..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
              />
              <Button
                type="submit"
                disabled={sending || !message.trim()}
                loading={sending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentAdvice = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const handleSendAdvice = async (studentId, message) => {
    try {
      await mentorApi.students.sendAdvice(studentId, { message });
      toast.success('Advice sent successfully');
      // Refresh the student data
      const updatedStudents = await mentorApi.students.getAllAssigned();
      setStudents(updatedStudents);
    } catch (error) {
      toast.error('Failed to send advice');
      throw error; // Re-throw to handle in the component
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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Student Advice</h2>
        <span className="text-sm text-gray-500">
          {students.length} assigned students
        </span>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No assigned students</h3>
            <p className="text-gray-500 mt-1">
              You currently have no students assigned to mentor
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {students.map((student) => (
            <AdviceThread
              key={student.id}
              student={student}
              onSendAdvice={handleSendAdvice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAdvice; 