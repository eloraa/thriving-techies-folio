'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect, useCallback } from 'react';
import { cn, generateColor } from '@/lib/utils';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';

import postIcon from './post.png';
import { users } from './const';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Actions } from './actions';
import { buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getCurrentDraft, getAllPosts } from '@/lib/db';

interface Draft {
  id: string;
  title: string;
  content: string;
  coverPhoto: string | null;
  tags: string[];
  slug: string;
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
}

export default function Dashboard() {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadDrafts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get current draft
      const currentDraft = await getCurrentDraft();

      // Get all posts and filter drafts
      const allPosts = await getAllPosts();
      const draftPosts = allPosts.filter(post => post.status === 'draft');

      // Combine current draft with other drafts, ensuring no duplicates
      const allDrafts = currentDraft ? [currentDraft, ...draftPosts.filter(post => post.id !== currentDraft.id)] : draftPosts;

      setDrafts(allDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handlePostSelect = (postId: string) => {
    setSelectedPosts(prev => (prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]));
  };

  const handleAfterDelete = useCallback(async () => {
    setSelectedPosts([]);
    await loadDrafts();
  }, [loadDrafts]);

  return (
    <main className="min-h-full md:pb-4 pb-20">
      <div className="flex items-center justify-between md:pr-14 h-16 sticky top-0 bg-background z-10">
        <div className="fixed h-16 bg-background top-0 inset-x-0 -z-10"></div>
        <div className="flex items-center gap-4">
          <h1 className="md:text-lg">Posts</h1>
          {selectedPosts.length > 0 && (
            <Actions
              align="center"
              data={drafts
                .filter(draft => selectedPosts.includes(draft.id))
                .map(draft => ({
                  id: draft.id,
                  title: draft.title,
                }))}
              onAfterDelete={handleAfterDelete}
              className={{ base: cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'items-center flex rounded-full bg-accent/15 hover:bg-accent/20') }}
            />
          )}
        </div>
      </div>
      <div className="-mx-2 flex items-center justify-between">
        <Tabs
          defaultValue="draft"
          onValueChange={value => {
            router.push('/dashboard/' + value);
          }}
        >
          <TabsList>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
        {drafts.length > 0 && (
          <div className="flex items-center gap-4 min-w-0 pr-2">
            {!!selectedPosts.length && (
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <span className="text-sm text-foreground/70 truncate">{selectedPosts.length} selected</span>
              </div>
            )}
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <Checkbox
                checked={drafts.length === selectedPosts.length}
                onCheckedChange={checked => {
                  if (checked) {
                    setSelectedPosts(drafts.map(draft => draft.id));
                  } else {
                    setSelectedPosts([]);
                  }
                }}
              />
              <span className="text-sm text-foreground/70 truncate">Select All</span>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="h-[calc(100%-16rem)] flex mt-4 items-center justify-center">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      ) : !drafts.length ? (
        <div className="h-[calc(100%-16rem)] flex mt-4 items-center justify-center">
          <div className="text-center">
            <figure className="size-16 mx-auto">
              <Image src={postIcon} alt="Post" className="size-16 opacity-50" />
            </figure>
            <p className="font-medium text-foreground/40">No Draft Found</p>
            <Link href="/posts/new" className={cn(buttonVariants({ variant: 'secondary' }), 'mt-4')}>
              Create New Post
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid mt-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {drafts.map(draft => (
            <div
              key={draft.id}
              className={cn('flex flex-col border-foreground/15 relative group rounded-[0.45rem]', selectedPosts.includes(draft.id) && 'ring-1 ring-blue-500 bg-blue-500/15 md:bg-blue-500/5')}
            >
              <div className={cn('absolute bottom-3 right-3 z-[1]', !selectedPosts.includes(draft.id) && 'hidden group-hover:block')}>
                <Checkbox checked={selectedPosts.includes(draft.id)} onCheckedChange={() => handlePostSelect(draft.id)} />
              </div>
              <div className={cn('flex flex-col relative transition-transform', selectedPosts.includes(draft.id) && 'scale-[0.97]')}>
                <Actions
                  data={{ id: draft.id, title: draft.title }}
                  onAfterDelete={handleAfterDelete}
                  className={{ base: 'absolute top-3 right-3 z-[1] text-white', open: 'opacity-0 invisible group-hover:opacity-100 group-hover:visible' }}
                />
                <Link href={'/posts/edit/' + draft.id}>
                  <figure className="h-40 md:h-56 relative overflow-hidden rounded-lg" style={{ backgroundColor: generateColor() }} suppressHydrationWarning>
                    {draft.coverPhoto ? (
                      <Image src={draft.coverPhoto} alt={draft.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                        <p className="text-foreground/50">No cover image</p>
                      </div>
                    )}
                  </figure>
                  <div className="mt-2">
                    <h3 className="font-medium">{draft.title || 'Untitled Post'}</h3>
                    <p className="text-sm text-foreground/80">
                      By <span className="font-medium text-primary">{users[0]?.name}</span>
                    </p>
                    <h4 className="font-mono text-xs uppercase mt-2">{formatDistance(draft.updatedAt, new Date(), { addSuffix: true })}</h4>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
