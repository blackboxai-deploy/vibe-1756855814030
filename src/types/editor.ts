export type BlockType = 
  | 'paragraph'
  | 'heading-1'
  | 'heading-2' 
  | 'heading-3'
  | 'bulleted-list'
  | 'numbered-list'
  | 'to-do'
  | 'toggle'
  | 'quote'
  | 'divider'
  | 'image'
  | 'code'
  | 'table'
  | 'callout';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  position: number;
  metadata?: {
    level?: number;
    checked?: boolean;
    language?: string;
    style?: string;
  };
}

export interface Page {
  id: string;
  title: string;
  icon?: string;
  blocks: Block[];
  parentId?: string;
  children?: Page[];
  createdAt: Date;
  updatedAt: Date;
  archived?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  pages: Page[];
  templates: Template[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: Block[];
  preview?: string;
}

export interface AIConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}