import Link from 'next/link';
import { User } from './layout';
import { Dropdown } from './dropdown';

export const Header = ({ theme, user }: { theme: string; user: User }) => {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 md:flex h-16 w-full items-center justify-between px-4 hidden">
      <Link href="/dashboard" className="font-mono pointer-events-auto font-medium flex items-center gap-1">
        TT
        <span className="py-0.5 px-1 font-mono text-xs bg-accent/10 rounded font-normal">v1.0</span>
      </Link>
      <div className="pointer-events-auto flex items-center gap-4">
        <Dropdown theme={theme} user={user} />
      </div>
    </header>
  );
};
