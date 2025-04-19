'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { EditUserForm } from './edit-user-form';
import { users } from '@/app/(dashboard)/teams/const';
import { useRouter } from 'next/navigation';

export default function EditUserModal({ id }: { id: string }) {
  const user = users.find(u => u.id === id);
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className="w-[620px] max-w-[calc(100vw-24px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription className="sr-only">Edit user profile</DialogDescription>
        </DialogHeader>
        <EditUserForm user={user} />
      </DialogContent>
    </Dialog>
  );
}
