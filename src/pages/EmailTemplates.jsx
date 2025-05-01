import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Copy, Eye } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { toast } from 'react-hot-toast';
import * as emailService from '../services/emailTemplate';

const initialFormData = {
  name: '',
  subject: '',
  type: 'welcome',
  description: '',
  content: '',
  status: true,
  variables: [],
};

export function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [newVariable, setNewVariable] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTemplates: 0
  });

  useEffect(() => {
    fetchTemplates();
  }, []);


  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await emailService.getAllEmailTemplates();
      console.log('response is', response)
      if (response.status && response.data) {
        setTemplates(response.data);
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


  const handleOpenModal = (template = null) => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        type: template.type,
        description: template.description,
        content: template.content,
        status: template.status,
        variables: [...template.variables],
      });
      setSelectedTemplate(template);
    } else {
      setFormData(initialFormData);
      setSelectedTemplate(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('form data is ', formData)
      if (selectedTemplate) {
        const response = await emailService.updateEmailTemplate(selectedTemplate.id, formData);
        if (response.status) {
          toast.success('Template updated successfully');
          await fetchTemplates();
        }
      } else {
        const response = await emailService.createEmailTemplate(formData);
        if (response.status) {
          toast.success('Template created successfully');
          await fetchTemplates();
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleViewTemplate = async (templateId) => {
    try {
      const response = await emailService.getEmailTemplateById(templateId);
      if (response.status && response.data) {
        setSelectedTemplate(response.data);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      toast.error('Failed to load template details');
    }
  };


  const handleDelete = async () => {
    if (selectedTemplate) {
      try {
        const response = await emailService.deleteEmailTemplate(selectedTemplate.id);
        if (response.status) {
          toast.success('Template deleted');
          await fetchTemplates();
          setSelectedTemplate(null);
        }
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      } finally {
        setIsDeleteModalOpen(false);
      }
    }
  };


  const handleCopy = async (template) => {
    try {
      console.log('template', template)
      const { created_at, updated_at, ...rest } = template;

      const copied = {
        ...rest,
        name: `${template.name} (Copy)`,
      };
      delete copied.id; // remove ID if backend auto-generates
      const response = await emailService.createEmailTemplate(copied);
      if (response.status) {
        toast.success('Template copied');
        await fetchTemplates();
      }
    } catch (error) {
      toast.error('Failed to copy template');
    }
  };


  const addVariable = () => {
    setFormData({
      ...formData,
      variables: [...formData.variables, { name: '', type: 'string' }]
    });
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
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${template.type === 'welcome' ? 'bg-green-100 text-green-800' :
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
                    {`{{${variable.name}}}`}
                  </code>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Last modified: {new Date(template.updated_at).toLocaleString()}
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
                    value={variable.name}
                    onChange={(e) => {
                      const newVariables = [...formData.variables];
                      newVariables[index].name = e.target.value;
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
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
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