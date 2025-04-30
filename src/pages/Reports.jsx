import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Shield, Ban, MessageSquare } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { toast } from 'react-hot-toast';
import * as reportService from '../services/report';

export function Reports() {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [pagination.currentPage]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await reportService.getAllReports(pagination.currentPage);
      console.log('report list is ', response.data.reports)
      if (response.status) {
        setReports(response.data.reports);
        setPagination({
          currentPage: response.current_page,
          totalPages: response.total_pages,
          totalRecords: response.total_records
        });
      }
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await reportService.updateReportStatus(id, status);
      toast.success('Report status updated successfully');
      await fetchReports();
    } catch (error) {
      toast.error('Failed to update report status');
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await reportService.deleteReport(id);
      toast.success('Report deleted successfully');
      await fetchReports();
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reported_user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-2xl font-semibold">Reported Users</h1>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by name..."
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
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={report.reported_user_avatar}
                    alt={report.reported_user_name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{report.reported_user_name}</h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : report.status === 'investigating'
                            ? 'bg-blue-100 text-blue-800'
                            : report.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Reported by {report.reporter_name} • {formatDate(report.date)}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {report.reason}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{report.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(report.id, 'investigating')}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Investigate"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(report.id, 'resolved')}
                    className="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    title="Mark as Resolved"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(report.id, 'banned')}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Ban User"
                  >
                    <Ban className="h-4 w-4" />
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
          Showing {filteredReports.length} of {pagination.totalRecords} reports
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