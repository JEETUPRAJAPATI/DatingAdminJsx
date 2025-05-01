import React, { useState, useMemo, useEffect } from 'react';
import { Search, MessageSquare, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../lib/utils';
import * as supportService from '../services/support';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../../src/constants/api.js';
export function Support() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const { admin } = useAuthStore();
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  // Fetch tickets data on component mount and when filters change
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const response = await supportService.getAllTickets({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          search: searchTerm
        });

        if (response.status && response.data) {
          setTickets(response.data.tickets);
          if (response.data.tickets.length > 0 && !selectedTicket) {
            setSelectedTicket(response.data.tickets[0]);
          }
        }
      } catch (err) {
        setError('Error fetching tickets. Please try again later.');
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [searchTerm, statusFilter, priorityFilter]);

  const loadMoreTickets = async () => {
    try {
      setIsLoadingMore(true);
      const response = await supportService.getAllTickets({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: searchTerm
      });

      if (response.status && response.data) {
        setTickets(prev => [...prev, ...response.data.tickets]);
      }
    } catch (err) {
      toast.error(err.message || 'Error loading more tickets.');
      console.error('Error loading more tickets.', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const response = await supportService.updateTicketStatus(ticketId, status);
      if (response.status) {
        setTickets(prev =>
          prev.map(t => t.ticket_id === ticketId ? { ...t, status: status } : t)
        );
        setSelectedTicket(prev =>
          prev && prev.ticket_id === ticketId ? { ...prev, status: status } : prev
        );
      }
      // ✅ Show success toast
      toast.success(response.message || 'Ticket status updated successfully');
    } catch (err) {
      toast.error(err.message || 'Error updating ticket status.');
      console.error('Error updating ticket status:', err);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) return;

    // console.log('admin is a', admin);
    // return false;
    try {
      const sender = admin?.role || 'Admin'; // use actual logged-in user info
      console.log('sender is ', sender);
      const response = await supportService.replyTicket(
        selectedTicket.ticket_id,
        responseMessage,
        sender,
        admin.id
      );

      if (response) {
        const newResponse = {
          sender,
          message: responseMessage,
          created_at: new Date().toISOString()
        };

        setTickets(prev =>
          prev.map(t =>
            t.ticket_id === selectedTicket.ticket_id
              ? {
                ...t,
                messages: [...(t.messages || []), newResponse],
                updated_at: new Date().toISOString()
              }
              : t
          )
        );

        setSelectedTicket(prev => ({
          ...prev,
          messages: [...(prev.messages || []), newResponse],
          updated_at: new Date().toISOString()
        }));

        setResponseMessage('');
      }
    } catch (err) {
      setError('Error adding response.');
      console.error('Error adding response:', err);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && !isLoadingMore) {
      loadMoreTickets();
    }
  };

  if (loading && !isLoadingMore) {
    return <div className="flex justify-center items-center h-screen">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Support Tickets</h1>
        <div className="text-sm text-gray-500">
          Showing {tickets.length} of tickets
        </div>
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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2"

        >
          {filteredTickets.length > 0 ? (
            <>
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.ticket_id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${selectedTicket?.ticket_id === ticket.ticket_id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <img
                        src={
                          ticket?.profile_image instanceof File
                            ? URL.createObjectURL(ticket.profile_image)
                            : ticket?.profile_image
                              ? ticket.profile_image
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(ticket?.user_name || 'User')}`
                        }
                        alt={ticket?.user_name}
                        className="h-full w-full object-cover"
                      />
                    </div>


                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{ticket.user_name}</span>
                        <span className="text-sm text-gray-500">#{ticket.ticket_id}</span>
                      </div>
                      <h3 className="mt-1 font-medium">{ticket.subject}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ticket.status === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : ticket.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : ticket.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {ticket.status === 'open' && <Clock className="mr-1 h-3 w-3" />}
                          {ticket.status === 'in_progress' && <User className="mr-1 h-3 w-3" />}
                          {ticket.status === 'resolved' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {ticket.status === 'closed' && <XCircle className="mr-1 h-3 w-3" />}
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ticket.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : ticket.priority === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : ticket.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {ticket.message}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        {formatDate(ticket.updated_at)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {isLoadingMore && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}

            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tickets found matching your criteria
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          {selectedTicket ? (
            <div className="h-full flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">#{selectedTicket.ticket_id}</h2>
                  <p className="text-sm text-gray-500">
                    Opened by {selectedTicket.user_name} on {formatDate(selectedTicket.created_at)}
                    <br />
                    Last updated: {formatDate(selectedTicket.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateTicketStatus(selectedTicket.ticket_id, 'resolved')}
                      className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}
                  {selectedTicket.status !== 'closed' && (
                    <button
                      onClick={() => handleUpdateTicketStatus(selectedTicket.ticket_id, 'closed')}
                      className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {(selectedTicket.messages || []).map((message, index) => (
                  message.sender === 'admin' || message.sender === 'moderator' || message.sender === 'supervisor' ? (
                    // Admin message (right side)
                    <div key={index} className="flex justify-end gap-3 mb-4">
                      <div className="flex flex-col items-end max-w-[85%]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {formatDate(message.created_at)}
                          </span>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Support Agent
                          </span>
                        </div>
                        <div className="relative">
                          <div className="bg-blue-500 text-white rounded-lg rounded-tr-none px-4 py-2 shadow-sm">
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <div className="absolute -right-1 top-0 w-3 h-3 bg-blue-500 clip-triangle-right"></div>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img
                          src={
                            selectedTicket?.admin?.profile_image instanceof File
                              ? URL.createObjectURL(selectedTicket.admin.profile_image)
                              : selectedTicket?.admin?.profile_image
                                ? `${API_BASE_URL}/${selectedTicket.admin.profile_image}`
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTicket?.user_name || 'User')}`
                          }
                          alt={selectedTicket?.user_name || 'User'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    // User message (left side)
                    <div key={index} className="flex items-start gap-3 mb-4">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">

                        <img
                          src={
                            selectedTicket?.profile_image instanceof File
                              ? URL.createObjectURL(selectedTicket.profile_image)
                              : selectedTicket?.profile_image
                                ? selectedTicket.profile_image
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTicket?.user_name || 'User')}`
                          }
                          alt={selectedTicket?.user_name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col max-w-[85%]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {selectedTicket.user_name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
                            <p className="text-sm text-gray-800 dark:text-gray-200">{message.message}</p>
                          </div>
                          <div className="absolute -left-1 top-0 w-3 h-3 bg-gray-100 dark:bg-gray-700 clip-triangle-left"></div>
                        </div>
                      </div>
                    </div>
                  )
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
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    onClick={handleAddResponse}
                    disabled={!responseMessage.trim()}
                  >
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