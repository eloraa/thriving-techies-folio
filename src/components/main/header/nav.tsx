'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { links } from './header';
import Link from 'next/link';

export const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [hasMeasured, setHasMeasured] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-4 inset-x-0 flex items-center justify-center pointer-events-none z-30">
      <div className="py-1 rounded-full bg-accent/10 backdrop-blur-xl flex items-center px-1 border pointer-events-auto" style={{ paddingLeft: isScrolled ? 16 : 4 }}>
        <button
          onClick={goToTop}
          ref={el => {
            if (el && !hasMeasured) {
              setButtonWidth(el.offsetWidth);
              setHasMeasured(true);
            }
          }}
          className="flex items-center gap-1 text-xs transition-[width] justify-center overflow-hidden whitespace-nowrap"
          style={{ width: hasMeasured ? (!isScrolled ? 0 : buttonWidth) : 'auto' }}
        >
          <ArrowUp className="w-3" />
          <span className="font-unifont uppercase font-bold">Go to top</span>
        </button>

        <div style={{ width: isScrolled ? 16 : 4 }}></div>

        <DropdownMenu>
          <DropdownMenuTrigger className="-ml-1 h-8 w-8 flex items-center justify-center rounded-full bg-accent/10 hover:bg-accent/20 transition-colors">
            <span className="sr-only">Menu</span>
            <div className="flex items-center gap-1 flex-col">
              <div className="w-4 h-px rounded-full bg-accent" />
              <div className="w-4 h-px rounded-full bg-accent" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-full max-w-[auto]">
            <nav>
              {links.map((link, i) => (
                <DropdownMenuItem key={i}>
                  <Link key={i} href={link.href}>
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </nav>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
