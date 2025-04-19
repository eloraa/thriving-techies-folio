'use client';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getSocialIcon } from '@/lib/get-social-icon';
import { User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import { ShieldIcon } from 'lucide-react';
import { Actions } from './actions';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="User ID" />,
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <h1 className="text-sm truncate max-w-20">
                <span className="border-b border-dotted border-red-500/50">{row.getValue('id')}</span>
              </h1>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue('id')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Avatar" />,
    cell: ({ row }) => {
      const name = row.getValue('name') as string;

      return (
        <Avatar className="size-8">
          <AvatarImage src={row.getValue('avatar')} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => <div>@{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'website',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
    cell: ({ row }) => (
      <a href={row.getValue('website')} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        {row.getValue('website')}
      </a>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => <div className="capitalize">{formatDistance(row.getValue('createdAt'), new Date(), { addSuffix: true })}</div>,
  },
  {
    accessorKey: 'socials',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Socials" />,
    cell: ({ row }) => {
      const socials = row.getValue('socials') as { type: string; url: string }[];

      return (
        <div className="flex gap-2 items-center">
          {socials.map(social => {
            const Icon = getSocialIcon(social.type);

            return (
              <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer" className="leading-none">
                {Icon ? <Icon /> : <span className="hover:underline text-xs font-mono uppercase">{social.type}</span>}
              </a>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'permissions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
    cell: ({ row }) => {
      const permissions = row.getValue('permissions') as string[];
      return (
        <div className="flex items-center gap-2">
          {permissions.includes('*') ? (
            <div className="flex items-center gap-0.5 text-primary text-sm">
              <ShieldIcon className="size-3" />
              <span className="text-sm font-medium">All Permissions</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {permissions.map(permission => (
                <span
                  key={permission}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:font-medium font-mono uppercase"
                >
                  {permission}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const permissions = row.getValue(id) as string[];
      return value.some((v: string) => permissions.includes(v));
    },
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => {
      return <Actions data={row.original} />;
    },
    enableSorting: false,
  },
];
