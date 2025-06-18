import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, BarChart, BarChart3 } from "lucide-react";
import { Modal } from "../components/ui/Modal";
import { toast } from "react-hot-toast";
import * as quizService from "../services/quiz";

const initialQuestionForm = {
  question: "",
  options: [
    { text: "", category: "Self Soothing" },
    { text: "", category: "Social Support" },
    { text: "", category: "Self Soothing" },
    { text: "", category: "Social Support" },
  ],
  stage: 1,
};

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        {icon}
      </div>
      {trend && (
        <p className="mt-2 text-sm text-green-500">{trend} from last month</p>
      )}
    </div>
  );
}

export function Questions() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    total_quizzes: 0,
    average_score: 0,
    completion_rate: "0%",
    match_rate: "0%",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState(initialQuestionForm);
  const [stageFilter, setStageFilter] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [questionsRes, dashboardRes] = await Promise.all([
        quizService.getAllQuestions(),
        quizService.getQuizDashboard(),
      ]);

      if (questionsRes.status) {
        setQuestions(questionsRes.questions);
      }
      if (dashboardRes.status) {
        setDashboardStats(dashboardRes.data);
      }
    } catch (error) {
      toast.error("Failed to fetch quiz data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedQuestionForm = {
        ...questionForm,
        options: questionForm.options.map(({ text, category }) => ({
          text,
          category,
        })),
      };

      if (selectedQuestion) {
        const response = await quizService.updateQuestion(
          selectedQuestion.id,
          cleanedQuestionForm
        );
        if (response.status) {
          toast.success("Question updated successfully");
          await fetchInitialData();
          setIsQuestionModalOpen(false);
          setQuestionForm(JSON.parse(JSON.stringify(initialQuestionForm)));

          setSelectedQuestion(null);
        }
      } else {
        const response = await quizService.createQuestion(cleanedQuestionForm);
        if (response.status) {
          toast.success("Question created successfully");
          await fetchInitialData();
          setIsQuestionModalOpen(false);
          setQuestionForm(JSON.parse(JSON.stringify(initialQuestionForm)));

          setSelectedQuestion(null);
        }
      }
      setIsQuestionModalOpen(false);
    } catch (error) {
      if (Array.isArray(error.errors)) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedQuestion) {
        await quizService.deleteQuestion(selectedQuestion.id);
        toast.success("Question deleted successfully");
      }
      await fetchInitialData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter
      ? Number(question.stage) === Number(stageFilter)
      : true;
    return matchesSearch && matchesStage;
  });

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
        >
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
          <p className="mt-1 text-sm text-gray-500">
            Manage quiz questions and matching criteria
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedQuestion(null);
              setQuestionForm(JSON.parse(JSON.stringify(initialQuestionForm)));
              setIsQuestionModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 my-6">
        <StatCard
          title="Total Quizzes"
          value={dashboardStats.total_quizzes}
          icon={<BarChart className="h-8 w-8 text-blue-500" />}
          trend="+12%"
        />
        <StatCard
          title="Average Score"
          value={`${dashboardStats.average_score}%`}
          icon={<BarChart3 className="h-8 w-8 text-green-500" />}
          trend="+5%"
        />
        <StatCard
          title="Completion Rate"
          value={dashboardStats.completion_rate}
          icon={<BarChart className="h-8 w-8 text-purple-500" />}
          trend="+8%"
        />
        <StatCard
          title="Match Rate"
          value={dashboardStats.match_rate}
          icon={<BarChart3 className="h-8 w-8 text-red-500" />}
          trend="+15%"
        />
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
        <div className="flex gap-2">
          <div className="relative">
            <label className="sr-only" htmlFor="stageFilter">
              Filter by Stage
            </label>
            <select
              id="stageFilter"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="">All Stages</option>
              {[1, 2, 3].map((stage) => (
                <option key={stage} value={stage}>
                  Stage {stage}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {question.stage}
                    </span>
                  </div>

                  {question.type !== "text" && (
                    <div className="mt-2">
                      <p className="mb-1 text-sm font-medium text-gray-500">
                        Options:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option, index) => (
                          <span
                            key={index}
                            className={`rounded-full px-3 py-1 text-sm ${
                              option.is_correct
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
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
                        options: question.options || [],
                        stage: Number(question.stage) || 1,
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
        title={selectedQuestion ? "Edit Question" : "Add New Question"}
      >
        <form onSubmit={handleQuestionSubmit} className="space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Question<span className="text-red-800 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your question here"
              required
              value={questionForm.question}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, question: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Stage<span className="text-red-800 ml-1">*</span>
            </label>
            <select
              value={questionForm.stage}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  stage: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              {[...Array(3)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Stage {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Options with Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Options<span className="text-red-800 ml-1">*</span>
            </label>
            <div className="mt-2 space-y-2">
              {questionForm.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const updatedOptions = [...questionForm.options];
                      updatedOptions[index].text = e.target.value;
                      setQuestionForm({
                        ...questionForm,
                        options: updatedOptions,
                      });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <select
                    value={option.category}
                    onChange={(e) => {
                      const updatedOptions = [...questionForm.options];
                      updatedOptions[index].category = e.target.value;
                      setQuestionForm({
                        ...questionForm,
                        options: updatedOptions,
                      });
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="Self Soothing">Self Soothing</option>
                    <option value="Social Support">Social Support</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
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
              {selectedQuestion ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Are you sure you want to delete this <strong>Question</strong>? This
            action cannot be undone.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
