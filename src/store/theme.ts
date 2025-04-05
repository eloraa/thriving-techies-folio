import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const getSystemTheme = (): 'light' | 'dark' => (typeof window === 'undefined' ? 'light' : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

export const useTheme = create<ThemeState>(set => ({
  theme: getSystemTheme(),
  setTheme: theme =>
    set({
      theme: theme === 'system' ? getSystemTheme() : theme,
    }),
}));
