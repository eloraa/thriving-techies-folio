'use client';

import { useEffect, useRef } from 'react';

interface AsciiDisplayProps {
  ascii: string;
}

export const AsciiDisplay = ({ ascii }: AsciiDisplayProps) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const preElement = preRef.current;
    if (!preElement) return;

    const resizeObserver = new ResizeObserver(() => {
      const container = preElement.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Start with your preferred size
      let fontSize = 3.2;
      let lineHeight = fontSize * 0.875; // This ratio (0.875) gives us 2.8px line-height for 3.2px font-size
      
      while (fontSize > 1) {
        preElement.style.fontSize = `${fontSize}px`;
        preElement.style.lineHeight = `${lineHeight}px`;
        
        if (preElement.offsetWidth <= containerWidth && preElement.offsetHeight <= containerHeight) {
          break;
        }
        
        fontSize -= 0.1;
        lineHeight = fontSize * 0.875;
      }
    });

    if (preElement.parentElement) {
      resizeObserver.observe(preElement.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <pre
      ref={preRef}
      className="font-unifont whitespace-pre inline-block scale-x-95"
      style={{
        fontSize: '3.2px',
        lineHeight: '2.8px'
      }}
    >
      {ascii}
    </pre>
  );
}; 