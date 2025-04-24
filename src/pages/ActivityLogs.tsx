import React, { useState } from 'react';
import { Search, Filter, Activity, User, Settings, Shield, Download, X } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  category: 'user' | 'system' | 'security' | 'admin';
  details: string;
  ipAddress: string;
  timestamp: string;
}

interface FilterData {
  timeRange: string;
  actionType: string;
  userType: string;
  severity: string;
}

const initialFilterData: FilterData = {
  timeRange: 'all',
  actionType: 'all',
  userType: 'all',
  severity: 'all',
};

const dummyLogs: ActivityLog[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    action: 'Profile Update',
    category: 'user',
    details: 'Updated profile information including bio and preferences',
    ipAddress: '192.168.1.1',
    timestamp: '2024-03-10T10:30:00',
  },
  {
    id: '2',
    userId: 'admin1',
    userName: 'Admin User',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    action: 'User Ban',
    category: 'admin',
    details: 'Banned user for violating community guidelines',
    ipAddress: '192.168.1.2',
    timestamp: '2024-03-10T09:15:00',
  },
  {
    id: '3',
    userId: 'system',
    userName: 'System',
    userAvatar: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=100&h=100&fit=crop',
    action: 'Maintenance',
    category: 'system',
    details: 'Scheduled system maintenance completed',
    ipAddress: 'internal',
    timestamp: '2024-03-09T22:00:00',
  },
];

export function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData);
  const [showFilters, setShowFilters] = useState(false);

  const filteredLogs = dummyLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesTimeRange = filterData.timeRange === 'all' ||
      (filterData.timeRange === 'today' && new Date(log.timestamp).toDateString() === new Date().toDateString()) ||
      (filterData.timeRange === 'week' && new Date(log.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterData.timeRange === 'month' && new Date(log.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const matchesActionType = filterData.actionType === 'all' || log.action.toLowerCase().includes(filterData.actionType.toLowerCase());
    const matchesUserType = filterData.userType === 'all' || 
      (filterData.userType === 'admin' && log.userId.startsWith('admin')) ||
      (filterData.userType === 'user' && log.userId.startsWith('user')) ||
      (filterData.userType === 'system' && log.userId === 'system');

    return matchesSearch && matchesCategory && matchesTimeRange && matchesActionType && matchesUserType;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'admin':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Activity Logs</h1>
        <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          <Download className="h-4 w-4" />
          Export Logs
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search logs..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="system">System</option>
          <option value="security">Security</option>
        </select>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Filter className="h-4 w-4" />
            More Filters
            {Object.values(filterData).some(value => value !== 'all') && (
              <span className="ml-1 rounded-full bg-blue-500 px-2 text-xs text-white">
                {Object.values(filterData).filter(value => value !== 'all').length}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Advanced Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Time Range
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                    value={filterData.timeRange}
                    onChange={(e) => setFilterData({ ...filterData, timeRange: e.target.value })}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Action Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                    value={filterData.actionType}
                    onChange={(e) => setFilterData({ ...filterData, actionType: e.target.value })}
                  >
                    <option value="all">All Actions</option>
                    <option value="login">Login</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="create">Create</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    User Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                    value={filterData.userType}
                    onChange={(e) => setFilterData({ ...filterData, userType: e.target.value })}
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Admins</option>
                    <option value="user">Regular Users</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Severity
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                    value={filterData.severity}
                    onChange={(e) => setFilterData({ ...filterData, severity: e.target.value })}
                  >
                    <option value="all">All Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setFilterData(initialFilterData);
                      setShowFilters(false);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start gap-4">
              <img
                src={log.userAvatar}
                alt={log.userName}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{log.userName}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{log.ipAddress}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    log.category === 'user' ? 'bg-blue-100 text-blue-800' :
                    log.category === 'admin' ? 'bg-purple-100 text-purple-800' :
                    log.category === 'system' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getCategoryIcon(log.category)}
                    {log.action}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{log.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredLogs.length} logs
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