import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { userService } from '../../services/userService';
import { User, UserRole } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Search, Shield, User as UserIcon, MoreHorizontal, Edit, Check, X } from 'lucide-react';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRole, setEditRole] = useState<UserRole>('User');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const allUsers = await userService.getAll();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string) => {
        try {
            await userService.updateRole(userId, editRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: editRole } : u));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update user role');
        }
    };

    const startEditing = (user: User) => {
        setEditingId(user.id);
        setEditRole(user.role);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = filterRole === 'All' || user.role === filterRole;

        return matchesSearch && matchesRole;
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
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-1">Manage system access and roles</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium"> Total: {users.length}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                            Active: {users.filter(u => u.emailVerified).length}
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="card p-6 mb-6 bg-white">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by email or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value as UserRole | 'All')}
                                className="input-field w-auto min-w-[150px]"
                            >
                                <option value="All">All Roles</option>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="SuperAdmin">Super Admin</option>
                                <option value="Agent">Agent</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card bg-white overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-navy-600 text-white flex items-center justify-center">
                                                    {user.displayName ? (
                                                        user.displayName.charAt(0).toUpperCase()
                                                    ) : (
                                                        <UserIcon className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.displayName || 'No Name'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === user.id ? (
                                                <select
                                                    value={editRole}
                                                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                                                    className="text-sm border rounded p-1"
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="SuperAdmin">Super Admin</option>
                                                    <option value="Agent">Agent</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                                                            user.role === 'Agent' ? 'bg-orange-100 text-orange-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 text-sm ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'
                                                }`}>
                                                {user.emailVerified ? (
                                                    <>
                                                        <Check className="w-4 h-4" /> Verified
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="w-4 h-4" /> Unverified
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.createdAt?.toDate().toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {editingId === user.id ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRoleUpdate(user.id)}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startEditing(user)}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
