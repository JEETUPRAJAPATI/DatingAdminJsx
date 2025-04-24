import React, { useState } from 'react';
import {
  User,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Plus,
  MapPin,
  Calendar,
  Crown,
  Ban,
  Eye,
  MessageSquare,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { Modal } from '../components/ui/Modal';

const initialFormData = {
  name: '',
  email: '',
  status: 'active',
  location: {
    city: '',
    state: '',
  },
  age: 18,
  gender: 'Male',
};

const initialFilterOptions = {
  status: 'all',
  premium: 'all',
  age: 'all',
  gender: 'all',
  location: 'all',
  joinDate: 'all',
};

const dummyUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    status: 'active',
    premium: true,
    location: { city: 'New York', state: 'NY' },
    age: 28,
    gender: 'Male',
    joinedAt: '2024-01-15',
    lastActive: '2024-03-10',
    bio: 'Software engineer passionate about technology and innovation.',
    interests: ['Photography', 'Travel', 'Coding'],
    matches: 15,
    reportCount: 0,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'active',
    premium: false,
    location: { city: 'Los Angeles', state: 'CA' },
    age: 24,
    gender: 'Female',
    joinedAt: '2024-02-01',
    lastActive: '2024-03-09',
    bio: 'Artist and designer looking for creative connections.',
    interests: ['Art', 'Music', 'Design'],
    matches: 23,
    reportCount: 1,
  },
];

export function Users() {
  const [users, setUsers] = useState(dummyUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const handleOpenModal = (user = null) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        status: user.status,
        location: user.location,
        age: user.age,
        gender: user.gender,
      });
      setSelectedUser(user);
    } else {
      setFormData(initialFormData);
      setSelectedUser(null);
    }
    setIsUserModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      const newUser = {
        id: String(users.length + 1),
        ...formData,
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        premium: false,
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        bio: '',
        interests: [],
        matches: 0,
        reportCount: 0,
      };
      setUsers([...users, newUser]);
    }
    setIsUserModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const applyFilters = (user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterOptions.status === 'all' || user.status === filterOptions.status;
    const matchesPremium = filterOptions.premium === 'all' ||
                          (filterOptions.premium === 'premium' && user.premium) ||
                          (filterOptions.premium === 'free' && !user.premium);
    const matchesAge = filterOptions.age === 'all' ||
                      (filterOptions.age === '18-25' && user.age >= 18 && user.age <= 25) ||
                      (filterOptions.age === '26-35' && user.age >= 26 && user.age <= 35) ||
                      (filterOptions.age === '36+' && user.age >= 36);
    const matchesGender = filterOptions.gender === 'all' || user.gender === filterOptions.gender;
    const matchesLocation = filterOptions.location === 'all' || user.location.state === filterOptions.location;
    const matchesJoinDate = filterOptions.joinDate === 'all' ||
                           (filterOptions.joinDate === 'today' && new Date(user.joinedAt).toDateString() === new Date().toDateString()) ||
                           (filterOptions.joinDate === 'week' && new Date(user.joinedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                           (filterOptions.joinDate === 'month' && new Date(user.joinedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesStatus && matchesPremium && matchesAge && matchesGender && matchesLocation && matchesJoinDate;
  };

  const filteredUsers = users.filter(applyFilters);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and monitor user accounts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add New User
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
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
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Filter className="h-4 w-4" />
          Filters
          {Object.values(filterOptions).some(value => value !== 'all') && (
            <span className="ml-1 rounded-full bg-blue-500 px-2 text-xs text-white">
              {Object.values(filterOptions).filter(value => value !== 'all').length}
            </span>
          )}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Joined Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                        {user.premium && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        {user.reportCount > 0 && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    getStatusColor(user.status)
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location.city}, {user.location.state}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.age}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.gender}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(user.joinedAt)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsViewModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="More Actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Users"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={filterOptions.status}
              onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subscription
            </label>
            <select
              value={filterOptions.premium}
              onChange={(e) => setFilterOptions({ ...filterOptions, premium: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">All Users</option>
              <option value="premium">Premium Users</option>
              <option value="free">Free Users</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Age Range
            </label>
            <select
              value={filterOptions.age}
              onChange={(e) => setFilterOptions({ ...filterOptions, age: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">All Ages</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36+">36+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              value={filterOptions.gender}
              onChange={(e) => setFilterOptions({ ...filterOptions, gender: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Join Date
            </label>
            <select
              value={filterOptions.joinDate}
              onChange={(e) => setFilterOptions({ ...filterOptions, joinDate: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => {
                setFilterOptions(initialFilterOptions);
                setIsFilterModalOpen(false);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="h-20 w-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex rounded-full px-2 py-1 text-sm font-semibold ${
                  getStatusColor(selectedUser.status)
                }`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Subscription</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold">
                  {selectedUser.premium ? (
                    <>
                      <Crown className="h-4 w-4 text-yellow-500" />
                      Premium
                    </>
                  ) : (
                    'Free'
                  )}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Location</p>
                <p className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  {selectedUser.location.city}, {selectedUser.location.state}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedUser.joinedAt)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Bio</p>
              <p className="text-sm">{selectedUser.bio}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Interests</p>
              <div className="flex flex-wrap gap-2">
                {selectedUser.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                <p className="text-2xl font-bold text-blue-600">{selectedUser.matches}</p>
                <p className="text-sm text-gray-500">Matches</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                <p className="text-2xl font-bold text-red-600">{selectedUser.reportCount}</p>
                <p className="text-sm text-gray-500">Reports</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
                <p className="text-2xl font-bold text-green-600">
                  {new Date(selectedUser.lastActive).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">Last Active</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenModal(selectedUser);
                }}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </button>
              {selectedUser.status === 'active' ? (
                <button
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                >
                  <Ban className="h-4 w-4" />
                  Ban User
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-green-600 transition-colors hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/20"
                >
                  <Shield className="h-4 w-4" />
                  Activate User
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                City
              </label>
              <input
                type="text"
                required
                value={formData.location.city}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, city: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                State
              </label>
              <input
                type="text"
                required
                value={formData.location.state}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, state: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Age
              </label>
              <input
                type="number"
                required
                min="18"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({
                ...formData,
                status: e.target.value
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {selectedUser ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}