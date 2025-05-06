import React, { useState, useEffect } from 'react';
import { Search, Filter, Ban, Clock, Undo2 } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import * as bannedUserService from '../services/bannedUser';

export function BannedUsers() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unbanReason, setUnbanReason] = useState('');

  useEffect(() => {
    fetchBannedUsers();
  }, [pagination.currentPage]);

  const fetchBannedUsers = async () => {
    try {
      setIsLoading(true);
      const response = await bannedUserService.getBannedUsers(pagination.currentPage);
      console.log('response', response.data.banned_users);
      if (response.status && response.data.banned_users) {
        setBannedUsers(response.data.banned_users);
        setPagination({
          currentPage: response.current_page,
          totalPages: response.total_pages,
          totalRecords: response.total_records
        });
      }
    } catch (error) {
      toast.error('Failed to fetch banned users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async () => {
    try {
      console.log('selectedUser', selectedUser)
      if (selectedUser && unbanReason.trim()) {
        const response = await bannedUserService.unbanUser(selectedUser.user?._id, unbanReason);
        if (response.status) {
          toast.success('User unbanned successfully');
          await fetchBannedUsers();
          setIsUnbanModalOpen(false);
          setSelectedUser(null);
          setUnbanReason('');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredUsers = bannedUsers.filter(user => {
    const matchesSearch = user?.user?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDuration = durationFilter === 'all' ||
      (durationFilter === 'temporary' && user?.duration > 0) ||
      (durationFilter === 'permanent' && !user.duration);
    return matchesSearch && matchesDuration;
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
            <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Banned Users</h1>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
        >
          <option value="all">All Durations</option>
          <option value="temporary">Temporary</option>
          <option value="permanent">Permanent</option>
        </select>
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={user.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user.full_name)}`}
                    alt={user.user.full_name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{user.user.full_name}</h3>
                      <span className="text-sm text-gray-500">{user.user.email}</span>
                    </div>
                    <p className="mt-1 text-sm text-red-600">
                      <Ban className="mr-1 inline-block h-4 w-4" />
                      {user.reason}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Banned on {formatDate(user.banned_on)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Duration: {user.duration ? `${user.duration} days` : 'Permanent'}
                      </span>
                      {user.expires_on && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          Expires: {formatDate(user.expires_on)}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Banned by: {user.banned_by.name}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsUnbanModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-green-600 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-900/20"
                  >
                    <Undo2 className="h-4 w-4" />
                    Unban
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
          Showing {filteredUsers.length} of {pagination.totalRecords} banned users
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

      {/* Unban Modal */}
      <Modal
        isOpen={isUnbanModalOpen}
        onClose={() => setIsUnbanModalOpen(false)}
        title="Unban User"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to unban this user? Please provide a reason for unbanning.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for Unbanning
            </label>
            <textarea
              value={unbanReason}
              onChange={(e) => setUnbanReason(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              rows={3}
              placeholder="Enter reason for unbanning..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsUnbanModalOpen(false);
                setUnbanReason('');
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUnban}
              disabled={!unbanReason.trim()}
              className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
            >
              Confirm Unban
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}