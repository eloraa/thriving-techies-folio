'use client';
import * as React from 'react';
import { ReactLenis } from 'lenis/react';
import { useTheme } from '@/store/theme';
import { useCity } from '@/store/city';

interface ClientHandlerProps {
  theme: 'light' | 'dark' | undefined;
  children: React.ReactNode;
}

export const ClientHandler = ({ children, theme }: ClientHandlerProps) => {
  const { setTheme } = useTheme();
  const { city } = useCity();

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = theme ?? (mediaQuery.matches ? 'dark' : 'light');

    setTheme(currentTheme);

    if (currentTheme === 'light') {
      city?.setColor('wireframe', '#b350af');
    } else {
      city?.setColor('wireframe', '#009688');
    }

    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.cookie = 'theme=dark; path=/';
        setTheme('dark');
        document.documentElement.classList.add('dark');
        city?.setColor('wireframe', '#009688');
      } else {
        document.cookie = 'theme=light; path=/';
        setTheme('light');
        document.documentElement.classList.remove('dark');
        city?.setColor('wireframe', '#b350af');
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [theme, setTheme, city]);

  return <ReactLenis root>{children}</ReactLenis>;
};
