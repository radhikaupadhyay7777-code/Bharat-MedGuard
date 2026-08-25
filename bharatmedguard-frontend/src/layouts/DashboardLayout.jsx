import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import SystemStatus from '../components/common/SystemStatus';

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bmg-navy text-slate-100 flex flex-col antialiased">
      <div className="flex-1 flex flex-row relative overflow-hidden">
        {/* Collapsible / Responsive Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            <Outlet />
          </main>

          <SystemStatus />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
