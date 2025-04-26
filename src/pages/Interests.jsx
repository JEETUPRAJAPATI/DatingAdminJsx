import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Heart, Music, Gamepad, Book, Utensils, Plane, X } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import * as interestService from '../services/interests';

const categoryIcons = {
  'Hobbies': Heart,
  'Music': Music,
  'Gaming': Gamepad,
  'Reading': Book,
  'Food': Utensils,
  'Travel': Plane,
};

const initialInterestForm = {
  name: '',
  category_id: '',
  color: '#3B82F6',
  status: 'active'
};

const initialCategoryForm = {
  name: '',
  description: '',
  status: 'active'
};

export function Interests() {
  const [interests, setInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [interestForm, setInterestForm] = useState(initialInterestForm);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [deleteType, setDeleteType] = useState('interest');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [interestsRes, categoriesRes] = await Promise.all([
        interestService.getAllInterests(),
        interestService.getAllCategories()
      ]);

      if (interestsRes.status) {
        setInterests(interestsRes.interests);
      }
      if (categoriesRes.status) {
        setCategories(categoriesRes.categories);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedInterest) {
        await interestService.updateInterest(selectedInterest.id, interestForm);
        toast.success('Interest updated successfully');
      } else {
        await interestService.createInterest(interestForm);
        toast.success('Interest created successfully');
      }
      await fetchData();
      setIsInterestModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await interestService.updateCategory(selectedCategory.id, categoryForm);
        toast.success('Category updated successfully');
      } else {
        await interestService.createCategory(categoryForm);
        toast.success('Category created successfully');
      }
      await fetchData();
      setIsCategoryModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'interest' && selectedInterest) {
        await interestService.deleteInterest(selectedInterest.id);
        toast.success('Interest deleted successfully');
      } else if (deleteType === 'category' && selectedCategory) {
        await interestService.deleteCategory(selectedCategory.id);
        toast.success('Category deleted successfully');
      }
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredInterests = interests.filter(interest => {
    const matchesSearch = interest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || interest.category.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const renderSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Interest Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user interests and categories</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCategoryListOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            View Categories
          </button>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCategoryForm(initialCategoryForm);
              setIsCategoryModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
          <button
            onClick={() => {
              setSelectedInterest(null);
              setInterestForm(initialInterestForm);
              setIsInterestModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Add Interest
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search interests..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredInterests.map((interest) => {
            const IconComponent = categoryIcons[interest.category?.name] || Heart;
            return (
              <div
                key={interest.id}
                className="group relative rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg p-2"
                        style={{ backgroundColor: `${interest.color}20` }}
                      >
                        <IconComponent
                          className="h-6 w-6"
                          style={{ color: interest.color }}
                        />
                      </div>
                      <h3 className="text-lg font-medium">{interest.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {interest.category?.name}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {interest.users_count || 0} users
                      </span>
                      {interest.status === 'active' && (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute right-4 top-4 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setSelectedInterest(interest);
                        setInterestForm({
                          name: interest.name,
                          category_id: interest.category.id,
                          color: interest.color,
                          status: interest.status
                        });
                        setIsInterestModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInterest(interest);
                        setDeleteType('interest');
                        setIsDeleteModalOpen(true);
                      }}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interest Modal */}
      <Modal
        isOpen={isInterestModalOpen}
        onClose={() => setIsInterestModalOpen(false)}
        title={selectedInterest ? 'Edit Interest' : 'Add New Interest'}
      >
        <form onSubmit={handleInterestSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              required
              value={interestForm.name}
              onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              required
              value={interestForm.category_id}
              onChange={(e) => setInterestForm({ ...interestForm, category_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </label>
            <input
              type="color"
              value={interestForm.color}
              onChange={(e) => setInterestForm({ ...interestForm, color: e.target.value })}
              className="mt-1 h-10 w-full rounded-lg border border-gray-300"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={interestForm.status === 'active'}
              onChange={(e) => setInterestForm({
                ...interestForm,
                status: e.target.checked ? 'active' : 'inactive'
              })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Active
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsInterestModalOpen(false)}
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

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="categoryActive"
              checked={categoryForm.status === 'active'}
              onChange={(e) => setCategoryForm({
                ...categoryForm,
                status: e.target.checked ? 'active' : 'inactive'
              })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="categoryActive" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Active
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {selectedCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category List Modal */}
      <Modal
        isOpen={isCategoryListOpen}
        onClose={() => setIsCategoryListOpen(false)}
        title="Categories"
      >
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {category.interests_count || 0} interests
                  </span>
                  {category.status === 'active' && (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setCategoryForm({
                      name: category.name,
                      description: category.description,
                      status: category.status
                    });
                    setIsCategoryListOpen(false);
                    setIsCategoryModalOpen(true);
                  }}
                  className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setDeleteType('category');
                    setIsCategoryListOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${deleteType === 'category' ? 'Category' : 'Interest'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this {deleteType}? This action cannot be undone.
            {deleteType === 'category' && (
              <span className="mt-2 block font-medium text-red-600">
                Warning: This will also delete all interests in this category!
              </span>
            )}
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