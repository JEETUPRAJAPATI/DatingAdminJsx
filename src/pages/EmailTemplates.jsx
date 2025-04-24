import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Copy, Eye } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

const initialFormData = {
  name: '',
  subject: '',
  type: 'welcome',
  description: '',
  content: '',
  active: true,
  variables: [],
};

const dummyTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Our Dating App!',
    type: 'welcome',
    description: 'Sent to new users after registration',
    content: `
      <h1>Welcome {{user_name}}!</h1>
      <p>Thank you for joining our dating app. We're excited to help you find meaningful connections.</p>
      <p>To get started, please verify your email by clicking the link below:</p>
      <a href="{{verification_link}}">Verify Email</a>
    `,
    lastModified: '2024-03-10T10:30:00',
    active: true,
    variables: ['user_name', 'verification_link'],
  },
  {
    id: '2',
    name: 'Email Verification',
    subject: 'Verify Your Email Address',
    type: 'verification',
    description: 'Email verification request',
    content: `
      <h1>Hello {{user_name}},</h1>
      <p>Please verify your email address by entering the following code:</p>
      <h2>{{verification_code}}</h2>
    `,
    lastModified: '2024-03-09T15:45:00',
    active: true,
    variables: ['user_name', 'verification_code'],
  },
];

export function EmailTemplates() {
  const [templates, setTemplates] = useState(dummyTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [newVariable, setNewVariable] = useState('');

  const handleOpenModal = (template = null) => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        type: template.type,
        description: template.description,
        content: template.content,
        active: template.active,
        variables: [...template.variables],
      });
      setSelectedTemplate(template);
    } else {
      setFormData(initialFormData);
      setSelectedTemplate(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTemplate) {
      setTemplates(templates.map(template =>
        template.id === selectedTemplate.id
          ? {
              ...template,
              ...formData,
              lastModified: new Date().toISOString(),
            }
          : template
      ));
    } else {
      const newTemplate = {
        id: String(templates.length + 1),
        ...formData,
        lastModified: new Date().toISOString(),
      };
      setTemplates([...templates, newTemplate]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter(template => template.id !== selectedTemplate.id));
      setIsDeleteModalOpen(false);
      setSelectedTemplate(null);
    }
  };

  const handleCopy = (template) => {
    const newTemplate = {
      ...template,
      id: String(templates.length + 1),
      name: `${template.name} (Copy)`,
      lastModified: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const addVariable = () => {
    if (newVariable.trim()) {
      setFormData({
        ...formData,
        variables: [...formData.variables, newVariable.trim()],
      });
      setNewVariable('');
    }
  };

  const removeVariable = (index) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((_, i) => i !== index),
    });
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Email Templates</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search templates..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="welcome">Welcome</option>
          <option value="verification">Verification</option>
          <option value="notification">Notification</option>
          <option value="marketing">Marketing</option>
          <option value="system">System</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{template.subject}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsViewModalOpen(true);
                  }}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenModal(template)}
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopy(template)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsDeleteModalOpen(true);
                  }}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                template.type === 'welcome' ? 'bg-green-100 text-green-800' :
                template.type === 'verification' ? 'bg-blue-100 text-blue-800' :
                template.type === 'notification' ? 'bg-purple-100 text-purple-800' :
                template.type === 'marketing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {template.type}
              </span>
              {template.active && (
                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Active
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {template.description}
            </p>

            <div className="mt-4">
              <p className="text-xs text-gray-500">Variables:</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {template.variables.map((variable, index) => (
                  <code
                    key={index}
                    className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {`{{${variable}}}`}
                  </code>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Last modified: {new Date(template.lastModified).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTemplate ? 'Edit Template' : 'New Template'}
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
              Subject
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({
                ...formData,
                type: e.target.value
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="welcome">Welcome</option>
              <option value="verification">Verification</option>
              <option value="notification">Notification</option>
              <option value="marketing">Marketing</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Variables
            </label>
            <div className="mt-2 space-y-2">
              {formData.variables.map((variable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={variable}
                    onChange={(e) => {
                      const newVariables = [...formData.variables];
                      newVariables[index] = e.target.value;
                      setFormData({ ...formData, variables: newVariables });
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariable(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  placeholder="Add new variable"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={addVariable}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add
                </button>
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
              {selectedTemplate ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="View Template"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{selectedTemplate.name}</h3>
              <p className="text-sm text-gray-500">{selectedTemplate.subject}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
            </div>
            <div className="flex justify-end">
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Template"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this template? This action cannot be undone.
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