'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { ArrowDownIcon, CloudUploadIcon } from 'lucide-react';

export const getFileSizeMB = (size: number): number => {
  return size / 1000 / 1000;
};

export const checkType = (file: File, types: string[]): boolean => {
  const extension = file.name.split('.').pop();
  const loweredTypes = types.map(type => type.toLowerCase());
  if (!extension) return false;
  return loweredTypes.includes(extension.toLowerCase());
};

export const acceptedExt = (types: string[]): string => {
  if (!types?.length) return '';
  return types.map(type => `.${type.toLowerCase()}`).join(',');
};

const drawDescription = (currFile: File | null, uploaded: boolean, typeError: boolean, disabled: boolean, label: string) => {
  return typeError ? (
    <div className="text-red-600">File type/size error, Hovered on types!</div>
  ) : (
    <div>
      {disabled ? (
        <span>Upload disabled</span>
      ) : !currFile && !uploaded ? (
        <>
          {label ? (
            <>
              <span>{label.split(' ')[0]}</span> {label.substr(label.indexOf(' ') + 1)}
            </>
          ) : (
            <>
              <span>Upload</span> or drop a attachment right here
            </>
          )}
        </>
      ) : (
        <>
          <span>Uploaded Successfully!</span> Upload another?
        </>
      )}
    </div>
  );
};

// First, let's create a custom hook for dragging
interface UseDraggingProps {
  labelRef: React.RefObject<HTMLDivElement | null>;
  multiple: boolean;
  handleChanges: (files: File | FileList) => boolean;
  onDrop?: (ev: React.DragEvent<HTMLDivElement>) => void;
}

const useDragging = ({ labelRef, multiple, handleChanges, onDrop }: UseDraggingProps): boolean => {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const label = labelRef.current;
    if (!label) return;

    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragIn = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        const isTargetInDropZone = label.contains(e.target as Node);
        if (isTargetInDropZone) {
          setDragging(true);
        }
      }
    };

    const handleDragOut = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const isTargetInDropZone = label.contains(e.relatedTarget as Node);
      if (!isTargetInDropZone) {
        setDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = e.dataTransfer.files;
        if (multiple) {
          handleChanges(files);
        } else {
          handleChanges(files[0]);
        }
        if (onDrop) {
          onDrop(e as unknown as React.DragEvent<HTMLDivElement>);
        }
        e.dataTransfer.clearData();
      }
    };

    label.addEventListener('dragenter', handleDragIn);
    label.addEventListener('dragleave', handleDragOut);
    label.addEventListener('dragover', handleDrag);
    label.addEventListener('drop', handleDrop);

    return () => {
      label.removeEventListener('dragenter', handleDragIn);
      label.removeEventListener('dragleave', handleDragOut);
      label.removeEventListener('dragover', handleDrag);
      label.removeEventListener('drop', handleDrop);
    };
  }, [labelRef, multiple, handleChanges, onDrop]);

  return dragging;
};

// Add DrawTypes component
interface DrawTypesProps {
  types: string[];
  minSize?: number;
  maxSize?: number;
}

const DrawTypes: React.FC<DrawTypesProps> = ({ types, minSize, maxSize }) => {
  return (
    <div className="text-xs text-muted-foreground mt-1">
      {types.join(', ')} {minSize && `min: ${minSize}MB`} {maxSize && `max: ${maxSize}MB`}
    </div>
  );
};

// Update the FileUploader component
interface FileUploaderProps {
  name: string;
  hoverTitle?: string;
  currentFiles?: FileList | File | null;
  setFile?: (file: File | FileList | null) => void;
  types: string[];
  handleChange?: (files: File | FileList) => void;
  classes?: string;
  className?: string;
  children?: React.ReactNode;
  maxSize?: number;
  minSize?: number;
  fileOrFiles?: File | FileList | null;
  onSizeError?: (error: string) => void;
  onTypeError?: (error: string) => void;
  onSelect?: (file: File | FileList) => void;
  onDrop?: (ev: React.DragEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  label?: string;
  multiple?: boolean;
  required?: boolean;
  onDraggingStateChange?: (dragging: boolean) => void;
  dropMessageStyle?: React.CSSProperties;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  name,
  hoverTitle,
  currentFiles,
  setFile,
  types,
  handleChange,
  classes,
  className,
  children,
  maxSize,
  minSize,
  fileOrFiles,
  onSizeError,
  onTypeError,
  onSelect,
  onDrop,
  disabled = false,
  label = '',
  multiple = false,
  required = false,
  onDraggingStateChange,
  dropMessageStyle,
}) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (types && !checkType(file, types)) {
      // types included and type not in them
      setError(true);
      if (onTypeError) onTypeError('File type is not supported');
      return false;
    }
    if (maxSize && getFileSizeMB(file.size) > maxSize) {
      setError(true);
      if (onSizeError) onSizeError('File size is too big');
      return false;
    }
    if (minSize && getFileSizeMB(file.size) < minSize) {
      setError(true);
      if (onSizeError) onSizeError('File size is too small');
      return false;
    }
    return true;
  };

  const handleChanges = (files: File | FileList) => {
    let checkError = false;
    if (files) {
      if (files instanceof File) {
        checkError = !validateFile(files);
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          checkError = !validateFile(file) || checkError;
        }
      }
      if (checkError) return false;
      if (handleChange) handleChange(files);
      if (setFile) setFile(files);

      setUploaded(true);
      setError(false);
      return true;
    }
    return false;
  };

  //   const blockEvent = (ev: React.DragEvent<HTMLDivElement>) => {
  //     ev.preventDefault();
  //     ev.stopPropagation();
  //   };
  const handleClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files) return;

    const allFilesArray = Array.from(files);
    let filesToAdd = allFilesArray;

    if (multiple && currentFiles) {
      const currentFilesArray = currentFiles instanceof File ? [currentFiles] : Array.from(currentFiles);
      filesToAdd = [...allFilesArray, ...currentFilesArray];
    }

    const finalFiles = multiple
      ? (Object.create(files, {
          items: { value: filesToAdd },
          length: { value: filesToAdd.length },
          item: { value: (index: number) => filesToAdd[index] || null },
          [Symbol.iterator]: {
            value: function* () {
              yield* filesToAdd;
            },
          },
        }) as FileList)
      : filesToAdd[0];

    const success = handleChanges(finalFiles);
    if (onSelect && success) onSelect(finalFiles);
  };
  const dragging = useDragging({
    labelRef,
    multiple,
    handleChanges,
    onDrop,
  });

  useEffect(() => {
    onDraggingStateChange?.(dragging);
  }, [dragging, onDraggingStateChange]);

  useEffect(() => {
    if (fileOrFiles) {
      setUploaded(true);
      if (setFile) setFile(fileOrFiles);
    } else {
      if (inputRef.current) inputRef.current.value = '';
      setUploaded(false);
      if (setFile) setFile(null);
    }
  }, [fileOrFiles, setFile]);

  return (
    <div
      className={cn(
        `${classes || ''} ${disabled ? 'is-disabled' : ''} ${fileOrFiles ? '' : 'border'}`,
        'flex flex-col items-center justify-center py-10 px-6 text-center relative rounded-2xl bg-background hover:border',
        className
      )}
      ref={labelRef}
      aria-label={name}
      onClick={handleClick}
    >
      <input
        className="opacity-0 pointer-events-none absolute block w-full"
        onClick={handleClick}
        onChange={handleInputChange}
        accept={acceptedExt(types)}
        ref={inputRef}
        type="file"
        name={name}
        disabled={disabled}
        multiple={multiple}
        required={required}
      />
      {dragging && (
        <div style={dropMessageStyle} className="absolute inset-0 inset-y-0 inset-x-0 bg-background rounded-2xl gap-1 text-sm">
          <div className="flex items-center justify-center h-full w-full bg-blue-500/5 ring-1 ring-blue-500 ring-inset rounded-2xl">
            <div className="flex items-center gap-1">
              <ArrowDownIcon className="size-5" />
              <span className="text-foreground">{hoverTitle || 'Drop Here'}</span>
            </div>
          </div>
        </div>
      )}
      {!children && (
        <>
          <figure className="size-10 p-2 rounded">
            <CloudUploadIcon className="size-full" />
          </figure>
          <div className={error ? 'text-red-500' : ''}>
            {drawDescription(currentFiles instanceof File ? currentFiles : null, uploaded, error, disabled, label)}
            <DrawTypes types={types} minSize={minSize} maxSize={maxSize} />
          </div>
        </>
      )}
      {children}
    </div>
  );
};
