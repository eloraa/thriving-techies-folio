'use client';

import { CityCanvas } from '@/lib/canvas';
import { useRef } from 'react';

const getDeviceScale = () => {
  const pixelRatio = window.devicePixelRatio || 1;

  const screenResolution = window.screen.width * window.screen.height;

  if (pixelRatio <= 1 || screenResolution < 1920 * 1080) {
    return 0.5;
  } else if (pixelRatio <= 2 || screenResolution < 2560 * 1440) {
    return 0.75;
  } else {
    return 0.95;
  }
};

export const Canvas = () => {
  const canvas = useRef<CityCanvas>(null);
  const init = (el: HTMLDivElement) => {
    if (el && !canvas.current) {
      const city = new CityCanvas(el);

      const scale = getDeviceScale();
      city.setScale(scale);

      canvas.current = city;
    }
  };

  return <div ref={init} className="absolute inset-0 pointer-events-none -z-10 dark:invert-0 invert"></div>;
};
