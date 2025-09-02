'use client';

import React, { useState } from 'react';
import { Block, BlockType } from '@/types/editor';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BlockToolbarProps {
  block: Block;
  onAddBlock: (type: BlockType) => void;
  onDeleteBlock: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const blockTypes: { type: BlockType; label: string; icon: string; description: string }[] = [
  { type: 'paragraph', label: 'Text', icon: '📝', description: 'Just start writing with plain text.' },
  { type: 'heading-1', label: 'Heading 1', icon: 'H1', description: 'Big section heading.' },
  { type: 'heading-2', label: 'Heading 2', icon: 'H2', description: 'Medium section heading.' },
  { type: 'heading-3', label: 'Heading 3', icon: 'H3', description: 'Small section heading.' },
  { type: 'bulleted-list', label: 'Bulleted list', icon: '•', description: 'Create a simple bulleted list.' },
  { type: 'numbered-list', label: 'Numbered list', icon: '1.', description: 'Create a list with numbering.' },
  { type: 'to-do', label: 'To-do list', icon: '☑️', description: 'Track tasks with a to-do list.' },
  { type: 'toggle', label: 'Toggle list', icon: '▶️', description: 'Toggleable content.' },
  { type: 'code', label: 'Code', icon: '💻', description: 'Capture a code snippet.' },
  { type: 'quote', label: 'Quote', icon: '❝', description: 'Capture a quote.' },
  { type: 'divider', label: 'Divider', icon: '—', description: 'Visually divide blocks.' },
  { type: 'callout', label: 'Callout', icon: '💡', description: 'Make writing stand out.' },
  { type: 'image', label: 'Image', icon: '🖼️', description: 'Upload or embed with a link.' },
];

export function BlockToolbar({
  onAddBlock,
  onDeleteBlock,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: BlockToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute left-0 top-0 -ml-12 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex flex-col gap-1">
        {/* Add Block Button */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              +
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-80">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">BASIC BLOCKS</div>
              <div className="space-y-1">
                {blockTypes.slice(0, 4).map((blockType) => (
                  <DropdownMenuItem
                    key={blockType.type}
                    onClick={() => {
                      onAddBlock(blockType.type);
                      setIsOpen(false);
                    }}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <span className="text-lg mt-0.5">{blockType.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{blockType.label}</div>
                      <div className="text-xs text-muted-foreground">{blockType.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">LISTS</div>
              <div className="space-y-1">
                {blockTypes.slice(4, 8).map((blockType) => (
                  <DropdownMenuItem
                    key={blockType.type}
                    onClick={() => {
                      onAddBlock(blockType.type);
                      setIsOpen(false);
                    }}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <span className="text-lg mt-0.5">{blockType.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{blockType.label}</div>
                      <div className="text-xs text-muted-foreground">{blockType.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator />
            
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">MEDIA & ADVANCED</div>
              <div className="space-y-1">
                {blockTypes.slice(8).map((blockType) => (
                  <DropdownMenuItem
                    key={blockType.type}
                    onClick={() => {
                      onAddBlock(blockType.type);
                      setIsOpen(false);
                    }}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <span className="text-lg mt-0.5">{blockType.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{blockType.label}</div>
                      <div className="text-xs text-muted-foreground">{blockType.description}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Move Controls */}
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={cn(
              "h-6 w-8 p-0 text-xs hover:bg-accent",
              !canMoveUp && "opacity-30 cursor-not-allowed"
            )}
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className={cn(
              "h-6 w-8 p-0 text-xs hover:bg-accent",
              !canMoveDown && "opacity-30 cursor-not-allowed"
            )}
          >
            ↓
          </Button>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeleteBlock}
          className="h-6 w-8 p-0 text-xs hover:bg-destructive hover:text-destructive-foreground"
        >
          ×
        </Button>
      </div>
    </div>
  );
}