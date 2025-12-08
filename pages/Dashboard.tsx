import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/hooks/useAuth';
import { businessService } from '../src/services/businessService';
import { complianceService } from '../src/services/complianceService';
import { notificationService } from '../src/services/notificationService';
import { ComplianceTask, Notification } from '../src/types';
import LoadingSpinner from '../src/components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    if (!currentUser) return;

    try {
      // Load business profile
      const profile = await businessService.getByUserId(currentUser.uid);
      if (profile) {
        setBusinessName(profile.businessName);
      }

      // Load compliance tasks
      const userTasks = await complianceService.getByUserId(currentUser.uid);
      setTasks(userTasks);

      // Load unread notifications
      const unreadNotifications = await notificationService.getUnread(currentUser.uid);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateComplianceScore = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getPendingTasks = () => {
    return tasks.filter(t => t.status === 'Pending').length;
  };

  const getOverdueTasks = () => {
    return tasks.filter(t => {
      if (t.status === 'Completed') return false;
      return t.dueDate.toDate() < new Date();
    }).length;
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tasks
      .filter(t => {
        if (t.status === 'Completed') return false;
        const dueDate = t.dueDate.toDate();
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime())
      .slice(0, 5);
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-row min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  const complianceScore = calculateComplianceScore();
  const pendingCount = getPendingTasks();
  const overdueCount = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="flex flex-row min-h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen w-full">
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-gray-900 text-3xl md:text-4xl font-bold">
                {businessName || 'Compliance Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your compliance overview.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="relative text-gray-600 hover:text-primary"
                onClick={() => navigate('/notifications')}
              >
                <span className="material-symbols-outlined">notifications</span>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-600 hover:text-primary"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Overall Compliance</p>
              <p className="text-gray-900 text-3xl font-bold">{complianceScore}%</p>
              <p className={`text-sm font-medium mt-1 ${complianceScore >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                {complianceScore >= 80 ? 'Good standing' : 'Needs attention'}
              </p>
            </div>

            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Tasks</p>
              <p className="text-gray-900 text-3xl font-bold">{tasks.length}</p>
              <p className="text-gray-600 text-sm font-medium mt-1">
                {tasks.filter(t => t.status === 'Completed').length} completed
              </p>
            </div>

            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Pending Actions</p>
              <p className="text-gray-900 text-3xl font-bold">{pendingCount}</p>
              <p className="text-yellow-600 text-sm font-medium mt-1">
                {upcomingTasks.length} due this week
              </p>
            </div>

            <div className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Overdue</p>
              <p className="text-gray-900 text-3xl font-bold">{overdueCount}</p>
              <p className={`text-sm font-medium mt-1 ${overdueCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {overdueCount > 0 ? 'Action required' : 'All up to date'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Deadlines */}
            <div className="lg:col-span-2 card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
                <button
                  onClick={() => navigate('/compliance')}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming deadlines</p>
                  <p className="text-sm mt-2">You're all caught up! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate('/compliance')}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDate(task.dueDate)}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/setup')}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="material-symbols-outlined text-primary">business</span>
                  <div>
                    <p className="font-semibold text-gray-900">Business Profile</p>
                    <p className="text-sm text-gray-600">Update your details</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/documents')}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="material-symbols-outlined text-primary">folder</span>
                  <div>
                    <p className="font-semibold text-gray-900">Upload Document</p>
                    <p className="text-sm text-gray-600">Add compliance docs</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/chat')}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                  <div>
                    <p className="font-semibold text-gray-900">AI Assistant</p>
                    <p className="text-sm text-gray-600">Get help & guidance</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/compliance')}
                  className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="material-symbols-outlined text-primary">task_alt</span>
                  <div>
                    <p className="font-semibold text-gray-900">View All Tasks</p>
                    <p className="text-sm text-gray-600">Manage compliance</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <div className="card p-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
                <button
                  onClick={() => navigate('/notifications')}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('/notifications')}
                  >
                    <span className={`material-symbols-outlined ${notification.type === 'deadline' ? 'text-yellow-600' :
                      notification.type === 'expiry' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                      {notification.type === 'deadline' ? 'schedule' :
                        notification.type === 'expiry' ? 'warning' :
                          'info'}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;