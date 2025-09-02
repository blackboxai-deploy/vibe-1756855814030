'use client';

import React from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function BlockRenderer({
  block,
  onUpdate,
  onKeyDown,
  onFocus,
  onBlur,
}: BlockRendererProps) {
  const updateContent = (content: any) => {
    onUpdate({ content: { ...block.content, ...content } });
  };

  const commonProps = {
    onKeyDown,
    onFocus,
    onBlur,
    className: 'w-full bg-transparent border-none outline-none resize-none',
    placeholder: getPlaceholder(block.type),
  };

  const renderEditableText = (
    value: string,
    onChange: (value: string) => void,
    multiline: boolean = false,
    className: string = ''
  ) => {
    if (multiline) {
      return (
        <textarea
          {...commonProps}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(commonProps.className, className)}
          rows={1}
          style={{
            minHeight: '1.5rem',
            resize: 'none',
            height: 'auto',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
      );
    }

    return (
      <input
        {...commonProps}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(commonProps.className, className)}
      />
    );
  };

  switch (block.type) {
    case 'paragraph':
      return (
        <div className="py-1">
          {renderEditableText(
            block.content?.text || '',
            (text) => updateContent({ text }),
            true,
            'text-base leading-relaxed'
          )}
        </div>
      );

    case 'heading-1':
      return (
        <div className="py-2">
          {renderEditableText(
            block.content?.text || '',
            (text) => updateContent({ text }),
            false,
            'text-3xl font-bold leading-tight'
          )}
        </div>
      );

    case 'heading-2':
      return (
        <div className="py-2">
          {renderEditableText(
            block.content?.text || '',
            (text) => updateContent({ text }),
            false,
            'text-2xl font-semibold leading-snug'
          )}
        </div>
      );

    case 'heading-3':
      return (
        <div className="py-1">
          {renderEditableText(
            block.content?.text || '',
            (text) => updateContent({ text }),
            false,
            'text-xl font-medium leading-snug'
          )}
        </div>
      );

    case 'bulleted-list':
      return (
        <div className="py-1 flex items-start gap-3">
          <span className="text-muted-foreground mt-1.5 text-sm">•</span>
          <div className="flex-1">
            {renderEditableText(
              block.content?.text || '',
              (text) => updateContent({ text }),
              true,
              'text-base leading-relaxed'
            )}
          </div>
        </div>
      );

    case 'numbered-list':
      return (
        <div className="py-1 flex items-start gap-3">
          <span className="text-muted-foreground mt-1.5 text-sm min-w-[1rem]">
            {block.position + 1}.
          </span>
          <div className="flex-1">
            {renderEditableText(
              block.content?.text || '',
              (text) => updateContent({ text }),
              true,
              'text-base leading-relaxed'
            )}
          </div>
        </div>
      );

    case 'to-do':
      return (
        <div className="py-1 flex items-start gap-3">
          <Checkbox
            checked={block.content?.checked || false}
            onCheckedChange={(checked) => updateContent({ checked })}
            className="mt-1.5"
          />
          <div className="flex-1">
            {renderEditableText(
              block.content?.text || '',
              (text) => updateContent({ text }),
              true,
              cn(
                'text-base leading-relaxed',
                block.content?.checked && 'line-through text-muted-foreground'
              )
            )}
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className="py-2 border-l-4 border-muted pl-4">
          {renderEditableText(
            block.content?.text || '',
            (text) => updateContent({ text }),
            true,
            'text-base leading-relaxed italic text-muted-foreground'
          )}
        </div>
      );

    case 'code':
      return (
        <div className="py-2">
          <div className="bg-muted rounded-md p-4 font-mono">
            <textarea
              {...commonProps}
              value={block.content?.text || ''}
              onChange={(e) => updateContent({ text: e.target.value })}
              placeholder="Enter your code..."
              className={cn(
                commonProps.className,
                'font-mono text-sm bg-transparent min-h-[3rem]'
              )}
              spellCheck={false}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <select
              value={block.content?.language || 'javascript'}
              onChange={(e) => updateContent({ language: e.target.value })}
              className="text-xs bg-background border rounded px-2 py-1"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
              <option value="bash">Bash</option>
            </select>
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="py-4">
          <Separator />
        </div>
      );

    case 'image':
      return (
        <div className="py-4">
          <div className="space-y-3">
            {block.content?.url ? (
              <div className="rounded-md overflow-hidden border">
                <img
                  src={block.content.url}
                  alt={block.content.alt || ''}
                  className="w-full h-auto max-h-96 object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4e54604d-6a86-4dfd-86c2-1fa60e3e3e2e.png';
                  }}
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-muted-foreground text-sm">
                  Add an image URL or upload a file
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <input
                type="url"
                value={block.content?.url || ''}
                onChange={(e) => updateContent({ url: e.target.value })}
                placeholder="Paste image URL..."
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                value={block.content?.caption || ''}
                onChange={(e) => updateContent({ caption: e.target.value })}
                placeholder="Add a caption..."
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      );

    case 'callout':
      const calloutColors = {
        blue: 'bg-blue-50 border-blue-200 text-blue-900',
        green: 'bg-green-50 border-green-200 text-green-900',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        red: 'bg-red-50 border-red-200 text-red-900',
        purple: 'bg-purple-50 border-purple-200 text-purple-900',
        gray: 'bg-gray-50 border-gray-200 text-gray-900',
      };

      const currentColor = block.content?.color || 'blue';

      return (
        <div className="py-2">
          <div className={cn(
            'border-l-4 rounded-md p-4',
            calloutColors[currentColor as keyof typeof calloutColors]
          )}>
            <div className="flex items-start gap-3">
              <input
                type="text"
                value={block.content?.emoji || '💡'}
                onChange={(e) => updateContent({ emoji: e.target.value })}
                className="w-8 text-center bg-transparent border-none outline-none"
                maxLength={2}
              />
              <div className="flex-1">
                {renderEditableText(
                  block.content?.text || '',
                  (text) => updateContent({ text }),
                  true,
                  'bg-transparent'
                )}
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <select
                value={currentColor}
                onChange={(e) => updateContent({ color: e.target.value })}
                className="text-xs bg-background/50 border rounded px-2 py-1"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="gray">Gray</option>
              </select>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-1">
          {renderEditableText(
            block.content?.text || '',
            (text) => updateContent({ text }),
            true,
            'text-base leading-relaxed'
          )}
        </div>
      );
  }
}

function getPlaceholder(type: string): string {
  switch (type) {
    case 'paragraph':
      return "Type '/' for commands...";
    case 'heading-1':
      return 'Heading 1';
    case 'heading-2':
      return 'Heading 2';
    case 'heading-3':
      return 'Heading 3';
    case 'bulleted-list':
      return 'List item';
    case 'numbered-list':
      return 'List item';
    case 'to-do':
      return 'To-do item';
    case 'quote':
      return 'Quote';
    case 'code':
      return 'Enter your code...';
    case 'callout':
      return 'Add your callout text...';
    default:
      return 'Type something...';
  }
}