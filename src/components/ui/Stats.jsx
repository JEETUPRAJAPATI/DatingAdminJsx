import React from 'react';
import { cn } from '../../lib/utils';

export function StatsCard({
  title,
  value,
  icon,
  change,
  changeType,
  className,
}) {
  return (
    <div
      className={cn(
        'group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        <div className="text-blue-500 transition-transform group-hover:scale-110">
          {icon}
        </div>
      </div>
      {change && (
        <p
          className={cn(
            'mt-2 text-sm',
            changeType === 'increase' ? 'text-green-500' : 'text-red-500'
          )}
        >
          {change} from last month
        </p>
      )}
    </div>
  );
}

export function StatsGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}