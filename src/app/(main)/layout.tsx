import { Header } from '@/components/main/header/header';
import { ClientHandler } from '@/components/main/client-handler/client-handler';
import { Contact } from '@/components/main/contact/contact';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientHandler>
      <Header />
      {children}
      <Contact />
    </ClientHandler>
  );
}
