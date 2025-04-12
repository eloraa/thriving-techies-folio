import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Theme } from './theme';
import { LogOutIcon, PaintbrushVerticalIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { User } from './layout';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  user: User;
  direction?: 'top' | 'bottom';
  className?: string;
};

export const Dropdown = ({ user, direction, className }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('hover:opacity-95 rounded-full bg-accent/5 w-10 h-10', className)}>
        <Avatar className="w-full h-full">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent collisionPadding={15} side={direction} className="w-56 bg-popover/90">
        <div className="py-2 px-3">
          <h1 className="font-medium">{user.name}</h1>
          <h2 className="text-sm text-foreground/50">{user.email}</h2>
        </div>
        <DropdownMenuSeparator />
        <div className="py-1 px-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 hover:font-medium md:hover:font-semibold md:font-medium max-md:text-sm">
              <PaintbrushVerticalIcon className="h-5 w-5 text-foreground/60" />
              Theme
            </p>
            <div className="flex items-center bg-accent/10 rounded-full p-0.5">
              <Theme />
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:!bg-transparent px-3">
          <Link href={`/profile/${user.username}`} className="flex items-center gap-2 hover:font-medium md:hover:font-semibold md:font-medium max-md:text-sm">
            <UserIcon className="h-5 w-5 text-foreground/60" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:!bg-transparent px-3">
          <Link href="/dashboard/settings" className="flex items-center gap-2 hover:font-medium md:hover:font-semibold md:font-medium max-md:text-sm">
            <SettingsIcon className="h-5 w-5 text-foreground/60" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:!bg-transparent px-3">
          <Link href="/logout" className="flex items-center gap-2 hover:font-medium md:hover:font-semibold md:font-medium max-md:text-sm">
            <LogOutIcon className="h-5 w-5 text-foreground/60" />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
