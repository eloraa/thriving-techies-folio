'use client';
import { buttonVariants } from '@/components/ui/button';
import { Dropdown } from './dropdown';
import { User } from './layout';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { dashboardLinks } from '@/lib/const';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { PencilIcon, SettingsIcon } from 'lucide-react';

export const Footer = ({ user }: { user: User }) => {
  const pathname = usePathname();
  return (
    <footer className="md:hidden flex items-center justify-between gap-2 fixed inset-x-0 bottom-0 z-40 h-[4rem] w-full bg-background/80 backdrop-blur-md px-4 py-2">
      <TooltipProvider delayDuration={0}>
        {dashboardLinks.map(link => (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'p-1 h-full w-14 [&_svg]:size-6 rounded-none',
                  !pathname.includes(link.href) && 'text-foreground/40 hover:text-foreground'
                )}
              >
                <span className="sr-only">{link.label}</span>
                <link.icon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{link.label}</TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/posts/new" className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'p-1 h-full bg-accent/10 w-14 [&_svg]:size-6 rounded-full')}>
              <span className="sr-only">Create new Post</span>
              <PencilIcon className="text-foreground/50" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Create new Post</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'p-1 h-full w-14 [&_svg]:size-6 rounded-none', '/settings' !== pathname && 'text-foreground/40 hover:text-foreground')}
            >
              <span className="sr-only">Settings</span>
              <SettingsIcon />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dropdown user={user} direction="top" className="w-14 h-14 p-2 bg-transparent" />
    </footer>
  );
};
