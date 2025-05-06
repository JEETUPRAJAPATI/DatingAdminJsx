import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Settings, BarChart, BarChart3, AlertCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import * as quizService from '../services/quiz';

const initialQuestionForm = {
  question: '',
  type: 'single',
  category_id: '',
  points: 5,
  options: [
    { text: '', is_correct: false },
    { text: '', is_correct: false }
  ],
  required: true
};

const initialCategoryForm = {
  name: '',
  description: '',
  status: 'active'
};

export function Questions() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dashboardStats, setDashboardStats] = useState({
    total_quizzes: 0,
    average_score: 0,
    completion_rate: '0%',
    match_rate: '0%'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questionForm, setQuestionForm] = useState(initialQuestionForm);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [deleteType, setDeleteType] = useState('question');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [questionsRes, categoriesRes, dashboardRes] = await Promise.all([
        quizService.getAllQuestions(),
        quizService.getAllCategories(),
        quizService.getQuizDashboard()
      ]);

      if (questionsRes.status) {
        setQuestions(questionsRes.questions);
      }
      if (categoriesRes.status) {
        setCategories(categoriesRes.categories);
      }
      if (dashboardRes.status) {
        setDashboardStats(dashboardRes.data);
      }
    } catch (error) {
      toast.error('Failed to fetch quiz data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {

      // Clean options before submit (remove _id)
      const cleanedQuestionForm = {
        ...questionForm,
        options: questionForm.options.map(({ text, is_correct }) => ({
          text,
          is_correct,
        })),
        required: questionForm.required ? "true" : "false",
      };
      console.log('cleanedQuestionForm', cleanedQuestionForm)
      if (selectedQuestion) {
        const response = await quizService.updateQuestion(selectedQuestion.id, cleanedQuestionForm);
        if (response.status) {
          toast.success('Question updated successfully');
          await fetchInitialData();
        }
      } else {
        const response = await quizService.createQuestion(questionForm);
        if (response.status) {
          toast.success('Question created successfully');
          await fetchInitialData();
        }
      }
      setIsQuestionModalOpen(false);
    } catch (error) {
      if (Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err.message));
      } else {
        toast.error(error.message || 'Something went wrong');
      }
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        const response = await quizService.updateCategory(selectedCategory.id, categoryForm);
        if (response.status) {
          toast.success('Category updated successfully');
          await fetchInitialData();
        }
      } else {
        const response = await quizService.createCategory(categoryForm);
        if (response.status) {
          toast.success('Category created successfully');
          await fetchInitialData();
        }
      }
      setIsCategoryModalOpen(false);
    } catch (error) {
      if (Array.isArray(error.errors)) {
        error.errors.forEach(err => toast.error(err.message));
      } else {
        toast.error(error.message || 'Something went wrong');
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'question' && selectedQuestion) {
        await quizService.deleteQuestion(selectedQuestion.id);
        toast.success('Question deleted successfully');
      } else if (deleteType === 'category' && selectedCategory) {
        await quizService.deleteCategory(selectedCategory.id);
        toast.success('Category deleted successfully');
      }
      await fetchInitialData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addOption = () => {
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, { text: '', is_correct: false }]
    });
  };

  const removeOption = (index) => {
    setQuestionForm({
      ...questionForm,
      options: questionForm.options.filter((_, i) => i !== index)
    });
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || question.category.id === categoryFilter;
    const matchesType = typeFilter === 'all' || question.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
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
          <h1 className="text-2xl font-semibold">Questions & Quiz</h1>
          <p className="mt-1 text-sm text-gray-500">Manage quiz categories, questions, and matching criteria</p>
        </div>
        <div className="flex gap-2">
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
              setSelectedQuestion(null);
              setQuestionForm(initialQuestionForm);
              setIsQuestionModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
          <button
            onClick={() => {
              // Handle quiz settings
            }}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
            Quiz Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Quizzes</p>
              <h3 className="text-2xl font-semibold">{dashboardStats.total_quizzes}</h3>
            </div>
            <BarChart className="h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+12% from last month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <h3 className="text-2xl font-semibold">{dashboardStats.average_score}%</h3>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+5% from last month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-semibold">{dashboardStats.completion_rate}</h3>
            </div>
            <BarChart className="h-8 w-8 text-purple-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+8% from last month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Match Rate</p>
              <h3 className="text-2xl font-semibold">{dashboardStats.match_rate}</h3>
            </div>
            <BarChart3 className="h-8 w-8 text-red-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+15% from last month</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {category.questionCount} questions
                    </span>
                    {category.status === 'active' ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inactive
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
                      setIsDeleteModalOpen(true);
                    }}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search questions..."
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
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
          <option value="text">Text Answer</option>
        </select>
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{question.question}</h3>
                    {question.required && (
                      <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        <AlertCircle className="h-3 w-3" />
                        Required
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {question.type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      {question.category.name}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {question.points} points
                    </span>
                  </div>

                  {question.type !== 'text' && (
                    <div className="mt-2">
                      <p className="mb-1 text-sm font-medium text-gray-500">Options:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option, index) => (
                          <span
                            key={index}
                            className={`rounded-full px-3 py-1 text-sm ${option.is_correct
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}
                          >
                            {option.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setQuestionForm({
                        question: question.question,
                        type: question.type,
                        category_id: question.category.id,
                        points: question.points,
                        options: question.options || [],
                        required: question.required
                      });
                      setIsQuestionModalOpen(true);
                    }}
                    className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setDeleteType('question');
                      setIsDeleteModalOpen(true);
                    }}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={selectedQuestion ? 'Edit Question' : 'Add New Question'}
      >
        <form onSubmit={handleQuestionSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Question<span className="text-red-800 ml-1 ">*</span>
            </label>
            <input
              type="text"
              required
              value={questionForm.question}
              onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type<span className="text-red-800 ml-1 ">*</span>
              </label>
              <select
                value={questionForm.type}
                onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Choice</option>
                <option value="text">Text Answer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category<span className="text-red-800 ml-1 ">*</span>
              </label>
              <select
                value={questionForm.category_id}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, category_id: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Choose One</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {(questionForm.type === 'single' || questionForm.type === 'multiple') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Options<span className="text-red-800 ml-1 ">*</span>
              </label>
              <div className="mt-2 space-y-2">
                {questionForm.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type={questionForm.type === 'single' ? 'radio' : 'checkbox'}
                      checked={option.is_correct}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        if (questionForm.type === 'single') {
                          newOptions.forEach((opt, i) => {
                            opt.is_correct = i === index;
                          });
                        } else {
                          newOptions[index].is_correct = e.target.checked;
                        }
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      className="h-4 w-4"
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[index].text = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                      placeholder={`Option ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add Option
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Points<span className="text-red-800 ml-1 ">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={questionForm.points}
              onChange={(e) => setQuestionForm({ ...questionForm, points: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={questionForm.required === true} // check if string is "true"
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  required: e.target.checked ? "true" : "false"
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="required" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Required
            </label>
          </div>


          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {selectedQuestion ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name<span className="text-red-800 ml-1 ">*</span>
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
              Description<span className="text-red-800 ml-1 ">*</span>
            </label>
            <textarea
              required
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={categoryForm.status}
              onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${deleteType === 'category' ? 'Category' : 'Question'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this {deleteType}? This action cannot be undone.
            {deleteType === 'category' && (
              <span className="mt-2 block font-medium text-red-600">
                Warning: This will also delete all questions in this category!
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