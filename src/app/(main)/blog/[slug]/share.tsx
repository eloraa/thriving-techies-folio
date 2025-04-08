'use client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link2 } from 'lucide-react';
import * as React from 'react';

export const Share = ({ content }: { content?: string }) => {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const copy = async () => {
    await navigator.clipboard.writeText(content || window.location.href);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0} open={copied}>
        <TooltipTrigger asChild>
          <Button onClick={copy} variant="ghost" size="sm" className="px-0 h-auto rounded-none">
            <Link2 />
            Share
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copied</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
