'use client';

import { WorkspaceSidebar } from '@/components/Sidebar/WorkspaceSidebar';
import { BlockEditor } from '@/components/Editor/BlockEditor';
import { AIAssistant } from '@/components/AI/AIAssistant';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


export default function HomePage() {
  const { state } = useWorkspace();

  return (
    <>
      {/* Sidebar */}
      <WorkspaceSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              {state.currentPage && (
                <>
                  <span className="text-lg">{state.currentPage.icon || '📄'}</span>
                  <h1 className="text-lg font-semibold truncate">
                    {state.currentPage.title}
                  </h1>
                  <Badge variant="outline" className="text-xs">
                    {state.currentPage.blocks.length} blocks
                  </Badge>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <AIAssistant />
              <Button variant="ghost" size="sm">
                Share
              </Button>
              <Button variant="ghost" size="sm">
                ⋯
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          {state.currentPage ? (
            <BlockEditor page={state.currentPage} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-semibold">Welcome to your workspace</h2>
        <p className="text-muted-foreground">
          Select a page from the sidebar to start editing, or create a new page to begin writing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button>
            Create New Page
          </Button>
          <Button variant="outline">
            Browse Templates
          </Button>
        </div>
      </div>
    </div>
  );
}