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

      let fontSize = 8;
      let lineHeight = fontSize;

      while (fontSize > 1) {
        preElement.style.fontSize = `${fontSize}px`;
        preElement.style.lineHeight = `${lineHeight}px`;

        if (preElement.offsetWidth <= containerWidth && preElement.offsetHeight <= containerHeight) {
          break;
        }

        fontSize -= 0.1;
        lineHeight = fontSize;
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
      className="font-mono whitespace-pre inline-block"
      style={{
        fontSize: '2.8px',
        lineHeight: '2.8px',
      }}
    >
      {ascii}
    </pre>
  );
};
