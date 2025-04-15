import { User } from '@/components/dashboard/layout/layout';
import { HomeIcon, UsersIcon } from 'lucide-react';

export const links = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Team',
    href: '/team',
  },
  {
    label: 'Showcase',
    href: '/showcase',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const dashboardLinks = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    label: 'Teams',
    href: '/teams',
    icon: UsersIcon,
  },
];

export const fakeUser = {
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
