'use client';

import { Header } from '@/components/posts/layout/header';
import { CustomMarkdownEditor } from '@/components/markdown/custom-markdown-editor';
import { MarkdownPreview } from '@/components/markdown/markdown';
import { useState, useEffect } from 'react';
import { TextToSpeech } from '@/app/(main)/blog/[slug]/text-to-speech';
import { Share } from '@/app/(main)/blog/[slug]/share';
import Link from 'next/link';
import Image from 'next/image';
import { fakeUser } from '@/lib/const';
import { saveCurrentDraft, getPost } from '@/lib/db';
import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'next/navigation';
import { FileUploader } from '../../new/file-uploader';

export default function EditPost() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState('');
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getPost(params.id as string);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setTags(post.tags);
          setSlug(post.slug);
          if (post.coverPhoto) {
            try {
              const base64Data = post.coverPhoto.split(',')[1];
              const bs = atob(base64Data);
              const buffer = new ArrayBuffer(bs.length);
              const ba = new Uint8Array(buffer);
              for (let i = 0; i < bs.length; i++) {
                ba[i] = bs.charCodeAt(i);
              }
              const blob = new Blob([ba], { type: 'image/png' });
              const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' });
              setCoverPhoto(file);
              setCoverPhotoUrl(post.coverPhoto);
            } catch (error) {
              console.error('Error loading cover photo:', error);
            }
          }

          // Save to currentDraft for auto-save functionality
          await saveCurrentDraft({
            title: post.title,
            content: post.content,
            coverPhoto: post.coverPhoto,
            tags: post.tags,
            slug: post.slug,
            status: post.status,
          });
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [params.id]);

  useEffect(() => {
    if (isLoading) return;
    const autoSave = async () => {
      const coverPhotoBase64 = coverPhoto
        ? await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(coverPhoto);
          })
        : null;

      const postData = {
        title,
        content,
        coverPhoto: coverPhotoBase64,
        tags,
        slug,
        status: 'draft' as const,
      };

      await saveCurrentDraft(postData);
    };

    const timer = setTimeout(autoSave, 30000);
    return () => clearTimeout(timer);
  }, [title, content, coverPhoto, tags, slug, isLoading]);

  useEffect(() => {
    if (coverPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(coverPhoto);
    } else {
      setCoverPhotoUrl(null);
    }
  }, [coverPhoto]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <main>
      <Header
        onModeChange={mode => setMode(mode)}
        mode={mode}
        title={title}
        onTitleChange={setTitle}
        tags={tags}
        onTagsChange={setTags}
        slug={slug}
        onSlugChange={setSlug}
        content={content}
        coverPhoto={coverPhoto}
      />
      {mode === 'edit' ? (
        <div className="pt-16 pb-8 container">
          <div className="relative h-[22rem] md:h-72 w-full md:max-w-lg overflow-hidden rounded-2xl mx-auto">
            <FileUploader onFileChange={setCoverPhoto} file={coverPhoto} />
          </div>

          <div className="py-10 md:max-w-3xl mx-auto">
            <CustomMarkdownEditor value={content} onChange={setContent} className="min-h-[500px]" />
          </div>
        </div>
      ) : (
        <div className="container py-10 md:max-w-3xl mx-auto max-md:pb-16">
          <div className="flex items-center justify-center flex-col border-b pb-8 border-foreground/15">
            <figure className="relative h-72 w-full md:max-w-lg overflow-hidden rounded-2xl">
              {coverPhotoUrl ? (
                <Image className="object-contain" src={coverPhotoUrl} fill alt={title || 'Cover image'} />
              ) : (
                <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                  <p className="text-foreground/50">No cover image</p>
                </div>
              )}
            </figure>
            <div className="space-y-2">
              <h1 className="text-center mt-8 text-lg lg:text-3xl font-semibold max-w-lg mx-auto">{title || 'Untitled Post'}</h1>
              <div className="flex items-center gap-2 justify-center">
                <p className="text-center py-1 text-sm text-foreground/80">{formatDate(new Date())}</p>
                <span className="h-4 border-l border-accent/15"></span>
                <p className="text-center py-1 text-sm text-foreground/80">
                  By{' '}
                  <Link href={`/profile/${fakeUser.username}`} className="font-medium text-primary">
                    {fakeUser.name}
                  </Link>
                </p>
              </div>
              {tags.length > 0 && (
                <div className="flex items-center gap-6 flex-wrap text-center justify-center text-sm uppercase font-mono text-foreground/50 font-medium">
                  {tags.map((tag, index) => (
                    <p key={index}>{tag}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <TextToSpeech text={content} />
            <Share content={typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : ''} />
          </div>

          <div className="mt-10">
            <MarkdownPreview content={content} />
          </div>
        </div>
      )}
    </main>
  );
}
