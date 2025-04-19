import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] border py-1 px-2 bg-accent/5 rounded border-accent/10 w-full disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-blue-500 focus-within:ring-1 focus-within:outline-none text-sm placeholder:text-muted-foreground',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
