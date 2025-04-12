'use client';
import { Filter } from './filter';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn, generateColor } from '@/lib/utils';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import Image from 'next/image';

import postIcon from './post.png';

export const users = [
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    name: 'Elora',
    username: 'elora',
    avatar: '/elora.png',
    posts: 14,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9',
    name: 'John Doe',
    username: 'johndoe',
    avatar: '/john.png',
    posts: 4,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d0',
    name: 'Neon',
    username: 'neon',
    avatar: '/neon.png',
    posts: 0,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d2',
    name: 'Jane Doe',
    username: 'janedoe',
    avatar: '/jane.png',
    posts: 0,
  },
  {
    id: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d3',
    name: 'John Smith',
    username: 'johnsmith',
    avatar: '/john.png',
    posts: 0,
  },
];

export const posts = [
  // Elora's posts (14)
  { id: 'post-1', title: 'Building a custom WebGL shader 🌈', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-10T08:00:00Z', image: 'https://picsum.photos/seed/shader1/600/400' },
  {
    id: 'post-2',
    title: 'CSS grid vs Flexbox: when to use what? 🎯',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-04-10T09:30:00Z',
    image: 'https://picsum.photos/seed/cssgrid/600/400',
  },
  { id: 'post-3', title: 'Math behind Bézier curves 🧮', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-09T14:20:00Z', image: 'https://picsum.photos/seed/math1/600/400' },
  {
    id: 'post-4',
    title: 'Experimenting with Three.js scenes 🧪',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-04-08T18:10:00Z',
    image: 'https://picsum.photos/seed/threejs/600/400',
  },
  {
    id: 'post-5',
    title: 'Animating with requestAnimationFrame 🎥',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-04-08T10:00:00Z',
    image: 'https://picsum.photos/seed/animation/600/400',
  },
  { id: 'post-6', title: 'Intro to GLSL for beginners ✨', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-07T11:00:00Z', image: 'https://picsum.photos/seed/glsl1/600/400' },
  {
    id: 'post-7',
    title: 'Math tricks every graphics dev should know 📐',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-04-06T16:45:00Z',
    image: 'https://picsum.photos/seed/mathtricks/600/400',
  },
  {
    id: 'post-8',
    title: 'Why React is still my go-to for UI 🧰',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-04-05T22:15:00Z',
    image: 'https://picsum.photos/seed/reactui/600/400',
  },
  { id: 'post-9', title: 'Signed distance functions are wild 🔥', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-04T14:00:00Z', image: 'https://picsum.photos/seed/sdf/600/400' },
  { id: 'post-10', title: 'Simulating light in shaders 🔦', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-04T08:40:00Z', image: 'https://picsum.photos/seed/lightshader/600/400' },
  {
    id: 'post-11',
    title: 'Performance tips for rendering 1000+ objects ⚡',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-04-03T17:00:00Z',
    image: 'https://picsum.photos/seed/renderperf/600/400',
  },
  { id: 'post-12', title: 'What the heck is a quadtree? 🌳', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8', created_at: '2025-04-02T12:30:00Z', image: 'https://picsum.photos/seed/quadtree/600/400' },
  {
    id: 'post-13',
    title: 'Using noise functions for terrain gen 🌍',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-04-01T15:20:00Z',
    image: 'https://picsum.photos/seed/noise/600/400',
  },
  {
    id: 'post-14',
    title: 'Debugging shader code like a boss 😎',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8',
    created_at: '2025-03-31T19:50:00Z',
    image: 'https://picsum.photos/seed/debugshader/600/400',
  },

  // John Doe's posts (4)
  {
    id: 'post-15',
    title: 'Just built a mini ray marcher! 🚀',
    userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9',
    created_at: '2025-04-10T12:00:00Z',
    image: 'https://picsum.photos/seed/raymarcher/600/400',
  },
  { id: 'post-16', title: 'React hooks + canvas = ❤️', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9', created_at: '2025-04-09T08:30:00Z', image: 'https://picsum.photos/seed/hooks/600/400' },
  { id: 'post-17', title: 'Trigonometry in game dev 🕹️', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9', created_at: '2025-04-08T19:00:00Z', image: 'https://picsum.photos/seed/trig/600/400' },
  { id: 'post-18', title: 'Tips for optimizing shaders 🧠', userid: '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d9', created_at: '2025-04-07T21:15:00Z', image: 'https://picsum.photos/seed/optimize/600/400' },
];

export default function Dashboard() {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    if (selectedUser === 'all') return true;
    if (selectedUser === 'only_me') return post.userid === '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8'; // Assuming this is the current user
    if (selectedUser) return post.userid === selectedUser;
    return true;
  });

  const handlePostSelect = (postId: string) => {
    setSelectedPosts(prev => (prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]));
  };

  const handleDeleteSelected = () => {
    // TODO: Implement delete functionality
    console.log('Deleting posts:', selectedPosts);
    setSelectedPosts([]);
  };

  return (
    <main className="py-4 h-full">
      <div className="flex items-center justify-between md:pr-14">
        <div className="flex items-center gap-4">
          <h1 className="md:text-lg">Posts</h1>
          {selectedPosts.length > 0 && (
            <Button variant="secondary" size="sm" className="text-destructive hover:text-destructive bg-accent/10 rounded-full gap-2" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          )}
        </div>

        <div className="-mx-2">
          <Filter onUserChange={setSelectedUser} />
        </div>
      </div>
      {!filteredPosts.length && (
        <div className="h-[calc(100%-4rem)] mt-4 flex items-center justify-center">
          <div className="text-center">
            <figure className="size-16 mx-auto">
              <Image src={postIcon} alt="Post" className="size-16 opacity-50" />
            </figure>
            <p className="font-medium text-foreground/40">No Post Found</p>
          </div>
        </div>
      )}
      {!!filteredPosts.length && (
        <div className="grid mt-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPosts.map(post => {
            const user = users.find(u => u.id === post.userid);
            return (
              <div
                key={post.id}
                className={cn('flex flex-col border border-foreground/15 relative p-3 rounded-xl group', selectedPosts.includes(post.id) && 'ring-1 ring-inset ring-primary bg-primary/5')}
              >
                <div className={cn('absolute bottom-3 right-3', !selectedPosts.includes(post.id) && 'hidden group-hover:block')}>
                  <Checkbox checked={selectedPosts.includes(post.id)} onCheckedChange={() => handlePostSelect(post.id)} />
                </div>
                <figure className="h-40 rounded-lg md:h-56 relative overflow-hidden" style={{ backgroundColor: generateColor() }} suppressHydrationWarning>
                  <Image src={post.image} alt={post.title} fill />
                </figure>
                <div className="mt-2">
                  <Link href="/blog/pixels-and-poetry">{post.title}</Link>
                  <p className="text-sm text-foreground/80">
                    By{' '}
                    <Link href="/profile/elora" className="font-medium text-primary">
                      {user?.name}
                    </Link>
                  </p>
                  <h4 className="font-mono text-xs uppercase mt-2">{formatDistance(post.created_at, new Date(), { addSuffix: true })}</h4>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
