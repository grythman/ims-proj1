import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ChartBar, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import teacherApi from '../../services/teacherApi';
import Progress from '../UI/Progress';

const StudentProgressCard = ({ student }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Student Info Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                {student.profile_picture ? (
                  <img
                    src={student.profile_picture}
                    alt={student.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-emerald-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.student_id}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm ${
              student.status === 'active' ? 'bg-green-100 text-green-700' :
              student.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {student.status}
            </span>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Overall Progress</span>
                <span className="font-medium">{student.overall_progress}%</span>
              </div>
              <Progress 
                value={student.overall_progress} 
                color="emerald"
                size="md"
              />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {student.reports_submitted}
                </div>
                <div className="text-xs text-gray-500">Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {student.days_completed}
                </div>
                <div className="text-xs text-gray-500">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {student.evaluations_received}
                </div>
                <div className="text-xs text-gray-500">Evaluations</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
              <div className="space-y-2">
                {student.recent_activities?.slice(0, 2).map((activity, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      activity.type === 'submission' ? 'bg-emerald-500' :
                      activity.type === 'evaluation' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-gray-600">{activity.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600"
              onClick={() => window.location.href = `/student/${student.id}/details`}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-600"
              onClick={() => window.location.href = `/student/${student.id}/reports`}
            >
              View Reports
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MonitorStudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await teacherApi.students.getAllStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.student_id.includes(searchQuery);
      const matchesFilter = filter === 'all' || student.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.overall_progress - a.overall_progress;
        case 'reports':
          return b.reports_submitted - a.reports_submitted;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="reports">Reports</option>
          </select>
        </div>
      </div>

      {/* Student Grid */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No students found</h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <StudentProgressCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonitorStudentProgress; 