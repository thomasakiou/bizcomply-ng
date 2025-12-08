import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { complianceService } from '../../services/complianceService';
import { businessService } from '../../services/businessService';
import { ComplianceTask, BusinessProfile } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ComplianceMonitoring: React.FC = () => {
    const [tasks, setTasks] = useState<ComplianceTask[]>([]);
    const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [allTasks, allBusinesses] = await Promise.all([
                complianceService.getAll(),
                businessService.getAll()
            ]);
            setTasks(allTasks);
            setBusinesses(allBusinesses);
        } catch (error) {
            console.error('Error loading compliance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getBusinessName = (profileId: string) => {
        return businesses.find(b => b.id === profileId)?.businessName || 'Unknown Business';
    };

    const filteredTasks = tasks.filter(task => {
        const businessName = getBusinessName(task.businessProfileId);
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            businessName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'All' || task.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Compliance Monitoring</h1>

                {/* Filters */}
                <div className="card p-6 mb-6 bg-white">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by task or business name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="input-field w-auto"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="card bg-white overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {getBusinessName(task.businessProfileId)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{task.title}</p>
                                        <p className="text-xs text-gray-500">{task.category}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {task.dueDate.toDate().toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                task.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {task.status === 'Completed' ? <CheckCircle className="w-3.5 h-3.5" /> :
                                                task.status === 'Overdue' ? <AlertCircle className="w-3.5 h-3.5" /> :
                                                    <Clock className="w-3.5 h-3.5" />}
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${task.priority === 'High' ? 'text-red-600' :
                                                task.priority === 'Medium' ? 'text-yellow-600' :
                                                    'text-blue-600'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ComplianceMonitoring;
