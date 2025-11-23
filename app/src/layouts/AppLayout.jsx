import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

function AppLayoutContent() {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Glassmorphism blur overlay on left side */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white/75 backdrop-blur-[10px] pointer-events-none z-10 transition-all duration-300 ${
          isExpanded ? 'w-[713px]' : 'w-[577px]'
        }`}
      />

      {/* Main Content */}
      <div
        className={`relative z-20 transition-all duration-300 ${
          isExpanded ? 'pl-[240px]' : 'pl-[104px]'
        }`}
      >
        {/* Page Content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppLayoutContent />
    </SidebarProvider>
  );
}
