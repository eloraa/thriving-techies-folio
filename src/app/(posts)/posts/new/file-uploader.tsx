'use client';
import { FileUploader as UploadFile } from '@/components/posts/file-uploader/file-uploader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon, ImageIcon, Maximize2Icon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

interface FileUploaderProps {
  onFileChange?: (file: File | null) => void;
  file?: File | null;
}

export const FileUploader = ({ onFileChange, file: defaultFile }: FileUploaderProps) => {
  const fileTypes = ['JPEG', 'PNG', 'GIF', 'JPG', 'WEBP', 'AVIF'];
  const [file, setFile] = React.useState<File | FileList | null | undefined>(defaultFile);
  const [showInfo, setShowInfo] = React.useState(true);

  const handleFileChange = (newFile: File | FileList | null) => {
    setFile(newFile);
    if (onFileChange) onFileChange(newFile instanceof File ? newFile : null);
  };

  return (
    <div className="h-full flex flex-col justify-center group" onClick={() => setShowInfo(true)}>
      {file && (
        <figure className="w-full relative h-full min-h-0 rounded flex items-center">
          <Image fill src={URL.createObjectURL(file instanceof File ? file : Array.from(file)[0])} alt="Profile" className="object-contain h-full max-md:!h-72 !static" />
          <div className={cn('absolute top-2 right-2 md:opacity-0 md:invisible transition-opacity md:group-hover:opacity-100 md:group-hover:visible z-[2]', !showInfo && 'opacity-0 invisible')}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      setShowInfo(false);
                    }}
                    className="rounded-full md:hidden"
                  >
                    {showInfo ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showInfo ? 'Hide Info' : 'Show Info'}</TooltipContent>
              </Tooltip>
              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Maximize2Icon className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Maximize</TooltipContent>
                </Tooltip>
                <DialogContent className="p-0 w-full max-w-max saturate-100" aria-describedby="profile-preview">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Preview Image</DialogTitle>
                  </DialogHeader>
                  <Image fill src={URL.createObjectURL(file instanceof File ? file : Array.from(file)[0])} alt="Profile Preview" className="w-full h-full max-h-screen object-contain !static" />
                </DialogContent>
              </Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleFileChange(null)} className="rounded-full">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </figure>
      )}
      <UploadFile
        currentFiles={file}
        setFile={handleFileChange}
        fileOrFiles={file}
        className={cn('text-black dark:text-white h-full', file && 'flex items-end flex-row gap-2 py-2 px-2 justify-start bg-transparent absolute bottom-0 inset-x-0', file && !showInfo && 'hidden')}
        name="profile_image"
        types={fileTypes}
        label="Upload Profile Image"
        maxSize={5}
      >
        {file && (
          <div className="items-center gap-1 md:hidden flex md:group-hover:flex w-full justify-center">
            <ImageIcon className="size-3 drop-shadow-[0_0_4px_rgba(0,0,0)]" />
            <p className="text-xs font-medium drop-shadow-[0_0_4px_rgba(0,0,0)]">Upload or drop another image to replace</p>
          </div>
        )}
      </UploadFile>
    </div>
  );
};
