import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter, HandIcon as DragHandleDots2Icon, AlertCircle, Settings, BarChart } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  active: boolean;
}

interface Question {
  id: string;
  question: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'OPEN_ENDED';
  category: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  required: boolean;
  order: number;
}

interface QuizSettings {
  questionsPerMatch: number;
  timeLimit: number;
  passingScore: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
}

interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

interface QuestionFormData {
  question: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'OPEN_ENDED';
  category: string;
  options: string[];
  correctAnswer: string[];
  points: number;
  required: boolean;
}

const initialCategoryForm: CategoryFormData = {
  name: '',
  description: '',
  active: true,
};

const initialQuestionForm: QuestionFormData = {
  question: '',
  type: 'MCQ',
  category: '',
  options: [],
  correctAnswer: [],
  points: 1,
  required: true,
};

const initialQuizSettings: QuizSettings = {
  questionsPerMatch: 10,
  timeLimit: 15,
  passingScore: 70,
  shuffleQuestions: true,
  showCorrectAnswers: false,
};

const dummyCategories: QuizCategory[] = [
  {
    id: '1',
    name: 'Personality',
    description: 'Questions about personality traits and preferences',
    questionCount: 15,
    active: true,
  },
  {
    id: '2',
    name: 'Lifestyle',
    description: 'Questions about daily habits and lifestyle choices',
    questionCount: 12,
    active: true,
  },
  {
    id: '3',
    name: 'Interests',
    description: 'Questions about hobbies and interests',
    questionCount: 10,
    active: true,
  },
];

const dummyQuestions: Question[] = [
  {
    id: '1',
    question: 'What are you looking for in a relationship?',
    type: 'MCQ',
    category: 'Personality',
    options: ['Long-term relationship', 'Casual dating', 'Friendship', 'Not sure yet'],
    correctAnswer: ['Long-term relationship', 'Casual dating'],
    points: 2,
    required: true,
    order: 1,
  },
  {
    id: '2',
    question: 'Do you enjoy outdoor activities?',
    type: 'TRUE_FALSE',
    category: 'Lifestyle',
    correctAnswer: ['true'],
    points: 1,
    required: true,
    order: 2,
  },
  {
    id: '3',
    question: 'Describe your ideal weekend',
    type: 'OPEN_ENDED',
    category: 'Interests',
    points: 3,
    required: false,
    order: 3,
  },
];

const dummyStats = {
  totalQuizzes: 1250,
  averageScore: 78,
  completionRate: 92,
  averageMatchRate: 65,
};

export function Questions() {
  const [categories, setCategories] = useState(dummyCategories);
  const [questions, setQuestions] = useState(dummyQuestions);
  const [quizSettings, setQuizSettings] = useState(initialQuizSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'category' | 'question'>('category');
  
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [questionForm, setQuestionForm] = useState(initialQuestionForm);

  const handleOpenCategoryModal = (category: QuizCategory | null = null) => {
    if (category) {
      setCategoryForm({
        name: category.name,
        description: category.description,
        active: category.active,
      });
      setSelectedCategory(category);
    } else {
      setCategoryForm(initialCategoryForm);
      setSelectedCategory(null);
    }
    setIsCategoryModalOpen(true);
  };

  const handleOpenQuestionModal = (question: Question | null = null) => {
    if (question) {
      setQuestionForm({
        question: question.question,
        type: question.type,
        category: question.category,
        options: question.options || [],
        correctAnswer: Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer || ''],
        points: question.points,
        required: question.required,
      });
      setSelectedQuestion(question);
    } else {
      setQuestionForm({ ...initialQuestionForm, category: categories[0].name });
      setSelectedQuestion(null);
    }
    setIsQuestionModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      setCategories(categories.map(category =>
        category.id === selectedCategory.id
          ? { ...category, ...categoryForm }
          : category
      ));
    } else {
      const newCategory = {
        id: String(categories.length + 1),
        ...categoryForm,
        questionCount: 0,
      };
      setCategories([...categories, newCategory]);
    }
    setIsCategoryModalOpen(false);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestion) {
      setQuestions(questions.map(question =>
        question.id === selectedQuestion.id
          ? {
              ...question,
              ...questionForm,
              options: questionForm.type === 'MCQ' ? questionForm.options : undefined,
            }
          : question
      ));
    } else {
      const newQuestion = {
        id: String(questions.length + 1),
        ...questionForm,
        options: questionForm.type === 'MCQ' ? questionForm.options : undefined,
        order: questions.length + 1,
      };
      setQuestions([...questions, newQuestion]);
      
      // Update category question count
      setCategories(categories.map(category =>
        category.name === questionForm.category
          ? { ...category, questionCount: category.questionCount + 1 }
          : category
      ));
    }
    setIsQuestionModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteType === 'category' && selectedCategory) {
      setCategories(categories.filter(category => category.id !== selectedCategory.id));
      setQuestions(questions.filter(question => question.category !== selectedCategory.name));
    } else if (deleteType === 'question' && selectedQuestion) {
      setQuestions(questions.filter(question => question.id !== selectedQuestion.id));
      setCategories(categories.map(category =>
        category.name === selectedQuestion.category
          ? { ...category, questionCount: category.questionCount - 1 }
          : category
      ));
    }
    setIsDeleteModalOpen(false);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter;
    const matchesType = typeFilter === 'all' || question.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Questions & Quiz</h1>
          <p className="mt-1 text-sm text-gray-500">Manage quiz categories, questions, and matching criteria</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenCategoryModal()}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
          <button
            onClick={() => handleOpenQuestionModal()}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Settings className="h-4 w-4" />
            Quiz Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Quizzes</p>
              <h3 className="text-2xl font-semibold">{dummyStats.totalQuizzes}</h3>
            </div>
            <BarChart className="h-8 w-8 text-blue-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+12% from last month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <h3 className="text-2xl font-semibold">{dummyStats.averageScore}%</h3>
            </div>
            <BarChart className="h-8 w-8 text-green-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+5% from last month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-semibold">{dummyStats.completionRate}%</h3>
            </div>
            <BarChart className="h-8 w-8 text-purple-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+8% from last month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Match Rate</p>
              <h3 className="text-2xl font-semibold">{dummyStats.averageMatchRate}%</h3>
            </div>
            <BarChart className="h-8 w-8 text-red-500" />
          </div>
          <p className="mt-2 text-sm text-green-500">+15% from last month</p>
        </div>
      </div>

      {/* Categories */}
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
                    {category.active ? (
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
                    onClick={() => handleOpenCategoryModal(category)}
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

      {/* Questions List */}
      <div>
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
              <option key={category.id} value={category.name}>
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
            <option value="MCQ">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="OPEN_ENDED">Open Ended</option>
          </select>
        </div>

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
                      {question.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {question.points} points
                    </span>
                  </div>

                  {question.type === 'MCQ' && question.options && (
                    <div className="mt-2">
                      <p className="mb-1 text-sm font-medium text-gray-500">Options:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option, index) => (
                          <span
                            key={index}
                            className={`rounded-full px-3 py-1 text-sm ${
                              question.correctAnswer?.includes(option)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === 'TRUE_FALSE' && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Correct answer: {question.correctAnswer?.[0]}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenQuestionModal(question)}
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
      </div>

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
              required
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={categoryForm.active}
              onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
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

      {/* Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={selectedQuestion ? 'Edit Question' : 'Add New Question'}
      >
        <form onSubmit={handleQuestionSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Question
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
                Type
              </label>
              <select
                value={questionForm.type}
                onChange={(e) => setQuestionForm({
                  ...questionForm,
                  type: e.target.value as 'MCQ' | 'TRUE_FALSE' | 'OPEN_ENDED',
                  options: e.target.value === 'MCQ' ? [] : undefined,
                  correctAnswer: e.target.value === 'TRUE_FALSE' ? ['true'] : [],
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="OPEN_ENDED">Open Ended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={questionForm.category}
                onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {questionForm.type === 'MCQ' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Options
              </label>
              <div className="mt-2 space-y-2">
                {questionForm.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[index] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <input
                      type="checkbox"
                      checked={questionForm.correctAnswer.includes(option)}
                      onChange={(e) => {
                        const newCorrectAnswers = e.target.checked
                          ? [...questionForm.correctAnswer, option]
                          : questionForm.correctAnswer.filter(answer => answer !== option);
                        setQuestionForm({ ...questionForm, correctAnswer: newCorrectAnswers });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = questionForm.options.filter((_, i) => i !== index);
                        setQuestionForm({
                          ...questionForm,
                          options: newOptions,
                          correctAnswer: questionForm.correctAnswer.filter(answer => answer !== option),
                        });
                      }}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setQuestionForm({
                    ...questionForm,
                    options: [...questionForm.options, ''],
                  })}
                  className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add Option
                </button>
              </div>
            </div>
          )}

          {questionForm.type === 'TRUE_FALSE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correct Answer
              </label>
              <select
                value={questionForm.correctAnswer[0]}
                onChange={(e) => setQuestionForm({
                  ...questionForm,
                  correctAnswer: [e.target.value],
                })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Points
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
              checked={questionForm.required}
              onChange={(e) => setQuestionForm({ ...questionForm, required: e.target.checked })}
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

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Quiz Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Questions per Match
            </label>
            <input
              type="number"
              min="1"
              value={quizSettings.questionsPerMatch}
              onChange={(e) => setQuizSettings({
                ...quizSettings,
                questionsPerMatch: Number(e.target.value),
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={quizSettings.timeLimit}
              onChange={(e) => setQuizSettings({
                ...quizSettings,
                timeLimit: Number(e.target.value),
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Passing Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={quizSettings.passingScore}
              onChange={(e) => setQuizSettings({
                ...quizSettings,
                passingScore: Number(e.target.value),
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shuffleQuestions"
              checked={quizSettings.shuffleQuestions}
              onChange={(e) => setQuizSettings({
                ...quizSettings,
                shuffleQuestions: e.target.checked,
              })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="shuffleQuestions" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Shuffle Questions
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showCorrectAnswers"
              checked={quizSettings.showCorrectAnswers}
              onChange={(e) => setQuizSettings({
                ...quizSettings,
                showCorrectAnswers: e.target.checked,
              })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showCorrectAnswers" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Show Correct Answers After Completion
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save Settings
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
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