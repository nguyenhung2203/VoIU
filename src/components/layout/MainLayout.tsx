import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from 'sonner';
import { useAppStore } from '../../store/useStore';

export const MainLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const location = useLocation();

  // Yêu cầu: khi mở web sẽ vào trang đăng nhập trước
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-strace-bg text-strace-text">
      {/* Toast Notification Provider */}
      <Toaster position="top-right" richColors />

      {/* Main Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
