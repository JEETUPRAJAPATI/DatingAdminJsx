import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { User, Search, Filter, Edit, Trash2, Eye, Plus, Ban, CheckCircle, Camera, Upload, X } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import * as userService from '../services/user';
import * as locationService from '../services/location';
import * as interestService from '../services/interests';

const initialFormData = {
  name: '',
  email: '',
  password: '',
  mobile: '',
  i_am: 'Male',
  interested_in: 'Female',
  age: 18,
  about: '',
  likes: [],
  interests: [],
  hobbies: [],
  skin_color: '',
  height: '',
  weight: '',
  address: {
    country: '',
    state: '',
    city: '',
    pincode: '',
    locality: ''
  },
  profession: '',
  marital_status: 'unmarried',
  category: 'Serious Relationship',
  profile_image: null,
  cover_image: null
};

export function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [interests, setInterests] = useState([]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUserStatus, setSelectedUserStatus] = useState({
    id: null,
    currentStatus: '',
    newStatus: '',
    reason: '',
    duration: '',
  });
  const openStatusModal = (user) => {
    setSelectedUserStatus({
      id: user.id,
      currentStatus: user.status,
      newStatus: user.status,
      reason: user.reason || '',
      duration: user.duration || '',
    });
    setStatusModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
    fetchCountries();
    fetchInterests();
  }, []);


  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers(page);
      if (response.status && response.data) {
        setUsers(response.data.users);
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.total_pages,
          totalUsers: response.data.total_users
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await locationService.getCountries();
      if (response.status) {
        setCountries(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch countries');
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await locationService.getStates(country);
      if (response.status) {
        setStates(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch states');
    }
  };

  const fetchCities = async (country, state) => {
    try {
      const response = await locationService.getCities(country, state);
      if (response.status) {
        setCities(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch cities');
    }
  };

  const fetchInterests = async () => {
    try {
      const response = await interestService.getAllInterests();
      console.log('response', response.interests)
      if (response.status) {
        setInterests(response.interests);
      }
    } catch (error) {
      toast.error('Failed to fetch interests');
    }
  };

  const interestOptions = interests.map((interest) => ({
    value: interest.id,
    label: interest.name,
    data: interest, // save full object here
  }));
  const handleOpenModal = async (user = null) => {
    if (user) {
      try {
        const response = await userService.getUserById(user.id);
        if (response.status && response.data) {
          const userData = response.data;
          const matchedInterests = (userData.interests || []).map((id) => {
            const match = interestOptions.find(opt => opt.value === id);
            return match ? match.data : null;
          }).filter(item => item !== null);

          setFormData({
            ...userData,
            interests: matchedInterests
          });

          setSelectedUser(userData);
        }
      } catch (error) {
        toast.error('Failed to fetch user details');
        return;
      }
    } else {
      setFormData(initialFormData);
      setSelectedUser(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedFormData = {
      ...formData,
      interests: formData.interests.map((interest) => interest.id), // Extract only the IDs
    };
    try {

      console.log('Processed formData', processedFormData);
      if (selectedUser) {
        const response = await userService.updateUser(selectedUser.id, processedFormData);
        if (response.status) {
          toast.success('User updated successfully');
          await fetchUsers(pagination.currentPage);
        }
      } else {
        const response = await userService.createUser(processedFormData);
        if (response.status) {
          toast.success('User created successfully');
          await fetchUsers(pagination.currentPage);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        const response = await userService.deleteUser(selectedUser.id);
        if (response.status) {
          toast.success('User deleted successfully');
          await fetchUsers(pagination.currentPage);
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await userService.updateUserStatus(id, status);
      if (response.status) {
        toast.success('Status updated successfully');
        await fetchUsers(pagination.currentPage);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const submitStatusChange = async () => {
    const { id, newStatus, reason, duration } = selectedUserStatus;

    try {
      const payload =
        newStatus === 'banned'
          ? { status: newStatus, reason, duration }
          : { status: newStatus };

      const response = await userService.banUser(id, payload);

      if (response.status) {
        toast.success('Status updated successfully');
        setStatusModalOpen(false);
        await fetchUsers(pagination.currentPage);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };


  const handleCountryChange = async (country) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        country,
        state: '',
        city: ''
      }
    });
    await fetchStates(country);
    setCities([]);
  };

  const handleStateChange = async (state) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        state,
        city: ''
      }
    });
    await fetchCities(formData.address.country, state);
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="space-x-2">
              <div className="inline-block h-6 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="inline-block h-6 w-6 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Users: {pagination.totalUsers}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search users..."
          className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={user.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-full w-full p-2 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user.address?.city}, {user.address?.state}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {user.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      onClick={() => handleStatusChange(
                        user.id,
                        user.status === 'active' ? 'inactive' : 'active'
                      )}
                      className={`cursor-pointer inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsViewModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openStatusModal(user)}
                        className={`${user.status === 'active'
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                          }`}
                      >
                        {user.status === 'active' ? (
                          <Ban className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchUsers(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          <button
            onClick={() => fetchUsers(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              {selectedUser.cover_image ? (
                <img
                  src={selectedUser.cover_image}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="relative px-6">
              <div className="absolute -top-16 left-6">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-gray-800">
                  {selectedUser.profile_image ? (
                    <img
                      src={selectedUser.profile_image}
                      alt={selectedUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-40">
                <h2 className="text-2xl font-bold">{selectedUser.name || 'N/A'}</h2>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mobile</span>
                      <span>{selectedUser.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age</span>
                      <span>{selectedUser.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender</span>
                      <span>{selectedUser.i_am || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Interested In</span>
                      <span>{selectedUser.interested_in || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold">Physical Attributes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Height</span>
                      <span>{selectedUser.height ? `${selectedUser.height} cm` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight</span>
                      <span>{selectedUser.weight ? `${selectedUser.weight} kg` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Skin Color</span>
                      <span>{selectedUser.skin_color || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold">Location</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Country</span>
                      <span>{selectedUser.address?.country || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">State</span>
                      <span>{selectedUser.address?.state || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">City</span>
                      <span>{selectedUser.address?.city || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pincode</span>
                      <span>{selectedUser.address?.pincode || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold">Additional Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Marital Status</span>
                      <span>{selectedUser.marital_status || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category</span>
                      <span>{selectedUser.category || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${selectedUser.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 font-semibold">About</h3>
                <p className="text-gray-600 dark:text-gray-300">{selectedUser.about || 'No description available.'}</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 font-semibold">Interests & Hobbies</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-500">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interests?.length > 0 ? (
                        selectedUser.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No interests added</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-500">Hobbies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.hobbies?.length > 0 ? (
                        selectedUser.hobbies.map((hobby, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                          >
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No hobbies added</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenModal(selectedUser);
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            {formData.cover_image ? (
              <>
                <img
                  src={typeof formData.cover_image === 'string' ? formData.cover_image : URL.createObjectURL(formData.cover_image)}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cover_image: null })}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <label className="flex h-full w-full cursor-pointer items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, cover_image: file });
                    }
                  }}
                />
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload cover image</p>
                </div>
              </label>
            )}
          </div>

          {/* Profile Image Upload */}
          <div className="relative mx-auto h-32 w-32">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white dark:border-gray-800">
              {formData.profile_image ? (
                <img
                  src={typeof formData.profile_image === 'string' ? formData.profile_image : URL.createObjectURL(formData.profile_image)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, profile_image: file });
                  }
                }}
              />
              <Camera className="h-4 w-4" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"> {/* Make it span full width */}
              <h4 className="mb-2 text-sm font-medium text-gray-500">Interests</h4>
              <Select
                options={interestOptions}
                isMulti
                value={formData.interests.map((selectedInterest) => ({
                  value: selectedInterest.id,
                  label: selectedInterest.name,
                  data: selectedInterest,
                }))}
                onChange={(selectedOptions) => {
                  const selectedInterests = selectedOptions.map((opt) => opt.data);
                  setFormData((prev) => ({
                    ...prev,
                    interests: selectedInterests,
                  }));
                }}
                placeholder="Select Interests"
                className="w-full" // Force full width
                classNamePrefix="select"
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mobile
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">

                Age
              </label>
              <input
                type="number"
                min="18"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                I am
              </label>
              <select
                value={formData.i_am}
                onChange={(e) => setFormData({ ...formData, i_am: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Interested In
              </label>
              <select
                value={formData.interested_in}
                onChange={(e) => setFormData({ ...formData, interested_in: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              About
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Country
              </label>
              <Select
                options={countries.map((country) => ({
                  value: country.name,
                  label: country.name,
                }))}
                value={formData.address?.country ? { value: formData.address?.country, label: formData.address?.country } : null}
                onChange={(selectedOption) => handleCountryChange(selectedOption?.value)}
                placeholder="Select Country"
                isSearchable={true}
                className="mt-1"
                isClearable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                State
              </label>
              <Select
                options={states.map((state) => ({
                  value: state.name,
                  label: state.name,
                }))}
                value={formData.address?.state ? { value: formData.address?.state, label: formData.address?.state } : null}
                onChange={(selectedOption) => handleStateChange(selectedOption?.value)}
                placeholder="Select State"
                className="mt-1"
                isClearable
                isSearchable={true}
                isDisabled={!formData.address?.country}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                City
              </label>
              <Select
                options={cities.map((city) => ({
                  value: city,
                  label: city,
                }))}
                value={formData.address?.city ? { value: formData.address?.city, label: formData.address?.city } : null}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: selectedOption?.value },
                  })
                }
                placeholder="Select City"
                className="mt-1"
                isClearable
                isSearchable={true}
                isDisabled={!formData.address?.state}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pincode
              </label>
              <input
                type="text"
                value={formData.address?.pincode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, pincode: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Locality
              </label>
              <input
                type="text"
                value={formData.address?.locality}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, locality: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skin Color
              </label>
              <input
                type="text"
                value={formData.skin_color}
                onChange={(e) => setFormData({ ...formData, skin_color: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Marital Status
              </label>
              <select
                value={formData.marital_status}
                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="unmarried">Unmarried</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="Serious Relationship">Serious Relationship</option>
              <option value="Casual Dating">Casual Dating</option>
              <option value="Friendship">Friendship</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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



      {statusModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Change User Status</h2>

            <select
              className="w-full mb-4 border p-2 rounded"
              value={selectedUserStatus.newStatus}
              onChange={(e) =>
                setSelectedUserStatus((prev) => ({
                  ...prev,
                  newStatus: e.target.value,
                }))
              }
            >
              <option value="">select</option>
              <option value="banned">Banned</option>
            </select>

            {selectedUserStatus.newStatus === 'banned' && (
              <>
                <input
                  type="text"
                  className="w-full mb-2 border p-2 rounded"
                  placeholder="Ban Reason"
                  value={selectedUserStatus.reason}
                  onChange={(e) =>
                    setSelectedUserStatus((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                />

                <input
                  type="number"
                  className="w-full mb-4 border p-2 rounded"
                  placeholder="Duration (days)"
                  value={selectedUserStatus.duration}
                  onChange={(e) =>
                    setSelectedUserStatus((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                />
              </>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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