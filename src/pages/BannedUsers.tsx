import React, { useState } from 'react';
import { Search, Filter, Ban, Clock, Undo2 } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface BannedUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  reason: string;
  bannedAt: string;
  banDuration: string;
  banExpiry: string;
  bannedBy: string;
}

const dummyBannedUsers: BannedUser[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    reason: 'Multiple reports of harassment',
    bannedAt: '2024-03-01T10:30:00',
    banDuration: '30 days',
    banExpiry: '2024-03-31T10:30:00',
    bannedBy: 'Admin User',
  },
  {
    id: '2',
    name: 'Emily Brown',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    reason: 'Inappropriate content',
    bannedAt: '2024-03-05T15:45:00',
    banDuration: 'Permanent',
    banExpiry: '',
    bannedBy: 'System',
  },
];

export function BannedUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');

  const filteredUsers = dummyBannedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDuration = durationFilter === 'all' ||
                           (durationFilter === 'temporary' && user.banDuration !== 'Permanent') ||
                           (durationFilter === 'permanent' && user.banDuration === 'Permanent');
    return matchesSearch && matchesDuration;
  });

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
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{user.name}</h3>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                  <p className="mt-1 text-sm text-red-600">
                    <Ban className="mr-1 inline-block h-4 w-4" />
                    {user.reason}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      <Clock className="mr-1 h-3 w-3" />
                      Banned on {formatDate(user.bannedAt)}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      Duration: {user.banDuration}
                    </span>
                    {user.banExpiry && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Expires: {formatDate(user.banExpiry)}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Banned by: {user.bannedBy}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-green-600 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-900/20">
                  <Undo2 className="h-4 w-4" />
                  Unban
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length} banned users
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