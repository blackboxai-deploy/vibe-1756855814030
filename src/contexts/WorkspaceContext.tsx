'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Page, Workspace, Block } from '@/types/editor';

interface WorkspaceState {
  workspace: Workspace | null;
  currentPage: Page | null;
  sidebarCollapsed: boolean;
  isLoading: boolean;
}

type WorkspaceAction =
  | { type: 'SET_WORKSPACE'; payload: Workspace }
  | { type: 'SET_CURRENT_PAGE'; payload: Page }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'UPDATE_PAGE'; payload: { id: string; updates: Partial<Page> } }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_BLOCKS'; payload: { pageId: string; blocks: Block[] } };

const initialState: WorkspaceState = {
  workspace: null,
  currentPage: null,
  sidebarCollapsed: false,
  isLoading: false,
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_WORKSPACE':
      return { ...state, workspace: action.payload };
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'ADD_PAGE':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          pages: [...state.workspace.pages, action.payload],
        },
      };
    
    case 'UPDATE_PAGE':
      if (!state.workspace) return state;
      const updatedPages = state.workspace.pages.map(page =>
        page.id === action.payload.id
          ? { ...page, ...action.payload.updates }
          : page
      );
      return {
        ...state,
        workspace: {
          ...state.workspace,
          pages: updatedPages,
        },
        currentPage: state.currentPage?.id === action.payload.id
          ? { ...state.currentPage, ...action.payload.updates }
          : state.currentPage,
      };
    
    case 'DELETE_PAGE':
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          pages: state.workspace.pages.filter(page => page.id !== action.payload),
        },
        currentPage: state.currentPage?.id === action.payload ? null : state.currentPage,
      };
    
    case 'UPDATE_BLOCKS':
      if (!state.workspace) return state;
      const pagesWithUpdatedBlocks = state.workspace.pages.map(page =>
        page.id === action.payload.pageId
          ? { ...page, blocks: action.payload.blocks, updatedAt: new Date() }
          : page
      );
      return {
        ...state,
        workspace: {
          ...state.workspace,
          pages: pagesWithUpdatedBlocks,
        },
        currentPage: state.currentPage?.id === action.payload.pageId
          ? { ...state.currentPage, blocks: action.payload.blocks, updatedAt: new Date() }
          : state.currentPage,
      };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

const WorkspaceContext = createContext<{
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
} | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Load workspace from localStorage on mount
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('notion-workspace');
    if (savedWorkspace) {
      try {
        const workspace = JSON.parse(savedWorkspace);
        dispatch({ type: 'SET_WORKSPACE', payload: workspace });
      } catch (error) {
        console.error('Failed to load workspace:', error);
        // Initialize with default workspace
        initializeDefaultWorkspace();
      }
    } else {
      initializeDefaultWorkspace();
    }
  }, []);

  // Save workspace to localStorage whenever it changes
  useEffect(() => {
    if (state.workspace) {
      localStorage.setItem('notion-workspace', JSON.stringify(state.workspace));
    }
  }, [state.workspace]);

  const initializeDefaultWorkspace = () => {
    const defaultWorkspace: Workspace = {
      id: 'default',
      name: 'My Workspace',
      pages: [
        {
          id: 'welcome',
          title: 'Welcome to Your Workspace',
          blocks: [
            {
              id: 'block-1',
              type: 'heading-1',
              content: { text: 'Welcome to Your Workspace' },
              position: 0,
            },
            {
              id: 'block-2',
              type: 'paragraph',
              content: { text: 'Start creating amazing content with our Notion-like editor. Add pages, organize your thoughts, and boost your productivity.' },
              position: 1,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      templates: [],
    };
    dispatch({ type: 'SET_WORKSPACE', payload: defaultWorkspace });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: defaultWorkspace.pages[0] });
  };

  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}