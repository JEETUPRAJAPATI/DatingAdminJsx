import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Heart, Music, Camera, Gamepad, Book, Utensils, Plane, X } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Card, CardContent } from '../components/ui/Card';
import { Filters, FilterDropdown } from '../components/ui/Filters';

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

const dummyInterests = [
  {
    id: '1',
    name: 'Photography',
    category: 'Photography',
    usageCount: 1250,
    active: true,
    icon: 'Photography',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Hiking',
    category: 'Hobbies',
    usageCount: 980,
    active: true,
    icon: 'Hobbies',
    color: '#EF4444',
  },
  {
    id: '3',
    name: 'Cooking',
    category: 'Food',
    usageCount: 1500,
    active: true,
    icon: 'Food',
    color: '#10B981',
  },
  {
    id: '4',
    name: 'Gaming',
    category: 'Gaming',
    usageCount: 2100,
    active: true,
    icon: 'Gaming',
    color: '#8B5CF6',
  },
];

export function Interests() {
  const [interests, setInterests] = useState(dummyInterests);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const categories = Array.from(new Set(interests.map(interest => interest.category)));

  const handleOpenModal = (interest = null) => {
    if (interest) {
      setFormData({
        name: interest.name,
        category: interest.category,
        active: interest.active,
        icon: interest.icon,
        color: interest.color,
      });
      setSelectedInterest(interest);
    } else {
      setFormData(initialFormData);
      setSelectedInterest(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedInterest) {
      setInterests(interests.map(interest =>
        interest.id === selectedInterest.id
          ? { ...interest, ...formData }
          : interest
      ));
    } else {
      const newInterest = {
        id: String(interests.length + 1),
        ...formData,
        usageCount: 0,
      };
      setInterests([...interests, newInterest]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedInterest) {
      setInterests(interests.filter(interest => interest.id !== selectedInterest.id));
      setIsDeleteModalOpen(false);
      setSelectedInterest(null);
    }
  };

  const filteredInterests = interests.filter(interest => {
    const matchesSearch = interest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || interest.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
          options={categories.map(category => ({
            value: category,
            label: category,
          }))}
        />
      </Filters>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredInterests.map((interest) => {
          const IconComponent = categoryIcons[interest.icon];
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
                        style={{ backgroundColor: `${interest.color}20` }}
                      >
                        {IconComponent && (
                          <IconComponent
                            className="h-6 w-6"
                            style={{ color: interest.color }}
                          />
                        )}
                      </div>
                      <h3 className="text-lg font-medium">{interest.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${interest.color}20`,
                          color: interest.color,
                        }}
                      >
                        {interest.category}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {interest.usageCount.toLocaleString()} users
                      </span>
                      {interest.active && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          Active
                        </span>
                      )}
                    </div>
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
              </CardContent>
            </Card>
          );
        })}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const category = e.target.value;
                setFormData({
                  ...formData,
                  category,
                  icon: category,
                });
              }}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              {Object.keys(categoryIcons).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </label>
            <div className="mt-1 flex items-center gap-4">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-20 rounded-lg border border-gray-300"
              />
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {categoryIcons[formData.icon] && React.createElement(categoryIcons[formData.icon], {
                  className: "h-6 w-6",
                  style: { color: formData.color }
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Active
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