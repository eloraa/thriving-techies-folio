import Link from 'next/link';
import { Nav } from './nav';

export const links = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Team',
    href: '/team',
  },
  {
    label: 'Showcase',
    href: '/showcase',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];
export const Header = () => {
  return (
    <>
      <header className="container py-2 sticky top-0 bg-background z-30">
        <div className="flex items-center md:justify-between max-md:text-center">
          <h1 className="font-unifont font-semibold max-md:w-full">Thriving Techies</h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {links.map((link, index) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-1">
                    <span className="font-unifont text-muted-foreground">0{index + 1}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <Nav />
    </>
  );
};
