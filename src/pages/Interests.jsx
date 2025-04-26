import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Heart, Music, Camera, Gamepad, Book, Utensils, Plane, X } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Card, CardContent } from '../components/ui/Card';
import { Filters, FilterDropdown } from '../components/ui/Filters';
import { toast } from 'react-hot-toast';
import * as interestService from '../services/interests';

const categoryIcons = {
  'Hobbies': Heart,
  'Music': Music,
  'Photography': Camera,
  'Gaming': Gamepad,
  'Reading': Book,
  'Food': Utensils,
  'Travel': Plane,
};

const initialFormData = {
  name: '',
  category: 'Hobbies',
  active: true,
  icon: 'Hobbies',
  color: '#3B82F6',
};

export function Interests() {
  const [interests, setInterests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      setIsLoading(true);
      const response = await interestService.getAllInterests();
      if (response.status && response.interests) {
        setInterests(response.interests);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch interests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (interest = null) => {
    if (interest) {
      setFormData({
        name: interest.name,
        category: interest.category || 'Hobbies',
        active: true,
        icon: interest.icon || 'Hobbies',
        color: interest.color || '#3B82F6',
      });
      setSelectedInterest(interest);
    } else {
      setFormData(initialFormData);
      setSelectedInterest(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedInterest) {
        const response = await interestService.updateInterest(selectedInterest.id, { name: formData.name });
        if (response.status) {
          toast.success('Interest updated successfully');
          await fetchInterests();
        }
      } else {
        const response = await interestService.createInterest({ name: formData.name });
        if (response.status) {
          toast.success('Interest created successfully');
          await fetchInterests();
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (selectedInterest) {
      try {
        const response = await interestService.deleteInterest(selectedInterest.id);
        if (response.status) {
          toast.success('Interest deleted successfully');
          await fetchInterests();
          setIsDeleteModalOpen(false);
          setSelectedInterest(null);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const filteredInterests = interests.filter(interest => {
    const matchesSearch = interest.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const renderSkeleton = () => {
    return Array(6).fill(null).map((_, index) => (
      <Card key={index} className="group relative animate-pulse transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Interest Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user interests and categories</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Interest
        </button>
      </div>

      <Filters
        searchPlaceholder="Search interests..."
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      >
        <FilterDropdown
          label="All Categories"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={Object.keys(categoryIcons).map(category => ({
            value: category,
            label: category,
          }))}
        />
      </Filters>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          renderSkeleton()
        ) : (
          filteredInterests.map((interest) => {
            const IconComponent = categoryIcons[interest.icon] || Tag;
            return (
              <Card
                key={interest.id}
                className="group relative transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-lg p-2"
                          style={{ backgroundColor: `${interest.color || '#3B82F6'}20` }}
                        >
                          <IconComponent
                            className="h-6 w-6"
                            style={{ color: interest.color || '#3B82F6' }}
                          />
                        </div>
                        <h3 className="text-lg font-medium">{interest.name}</h3>
                      </div>
                    </div>

                    <div className="absolute right-4 top-4 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleOpenModal(interest)}
                        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInterest(interest);
                          setIsDeleteModalOpen(true);
                        }}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedInterest ? 'Edit Interest' : 'Add New Interest'}
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
              {selectedInterest ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Interest"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this interest? This action cannot be undone.
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