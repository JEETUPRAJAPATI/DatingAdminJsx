import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Filters({
  searchPlaceholder = 'Search...',
  onSearch,
  searchValue,
  children,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center', className)}>
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterDropdown({
  label,
  value,
  onChange,
  options,
  className,
}) {
  return (
    <select
      className={cn(
        'rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800',
        className
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">{label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function AdvancedFilters({
  isOpen,
  onClose,
  onReset,
  onApply,
  children,
  title = 'Advanced Filters',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 sm:w-80">
      <div className="fixed inset-0 bg-black/20 sm:hidden" onClick={onClose} />
      <div className="relative w-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:w-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          {children}
          <div className="flex justify-end gap-2">
            <button
              onClick={onReset}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700"
            >
              Reset
            </button>
            <button
              onClick={onApply}
              className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}