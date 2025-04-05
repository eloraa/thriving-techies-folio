import { Copy } from '@/components/ui/copy';
import * as React from 'react';
import { Theme } from './theme';
import { GoToTop } from './go-to-top';

export const Contact = () => {
  return (
    <footer id="contact" className="container py-8 md:py-10 bg-white light relative z-10 mt-56 text-black" style={{ colorScheme: 'light' }}>
      <div className="flex items-center justify-between max-md:flex-col max-md:gap-4">
        <Copy className={{ base: 'border border-black/20 h-12 flex items-center pl-4 text-sm font-mono font-semibold max-md:w-full justify-between', button: 'px-6 ml-2' }}>
          info@thrivingtechies.com
        </Copy>
        <Theme />
      </div>
      <div className="text-sm mt-8 flex max-md:flex-col gap-2 pb-10 items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <a href="#">TW/X</a>
          <a href="#">GH</a>
          <a href="#">FB</a>
          <a href="#">LI</a>
        </div>
        <GoToTop />
        <p>
          <span className="font-mono">&copy;2025</span>
          <span className="text-black/60"> &lt;3 By </span>
          <a href="//github.com/eloraa" target="_blank" className="font-medium">
            Elora
          </a>
        </p>
      </div>
    </footer>
  );
};
