'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Page, Block, BlockType } from '@/types/editor';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BlockRenderer } from './BlockRenderer';
import { BlockToolbar } from './BlockToolbar';
import { cn } from '@/lib/utils';

interface BlockEditorProps {
  page: Page;
  className?: string;
}

export function BlockEditor({ page, className }: BlockEditorProps) {
  const { dispatch } = useWorkspace();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const updateBlocks = (newBlocks: Block[]) => {
    dispatch({
      type: 'UPDATE_BLOCKS',
      payload: { pageId: page.id, blocks: newBlocks }
    });
  };

  const addBlock = (type: BlockType, afterBlockId?: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: getDefaultContent(type),
      position: afterBlockId 
        ? (page.blocks.find(b => b.id === afterBlockId)?.position ?? -1) + 1 || page.blocks.length
        : page.blocks.length,
      metadata: getDefaultMetadata(type),
    };

    const newBlocks = [...page.blocks];
    
    if (afterBlockId) {
      const insertIndex = newBlocks.findIndex(b => b.id === afterBlockId) + 1;
      newBlocks.splice(insertIndex, 0, newBlock);
      
      // Reorder positions
      newBlocks.forEach((block, index) => {
        block.position = index;
      });
    } else {
      newBlocks.push(newBlock);
    }

    updateBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    setIsEditing(true);
    
    // Focus the new block after render
    setTimeout(() => focusBlock(newBlock.id), 50);
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    const newBlocks = page.blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    updateBlocks(newBlocks);
  };

  const deleteBlock = (blockId: string) => {
    if (page.blocks.length <= 1) return; // Keep at least one block
    
    const newBlocks = page.blocks
      .filter(block => block.id !== blockId)
      .map((block, index) => ({ ...block, position: index }));
    
    updateBlocks(newBlocks);
    
    // Select previous block or first block
    const deletedBlockIndex = page.blocks.findIndex(b => b.id === blockId);
    const nextSelectedBlock = page.blocks[deletedBlockIndex - 1] || page.blocks[deletedBlockIndex + 1];
    if (nextSelectedBlock && nextSelectedBlock.id !== blockId) {
      setSelectedBlockId(nextSelectedBlock.id);
    }
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = page.blocks.findIndex(b => b.id === blockId);
    if (
      (direction === 'up' && blockIndex === 0) ||
      (direction === 'down' && blockIndex === page.blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...page.blocks];
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    
    [newBlocks[blockIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[blockIndex]];
    
    // Update positions
    newBlocks.forEach((block, index) => {
      block.position = index;
    });

    updateBlocks(newBlocks);
  };

  const focusBlock = (blockId: string) => {
    const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);
    if (blockElement) {
      const input = blockElement.querySelector('input, textarea, [contenteditable]') as HTMLElement;
      if (input) {
        input.focus();
        // Move cursor to end for contenteditable
        if (input.contentEditable === 'true') {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(input);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const block = page.blocks.find(b => b.id === blockId);
      if (block && block.type !== 'code') {
        addBlock('paragraph', blockId);
      }
    } else if (e.key === 'Backspace') {
      const block = page.blocks.find(b => b.id === blockId);
      if (block && (!block.content?.text || block.content.text === '')) {
        e.preventDefault();
        deleteBlock(blockId);
      }
    } else if (e.key === 'ArrowUp' && e.metaKey) {
      e.preventDefault();
      moveBlock(blockId, 'up');
    } else if (e.key === 'ArrowDown' && e.metaKey) {
      e.preventDefault();
      moveBlock(blockId, 'down');
    }
  };

  // Focus first block on mount if no blocks have content
  useEffect(() => {
    if (page.blocks.length > 0 && !selectedBlockId) {
      const firstEmptyBlock = page.blocks.find(block => 
        !block.content?.text || block.content.text === ''
      );
      if (firstEmptyBlock) {
        setSelectedBlockId(firstEmptyBlock.id);
        setTimeout(() => focusBlock(firstEmptyBlock.id), 100);
      }
    }
  }, [page.id, selectedBlockId]);

  return (
    <div 
      ref={editorRef}
      className={cn('flex-1 relative', className)}
      onClick={() => {
        // Click on empty space creates new block
        if (editorRef.current && !editorRef.current.contains(document.activeElement)) {
          addBlock('paragraph');
        }
      }}
    >
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto py-8 px-6 space-y-2">
          {/* Page Title */}
          <div className="mb-8">
            <input
              type="text"
              value={page.title}
              onChange={(e) => {
                dispatch({
                  type: 'UPDATE_PAGE',
                  payload: {
                    id: page.id,
                    updates: { title: e.target.value, updatedAt: new Date() }
                  }
                });
              }}
              placeholder="Untitled"
              className="text-4xl font-bold w-full bg-transparent border-none outline-none placeholder-muted-foreground/50 resize-none"
              style={{ lineHeight: '1.2' }}
            />
          </div>

          {/* Blocks */}
          <div className="space-y-1">
            {page.blocks
              .sort((a, b) => a.position - b.position)
              .map((block, index) => (
                <div
                  key={block.id}
                  data-block-id={block.id}
                  className={cn(
                    'group relative rounded-sm',
                    selectedBlockId === block.id && 'ring-1 ring-blue-200'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(block.id);
                  }}
                >
                  <BlockRenderer
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    isEditing={isEditing && selectedBlockId === block.id}
                    onUpdate={(updates) => updateBlock(block.id, updates)}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    onFocus={() => {
                      setSelectedBlockId(block.id);
                      setIsEditing(true);
                    }}
                    onBlur={() => setIsEditing(false)}
                  />

                  {/* Block Controls */}
                  {selectedBlockId === block.id && (
                    <BlockToolbar
                      block={block}
                      onAddBlock={(type) => addBlock(type, block.id)}
                      onDeleteBlock={() => deleteBlock(block.id)}
                      onMoveUp={() => moveBlock(block.id, 'up')}
                      onMoveDown={() => moveBlock(block.id, 'down')}
                      canMoveUp={index > 0}
                      canMoveDown={index < page.blocks.length - 1}
                    />
                  )}
                </div>
              ))}
          </div>

          {/* Add Block Button */}
          {page.blocks.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <Button
                variant="outline"
                onClick={() => addBlock('paragraph')}
                className="text-muted-foreground"
              >
                <span className="mr-2">+</span>
                Click to add content
              </Button>
            </div>
          )}

          {/* Bottom Spacing */}
          <div className="h-64" />
        </div>
      </ScrollArea>
    </div>
  );
}

function getDefaultContent(type: BlockType): any {
  switch (type) {
    case 'paragraph':
    case 'heading-1':
    case 'heading-2':
    case 'heading-3':
    case 'quote':
      return { text: '' };
    case 'to-do':
      return { text: '', checked: false };
    case 'code':
      return { text: '', language: 'javascript' };
    case 'bulleted-list':
    case 'numbered-list':
      return { text: '' };
    case 'divider':
      return {};
    case 'image':
      return { url: '', alt: '', caption: '' };
    case 'callout':
      return { text: '', emoji: '💡', color: 'blue' };
    default:
      return { text: '' };
  }
}

function getDefaultMetadata(type: BlockType): any {
  switch (type) {
    case 'heading-1':
      return { level: 1 };
    case 'heading-2':
      return { level: 2 };
    case 'heading-3':
      return { level: 3 };
    case 'to-do':
      return { checked: false };
    case 'code':
      return { language: 'javascript' };
    case 'callout':
      return { color: 'blue' };
    default:
      return {};
  }
}