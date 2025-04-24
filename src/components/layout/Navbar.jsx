import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'react-hot-toast';

const dummyNotifications = [
  {
    id: '1',
    title: 'New User Registration',
    message: 'John Doe has registered as a new user',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    title: 'System Update',
    message: 'System maintenance completed successfully',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Payment Received',
    message: 'New subscription payment received from user #123',
    time: '3 hours ago',
    read: true,
  },
];

export function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const admin = useAuthStore((state) => state.admin);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
      {/* Search - Desktop */}
      <div className="relative hidden flex-1 lg:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search..."
          className="h-10 w-full max-w-md rounded-lg border border-gray-200 pl-10 pr-4 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {/* Search - Mobile */}
      <div className="relative lg:hidden" ref={searchRef}>
        <button
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-5 w-5" />
        </button>

        {showSearch && (
          <div className="absolute right-0 mt-2 w-screen max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-4 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:w-96">
              <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`cursor-pointer border-b border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setShowProfile(!showProfile)}
          >
            <User className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:block">
              {admin?.name || 'Admin'}
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}