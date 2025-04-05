'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollTriggerWrapperProps {
  children: React.ReactNode;
}

export const ScrollTriggerWrapper = ({ children }: ScrollTriggerWrapperProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const teamContainer = containerRef.current;
      if (!teamContainer) return;

      const isMobile = window.innerWidth < 768;
      if (isMobile) return;

      const teamWidth = teamContainer.scrollWidth;
      const sectionWidth = sectionRef.current?.offsetWidth || 0;
      const maxScroll = teamWidth - sectionWidth;

      gsap.to(teamContainer, {
        x: -maxScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: () => `+=${maxScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="overflow-hidden min-h-[50vh] flex items-center">
      <div ref={containerRef} className="flex gap-6 md:flex-row flex-col max-md:w-full">
        {children}
      </div>
    </div>
  );
};
