export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  return id;
}
