import React, { useState, useEffect } from 'react';
import { Search, Filter, Bell, Check, Trash2 } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { toast } from 'react-hot-toast';
import * as notificationService from '../services/notification';

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [pagination.currentPage]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getAllNotifications(pagination.currentPage); // pass page number here
      if (response.status) {
        setNotifications(response.notifications);
        setPagination({
          currentPage: response.current_page,
          totalPages: response.total_pages,
          totalRecords: response.total_records
        });
      }
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      toast.success('Notification marked as read');
      await fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      toast.success('Notification deleted successfully');
      await fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.clearAllNotifications();
      toast.success('All notifications cleared');
      await fetchNotifications();
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'read' ? notification.read : !notification.read);
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-gray-200 p-2 dark:bg-gray-700">
                <div className="h-5 w-5"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-64 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Mark All as Read
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search notifications..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="user">User</option>
          <option value="system">System</option>
          <option value="alert">Alert</option>
        </select>
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border ${notification.read
                ? 'border-gray-200 bg-white'
                : 'border-blue-200 bg-blue-50'
                } p-4 dark:border-gray-700 dark:bg-gray-800`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div
                    className={`rounded-full p-2 ${notification.type === 'user'
                      ? 'bg-blue-100 text-blue-600'
                      : notification.type === 'system'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-red-100 text-red-600'
                      }`}
                  >
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Mark as Read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredNotifications.length} of {pagination.totalRecords} notifications
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={pagination.currentPage === 1}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}