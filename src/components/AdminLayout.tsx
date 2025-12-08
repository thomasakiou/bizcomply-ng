import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Users, FileText, Settings, Bell, LogOut, LayoutDashboard } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, userProfile, logout } = useAuth();

    // Verify admin access
    React.useEffect(() => {
        if (userProfile && userProfile.role !== 'SuperAdmin' && userProfile.role !== 'Agent') {
            navigate('/');
        }
    }, [userProfile, navigate]);

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'User Management', icon: Users, path: '/admin/users' },
        { name: 'Compliance Review', icon: FileText, path: '/admin/compliance' },
        { name: 'Document Vault', icon: FileText, path: '/admin/documents' },
        { name: 'Regulations', icon: Settings, path: '/admin/regulations' },
        { name: 'Broadcast Alerts', icon: Bell, path: '/admin/alerts' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-navy text-white flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-navy-600">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-6 h-6 text-primary" />
                        <span className="text-lg font-bold">BizComply Admin</span>
                    </div>
                    <p className="text-xs text-gray-400">
                        {userProfile?.role || 'Admin'} Portal
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${isActive(item.path)
                                    ? 'bg-primary text-white'
                                    : 'text-gray-300 hover:bg-navy-600 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span className="text-sm font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-navy-600">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-navy-600 flex items-center justify-center">
                            <span className="text-sm font-bold">
                                {currentUser?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{currentUser?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left text-red-400 hover:bg-navy-600 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
