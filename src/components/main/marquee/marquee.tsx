'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MarqueeProps {
  items: string[];
}

export const Marquee = ({ items }: MarqueeProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const lastItemRef = useRef<HTMLLIElement>(null);
  const state = useRef({
    count: 0,
    multiplier: 0.4,
    translateX: 0,
  });

  useEffect(() => {
    if (lastItemRef.current) {
      state.current.translateX = lastItemRef.current.offsetLeft;
    }

    const tmp = {};
    gsap.to(tmp, {
      yoyo: true,
      repeat: -1,
      duration: 0.01,
      onRepeat: () => {
        state.current.count += 3 * state.current.multiplier;
        if (state.current.count >= state.current.translateX) {
          state.current.count = 0;
        }

        if (listRef.current) {
          gsap.set(listRef.current, {
            x: -state.current.count,
          });
        }
      },
    });

    return () => {
      gsap.killTweensOf(tmp);
    };
  }, []);

  const handleMouseEnter = () => {
    gsap.to(state.current, {
      multiplier: 0.2,
      ease: 'power2.in',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(state.current, {
      multiplier: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <div className="overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ul ref={listRef} className="flex p-3 dark:font-normal font-semibold text-sm md:text-[clamp(1.2rem,1.25vw,1.5rem)] text-accent">
        {[...items, ...items, ...items].map((item, index, arr) => (
          <li key={index} ref={arr.length / 2 === index ? lastItemRef : null} className="whitespace-nowrap pr-[3vw]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
