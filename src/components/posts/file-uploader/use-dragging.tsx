import { useState, useEffect, useCallback, RefObject } from 'react';

let draggingCount = 0;

interface UseDraggingProps {
  labelRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  multiple: boolean;
  allFiles?: FileList | null;
  handleChanges: (files: File[] | FileList) => boolean;
  onDrop?: (files: File[] | FileList) => void;
}

/**
 * Custom hook for handling file drag and drop
 * @param props - Hook properties
 * @returns boolean - the dragging state
 * @internal
 */
export default function useDragging({ 
  labelRef, 
  inputRef, 
  multiple, 
  allFiles, 
  handleChanges, 
  onDrop 
}: UseDraggingProps): boolean {
  const [dragging, setDragging] = useState(false);
  
  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  const handleDragIn = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount++;
    if (ev.dataTransfer?.items && ev.dataTransfer.items.length !== 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    draggingCount--;
    if (draggingCount > 0) return;
    setDragging(false);
  }, []);

  const handleDrag = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, []);

  const handleDrop = useCallback((ev: DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDragging(false);
    draggingCount = 0;
    
    const eventFiles = ev.dataTransfer?.files;
    if (eventFiles && eventFiles.length > 0) {
      let filesToAdd: File[] | FileList = eventFiles;
      if (multiple) {
        filesToAdd = Array.from(eventFiles).concat(allFiles ? Array.from(allFiles) : []);
      }
      const success = handleChanges(filesToAdd);
      if (onDrop && success) {
        onDrop(filesToAdd);
      }
    }
  }, [handleChanges, multiple, onDrop, allFiles]);

  useEffect(() => {
    const ele = labelRef.current;
    if (!ele) return;

    ele.addEventListener('click', handleClick);
    ele.addEventListener('dragenter', handleDragIn);
    ele.addEventListener('dragleave', handleDragOut);
    ele.addEventListener('dragover', handleDrag);
    ele.addEventListener('drop', handleDrop);
    
    return () => {
      ele.removeEventListener('click', handleClick);
      ele.removeEventListener('dragenter', handleDragIn);
      ele.removeEventListener('dragleave', handleDragOut);
      ele.removeEventListener('dragover', handleDrag);
      ele.removeEventListener('drop', handleDrop);
    };
  }, [handleClick, handleDragIn, handleDragOut, handleDrag, handleDrop, labelRef]);

  return dragging;
}
