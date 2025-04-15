import { Layout } from '@/components/dashboard/layout/layout';
import { fakeUser } from '@/lib/const';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout user={fakeUser}>{children}</Layout>;
}
