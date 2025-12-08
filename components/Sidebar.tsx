import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../src/hooks/useAuth';
import { LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Business Profile', icon: 'business', path: '/setup' },
    { name: 'Compliance', icon: 'task_alt', path: '/compliance' },
    { name: 'Documents', icon: 'folder', path: '/documents' },
    { name: 'Notifications', icon: 'notifications', path: '/notifications' },
    { name: 'AI Assistant', icon: 'smart_toy', path: '/chat' },
  ];

  return (
    <aside className="w-64 bg-white hidden md:flex flex-col p-4 border-r border-gray-200 h-screen sticky top-0">
      <div className="flex flex-col gap-4 h-full">
        {/* Logo and User Profile */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">business</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 text-base font-medium leading-normal">BizComply NG</h1>
            <p className="text-gray-600 text-sm font-normal leading-normal truncate">
              {currentUser?.email || 'user@bizcomply.ng'}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2 mt-4 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'text-white' : 'text-gray-600'}`}>
                {item.icon}
              </span>
              <p className={`text-sm font-medium leading-normal ${isActive(item.path) ? 'text-white' : 'text-gray-700'}`}>
                {item.name}
              </p>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors hover:bg-red-50 text-red-600 border-t border-gray-200 pt-4"
        >
          <LogOut className="w-5 h-5" />
          <p className="text-sm font-medium leading-normal">Logout</p>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;