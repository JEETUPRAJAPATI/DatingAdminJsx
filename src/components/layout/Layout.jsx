import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Menu, X } from 'lucide-react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close sidebar when screen size changes to prevent sidebar staying open on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-30 transform overflow-y-auto bg-white transition-all duration-300 ease-in-out dark:bg-gray-900 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
      </div>

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${
        sidebarCollapsed ? '' : ''
      }`}>
        {/* Announcement Banner */}
        {showAnnouncement && (
          <div className="relative w-full bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm font-medium">
                  🎉 Welcome to the new admin dashboard! Check out our latest features.
                </p>
                <a
                  href="#"
                  className="ml-3 text-sm font-medium underline hover:text-blue-100"
                >
                  Learn more
                </a>
              </div>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-blue-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <header className="z-10 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Navbar />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}