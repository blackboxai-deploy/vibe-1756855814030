'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Page } from '@/types/editor';
import { cn } from '@/lib/utils';

interface WorkspaceSidebarProps {
  className?: string;
}

export function WorkspaceSidebar({ className }: WorkspaceSidebarProps) {
  const { state, dispatch } = useWorkspace();
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  const createNewPage = () => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: 'Untitled',
      blocks: [
        {
          id: `block-${Date.now()}`,
          type: 'paragraph',
          content: { text: '' },
          position: 0,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'ADD_PAGE', payload: newPage });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage });
  };

  const selectPage = (page: Page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const togglePageExpansion = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const renderPageItem = (page: Page, level: number = 0) => {
    const isSelected = state.currentPage?.id === page.id;
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);

    return (
      <div key={page.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer hover:bg-accent group',
            isSelected && 'bg-accent',
            level > 0 && 'ml-4'
          )}
          onClick={() => selectPage(page)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePageExpansion(page.id);
              }}
              className="w-4 h-4 flex items-center justify-center hover:bg-accent-foreground/10 rounded"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm opacity-60">{page.icon || '📄'}</span>
            <span className="text-sm truncate flex-1">{page.title}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                // Add sub-page functionality here
              }}
            >
              +
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">
            {page.children?.map(childPage => renderPageItem(childPage, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (state.sidebarCollapsed) {
    return (
      <div className={cn('w-12 border-r bg-muted/10 flex flex-col items-center py-4', className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="w-8 h-8 p-0"
        >
          ☰
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('w-64 border-r bg-muted/10 flex flex-col', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{state.workspace?.name || 'Workspace'}</h2>
            <Badge variant="secondary" className="text-xs">
              {state.workspace?.pages.length || 0}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="w-6 h-6 p-0"
          >
            ←
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search pages..."
            className="w-full px-3 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <Separator />

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={createNewPage}
          className="w-full justify-start text-sm font-normal"
        >
          <span className="mr-2">+</span>
          New Page
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm font-normal"
        >
          <span className="mr-2">📋</span>
          Templates
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm font-normal"
        >
          <span className="mr-2">🗂️</span>
          All Pages
        </Button>
      </div>

      <Separator />

      {/* Pages List */}
      <div className="flex-1 p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Private
          </span>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {state.workspace?.pages.map(page => renderPageItem(page))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm font-normal"
        >
          <span className="mr-2">⚙️</span>
          Settings
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm font-normal"
        >
          <span className="mr-2">❓</span>
          Help & Support
        </Button>
      </div>
    </div>
  );
}