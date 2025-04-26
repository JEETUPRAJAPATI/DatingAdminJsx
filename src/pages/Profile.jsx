import React, { useState, useEffect } from 'react';
import { Camera, Save, Lock } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import * as profileService from '../services/profile';
import { useAuthStore } from '../store/useAuthStore';

export function Profile() {
  const { admin, setAdmin, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    profile_image: null
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getProfile();
      if (response.status && response.profile) {
        setProfile(response.profile);
        setAdmin(response.profile);
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await profileService.updateProfile(profile);
      if (response.status) {
        toast.success('Profile updated successfully');
        setAdmin(response.profile);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await profileService.changePassword(passwordData);
      if (response.status) {
        toast.success('Password changed successfully');
        setIsPasswordModalOpen(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        // Logout user after password change
        logout();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfile({ ...profile, profile_image: file });
    }
  };

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-4 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-6">
            <div className="h-10 w-48 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-medium">Profile Information</h2>
          <div className="mt-4 flex items-center justify-center">
            <div className="relative">
              <img
                src={profile.profile_image instanceof File ? URL.createObjectURL(profile.profile_image) :
                  profile.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`}
                alt={profile.name}
                className="h-32 w-32 rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mobile
              </label>
              <input
                type="tel"
                value={profile.mobile}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <input
                type="text"
                value={profile.role}
                disabled
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-medium">Security</h2>
          <div className="mt-6">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Lock className="h-4 w-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              required
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}