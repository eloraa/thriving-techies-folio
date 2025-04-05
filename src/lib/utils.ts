import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateColor = () => {
  const r = Math.floor(180 + Math.random() * 75);
  const g = Math.floor(180 + Math.random() * 75);
  const b = Math.floor(180 + Math.random() * 75);
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
};
