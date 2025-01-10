import {
  BarChart3,
  Users,
  Calendar,
  ClipboardCheck,
  FileText,
  TrendingUp,
  Award,
  CheckCircle,
  UserCheck,
  Clock
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button } from '../../components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card';
import { useAuth } from '../../context/AuthContext';
import mentorApi from '../../services/mentorApi';

// Create StatCard component for reuse
const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
      {description && (
        <p className="mt-4 text-sm text-gray-600">{description}</p>
      )}
    </CardContent>
  </Card>
);

const MentorDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    pendingReviews: 0,
    completedEvaluations: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const overview = await mentorApi.dashboard.getOverview();
        const stats = await mentorApi.dashboard.getStats();
        const activities = await mentorApi.dashboard.getActivities();

        setDashboardData({
          ...overview,
          ...stats,
          recentActivity: activities
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: dashboardData.totalStudents,
      icon: Users,
      description: "Students under your supervision"
    },
    {
      title: "Pending Reviews",
      value: dashboardData.pendingReviews,
      icon: ClipboardCheck,
      description: "Reports waiting for review"
    },
    {
      title: "Completed Evaluations",
      value: dashboardData.completedEvaluations,
      icon: CheckCircle,
      description: "Evaluations completed this month"
    },
    {
      title: "Active Tasks",
      value: "8",
      icon: Clock,
      description: "Ongoing student tasks"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'Mentor'}! 👋
          </h1>
          <p className="mt-1 text-gray-500">
            Here's an overview of your students' progress.
          </p>
        </div>
        <Button
          as={Link}
          to="/mentor/evaluations/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          New Evaluation
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Progress Section */}
        <Card className="col-span-1">
          <CardHeader className="border-b p-6">
            <CardTitle className="text-lg font-semibold">Student Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {dashboardData.studentProgress?.map((student, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{student.name}</span>
                    <span className="text-sm font-medium text-emerald-600">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader className="border-b p-6">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews Section */}
      <Card>
        <CardHeader className="border-b p-6">
          <CardTitle className="text-lg font-semibold">Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {dashboardData.pendingReviewsList?.map((review, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.studentName}</p>
                    <p className="text-sm text-gray-500">{review.reportType}</p>
                  </div>
                </div>
                <Button
                  as={Link}
                  to={`/mentor/reviews/${review.id}`}
                  variant="outline"
                  className="text-emerald-600 hover:bg-emerald-50"
                >
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDashboard; 