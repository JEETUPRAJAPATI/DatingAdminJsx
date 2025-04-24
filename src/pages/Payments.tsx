import React, { useState } from 'react';
import { Search, Download, Filter, Edit, Trash2, CreditCard, X } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';
import { Modal } from '../components/ui/Modal';
import type { Payment } from '../types';

interface PaymentFormData {
  userId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

interface FilterData {
  dateRange: string;
  amountRange: string;
  paymentMethod: string;
}

const initialFormData: PaymentFormData = {
  userId: '',
  amount: 0,
  status: 'completed',
  method: 'Credit Card',
};

const initialFilterData: FilterData = {
  dateRange: 'all',
  amountRange: 'all',
  paymentMethod: 'all',
};

const dummyPayments: Payment[] = [
  {
    id: '1',
    userId: 'user1',
    amount: 99.99,
    status: 'completed',
    method: 'Credit Card',
    date: '2024-03-10T10:30:00',
  },
  {
    id: '2',
    userId: 'user2',
    amount: 49.99,
    status: 'pending',
    method: 'PayPal',
    date: '2024-03-09T15:45:00',
  },
  {
    id: '3',
    userId: 'user3',
    amount: 149.99,
    status: 'failed',
    method: 'Bank Transfer',
    date: '2024-03-08T09:15:00',
  },
];

export function Payments() {
  const [payments, setPayments] = useState(dummyPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData);
  const [showFilters, setShowFilters] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);

  const handleOpenEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      userId: payment.userId,
      amount: payment.amount,
      status: payment.status,
      method: payment.method,
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPayment) {
      setPayments(payments.map(payment =>
        payment.id === selectedPayment.id
          ? { ...payment, ...formData }
          : payment
      ));
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedPayment) {
      setPayments(payments.filter(payment => payment.id !== selectedPayment.id));
      setIsDeleteModalOpen(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesDateRange = filterData.dateRange === 'all' ||
      (filterData.dateRange === 'today' && new Date(payment.date).toDateString() === new Date().toDateString()) ||
      (filterData.dateRange === 'week' && new Date(payment.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterData.dateRange === 'month' && new Date(payment.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const matchesAmountRange = filterData.amountRange === 'all' ||
      (filterData.amountRange === 'under50' && payment.amount < 50) ||
      (filterData.amountRange === '50to100' && payment.amount >= 50 && payment.amount <= 100) ||
      (filterData.amountRange === 'over100' && payment.amount > 100);
    const matchesPaymentMethod = filterData.paymentMethod === 'all' || payment.method === filterData.paymentMethod;

    return matchesSearch && matchesStatus && matchesDateRange && matchesAmountRange && matchesPaymentMethod;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payment History</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by user ID..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Filter className="h-4 w-4" />
            More Filters
            {Object.values(filterData).some(value => value !== 'all') && (
              <span className="ml-1 rounded-full bg-blue-500 px-2 text-xs text-white">
                {Object.values(filterData).filter(value => value !== 'all').length}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Range
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                    value={filterData.dateRange}
                    onChange={(e) => setFilterData({ ...filterData, dateRange: e.target.value })}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount Range
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                    value={filterData.amountRange}
                    onChange={(e) => setFilterData({ ...filterData, amountRange: e.target.value })}
                  >
                    <option value="all">All Amounts</option>
                    <option value="under50">Under $50</option>
                    <option value="50to100">$50 - $100</option>
                    <option value="over100">Over $100</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method
                  </label>
                  <select
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
                    value={filterData.paymentMethod}
                    onChange={(e) => setFilterData({ ...filterData, paymentMethod: e.target.value })}
                  >
                    <option value="all">All Methods</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setFilterData(initialFilterData);
                      setShowFilters(false);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {payment.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {payment.userId}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {payment.method}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(payment.date)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleOpenEditModal(payment)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Payment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Payment"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              User ID
            </label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({
                ...formData,
                status: e.target.value as 'completed' | 'pending' | 'failed'
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Method
            </label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Payment Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Payment"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this payment? This action cannot be undone.
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