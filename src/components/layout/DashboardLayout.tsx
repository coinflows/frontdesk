
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import TokenModal from '../ui/TokenModal';

interface DashboardLayoutProps {
  adminOnly?: boolean;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ adminOnly = false, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebar_collapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [showTokenModal, setShowTokenModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const toggleTokenModal = () => {
    setShowTokenModal(prev => !prev);
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-frontdesk-600 border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admin users from admin-only pages
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  // Redirect admin users from user pages
  if (!adminOnly && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleCollapse={toggleSidebar} 
        toggleTokenModal={toggleTokenModal}
      />
      
      <main 
        className={`flex-1 overflow-auto p-6 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {children}
      </main>

      {/* API Token Modal */}
      <TokenModal 
        isOpen={showTokenModal} 
        onClose={() => setShowTokenModal(false)} 
      />
    </div>
  );
};

export default DashboardLayout;
