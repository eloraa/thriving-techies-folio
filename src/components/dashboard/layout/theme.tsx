'use client';
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/store/theme';
import { cn } from '@/lib/utils';

export const Theme = ({ theme: defaultTheme }: { theme: string }) => {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setTheme(defaultTheme === 'dark' ? 'dark' : 'light');
  }, [defaultTheme, setTheme]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn('rounded-full p-2 h-auto w-auto', theme === 'light' && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground')}
            onClick={() => setTheme('light')}
          >
            <span className="sr-only">Light</span>
            <SunIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-accent/10">Light</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn('rounded-full p-2 h-auto w-auto', theme === 'dark' && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground')}
            onClick={() => setTheme('dark')}
          >
            <span className="sr-only">Dark</span>
            <MoonIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-accent/10">Dark</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
