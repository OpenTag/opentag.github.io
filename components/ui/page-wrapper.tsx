'use client';

import { ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  loadingSize?: 'sm' | 'md' | 'lg';
}

export function PageWrapper({ 
  children, 
  isLoading = false, 
  className, 
  loadingSize = 'md' 
}: PageWrapperProps) {
  return (
    <div className={cn(
      'min-h-screen w-full py-10 px-4 sm:px-6',
      className
    )}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[70vh]">
          <LoadingSpinner size={loadingSize} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}