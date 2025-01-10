import {
  BarChart3,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import PreliminaryReportCheck from '../../components/student/PreliminaryReportCheck';
import ViewInternshipDuration from '../../components/student/ViewInternshipDuration';
import ViewMentorEvaluation from '../../components/student/ViewMentorEvaluation';
import ViewTeacherEvaluation from '../../components/student/ViewTeacherEvaluation';
import { Button } from '../../components/UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../services/studentApi';

// Update StatCard to use emerald color scheme
const StatCard = ({ title, value, icon: Icon, description, onClick }) => (
  <Card className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}>
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

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    reportsSubmitted: 0,
    daysRemaining: 0,
    overallProgress: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const overview = await studentApi.dashboard.getOverview();
        const stats = await studentApi.dashboard.getStats();
        const activities = await studentApi.dashboard.getActivities();

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

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const stats = [
    {
      title: "Reports Submitted",
      value: dashboardData.reportsSubmitted,
      icon: FileText,
      description: "Total reports submitted this semester",
      onClick: () => handleOpenModal('submitReport')
    },
    {
      title: "Days Remaining",
      value: dashboardData.daysRemaining,
      icon: Calendar,
      description: "Days left in your internship",
      onClick: () => handleOpenModal('internshipDuration')
    },
    {
      title: "Overall Progress",
      value: `${dashboardData.overallProgress}%`,
      icon: TrendingUp,
      description: "Your overall internship progress"
    },
    {
      title: "Tasks Completed",
      value: "12/15",
      icon: CheckCircle,
      description: "Weekly tasks completion rate"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'Student'}! 👋
          </h1>
          <p className="mt-1 text-gray-500">
            Here's what's happening with your internship today.
          </p>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => handleOpenModal('submitReport')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
          <Button
            onClick={() => handleOpenModal('registerInternship')}
            variant="outline"
            className="text-emerald-600 hover:bg-emerald-50"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Register Internship
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className={`${stat.onClick ? 'cursor-pointer' : ''}`}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Section */}
        <div onClick={() => handleOpenModal('internshipDuration')} className="cursor-pointer">
          <Card className="col-span-1 hover:shadow-lg transition-shadow">
            <CardHeader className="border-b p-6">
              <CardTitle className="text-lg font-semibold">Internship Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                    <span className="text-sm font-medium text-emerald-600">{dashboardData.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${dashboardData.overallProgress}%` }}
                    />
                  </div>
                </div>
                <ViewInternshipDuration />
              </div>
            </CardContent>
          </Card>
        </div>

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

      {/* Evaluations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div onClick={() => handleOpenModal('mentorEvaluation')} className="cursor-pointer">
          <ViewMentorEvaluation />
        </div>
        <div onClick={() => handleOpenModal('teacherEvaluation')} className="cursor-pointer">
          <ViewTeacherEvaluation />
        </div>
      </div>

      {/* Preliminary Report Check */}
      <div className="mt-8" onClick={() => handleOpenModal('preliminaryCheck')}>
        <PreliminaryReportCheck />
      </div>

      {/* Modals */}
      {activeModal === 'submitReport' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <SubmitReport onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {activeModal === 'registerInternship' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <RegisterInternship onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {activeModal === 'mentorEvaluation' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <ViewMentorEvaluation onClose={handleCloseModal} detailed />
          </div>
        </div>
      )}

      {activeModal === 'teacherEvaluation' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <ViewTeacherEvaluation onClose={handleCloseModal} detailed />
          </div>
        </div>
      )}

      {activeModal === 'preliminaryCheck' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <PreliminaryReportCheck onClose={handleCloseModal} detailed />
          </div>
        </div>
      )}

      {activeModal === 'internshipDuration' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <ViewInternshipDuration onClose={handleCloseModal} detailed />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;