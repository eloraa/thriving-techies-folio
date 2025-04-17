import { fakeUser, links } from '@/lib/const';
import { Link } from './link';
import { Nav } from './nav';

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
                  <Link href={link.href} index={index} className="flex items-center gap-1">
                    {link.label}
                  </Link>
                </li>
              ))}
              {fakeUser && (
                <li>
                  <Link href="/dashboard" className="flex items-center gap-1">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <Nav />
    </>
  );
};
