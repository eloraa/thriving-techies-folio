import { Header } from '@/components/main/header/header';
import { cookies } from 'next/headers';
import { ClientHandler } from '@/components/main/client-handler/client-handler';
import { Contact } from '@/components/main/contact/contact';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();

  const theme = cookiesStore.get('theme');

  return (
    <ClientHandler theme={theme?.value === 'dark' ? 'dark' : 'light'}>
      <Header />
      {children}
      <Contact />
    </ClientHandler>
  );
}
