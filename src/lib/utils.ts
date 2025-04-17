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

export function stripMarkdown(text: string): string {
  return (
    text
      // Remove headers
      .replace(/#{1,6}\s/g, '')
      // Remove bold and italic
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      // Remove images
      .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove blockquotes
      .replace(/^\s*>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^\s*[-*_]{3,}\s*$/gm, '')
      // Remove lists
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // Remove extra newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim()
  );
}

export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[arr.length - 1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
