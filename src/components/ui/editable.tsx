'use client';
import { Kbd } from '@/components/ui/kbd';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import * as React from 'react';

type Props = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onEditChange?: (editing: boolean) => void;
  placeholder?: string;
};

export const Editable = ({ value, defaultValue, onValueChange, onEditChange, placeholder }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [pendingValue, setPendingValue] = React.useState<string | null>(null);
  const [originalValue, setOriginalValue] = React.useState(value || defaultValue || '');
  const [displayValue, setDisplayValue] = React.useState(value !== undefined ? value : internalValue);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(value);
    }
  }, [value]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsEditing(true);
    onEditChange?.(true);
    e.currentTarget.focus();
  };

  const saveChanges = (newContent: string) => {
    if (!newContent.trim()) {
      if (value !== undefined) {
        onValueChange?.(originalValue);
        setDisplayValue(originalValue);
      } else {
        setInternalValue(originalValue);
        setDisplayValue(originalValue);
      }
      setIsEditing(false);
      onEditChange?.(false);
      return;
    }

    if (newContent === originalValue) {
      setIsEditing(false);
      onEditChange?.(false);
      return;
    }

    if (value !== undefined) {
      onValueChange?.(newContent);
      setDisplayValue(newContent);
      setOriginalValue(newContent);
      setIsEditing(false);
      onEditChange?.(false);
    } else {
      setIsSaving(true);
      setInternalValue(newContent);
      setDisplayValue(newContent);
      setOriginalValue(newContent);

      setTimeout(() => {
        setIsSaving(false);
        setPendingValue(null);
        setIsEditing(false);
        onEditChange?.(false);
      }, 3000);
    }
  };

  const handleBlur = () => {
    if (isSaving) return;

    if (pendingValue !== null) {
      saveChanges(pendingValue);
    } else {
      const currentContent = contentRef.current?.textContent || '';
      saveChanges(currentContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newContent = e.currentTarget.textContent || '';
      saveChanges(newContent);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    if (contentRef.current && value) {
      return;
    }
    setPendingValue(newContent);
  };

  React.useEffect(() => {
    if (contentRef.current && !isEditing) {
      contentRef.current.textContent = displayValue;
    }
  }, [displayValue, isEditing]);

  React.useEffect(() => {
    if (contentRef.current && value !== undefined && !isEditing) {
      contentRef.current.textContent = value;
    }
  }, [value, isEditing]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isEditing || isSaving ? true : undefined}>
        <TooltipTrigger asChild>
          <div className="flex max-w-full overflow-hidden relative h-6 items-center" style={{ minWidth: placeholder ? placeholder.length + 'ch' : '1rem' }}>
            {(!displayValue || displayValue.trim() === '') && (!pendingValue || pendingValue.trim() === '') && !!placeholder && (
              <span className="absolute text-muted-foreground pointer-events-none text-sm top-1/2 -translate-y-1/2">{placeholder}</span>
            )}
            <div
              ref={contentRef}
              role="textbox"
              contentEditable={isEditing && !isSaving}
              aria-label="Title"
              onClick={handleClick}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              suppressContentEditableWarning
              tabIndex={0}
              className={cn(
                'outline-none selection:bg-violet-500/30 selection:text-foreground caret-red-500 text-sm relative h-6 p-0.5 selection:rounded-md',
                !isEditing && 'truncate',
                isSaving && 'opacity-70 cursor-not-allowed'
              )}
              style={{ minWidth: placeholder ? placeholder.length + 'ch' : '1rem' }}
              data-placeholder={placeholder}
            >
              {displayValue}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent align="start">
          {isSaving ? (
            <div className="flex items-center gap-1">
              <Spinner className="size-3" /> Saving...
            </div>
          ) : !isEditing ? (
            'Click to Edit'
          ) : (
            <>
              Press <Kbd>Enter</Kbd> or <Kbd>Click</Kbd> Outside to Save
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
