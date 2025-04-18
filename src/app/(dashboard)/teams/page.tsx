'use client';

import { DataTable } from '@/components/data-table/data-table';
import { sanitizeObject } from '@/components/data-table/utils';
import { User } from '@/types';
import { ShieldIcon, EyeIcon, PencilIcon, Trash2Icon, ToggleLeftIcon } from 'lucide-react';
import { columns } from './column';

export const users: User[] = [
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    name: 'Elora',
    username: 'elora',
    avatar: '/elora.png',
    email: 'me@aruu.me',
    bio: 'UI Designer | Developer | Generative Artist',
    role: 'Frontend Developer',
    permissions: ['*'],
    website: 'https://aruu.me',
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
    socials: [
      { type: 'twitter', url: 'https://twitter.com/btwitsneon' },
      { type: 'github', url: 'https://github.com/eloraa' },
    ],
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3f9',
    name: 'Neon',
    username: 'neon',
    avatar: '/neon.png',
    email: 'me@aruu.me',
    bio: 'UI Designer | Developer | Generative Artist',
    role: 'Frontend Developer',
    permissions: ['*'],
    website: 'https://aruu.me',
    createdAt: '2023-10-01T00:00:00.000Z',
    updatedAt: '2023-10-01T00:00:00.000Z',
    socials: [
      { type: 'twitter', url: 'https://twitter.com/btwitsneon' },
      { type: 'github', url: 'https://github.com/eloraa' },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Alice Johnson',
    username: 'alicej',
    avatar: 'https://example.com/avatars/alice.jpg',
    email: 'alice@example.com',
    bio: 'Frontend developer and coffee enthusiast.',
    role: 'Frontend Developer',
    permissions: ['*', 'read', 'write', 'delete', 'change_status'],
    website: 'https://alice.dev',
    createdAt: '2023-06-15T12:00:00Z',
    updatedAt: '2024-04-01T09:00:00Z',
    socials: [
      { type: 'twitter', url: 'https://twitter.com/alicej' },
      { type: 'github', url: 'https://github.com/alicej' },
    ],
  },
  {
    id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    name: 'Brian Smith',
    username: 'brians',
    avatar: 'https://example.com/avatars/brian.jpg',
    email: 'brian@example.com',
    bio: 'Backend engineer with a passion for clean architecture.',
    role: 'Backend Developer',
    permissions: ['read', 'write', 'change_status'],
    website: 'https://briansmith.io',
    createdAt: '2022-11-05T08:30:00Z',
    updatedAt: '2025-02-20T15:45:00Z',
    socials: [{ type: 'linkedin', url: 'https://linkedin.com/in/brians' }],
  },
  {
    id: '1e2b93d6-b925-45d2-9c11-7b093c5faabe',
    name: 'Clara Martinez',
    username: 'claram',
    avatar: 'https://example.com/avatars/clara.jpg',
    email: 'clara@example.com',
    bio: 'UI/UX designer, illustrator, and traveler.',
    role: 'Designer',
    permissions: ['read', 'write'],
    website: 'https://claramartinez.design',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2025-03-12T17:25:00Z',
    socials: [
      { type: 'dribbble', url: 'https://dribbble.com/claram' },
      { type: 'instagram', url: 'https://instagram.com/claram' },
    ],
  },
  {
    id: '3a8f83f0-4e53-4c8e-8d9d-42e25b2e657f',
    name: 'David Lee',
    username: 'dlee',
    avatar: 'https://example.com/avatars/david.jpg',
    email: 'david@example.com',
    bio: 'DevOps specialist and open-source contributor.',
    role: 'DevOps Engineer',
    permissions: ['read', 'write', 'change_status'],
    website: 'https://davidlee.dev',
    createdAt: '2021-08-21T10:00:00Z',
    updatedAt: '2025-01-18T13:15:00Z',
    socials: [
      { type: 'github', url: 'https://github.com/dlee' },
      { type: 'mastodon', url: 'https://mastodon.social/@dlee' },
    ],
  },
  {
    id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
    name: 'Emma Walker',
    username: 'emmaw',
    avatar: 'https://example.com/avatars/emma.jpg',
    email: 'emma@example.com',
    bio: 'Full-stack engineer, teacher, and mentor.',
    role: 'Full-stack Developer',
    permissions: ['*', 'read', 'write', 'delete', 'change_status'],
    website: 'https://emma.dev',
    createdAt: '2020-12-02T11:15:00Z',
    updatedAt: '2025-04-10T08:00:00Z',
    socials: [
      { type: 'twitter', url: 'https://twitter.com/emmaw' },
      { type: 'linkedin', url: 'https://linkedin.com/in/emmaw' },
    ],
  },
  {
    id: '44b5c983-50da-4fcf-9430-b82a540d6cf0',
    name: 'Felix Nguyen',
    username: 'felixn',
    avatar: 'https://example.com/avatars/felix.jpg',
    email: 'felix@example.com',
    bio: 'Game dev. Shader wizard. Pixel pusher.',
    role: 'Technical Artist',
    permissions: ['read', 'write', 'delete'],
    website: 'https://felixnguyen.games',
    createdAt: '2023-03-09T16:45:00Z',
    updatedAt: '2025-04-01T14:30:00Z',
    socials: [
      { type: 'github', url: 'https://github.com/felixn' },
      { type: 'artstation', url: 'https://www.artstation.com/felixn' },
    ],
  },
];

const permissions = [
  {
    value: '*',
    label: 'All Permissions',
    icon: ShieldIcon,
  },
  {
    value: 'read',
    label: 'Read',
    icon: EyeIcon,
  },
  {
    value: 'write',
    label: 'Write',
    icon: PencilIcon,
  },
  {
    value: 'delete',
    label: 'Delete',
    icon: Trash2Icon,
  },
  {
    value: 'change_status',
    label: 'Change Status',
    icon: ToggleLeftIcon,
  },
];

export default function Teams() {
  return (
    <main className="min-h-full md:pb-4 pb-20">
      <div className="flex items-center justify-between md:pr-14 h-16 sticky top-0 bg-background z-10">
        <div className="fixed h-16 bg-background top-0 inset-x-0 -z-10"></div>
        <div className="flex items-center gap-4">
          <h1 className="md:text-lg">Teams</h1>
        </div>
      </div>

      <div>
        <DataTable
          search="id"
          placeholder="Filter by User ID"
          filterWith={{
            value: 'permissions',
            label: 'Permissions',
            icon: ShieldIcon,
            options: permissions,
          }}
          data={sanitizeObject(users)}
          columns={columns}
        />
      </div>
    </main>
  );
}
