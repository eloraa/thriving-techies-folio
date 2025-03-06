'use client';
import * as React from 'react';
import { ReactLenis } from 'lenis/react';

export const Lenis = ({ children }: { children: React.ReactNode }) => {
  return <ReactLenis root>{children}</ReactLenis>;
};
