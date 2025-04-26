import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, CreditCard, Crown } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import * as subscriptionService from '../services/subscription';

const initialFormData = {
  name: '',
  price: 0,
  duration_days: 30,
  features: [],
  status: 'active',
  isPopular: false,
  description: ''
};

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [newFeature, setNewFeature] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionService.getAllSubscriptions();
      if (response.status && response.plans) {
        setSubscriptions(response.plans);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (subscription = null) => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        price: subscription.price,
        duration_days: subscription.duration_days,
        features: [...subscription.features],
        status: subscription.status,
        isPopular: subscription.isPopular,
        description: subscription.description || ''
      });
      setSelectedSubscription(subscription);
    } else {
      setFormData(initialFormData);
      setSelectedSubscription(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSubscription) {
        const response = await subscriptionService.updateSubscription(selectedSubscription.id, formData);
        if (response.status) {
          toast.success('Subscription updated successfully');
          await fetchSubscriptions();
        }
      } else {
        const response = await subscriptionService.createSubscription(formData);
        if (response.status) {
          toast.success('Subscription created successfully');
          await fetchSubscriptions();
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (selectedSubscription) {
      try {
        await subscriptionService.updateSubscriptionStatus(selectedSubscription.id, 'inactive');
        toast.success('Subscription deleted successfully');
        await fetchSubscriptions();
        setIsDeleteModalOpen(false);
        setSelectedSubscription(null);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await subscriptionService.updateSubscriptionStatus(id, status);
      toast.success('Status updated successfully');
      await fetchSubscriptions();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showActive === null || subscription.status === (showActive ? 'active' : 'inactive');
    return matchesSearch && matchesStatus;
  });

  const renderSkeleton = () => {
    return Array(3).fill(null).map((_, index) => (
      <div key={index} className="relative rounded-xl border-2 border-gray-200 bg-white p-6 animate-pulse dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="ml-2 h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscription Plans</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your subscription plans and pricing</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add New Plan
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search plans..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={showActive === null ? 'all' : showActive ? 'active' : 'inactive'}
          onChange={(e) => {
            if (e.target.value === 'all') setShowActive(null);
            else setShowActive(e.target.value === 'active');
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          renderSkeleton()
        ) : (
          filteredSubscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className={`relative rounded-xl border-2 bg-white p-6 transition-all hover:shadow-lg dark:bg-gray-800 ${subscription.isPopular
                ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
                }`}
            >
              {subscription.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{subscription.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${subscription.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {subscription.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center">
                  <CreditCard className="mr-2 h-6 w-6 text-blue-500" />
                  <span className="text-3xl font-bold text-blue-600">
                    ${subscription.price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    /{subscription.duration_days} days
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => handleOpenModal(subscription)}
                  className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedSubscription(subscription);
                    setIsDeleteModalOpen(true);
                  }}
                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSubscription ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration (days)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Features
            </label>
            <div className="mt-2 space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      setFormData({ ...formData, features: newFeatures });
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Highlight as Popular</span>
            </label>
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
              {selectedSubscription ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Subscription Plan"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this subscription plan? This action cannot be undone.
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
