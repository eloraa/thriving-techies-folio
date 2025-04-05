import { links } from '@/lib/const';
import Home from '../page';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;

  console.log(page);

  if (!links.some(link => link.href.replace('/', '') === page)) return notFound();

  return <Home />;
}
