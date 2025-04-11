'use client';

import { cn } from '@/lib/utils';

export const VisuallyHidden = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  );
}; 