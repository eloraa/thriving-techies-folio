'use client';
import { Filter } from './filter';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { cn, generateColor } from '@/lib/utils';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import Image from 'next/image';

import postIcon from './post.png';
import { posts, users } from './const';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Actions } from './actions';
import { buttonVariants } from '@/components/ui/button';

export default function Dashboard() {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    if (selectedUser === 'all') return true;
    if (selectedUser === 'only_me') return post.userid === '4c1b2e4-8f3d-4a5e-8b2f-4c1b2e4f3d8';
    if (selectedUser) return post.userid === selectedUser;
    return true;
  });

  const handlePostSelect = (postId: string) => {
    setSelectedPosts(prev => (prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]));
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const isAllSelected = filteredPosts.length > 0 && selectedPosts.length === filteredPosts.length;
  const isIndeterminate = selectedPosts.length > 0 && selectedPosts.length < filteredPosts.length;

  return (
    <main className={cn('min-h-full md:pb-4 pb-20', !filteredPosts.length && 'h-full')}>
      <div className="flex items-center justify-between md:pr-14 h-16 sticky top-0 bg-background z-10">
        <div className="flex items-center gap-4">
          <h1 className="md:text-lg">Posts</h1>
          {selectedPosts.length > 0 && (
            <Actions
              align="center"
              data={posts.filter(post => selectedPosts.includes(post.id))}
              className={{ base: cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'items-center flex rounded-full bg-accent/15 hover:bg-accent/20') }}
            />
          )}
        </div>

        <div className="-mx-4">
          <Filter onUserChange={setSelectedUser} />
        </div>
      </div>
      <div className="-mx-2 flex items-center justify-between">
        <Tabs defaultValue="published" onValueChange={() => {}}>
          <TabsList>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
        {filteredPosts.length > 0 && (
          <div className="flex items-center gap-4 min-w-0 pr-2">
            {!!selectedPosts.length && (
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <span className="text-sm text-foreground/70 truncate">{selectedPosts.length} selected</span>
              </div>
            )}

            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <Checkbox checked={isIndeterminate ? 'indeterminate' : isAllSelected} onCheckedChange={handleSelectAll} />
              <span className="text-sm text-foreground/70 truncate">Select All</span>
            </div>
          </div>
        )}
      </div>
      {!filteredPosts.length && (
        <div className="h-[calc(100%-16rem)] flex- mt-4 flex items-center justify-center">
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
              <div key={post.id} className={cn('flex flex-col border-foreground/15 relative group', selectedPosts.includes(post.id) && 'ring-1 ring-blue-500 bg-blue-500/15 md:bg-blue-500/5')}>
                <Actions data={post} className={{ base: 'absolute top-3 right-3 z-[1] text-white', open: 'opacity-0 invisible group-hover:opacity-100 group-hover:visible' }} />
                <div className={cn('absolute bottom-3 right-3', !selectedPosts.includes(post.id) && 'hidden group-hover:block')}>
                  <Checkbox checked={selectedPosts.includes(post.id)} onCheckedChange={() => handlePostSelect(post.id)} />
                </div>
                <figure className="h-40 md:h-56 relative overflow-hidden" style={{ backgroundColor: generateColor() }} suppressHydrationWarning>
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
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
