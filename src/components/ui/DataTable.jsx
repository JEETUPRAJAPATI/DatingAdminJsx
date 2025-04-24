import React from 'react';

export function DataTable({ data, columns, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Desktop View */}
        <table className="hidden min-w-full divide-y divide-gray-200 dark:divide-gray-700 lg:table">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`whitespace-nowrap px-6 py-4 ${column.className || ''}`}
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 lg:hidden">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={`space-y-3 p-4 ${
                onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
              }`}
            >
              {columns.map((column, index) => (
                <div key={index} className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[120px]">
                    {column.header}
                  </span>
                  <span className={`text-sm text-right flex-1 ${column.className || ''}`}>
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor])}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}