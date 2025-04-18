'use client';
import * as React from 'react';
import { ReactLenis } from 'lenis/react';

interface ClientHandlerProps {
  children: React.ReactNode;
}

export const ClientHandler = ({ children }: ClientHandlerProps) => {
  return <ReactLenis root>{children}</ReactLenis>;
};
