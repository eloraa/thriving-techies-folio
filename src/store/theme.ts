import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return;
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
};

const setCookie = (name: string, value: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=${value};path=/;max-age=31536000`;
};

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useTheme = create<ThemeState>(set => ({
  theme: 'light', // Default theme for SSR
  setTheme: theme => {
    const newTheme = theme === 'system' ? getSystemTheme() : theme;
    set({ theme: newTheme });
    applyTheme(newTheme);
    setCookie('theme', newTheme);
  },
}));
