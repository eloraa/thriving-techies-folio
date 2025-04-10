'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/store/theme';
import { useCity } from '@/store/city';
import { cn } from '@/lib/utils';

export const Theme = () => {
  const { theme, setTheme } = useTheme();
  const { city } = useCity();

  useEffect(() => {
    const savedTheme = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] as 'light' | 'dark' | 'system' | undefined;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('system');
    }
  }, [setTheme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (city) {
      if (newTheme === 'light') {
        city.setColor('wireframe', '#b350af');
      } else {
        city.setColor('wireframe', '#009688');
      }
    }
  };

  return (
    <div className="flex items-center h-12">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'rounded-none hover:bg-foreground/5 border-r-0 border border-foreground/20 text-foreground h-full w-12 hover:border-foreground/20 hover:ring-foreground hover:ring-1 ring-inset',
          theme === 'light' && 'bg-primary text-black'
        )}
        onClick={() => handleThemeChange('light')}
      >
        <span className="sr-only">Light</span>
        <Sun />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'rounded-none hover:bg-foreground/5 border-r-0 border border-foreground/20 text-foreground h-full w-12 hover:border-foreground/20 hover:ring-foreground hover:ring-1 ring-inset',
          theme === 'dark' && 'bg-primary text-black'
        )}
        onClick={() => handleThemeChange('dark')}
      >
        <span className="sr-only">Dark</span>
        <Moon />
      </Button>
    </div>
  );
};
