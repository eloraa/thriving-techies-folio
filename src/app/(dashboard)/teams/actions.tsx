'use client';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AsteriskIcon, EllipsisVertical, EyeIcon, PencilIcon, SendToBackIcon, ShieldIcon, Trash2Icon, KeyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreakpoints } from '@/lib/useBreakpoints';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type Data = User | User[];

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters long',
    }),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const Actions = ({
  children,
  data,
  align,
  className,
}: {
  children?: React.ReactNode;
  data: Data | Data[];
  className?: { base?: string; open?: string };
  align?: 'center' | 'start' | 'end' | undefined;
  onAfterDelete?: () => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = React.useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const breakpoints = useBreakpoints();

  const handleChangePassword = async (values: z.infer<typeof passwordSchema>) => {
    // TODO: Implement password change logic
    console.log('Changing password for:', data, 'New password:', values.newPassword);
    setShowChangePasswordDialog(false);
    form.reset();
  };

  const handleDialogClose = () => {
    setShowChangePasswordDialog(false);
    form.reset();
  };

  return (
    <>
      <div className={cn(className?.base, !isOpen && className?.open)}>
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            {children || (
              <Button variant="ghost" size="icon" className="rounded-full">
                <EllipsisVertical className="size-4 drop-shadow-[0_0_4px_rgba(0,0,0)]" />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align || 'end'} className="w-60 bg-popover/85 backdrop-blur-lg saturate-[1.8] shadow-lg ">
            {Array.isArray(data) ? (
              <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2Icon className="mr-2" />
                Delete
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/teams/edit/${data.id}`}>
                    <PencilIcon className="mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowChangePasswordDialog(true)}>
                  <KeyIcon className="mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2Icon className="mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ShieldIcon className="mr-2" />
                    Permissions
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-popover/85 " sideOffset={breakpoints === 'md' || breakpoints === 'sm' ? -50 : 0}>
                      <DropdownMenuCheckboxItem className="pr-16" onClick={e => e.preventDefault()} checked={data.permissions.includes('*')}>
                        <AsteriskIcon className="mr-2 size-5" />
                        All Permissions
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem className="pr-16" onClick={e => e.preventDefault()} checked={data.permissions.includes('read')} disabled={data.permissions.includes('*')}>
                        <EyeIcon className="mr-2 size-5" />
                        Read
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem className="pr-16" onClick={e => e.preventDefault()} checked={data.permissions.includes('write')} disabled={data.permissions.includes('*')}>
                        <PencilIcon className="mr-2 size-5" />
                        Write
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem className="pr-16" onClick={e => e.preventDefault()} checked={data.permissions.includes('delete')} disabled={data.permissions.includes('*')}>
                        <Trash2Icon className="mr-2 size-5" />
                        Delete
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem className="pr-16" onClick={e => e.preventDefault()} checked={data.permissions.includes('change_status')} disabled={data.permissions.includes('*')}>
                        <SendToBackIcon className="mr-2 size-5" />
                        Change Status
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="sr-only">Are you sure you want to delete?</DialogDescription>
          </DialogHeader>
          <div>
            <p>
              Are you sure you want to delete{' '}
              {Array.isArray(data) ? (
                <>
                  <strong>{data.length}</strong> Users
                </>
              ) : (
                <span>
                  the user <strong>{data.name}</strong> (<span className="font-mono">{data.email}</span>)?
                </span>
              )}
              ?
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-full bg-transparent border-accent/15 w-20">
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-full w-20">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showChangePasswordDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter a new password for {Array.isArray(data) ? 'selected users' : data.name}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="items-start flex-col gap-2 border-b-0 py-0">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" className="bg-transparent border-accent/15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="items-start flex-col gap-2 border-b-0 py-0">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" className="bg-transparent border-accent/15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
                <Button variant="outline" onClick={handleDialogClose} className="rounded-full bg-transparent border-accent/15 w-20">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full w-20 bg-accent/15" variant='secondary'>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
