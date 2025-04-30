import React, { useState, useEffect } from 'react';
import { Search, Filter, Activity, User, Settings, Shield, Download, X } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { toast } from 'react-hot-toast';
import * as activityLogService from '../services/activityLog';

export function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterData, setFilterData] = useState({
    userId: '',
    action: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [pagination.currentPage, filterData]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await activityLogService.getActivityLogs({
        page: pagination.currentPage,
        perPage: 10,
        ...filterData
      });
      console.log('data is', response);
      if (response.status) {
        setLogs(response.data?.logs);
        setPagination({
          currentPage: response.current_page,
          totalPages: response.total_pages,
          totalRecords: response.total_records
        });
      }
    } catch (error) {
      toast.error('Failed to fetch activity logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await activityLogService.clearAllLogs();
      toast.success('All logs cleared successfully');
      await fetchLogs();
    } catch (error) {
      toast.error('Failed to clear logs');
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await activityLogService.deleteLog(id);
      toast.success('Log deleted successfully');
      await fetchLogs();
    } catch (error) {
      toast.error('Failed to delete log');
    }
  };

  const handleFilterSubmit = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    setFilterData({
      userId: '',
      action: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShowFilters(false);
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Activity Logs</h1>
        <div className="flex gap-2">
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-red-600 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-900/20"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
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
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Filter className="h-4 w-4" />
          Filters
          {Object.values(filterData).some(value => value !== '' && value !== 'all') && (
            <span className="ml-1 rounded-full bg-blue-500 px-2 text-xs text-white">
              {Object.values(filterData).filter(value => value !== '' && value !== 'all').length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                User ID
              </label>
              <input
                type="text"
                value={filterData.userId}
                onChange={(e) => setFilterData({ ...filterData, userId: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Filter by user ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Action Type
              </label>
              <select
                value={filterData.action}
                onChange={(e) => setFilterData({ ...filterData, action: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="profile_update">Profile Update</option>
                <option value="payment">Payment</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date From
              </label>
              <input
                type="date"
                value={filterData.dateFrom}
                onChange={(e) => setFilterData({ ...filterData, dateFrom: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date To
              </label>
              <input
                type="date"
                value={filterData.dateTo}
                onChange={(e) => setFilterData({ ...filterData, dateTo: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleFilterReset}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              onClick={handleFilterSubmit}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={log.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(log.user_name)}`}
                    alt={log.user_name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.user_name}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{log.ip_address}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${log.category === 'user' ? 'bg-blue-100 text-blue-800' :
                        log.category === 'admin' ? 'bg-purple-100 text-purple-800' :
                          log.category === 'system' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {log.category === 'user' && <User className="h-4 w-4" />}
                        {log.category === 'admin' && <Shield className="h-4 w-4" />}
                        {log.category === 'system' && <Settings className="h-4 w-4" />}
                        {log.action}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{log.details}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {logs.length} of {pagination.totalRecords} logs
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