import { notFound } from 'next/navigation';
import { User } from '@/types';
import { users } from '../../const';
import { EditUserForm } from '@/app/@user/(.)teams/edit/[id]/edit-user-form';

export default function EditUserPage({ params }: { params: { id: string } }) {
  const user = users.find((u: User) => u.id === params.id);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-full md:pb-4 pb-20">
      <div className="flex items-center justify-between md:pr-14 h-16 sticky top-0 bg-background z-10">
        <div className="fixed h-16 bg-background top-0 inset-x-0 -z-10"></div>
        <div className="flex items-center gap-4">
          <h1 className="md:text-lg">Edit user</h1>
        </div>
      </div>
      <div>
        <EditUserForm user={user} />
      </div>
    </main>
  );
}
