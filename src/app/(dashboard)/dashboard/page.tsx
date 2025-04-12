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
import { posts, users } from './const';

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
