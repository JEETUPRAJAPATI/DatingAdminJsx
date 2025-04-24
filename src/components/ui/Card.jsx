import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4 flex flex-col space-y-1.5', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 flex items-center', className)}>
      {children}
    </div>
  );
}