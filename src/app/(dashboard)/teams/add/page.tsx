import { AddUserForm } from '@/app/@user/(.)teams/add/add-user-form';

export default function AddUserPage() {
  return (
    <main className="min-h-full md:pb-4 pb-20">
      <div className="flex items-center justify-between md:pr-14 h-16 sticky top-0 bg-background z-10">
        <div className="fixed h-16 bg-background top-0 inset-x-0 -z-10"></div>
        <div className="flex items-center gap-4">
          <h1 className="md:text-lg">Add new user</h1>
        </div>
      </div>
      <div>
        <AddUserForm />
      </div>
    </main>
  );
}
