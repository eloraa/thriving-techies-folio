'use client';
import * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SearchIcon, UserIcon } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const users = [
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    name: 'Elora',
    username: 'elora',
    avatar: '/elora.png',
    posts: 4,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9',
    name: 'John Doe',
    username: 'johndoe',
    avatar: '/john.png',
    posts: 10,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d0',
    name: 'Neon',
    username: 'neon',
    avatar: '/neon.png',
    posts: 0,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d2',
    name: 'Jane Doe',
    username: 'janedoe',
    avatar: '/jane.png',
    posts: 0,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d3',
    name: 'John Smith',
    username: 'johnsmith',
    avatar: '/john.png',
    posts: 0,
  },
];

export const Filter = () => {
  const [selectedValue, setSelectedValue] = React.useState('all');
  const [selectedUser, setSelectedUser] = React.useState<(typeof users)[0] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [previousValue, setPreviousValue] = React.useState('all');

  const handleSelectUser = (user: (typeof users)[0]) => {
    setSelectedUser(user);
    setSelectedValue('specific');
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && !selectedUser) {
      setSelectedValue(previousValue);
    }
  };

  return (
    <>
      <Select
        defaultValue="all"
        value={selectedValue}
        onValueChange={value => {
          if (value === 'specific') {
            setPreviousValue(selectedValue);
            setOpen(true);
          } else {
            setSelectedUser(null);
            setSelectedValue(value);
          }
        }}
      >
        <SelectTrigger
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'focus:ring-0 !ring-0 focus-visible:right-0 focus-within:ring-0 !border-0 focus:border-0 focus-within:border-0 focus-visible:border-0 hover:text-foreground text-foreground/80 font-semibold rounded-full'
          )}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          {selectedValue === 'specific' && selectedUser ? <span>{selectedUser.name}</span> : <SelectValue />}
        </SelectTrigger>
        <SelectContent align="end" className="p-0.5">
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="only_me">Only Me</SelectItem>
          <SelectSeparator />
          <SelectItem value="specific">
            <div className="flex items-center flex-row gap-2 w-full">
              <SearchIcon className="size-4" />
              Specific User
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <CommandDialog open={open} onOpenChange={handleOpenChange} className="max-w-xs">
        <VisuallyHidden>
          <DialogTitle>Select a user</DialogTitle>
        </VisuallyHidden>
        <CommandInput placeholder="Search users..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            {users
              .filter(user => user.name.toLowerCase().includes(search.toLowerCase()) || user.username.toLowerCase().includes(search.toLowerCase()))
              .map(user => (
                <CommandItem key={user.id} onSelect={() => handleSelectUser(user)}>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{user.posts} Posts</p>
                      <p className="text-sm text-muted-foreground sr-only">@{user.username}</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
