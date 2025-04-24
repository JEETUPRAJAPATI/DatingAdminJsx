import React, { useState } from 'react';
import { Bell, Search, Check, Trash2 } from 'lucide-react';
import { formatDate } from '../lib/utils';
import type { Notification } from '../types';

const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'New User Registration',
    message: 'John Doe has registered as a new user.',
    type: 'user',
    read: false,
    createdAt: '2024-03-10T10:30:00',
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur in 2 hours.',
    type: 'system',
    read: true,
    createdAt: '2024-03-09T15:45:00',
  },
  {
    id: '3',
    title: 'User Report',
    message: 'Multiple users reported inappropriate content.',
    type: 'alert',
    read: false,
    createdAt: '2024-03-08T09:15:00',
  },
];

export function Notifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  const filteredNotifications = dummyNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'read' ? notification.read : !notification.read);
    return matchesSearch && matchesType && matchesRead;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="user">User</option>
          <option value="system">System</option>
          <option value="alert">Alert</option>
        </select>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg border ${
              notification.read
                ? 'border-gray-200 bg-white'
                : 'border-blue-200 bg-blue-50'
            } p-4 dark:border-gray-700 dark:bg-gray-800`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div
                  className={`rounded-full p-2 ${
                    notification.type === 'user'
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
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!notification.read && (
                  <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredNotifications.length} notifications
        </div>
        <div className="flex space-x-2">
          <button className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            Previous
          </button>
          <button className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}