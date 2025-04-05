'use client';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon } from 'lucide-react';
import React from 'react';

export const GoToTop = () => {
  return (
    <Button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
      variant="ghost"
      size="sm"
      className="h-auto px-0 rounded-none border-b border-black border-dotted hover:bg-transparent gap-1 text-sm absolute left-1/2 -translate-x-1/2 max-md:hidden"
    >
      Back to Top <ArrowUpIcon />
    </Button>
  );
};
