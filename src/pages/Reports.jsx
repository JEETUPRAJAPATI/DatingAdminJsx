import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Shield, Ban, MessageSquare } from 'lucide-react';

interface Report {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  date: string;
  description: string;
}

const dummyReports: Report[] = [
  {
    id: '1',
    reportedUserId: 'user1',
    reportedUserName: 'John Doe',
    reportedUserAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    reporterId: 'user2',
    reporterName: 'Jane Smith',
    reason: 'Inappropriate Content',
    status: 'pending',
    date: '2024-03-10T10:30:00',
    description: 'User posted inappropriate content in their profile.',
  },
  {
    id: '2',
    reportedUserId: 'user3',
    reportedUserName: 'Mike Johnson',
    reportedUserAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    reporterId: 'user4',
    reporterName: 'Sarah Wilson',
    reason: 'Harassment',
    status: 'investigating',
    date: '2024-03-09T15:45:00',
    description: 'User is sending harassing messages repeatedly.',
  },
];

export function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = dummyReports.filter(report => {
    const matchesSearch = report.reportedUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={report.reportedUserAvatar}
                  alt={report.reportedUserName}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{report.reportedUserName}</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Reported by {report.reporterName} • {new Date(report.date).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      {report.reason}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {report.description}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                  <Shield className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Ban className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredReports.length} reports
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