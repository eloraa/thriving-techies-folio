import EditUserModal from './modal';

export default async function UserModal({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  return <EditUserModal id={id} />;
}
