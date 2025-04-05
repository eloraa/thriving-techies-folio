'use client';

import { links } from '@/lib/const';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/all';
import { default as NextLink } from 'next/link';
import { usePathname } from 'next/navigation';
// import { useRouter } from 'next/router';

export const Link = ({ href, className, index, children }: { href: string; className?: string; index?: number; children: React.ReactNode }) => {
  //   const router = useRouter();
  const pathname = usePathname();
  const handleRouteChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!links.some(link => link.href === pathname)) return;
    e.preventDefault();
    if (!href) return;
    // doesn't work -> Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
    // router.push(href, undefined, { shallow: true });

    window.history.pushState({}, '', href);
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollToPlugin);
      if (href === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        gsap.to(window, { duration: 0.8, scrollTo: { y: `#${href.replace('/', '')}` }, ease: 'power2.easeOut' });
      }
    });
    return () => ctx.revert();
  };
  return (
    <NextLink href={href} className={className} onClick={handleRouteChange}>
      {index !== undefined && <span className="font-unifont text-muted-foreground">0{index + 1}</span>}
      {children}
    </NextLink>
  );
};
