'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getSocialIcon } from '@/lib/get-social-icon';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { XIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { AsteriskIcon, EyeIcon, PencilIcon, SendToBackIcon, ShieldIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const socialSchema = z.object({
  type: z.string(),
  url: z.string().url(),
});

const formSchema = z.object({
  avatar: z.union([z.string().url(), z.string().startsWith('/'), z.string().max(0), z.literal(''), z.null()]).optional(),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  bio: z.string().optional(),
  role: z.string().min(2, {
    message: 'Role must be at least 2 characters.',
  }),
  website: z.string().url().optional().or(z.literal('')),
  socials: z.array(socialSchema),
  permissions: z.array(z.string()).min(1, {
    message: 'Select at least one permission.',
  }),
});

export function AddUserForm() {
  const router = useRouter();
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [newSocial, setNewSocial] = useState({ type: '', url: '' });
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      role: '',
      website: '',
      avatar: '',
      socials: [],
      permissions: [],
    },
  });

  const handleAddSocial = () => {
    if (newSocial.type && newSocial.url) {
      const currentSocials = form.getValues('socials');
      form.setValue('socials', [...currentSocials, newSocial]);
      setNewSocial({ type: '', url: '' });
    }
  };

  const handleRemoveSocial = (index: number) => {
    const currentSocials = form.getValues('socials');
    form.setValue(
      'socials',
      currentSocials.filter((_, i) => i !== index)
    );
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.back();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-x-hidden">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[7rem]">Avatar</FormLabel>
              <div className="relative flex flex-col space-y-1 w-full">
                <FormControl>
                  <div className="flex md:w-60">
                    <div className="relative flex items-center justify-center gap-2">
                      <Button variant="link" size="sm" className="text-foreground underline cursor-pointer px-0 w-auto">
                        Upload
                      </Button>
                      <Avatar className="size-10 cursor-pointer">
                        <AvatarImage src={field.value || ''} alt="New user" />
                        <AvatarFallback>NU</AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setIsAvatarUploading(true);
                          try {
                            // TODO: Implement actual file upload logic here
                            const url = URL.createObjectURL(file);
                            field.onChange(url);
                          } catch (error) {
                            console.error('Error uploading avatar:', error);
                            field.onChange('');
                          } finally {
                            setIsAvatarUploading(false);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {isAvatarUploading && <Spinner className="size-5 absolute" />}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[7rem]">Name</FormLabel>
              <div className="relative flex flex-col space-y-1 w-full">
                <FormControl>
                  <Input placeholder="Enter name" {...field} className="bg-transparent border-0 text-sm px-0 w-full" />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[7rem]">Email</FormLabel>
              <div className="relative flex flex-col space-y-1 w-full">
                <FormControl>
                  <Input placeholder="Enter email" {...field} className="bg-transparent border-0 text-sm px-0 w-full" />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[7rem]">Password</FormLabel>
              <div className="relative flex flex-col space-y-1 w-full">
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} className="bg-transparent border-0 text-sm px-0 w-full" />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[7rem]">Role</FormLabel>
              <div className="relative flex flex-col space-y-1 w-full">
                <FormControl>
                  <Input placeholder="Enter role" {...field} className="bg-transparent border-0 text-sm px-0 w-full" />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[7rem]">Website</FormLabel>
              <div className="relative flex flex-col space-y-1 w-full">
                <FormControl>
                  <Input placeholder="Enter website URL" {...field} className="bg-transparent border-0 text-sm px-0 w-full" />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissions"
          render={({ field }) => {
            const individualPermissions = ['read', 'write', 'delete', 'change_status'];
            const hasAllIndividualPermissions = individualPermissions.every(p => field.value?.includes(p));

            if (hasAllIndividualPermissions && !field.value?.includes('*')) {
              field.onChange(['*']);
            }

            return (
              <FormItem>
                <FormLabel className="w-[7rem]">Permissions</FormLabel>
                <div className="flex w-full space-y-1 flex-col">
                  <div className="flex items-center gap-2">
                    <DropdownMenu open={open}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-transparent border-accent/15 rounded-full" onClick={() => setOpen(true)}>
                          <ShieldIcon className="mr-2 size-4" />
                          Select Permissions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-60 bg-popover/85 backdrop-blur-lg saturate-[1.8] shadow-lg" onPointerDownOutside={() => setOpen(false)}>
                        <DropdownMenuCheckboxItem
                          className="pr-16"
                          checked={field.value?.includes('*')}
                          onCheckedChange={checked => {
                            if (checked) {
                              field.onChange(['*']);
                            } else {
                              field.onChange([]);
                            }
                          }}
                        >
                          <AsteriskIcon className="mr-2 size-5" />
                          All Permissions
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          className="pr-16"
                          checked={field.value?.includes('read') || field.value?.includes('*')}
                          disabled={field.value?.includes('*')}
                          onCheckedChange={checked => {
                            const currentPermissions = field.value || [];
                            if (checked) {
                              field.onChange([...currentPermissions.filter(p => p !== '*'), 'read']);
                            } else {
                              field.onChange(currentPermissions.filter(p => p !== 'read'));
                            }
                          }}
                        >
                          <EyeIcon className="mr-2 size-5" />
                          Read
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          className="pr-16"
                          checked={field.value?.includes('write') || field.value?.includes('*')}
                          disabled={field.value?.includes('*')}
                          onCheckedChange={checked => {
                            const currentPermissions = field.value || [];
                            if (checked) {
                              field.onChange([...currentPermissions.filter(p => p !== '*'), 'write']);
                            } else {
                              field.onChange(currentPermissions.filter(p => p !== 'write'));
                            }
                          }}
                        >
                          <PencilIcon className="mr-2 size-5" />
                          Write
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          className="pr-16"
                          checked={field.value?.includes('delete') || field.value?.includes('*')}
                          disabled={field.value?.includes('*')}
                          onCheckedChange={checked => {
                            const currentPermissions = field.value || [];
                            if (checked) {
                              field.onChange([...currentPermissions.filter(p => p !== '*'), 'delete']);
                            } else {
                              field.onChange(currentPermissions.filter(p => p !== 'delete'));
                            }
                          }}
                        >
                          <Trash2Icon className="mr-2 size-5" />
                          Delete
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          className="pr-16"
                          checked={field.value?.includes('change_status') || field.value?.includes('*')}
                          disabled={field.value?.includes('*')}
                          onCheckedChange={checked => {
                            const currentPermissions = field.value || [];
                            if (checked) {
                              field.onChange([...currentPermissions.filter(p => p !== '*'), 'change_status']);
                            } else {
                              field.onChange(currentPermissions.filter(p => p !== 'change_status'));
                            }
                          }}
                        >
                          <SendToBackIcon className="mr-2 size-5" />
                          Change Status
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {!!field.value.length && (
                      <Badge className="border border-accent/15 bg-transparent text-foreground size-9 rounded-full justify-center items-center flex">{field.value.length}</Badge>
                    )}
                  </div>
                  <FormMessage />
                </div>
              </FormItem>
            );
          }}
        />

        <div className="space-y-2 py-4">
          <FormLabel className="w-[7rem]">Social Links</FormLabel>
          <div className="flex flex-wrap gap-2">
            {form.watch('socials').map((social, index) => {
              const Icon = getSocialIcon(social.type);
              return (
                <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-sm min-w-0 overflow-hidden">
                  {Icon && <Icon className="size-4" />}
                  {!Icon && <span className="hover:underline text-xs font-mono uppercase">{social.type}</span>}
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger className="min-w-0 overflow-hidden">
                        <span className="font-mono text-xs block max-w-36 min-w-0 truncate">{new URL(social.url).pathname.replace(/^\/(.*)/, '$1')}</span>
                      </TooltipTrigger>
                      <TooltipContent>{social.url}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <button onClick={() => handleRemoveSocial(index)} className="text-muted-foreground hover:text-foreground">
                    <XIcon className="size-3" />
                  </button>
                </div>
              );
            })}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent border-accent/15 rounded-full">
                  Add Social
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform</label>
                    <Input placeholder="e.g. twitter, github" value={newSocial.type} onChange={e => setNewSocial({ ...newSocial, type: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL</label>
                    <Input placeholder="https://..." value={newSocial.url} onChange={e => setNewSocial({ ...newSocial, url: e.target.value })} />
                  </div>
                  <Button onClick={handleAddSocial} variant="secondary" className="w-full rounded-full bg-accent/10">
                    Add
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex-col items-start pt-4">
              <FormLabel className="w-[7rem]">Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter bio" {...field} className="bg-transparent border-0 text-sm px-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 mt-6 max-md:flex-col max-md:items-end max-md:space-y-2">
          <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent border-accent/15 rounded-full">
            Cancel
          </Button>
          <Button type="submit" variant="secondary" className="bg-accent/15 rounded-full">
            Add User
          </Button>
        </div>
      </form>
    </Form>
  );
}
