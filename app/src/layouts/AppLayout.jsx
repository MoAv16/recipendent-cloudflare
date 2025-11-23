import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Glassmorphism blur overlay on left side */}
      <div className="fixed left-0 top-0 h-screen w-[577px] bg-white/75 backdrop-blur-[10px] pointer-events-none z-10" />

      {/* Main Content */}
      <div className="pl-[104px] relative z-20">
        {/* Page Content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
