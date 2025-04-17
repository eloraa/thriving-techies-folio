'use client';
import * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Check, SearchIcon, UserIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { users } from './const';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FilterProps {
  onUserChange: (value: string | null) => void;
}

export const Filter = ({ onUserChange }: FilterProps) => {
  const [selectedValue, setSelectedValue] = React.useState('all');
  const [selectedUser, setSelectedUser] = React.useState<(typeof users)[0] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [previousValue, setPreviousValue] = React.useState('all');

  const handleSelectUser = (user: (typeof users)[0]) => {
    setSelectedUser(user);
    setSelectedValue(user.username);
    onUserChange(user.id);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && !selectedUser) {
      setSelectedValue(previousValue);
    }
  };

  const handleValueChange = (value: string) => {
    if (value === 'specific') {
      setPreviousValue(selectedValue);
      setOpen(true);
    } else {
      setSelectedUser(null);
      setSelectedValue(value);
      onUserChange(value === 'all' ? null : value);
    }
  };

  return (
    <div>
      <Select
        defaultValue="all"
        value={selectedValue}
        onValueChange={handleValueChange}
      >
        <Popover open={open}>
          <PopoverAnchor asChild>
            <SelectTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'focus:ring-0 !ring-0 focus-visible:right-0 focus-within:ring-0 !border-0 focus:border-0 focus-within:border-0 focus-visible:border-0 hover:text-foreground text-foreground/80 font-semibold rounded-full text-sm'
              )}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              {selectedValue === 'specific' && selectedUser ? <span>{selectedUser.name}</span> : <SelectValue />}
            </SelectTrigger>
          </PopoverAnchor>
          <PopoverContent
            align="end"
            className="w-[200px] p-0"
            onOpenAutoFocus={e => e.preventDefault()}
            onCloseAutoFocus={e => e.preventDefault()}
            onPointerDownOutside={e => {
              e.preventDefault();
              handleOpenChange(false);
            }}
          >
            <Command>
              <CommandInput placeholder="Search users..." value={search} onValueChange={setSearch} className="h-9" />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {users
                    .filter(user => user.name.toLowerCase().includes(search.toLowerCase()) || user.username.toLowerCase().includes(search.toLowerCase()))
                    .map(user => (
                      <CommandItem key={user.name} value={user.username} onSelect={() => handleSelectUser(user)}>
                        {user.name}
                        <Check className={cn('ml-auto', selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <SelectContent align="end" className="p-0.5">
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="only_me">Only Me</SelectItem>
          <SelectSeparator />
          <SelectItem value="specific">
            <div className="flex items-center flex-row gap-2 w-full">
              <SearchIcon className="size-4" />
              {selectedUser ? 'Modify...' : 'Specific User'}
            </div>
          </SelectItem>
          {selectedUser && (
            <SelectItem value={selectedUser.username}>
              <div className="flex items-center flex-row gap-2 w-full">
                <Avatar className="size-4">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-xs">{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                {selectedUser.name}
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* <CommandDialog open={open} onOpenChange={handleOpenChange} className="max-w-xs">
        <VisuallyHidden>
          <DialogTitle>Select a user</DialogTitle>
        </VisuallyHidden>
        <CommandInput placeholder="Search users..." value={search} onValueChange={setSearch} />
        <CommandList className="pb-1">
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
                      <p className="text-sm text-muted-foreground">{user.posts} Posts</p>
                      <p className="text-sm text-muted-foreground sr-only">@{user.username}</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog> */}
    </div>
  );
};
