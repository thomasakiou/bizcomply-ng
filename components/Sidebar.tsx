import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../src/hooks/useAuth';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
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

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Business Profile', icon: 'business', path: '/setup' },
    { name: 'Compliance', icon: 'task_alt', path: '/compliance' },
    { name: 'Documents', icon: 'folder', path: '/documents' },
    { name: 'Notifications', icon: 'notifications', path: '/notifications' },
    { name: 'AI Assistant', icon: 'smart_toy', path: '/chat' },
  ];

  // Admin Links (conditionally rendered)
  if (['SuperAdmin', 'Admin'].includes(userProfile?.role || '')) {
    menuItems.push({ name: 'Admin Panel', icon: 'admin_panel_settings', path: '/admin' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col p-4
      `}>
        <div className="flex flex-col gap-4 h-full">
          {/* Logo and User Profile */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">business</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 text-base font-medium leading-normal">BizComply NG</h1>
              <p className="text-gray-600 text-sm font-normal leading-normal truncate w-40">
                {currentUser?.email || 'user@bizcomply.ng'}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2 mt-4 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors hover:bg-red-50 text-red-600 border-t border-gray-200 pt-4 mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <p className="text-sm font-medium leading-normal">Logout</p>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;