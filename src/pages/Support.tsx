import React, { useState } from 'react';
import { Search, Filter, MessageSquare, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'account' | 'technical' | 'billing' | 'report' | 'other';
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string;
  responses: {
    id: string;
    message: string;
    from: 'user' | 'support';
    timestamp: string;
  }[];
}

const dummyTickets: SupportTicket[] = [
  {
    id: 'TICKET-001',
    userId: 'user1',
    userName: 'John Smith',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    subject: 'Cannot access premium features',
    message: 'I purchased premium subscription but cannot access the features.',
    status: 'open',
    priority: 'high',
    category: 'technical',
    createdAt: '2024-03-10T10:30:00',
    lastUpdated: '2024-03-10T10:30:00',
    responses: [],
  },
  {
    id: 'TICKET-002',
    userId: 'user2',
    userName: 'Emily Brown',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    subject: 'Billing issue with subscription',
    message: 'I was charged twice for my subscription this month.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'billing',
    createdAt: '2024-03-09T15:45:00',
    lastUpdated: '2024-03-09T16:30:00',
    assignedTo: 'Support Agent 1',
    responses: [
      {
        id: 'resp1',
        message: 'We are looking into this issue and will get back to you shortly.',
        from: 'support',
        timestamp: '2024-03-09T16:30:00',
      },
    ],
  },
];

export function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const filteredTickets = dummyTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Support Tickets</h1>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search tickets..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          className="rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="account">Account</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="report">Report</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${
                selectedTicket?.id === ticket.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={ticket.userAvatar}
                  alt={ticket.userName}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ticket.userName}</span>
                    <span className="text-sm text-gray-500">#{ticket.id}</span>
                  </div>
                  <h3 className="mt-1 font-medium">{ticket.subject}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status === 'open' && <Clock className="mr-1 h-3 w-3" />}
                      {ticket.status === 'in_progress' && <User className="mr-1 h-3 w-3" />}
                      {ticket.status === 'resolved' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {ticket.status === 'closed' && <XCircle className="mr-1 h-3 w-3" />}
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {ticket.message.length > 100
                      ? `${ticket.message.substring(0, 100)}...`
                      : ticket.message}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          {selectedTicket ? (
            <div className="h-full">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">#{selectedTicket.id}</h2>
                  <p className="text-sm text-gray-500">
                    Opened by {selectedTicket.userName} on{' '}
                    {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                    Resolve
                  </button>
                  <button className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedTicket.userAvatar}
                      alt={selectedTicket.userName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedTicket.userName}</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(selectedTicket.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {selectedTicket.message}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedTicket.responses.map((response) => (
                  <div
                    key={response.id}
                    className={`rounded-lg p-4 ${
                      response.from === 'support'
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {response.from === 'support' ? 'Support Agent' : selectedTicket.userName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(response.timestamp)}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{response.message}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reply
                </label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Type your response..."
                />
                <div className="mt-4 flex justify-end">
                  <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Send Response
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}