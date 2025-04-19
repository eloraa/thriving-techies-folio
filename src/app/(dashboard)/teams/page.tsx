'use client';

import { DataTable } from '@/components/data-table/data-table';
import { sanitizeObject } from '@/components/data-table/utils';
import { ShieldIcon, EyeIcon, PencilIcon, Trash2Icon, BringToFrontIcon, ChevronDownIcon } from 'lucide-react';
import { columns } from './column';
import { users } from './const';
import { Actions } from './actions';
import { User } from '@/types';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';

const permissions = [
  {
    value: '*',
    label: 'All Permissions',
    icon: ShieldIcon,
  },
  {
    value: 'read',
    label: 'Read',
    icon: EyeIcon,
  },
  {
    value: 'write',
    label: 'Write',
    icon: PencilIcon,
  },
  {
    value: 'delete',
    label: 'Delete',
    icon: Trash2Icon,
  },
  {
    value: 'change_status',
    label: 'Change Status',
    icon: BringToFrontIcon,
  },
];

export default function Teams() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleSelectionChange = useCallback((users: User[]) => {
    setSelectedUsers(users);
  }, []);

  return (
    <main className="min-h-full md:pb-4 pb-20">
      <div className="flex items-center justify-between md:pr-14 h-16 sticky top-0 bg-background z-10">
        <div className="fixed h-16 bg-background top-0 inset-x-0 -z-10"></div>
        <div className="flex items-center gap-4">
          <h1 className="md:text-lg">Teams</h1>
        </div>
      </div>

      <div>
        <DataTable
          search="id"
          placeholder="Filter by User ID"
          selectActions={
            selectedUsers.length > 0 ? (
              <Actions data={selectedUsers} className={{ base: 'w-auto px-2 h-9' }}>
                <Button variant="secondary" size="sm" className="h-9 bg-accent/10 rounded-full">
                  <span>Actions</span>
                  <ChevronDownIcon className="h-4 w-4 text-foreground" />
                </Button>
              </Actions>
            ) : null
          }
          onSelectionChange={handleSelectionChange}
          filterWith={{
            value: 'permissions',
            label: 'Permissions',
            icon: ShieldIcon,
            options: permissions,
          }}
          data={sanitizeObject(users)}
          columns={columns}
        />
      </div>
    </main>
  );
}
