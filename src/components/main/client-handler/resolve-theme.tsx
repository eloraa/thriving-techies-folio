'use client';

import { useCity } from '@/store/city';
import { useTheme } from '@/store/theme';
import { useEffect } from 'react';

export const ResolveTheme = ({ theme }: { theme?: 'light' | 'dark' }) => {
  const { setTheme } = useTheme();
  const { city } = useCity();

  useEffect(() => {
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
  return null;
};
