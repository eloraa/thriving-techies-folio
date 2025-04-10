'use client';

import { CopyIcon, CheckIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

const AnimatedText = ({ children, copied }: { children: React.ReactNode; copied: boolean }) => {
  const text = children?.toString() || '';
  const displayText = copied ? 'Copied!' : text;

  return (
    <span className="min-w-0 truncate inline-flex relative overflow-hidden">
      <span className="flex transition-transform duration-200" style={{ transform: copied ? 'translateY(-100%)' : 'translateY(0)' }}>
        {text.split('').map((char, i) => (
          <span key={`original-${i}`} className="inline-block">
            {char}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 flex transition-transform duration-200" style={{ transform: copied ? 'translateY(0)' : 'translateY(100%)' }}>
        {displayText.split('').map((char, i) => (
          <span key={`copied-${i}`} className="inline-block">
            {char}
          </span>
        ))}
      </span>
    </span>
  );
};

export const Copy = ({ children, className }: { children: Readonly<React.ReactNode>; className?: { base?: string; button?: string } }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const copy = async () => {
    const text = children?.toString() || '';
    await navigator.clipboard.writeText(text);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <p className={cn('flex items-center gap-2 overflow-hidden relative', className?.base, copied && 'bg-primary text-black')}>
      <AnimatedText copied={copied}>{children}</AnimatedText>
      <Button variant="ghost" size="icon" className={cn('rounded-none hover:bg-foreground/5 border-l border-foreground/20 text-foreground h-full', className?.button)} onClick={copy}>
        {copied ? <CheckIcon className="h-4 w-4 text-black" /> : <CopyIcon className="h-4 w-4" />}
        <span className="sr-only">Copy</span>
      </Button>
    </p>
  );
};
