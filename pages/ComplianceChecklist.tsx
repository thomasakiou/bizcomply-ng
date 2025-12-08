import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../src/hooks/useAuth';
import { complianceService } from '../src/services/complianceService';
import { ComplianceTask, ComplianceStatus, CompliancePriority } from '../src/types';
import LoadingSpinner from '../src/components/ui/LoadingSpinner';
import Button from '../src/components/ui/Button';
import { Plus, Filter } from 'lucide-react';

const ComplianceChecklist: React.FC = () => {
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ComplianceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ComplianceStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTasks();
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filter, searchTerm]);

  const loadTasks = async () => {
    if (!currentUser) return;

    try {
      const userTasks = await complianceService.getByUserId(currentUser.uid);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = tasks;

    // Filter by status
    if (filter !== 'All') {
      filtered = filtered.filter(task => task.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleStatusChange = async (taskId: string, newStatus: ComplianceStatus) => {
    try {
      await complianceService.updateStatus(taskId, newStatus);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  const isOverdue = (task: ComplianceTask): boolean => {
    if (task.status === 'Completed') return false;
    return task.dueDate.toDate() < new Date();
  };

  const formatDate = (timestamp: any): string => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: ComplianceStatus): string => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: CompliancePriority): string => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    overdue: tasks.filter(t => isOverdue(t)).length,
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

  return (
    <div className="flex flex-row min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Compliance Checklist</h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your compliance requirements in one place.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as ComplianceStatus | 'All')}
                  className="input-field"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="card">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg font-medium">No tasks found</p>
                <p className="text-sm mt-2">
                  {searchTerm || filter !== 'All'
                    ? 'Try adjusting your filters'
                    : 'Create your business profile to generate compliance tasks'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${isOverdue(task) ? 'bg-red-50' : ''
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {isOverdue(task) && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              Overdue
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">{task.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            <span className="font-medium">Category:</span> {task.category}
                          </span>
                          <span className="text-gray-600">
                            <span className="font-medium">Due:</span> {formatDate(task.dueDate)}
                          </span>
                          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority} Priority
                          </span>
                          {task.portalUrl && (
                            <a
                              href={task.portalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                            >
                              Visit {task.authorityName || 'Portal'}
                              <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as ComplianceStatus)}
                          className="input-field text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplianceChecklist;