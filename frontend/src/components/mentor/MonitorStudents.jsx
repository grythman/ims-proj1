import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  User,
  ChartBar,
  FileText,
  AlertCircle,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import mentorApi from '../../services/mentorApi';
import Progress from '../UI/Progress';

const StudentCard = ({ student, onViewDetails }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Student Info Header */}
          <div className="flex items-start justify-between">
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

          {/* Progress Section */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Overall Progress</span>
              <span className="font-medium">{student.progress}%</span>
            </div>
            <Progress 
              value={student.progress} 
              color="blue"
              size="md"
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {student.reports_submitted}
              </div>
              <div className="text-xs text-gray-500">Reports</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {student.days_completed}
              </div>
              <div className="text-xs text-gray-500">Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {student.meetings_attended}
              </div>
              <div className="text-xs text-gray-500">Meetings</div>
            </div>
          </div>

          {/* Recent Activity */}
          {student.latest_activity && (
            <div className="border-t pt-3">
              <p className="text-sm text-gray-500">Latest Activity</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {student.latest_activity}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(student)}
            >
              View Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = `/mentor/students/${student.id}/evaluate`}
            >
              Evaluate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MonitorStudents = () => {
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
      const data = await mentorApi.students.getAllAssigned();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (student) => {
    window.location.href = `/mentor/students/${student.id}`;
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
          return b.progress - a.progress;
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
              className="w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="reports">Reports</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
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
            <StudentCard
              key={student.id}
              student={student}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonitorStudents; 