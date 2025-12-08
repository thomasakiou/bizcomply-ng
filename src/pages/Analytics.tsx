import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { complianceService } from '../services/complianceService';
import { ComplianceTask } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { BarChart, PieChart, Activity, TrendingUp, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState<ComplianceTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (currentUser) {
                const userTasks = await complianceService.getByUserId(currentUser.uid);
                setTasks(userTasks);
            }
            setLoading(false);
        };
        loadData();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex flex-row min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;
    const complianceScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Mock monthly data (simulation)
    const monthlyProgress = [40, 55, 65, 80, complianceScore];
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="flex flex-row min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Analytics</h1>
                    <p className="text-gray-600 mb-8">Track your compliance health and performance over time.</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card p-6 bg-white border-l-4 border-l-primary">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{complianceScore}%</p>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Activity className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>Top 10% in industry</span>
                            </p>
                        </div>

                        <div className="card p-6 bg-white border-l-4 border-l-blue-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{completedTasks}</p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <PieChart className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Total actions taken</p>
                        </div>

                        <div className="card p-6 bg-white border-l-4 border-l-yellow-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{pendingTasks}</p>
                                </div>
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Calendar className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="card p-6 bg-white border-l-4 border-l-red-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Risk Level</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {overdueTasks > 0 ? 'High' : pendingTasks > 5 ? 'Medium' : 'Low'}
                                    </p>
                                </div>
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <BarChart className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                            <p className={`${overdueTasks > 0 ? 'text-red-600' : 'text-green-600'} text-sm mt-2`}>
                                {overdueTasks} overdue items
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Trend Chart Placeholder */}
                        <div className="card p-6 bg-white">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Compliance Trend (Last 5 Months)</h3>
                            <div className="h-64 flex items-end justify-between px-4 border-b border-gray-200 pb-2">
                                {monthlyProgress.map((value, index) => (
                                    <div key={index} className="flex flex-col items-center gap-2 group w-full">
                                        <div
                                            className="w-full max-w-[40px] bg-primary/20 group-hover:bg-primary transition-all rounded-t-lg relative"
                                            style={{ height: `${value}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {value}%
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-600">{months[index]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between text-xs text-gray-400">
                                <span>0% Compliance</span>
                                <span>100% Compliance</span>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="card p-6 bg-white">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Insight & Recommendations</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                                            💡
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">Improve your score</p>
                                            <p className="text-xs text-blue-700 mt-1">Completion of "Tax Clearance Certificate" will boost your score by 15%.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 shrink-0">
                                            📈
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-900">On Track</p>
                                            <p className="text-xs text-green-700 mt-1">You are engaging with the platform 20% more than the average user. Great job!</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 shrink-0">
                                            ⚠️
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-900">Document Expiry Warning</p>
                                            <p className="text-xs text-yellow-700 mt-1">2 documents are expiring in the next 30 days. Renew them soon.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
