import { Layout, User } from '@/components/dashboard/layout/layout';

const fakeUser = {
  id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
  name: 'Elora',
  username: 'elora',
  avatar: '/elora.png',
  email: 'me@aruu.me',
  bio: 'UI Designer | Developer | Generative Artist',
  role: 'Frontend Developer',
  website: 'https://aruu.me',
  createdAt: '2023-10-01T00:00:00.000Z',
  updatedAt: '2023-10-01T00:00:00.000Z',
  socials: [
    { type: 'twitter', url: 'https://twitter.com/btwitsneon' },
    { type: 'github', url: 'https://github.com/eloraa' },
  ],
} satisfies User;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout user={fakeUser}>{children}</Layout>;
}
