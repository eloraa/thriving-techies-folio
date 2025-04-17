'use client';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, FileIcon, GlobeIcon, PencilIcon, SendToBack, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { useBreakpoints } from '@/lib/useBreakpoints';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deletePost } from '@/lib/db';
import Link from 'next/link';

type Data = {
  id: string;
  title: string;
};

export const Actions = ({ 
  data, 
  align, 
  className,
  onAfterDelete 
}: { 
  data: Data | Data[]; 
  className?: { base?: string; open?: string }; 
  align?: 'center' | 'start' | 'end' | undefined;
  onAfterDelete?: () => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const breakpoints = useBreakpoints();

  const handleChange = (value: string) => {
    if (value === 'draft') setIsChanging(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (Array.isArray(data)) {
        await deletePost(data.map(item => item.id));
      } else {
        await deletePost(data.id);
      }
      setShowDeleteDialog(false);
      if (onAfterDelete) {
        await onAfterDelete();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={cn(className?.base, !isOpen && className?.open)}>
        <DropdownMenu
          onOpenChange={value => {
            setIsOpen(value);
            if (!value) setIsChanging(false);
          }}
        >
          <DropdownMenuTrigger>
            <EllipsisVertical className="size-4 drop-shadow-[0_0_4px_rgba(0,0,0)]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align || 'end'} className="w-60 bg-popover/85 backdrop-blur-lg saturate-[1.8] shadow-lg ">
            {!Array.isArray(data) && (
              <DropdownMenuItem asChild>
                <Link href={`/posts/edit/${data.id}`}>
                  <PencilIcon className="mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2Icon className="mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SendToBack className="mr-2" />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-popover/85 " sideOffset={breakpoints === 'md' || breakpoints === 'sm' ? -50 : 0}>
                  <DropdownMenuRadioGroup value="published">
                    <DropdownMenuRadioItem
                      value="published"
                      className="pr-16"
                      onClick={e => {
                        handleChange('published');
                        e.preventDefault();
                      }}
                    >
                      <GlobeIcon className="mr-2" />
                      Published
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="draft"
                      className="pr-16"
                      onClick={e => {
                        handleChange('draft');
                        e.preventDefault();
                      }}
                      showIndicator={!isChanging}
                    >
                      <FileIcon className="mr-2" />
                      Draft
                      {isChanging && (
                        <div className="absolute right-2 flex items-center justify-center h-full">
                          <Spinner className="size-4" />
                        </div>
                      )}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="sr-only">Are you sure you want to delete?</DialogDescription>
          </DialogHeader>
          <div>
            <p>
              Are you sure you want to delete{' '}
              {Array.isArray(data) ? (
                <>
                  <strong>{data.length}</strong> Posts
                </>
              ) : (
                <strong>{data.title}</strong>
              )}
              ?
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-full bg-transparent border-accent/15 w-20" disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="rounded-full w-20">
              {isDeleting ? <Spinner className="size-4" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
