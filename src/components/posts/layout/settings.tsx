'use client';
import { users } from '@/app/(dashboard)/dashboard/published/const';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fakeUser } from '@/lib/const';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon, GlobeIcon, HashIcon, Link2Icon, SettingsIcon, Trash2Icon, UserIcon, UsersIcon } from 'lucide-react';
import * as React from 'react';
import { Tags } from './tags';

interface SettingsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
}

export const Settings = ({ tags, onTagsChange, slug, onSlugChange }: SettingsProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="secondary" className="[&_svg]:size-3.5 gap-1 rounded-full bg-accent/15 max-md:px-2.5">
          <SettingsIcon />
          <span className="-mt-0.5 max-md:sr-only">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[16rem] py-4 px-0">
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 text-xs">
            <Link2Icon className="size-4" />
            Slug
          </div>
          <div className="mt-2 w-full">
            <Input placeholder="toasty-muffin" className="w-full text-sm h-8" value={slug} onChange={e => onSlugChange(e.target.value)} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 text-xs">
            <HashIcon className="size-4" />
            Tags
          </div>
          <div className="mt-2 w-full">
            <Tags tags={tags} onTagsChange={onTagsChange} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-3 pt-2 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <GlobeIcon className="size-3" />
            Collaboration
          </div>
          <div className="w-full">
            <div className="flex items-center">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between bg-accent/5 border border-accent/10 h-8 rounded-r-none px-2 w-full text-sm hover:ring-blue-500"
                  >
                    {value ? users.find(user => user.id === value)?.name : 'Select user...'}
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[200px] p-0 z-50">
                  <Command>
                    <CommandInput placeholder="Search users..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users
                          .filter(user => user.id !== fakeUser.id && user.username !== 'neon')
                          .map(user => (
                            <CommandItem
                              key={user.name}
                              value={user.id}
                              onSelect={currentValue => {
                                setValue(currentValue === value ? '' : currentValue);
                                setOpen(false);
                              }}
                            >
                              {user.name}
                              <CheckIcon className={cn('ml-auto', value === user.id ? 'opacity-100' : 'opacity-0')} />
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button size="sm" variant="secondary" className="h-8 min-w-[6rem] w-[6rem] border border-l-0 border-accent/10 rounded-l-none text-sm justify-center gap-1 bg-accent/15">
                <UsersIcon />
                Invite
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2 mt-4 px-3 pr-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarFallback>
                  <UserIcon className="size-3" />
                </AvatarFallback>
              </Avatar>
              Admin
            </div>
            <p className="text-xs font-mono text-foreground/80">Can Access</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarImage src={fakeUser.avatar} />
                <AvatarFallback>{fakeUser.name[0]}</AvatarFallback>
              </Avatar>
              {fakeUser.name}
            </div>
            <p className="text-xs font-mono text-foreground/80">Owner</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarImage src="/neon.png" />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
              Neon
            </div>
            <Select defaultValue="editor">
              <SelectTrigger className="text-xs font-mono text-foreground/80 min-w-0 w-auto gap-1 py-0 h-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="viewer" className="py-1.5">
                    Viewer
                  </SelectItem>
                  <SelectItem value="editor" className="py-1.5">
                    Editor
                  </SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <Button variant="ghost" size="sm" className="text-sm w-full rounded-[10px] text-start justify-start">
                  <Trash2Icon />
                  Remove
                </Button>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
