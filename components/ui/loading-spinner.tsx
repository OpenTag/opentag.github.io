'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-24 w-24 border-4'
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div 
        className={cn(
          'animate-spin rounded-full border-t-red-500 border-b-red-500 border-l-transparent border-r-transparent',
          sizeClasses[size],
          className
        )}
        aria-label="Loading"
      />
    </div>
  );
}