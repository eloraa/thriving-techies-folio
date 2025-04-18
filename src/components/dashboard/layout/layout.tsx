import { User } from '@/types';
import { Footer } from './footer';
import { Header } from './header';
import { Sidebar } from './sidebar';

type Props = {
  children: Readonly<React.ReactNode>;
  user: User;
};

export const Layout = ({ children, user }: Props) => {
  return (
    <main className="fixed h-full w-full bg-background">
      <Header user={user} />
      <div className="absolute inset-0 h-full w-full flex">
        <Sidebar />
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">{children}</div>
      </div>
      <Footer user={user} />
    </main>
  );
};
