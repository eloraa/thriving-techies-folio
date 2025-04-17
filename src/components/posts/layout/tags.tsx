'use client';
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

const Keys = [188, 13];
const MAX_VISIBLE_TAGS = 5;

interface TagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const Tags = ({ tags, onTagsChange }: TagsProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (Keys.includes(e.keyCode) && inputValue.trim()) {
      e.preventDefault();
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault();
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleRemoveTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleDoubleClick = (index: number, tag: string) => {
    setEditingIndex(index);
    setEditValue(tag);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editingIndex !== null) {
      e.preventDefault();
      const newTags = [...tags];
      newTags[editingIndex] = editValue.trim();
      onTagsChange(newTags);
      setEditingIndex(null);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
    }
  };

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = tags.slice(MAX_VISIBLE_TAGS);

  const renderTag = (tag: string, index: number) => (
    <div key={index} className="relative group min-w-0">
      {editingIndex === index ? (
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <Input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={() => setEditingIndex(null)}
              className="text-sm bg-accent/5 flex items-center outline-none px-0 py-0 p-0 h-auto w-auto min-w-0"
              style={{ width: tag.length + 'ch' }}
              autoFocus
            />
          </TooltipTrigger>
          <TooltipContent>
            Press <Kbd>Enter</Kbd> to save
          </TooltipContent>
        </Tooltip>
      ) : (
        <div onDoubleClick={() => handleDoubleClick(index, tag)} className="text-sm bg-accent/5 flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{tag}</span>
            </TooltipTrigger>
            <TooltipContent>Double click to edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => handleRemoveTag(index)} className="ml-1 p-0.5 rounded-full transition-colors">
                <X className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Remove tag</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider delayDuration={0}>
        {visibleTags.map((tag, index) => renderTag(tag, index))}

        {hiddenTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button className="text-sm flex items-center outline-none px-1 py-0 h-auto w-auto" size="icon" variant="secondary">
                <span>+{hiddenTags.length}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex flex-wrap gap-2">{hiddenTags.map((tag, index) => renderTag(tag, index + MAX_VISIBLE_TAGS))}</div>
            </PopoverContent>
          </Popover>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Add tags..."
          className="flex-1 min-w-[60px] outline-none bg-transparent text-sm placeholder:text-foreground/70 text-foreground"
        />
      </TooltipProvider>
    </div>
  );
};
