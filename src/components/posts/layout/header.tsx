import { Dropdown } from '@/components/dashboard/layout/dropdown';
import { Button } from '@/components/ui/button';
import { Editable } from '@/components/ui/editable';
import { fakeUser } from '@/lib/const';
import { AppWindowIcon, ArrowLeft, ChevronDown, CodeIcon, FileIcon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { Settings } from './settings';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveCurrentDraft, savePost } from '@/lib/db';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

interface ToolsProps {
  mode: 'edit' | 'preview';
  onModeChange: (mode: 'edit' | 'preview') => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  title: string;
  content: string;
  coverPhoto: File | null;
}

const Tools = ({ mode, onModeChange, tags, onTagsChange, slug, onSlugChange, title, content, coverPhoto }: ToolsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const coverPhotoBase64 = coverPhoto
        ? await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
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

      await Promise.all([saveCurrentDraft(postData), savePost({ ...postData, status: 'draft' })]);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const coverPhotoBase64 = coverPhoto
        ? await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(coverPhoto);
          })
        : null;

      const postData = {
        title,
        content,
        coverPhoto: coverPhotoBase64,
        tags,
        slug,
        status: 'published' as const,
      };

      await savePost(postData);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="items-center gap-1 flex flex-wrap justify-center">
      <Tabs value={mode} onValueChange={value => onModeChange(value as 'edit' | 'preview')}>
        <TabsList className="h-8 p-0.5">
          <TabsTrigger value="edit" className="flex items-center text-sm gap-1 h-full py-0 data-[state=active]:bg-accent/10">
            <CodeIcon className="size-4" />
            <span className="-mt-0.5">Code</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center text-sm gap-1 h-full py-0 data-[state=active]:bg-accent/10">
            <AppWindowIcon className="size-4" />
            <span className="-mt-0.5">Preview</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Settings tags={tags} onTagsChange={onTagsChange} slug={slug} onSlugChange={onSlugChange} />
      <div className="flex items-center">
        <Button
          size="sm"
          variant="secondary"
          className="[&_svg]:size-3.5 gap-1 rounded-full bg-accent/15 rounded-r-none border-r border-accent/10 relative w-32 justify-start text-start"
          onClick={handleSaveDraft}
          disabled={isSaving}
        >
          {isSaving ? <Spinner className="size-4" /> : <FileIcon />}
          <span className="-mt-0.5">{isSaving ? 'Saving...' : 'Save to draft'}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary" className="[&_svg]:size-3.5 rounded-full bg-accent/15 rounded-l-none h-8">
              <ChevronDown />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="py-1 text-sm" onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? <Spinner className="size-4 mr-2" /> : <GlobeIcon className="mr-2" />}
              {isPublishing ? 'Publishing...' : 'Publish now'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

interface HeaderProps {
  mode: 'edit' | 'preview';
  onModeChange: (mode: 'edit' | 'preview') => void;
  title: string;
  onTitleChange: (title: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  content: string;
  coverPhoto: File | null;
}

export const Header = ({ mode, onModeChange, title, onTitleChange, tags, onTagsChange, slug, onSlugChange, content, coverPhoto }: HeaderProps) => {
  return (
    <>
      <header className="sticky top-0 px-2 md:px-4 py-1 border-b border-accent/10 z-10 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex w-12">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/published">
                <ArrowLeft />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          </div>
          <div className="min-w-0 overflow-hidden truncate mr-auto">
            <Editable placeholder="Title" value={title} onValueChange={onTitleChange} />
          </div>
          <div className="flex justify-end items-center gap-4">
            <div className="md:flex hidden">
              <Tools mode={mode} onModeChange={onModeChange} tags={tags} onTagsChange={onTagsChange} slug={slug} onSlugChange={onSlugChange} title={title} content={content} coverPhoto={coverPhoto} />
            </div>
            <Dropdown user={fakeUser} />
          </div>
        </div>
      </header>
      <div className="fixed bottom-0 inset-x-0 flex justify-center md:hidden z-20 bg-background py-6">
        <Tools mode={mode} onModeChange={onModeChange} tags={tags} onTagsChange={onTagsChange} slug={slug} onSlugChange={onSlugChange} title={title} content={content} coverPhoto={coverPhoto} />
      </div>
    </>
  );
};
