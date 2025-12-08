import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { businessService } from '../../services/businessService';
import { complianceService } from '../../services/complianceService';
import { BusinessProfile, ComplianceTask } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Users, FileText, CheckCircle, AlertOctagon, TrendingUp, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
    const [allTasks, setAllTasks] = useState<ComplianceTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [fetchedBusinesses, fetchedTasks] = await Promise.all([
                businessService.getAll(),
                complianceService.getAll()
            ]);
            setBusinesses(fetchedBusinesses);
            setAllTasks(fetchedTasks);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" />
                </div>
            </AdminLayout>
        );
    }

    // Calculate stats
    const totalBusinesses = businesses.length;
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
    const overdueTasks = allTasks.filter(t => t.status === 'Overdue' || (t.status === 'Pending' && t.dueDate.toDate() < new Date())).length;
    const complianceRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent businesses (limit 5)
    const recentBusinesses = [...businesses]
        .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
        .slice(0, 5);

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6 bg-white border-l-4 border-l-primary">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{totalBusinesses}</p>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Building className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12% this month</span>
                        </p>
                    </div>

                    <div className="card p-6 bg-white border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{complianceRate}%</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">System-wide average</p>
                    </div>

                    <div className="card p-6 bg-white border-l-4 border-l-yellow-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {allTasks.filter(t => t.status === 'Pending').length}
                                </p>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FileText className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Requires action</p>
                    </div>

                    <div className="card p-6 bg-white border-l-4 border-l-red-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{overdueTasks}</p>
                            </div>
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertOctagon className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <p className="text-sm text-red-600 mt-2">Critical attention needed</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Registrations */}
                    <div className="card p-6 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Registrations</h2>
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentBusinesses.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No businesses registered yet</p>
                            ) : (
                                recentBusinesses.map((business) => (
                                    <div key={business.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold">
                                                {business.businessName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{business.businessName}</p>
                                                <p className="text-xs text-gray-500">{business.industry} • {business.state}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card p-6 bg-white">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors group">
                                <Users className="w-8 h-8 text-navy-600 mb-3 group-hover:scale-110 transition-transform" />
                                <p className="font-semibold text-gray-900">Manage Users</p>
                                <p className="text-xs text-gray-500 mt-1">Add or remove access</p>
                            </button>

                            <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors group">
                                <Bell className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                                <p className="font-semibold text-gray-900">Send Alert</p>
                                <p className="text-xs text-gray-500 mt-1">Broadcast to all users</p>
                            </button>

                            <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors group">
                                <FileText className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                                <p className="font-semibold text-gray-900">Review Docs</p>
                                <p className="text-xs text-gray-500 mt-1">Pending approval</p>
                            </button>

                            <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-left transition-colors group">
                                <Settings className="w-8 h-8 text-gray-600 mb-3 group-hover:scale-110 transition-transform" />
                                <p className="font-semibold text-gray-900">System Settings</p>
                                <p className="text-xs text-gray-500 mt-1">Configure platform</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
