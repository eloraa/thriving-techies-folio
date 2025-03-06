import { forwardRef } from 'react';

export const Title = forwardRef<HTMLHeadingElement, { children: React.ReactNode }>(({ children }, ref) => {
  return (
    <h1 ref={ref} className="md:text-lg dark:font-medium font-semibold font-unifont uppercase leading-tight text-center">
      {children}
    </h1>
  );
});
Title.displayName = 'Title';
