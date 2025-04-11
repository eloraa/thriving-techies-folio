'use client';

import { Button } from '@/components/ui/button';
import { dashboardLinks } from '@/lib/const';
import { cn } from '@/lib/utils';
import { PencilIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="w-sidebar relative top-16 flex h-[calc(100%-4rem)] flex-col px-6 max-md:hidden">
      <div className="space-y-4 -mx-4">
        <div className="space-y-2">
          <Button asChild variant="ghost" className="rounded-full bg-accent/5 hover:bg-accent/5 text-foreground/60">
            <Link href="/posts/new">
              <PencilIcon className="h-4 w-4 text-foreground/60" />
              New Post
            </Link>
          </Button>
          <Button asChild variant="ghost" className={cn('rounded-full', pathname === '/settings' && 'bg-accent/5 hover:bg-accent/5')}>
            <Link href="/settings">
              <SettingsIcon className="h-5 w-5 text-foreground/60" />
              Settings
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground px-4 text-xs font-mono">Pages</p>
          {dashboardLinks.map(link => (
            <Button key={link.href} asChild variant="ghost" className={cn('rounded-full', link.href === pathname && 'bg-accent/5 hover:bg-accent/5')}>
              <Link href={link.href} className="flex items-center gap-2">
                <link.icon className="h-5 w-5 text-foreground/60" />
                {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
