'use client';

import * as React from 'react';
import { GradientEffect } from './gradient';

export const Canvas = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const effectRef = React.useRef<GradientEffect | null>(null);

  React.useEffect(() => {
    if (containerRef.current && canvasRef.current && !effectRef.current) {
      effectRef.current = new GradientEffect(containerRef.current, canvasRef.current);
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.dispose();
        effectRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full w-full fixed inset-0 bg-[#8BC34A]" ref={containerRef}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
    </div>
  );
};
