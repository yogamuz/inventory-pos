import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar.jsx';
import Topbar from '@/components/Topbar.jsx';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* HAPUS <Toaster /> dari sini - sudah ada di App.jsx */}
      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 lg:ml-64">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}