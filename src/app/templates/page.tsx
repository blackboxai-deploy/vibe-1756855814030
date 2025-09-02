'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Page, Block } from '@/types/editor';
import { WorkspaceSidebar } from '@/components/Sidebar/WorkspaceSidebar';
import { toast } from 'sonner';

const templates = [
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Structure your meeting notes with agenda, attendees, and action items',
    category: 'Productivity',
    preview: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5ee64465-9a5f-41aa-bd7a-20ba7974041b.png',
    blocks: [
      {
        id: 'title',
        type: 'heading-1' as const,
        content: { text: 'Meeting Notes - [Date]' },
        position: 0,
      },
      {
        id: 'attendees',
        type: 'heading-3' as const,
        content: { text: 'Attendees' },
        position: 1,
      },
      {
        id: 'attendees-list',
        type: 'bulleted-list' as const,
        content: { text: 'Add attendee names here' },
        position: 2,
      },
      {
        id: 'agenda',
        type: 'heading-3' as const,
        content: { text: 'Agenda' },
        position: 3,
      },
      {
        id: 'agenda-item-1',
        type: 'numbered-list' as const,
        content: { text: 'Agenda item 1' },
        position: 4,
      },
      {
        id: 'action-items',
        type: 'heading-3' as const,
        content: { text: 'Action Items' },
        position: 5,
      },
      {
        id: 'action-1',
        type: 'to-do' as const,
        content: { text: 'Action item 1', checked: false },
        position: 6,
      },
    ],
  },
  {
    id: 'project-plan',
    name: 'Project Planning',
    description: 'Comprehensive project planning template with timeline and milestones',
    category: 'Project Management',
    preview: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d80fcf45-7648-4930-8973-a3d8f47a5d81.png',
    blocks: [
      {
        id: 'title',
        type: 'heading-1' as const,
        content: { text: 'Project Plan: [Project Name]' },
        position: 0,
      },
      {
        id: 'overview',
        type: 'heading-2' as const,
        content: { text: 'Project Overview' },
        position: 1,
      },
      {
        id: 'overview-text',
        type: 'paragraph' as const,
        content: { text: 'Brief description of the project goals and objectives...' },
        position: 2,
      },
      {
        id: 'timeline',
        type: 'heading-2' as const,
        content: { text: 'Timeline & Milestones' },
        position: 3,
      },
      {
        id: 'milestone-1',
        type: 'to-do' as const,
        content: { text: 'Milestone 1: Project kickoff - [Date]', checked: false },
        position: 4,
      },
      {
        id: 'deliverables',
        type: 'heading-2' as const,
        content: { text: 'Key Deliverables' },
        position: 5,
      },
      {
        id: 'deliverable-1',
        type: 'bulleted-list' as const,
        content: { text: 'Deliverable 1' },
        position: 6,
      },
    ],
  },
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    description: 'Reflect on your day with prompts for gratitude, achievements, and goals',
    category: 'Personal',
    preview: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/787f206f-4b3a-42ee-b5b8-d98570d7a322.png',
    blocks: [
      {
        id: 'title',
        type: 'heading-1' as const,
        content: { text: 'Daily Journal - [Date]' },
        position: 0,
      },
      {
        id: 'mood-callout',
        type: 'callout' as const,
        content: { text: 'How are you feeling today?', emoji: '😊', color: 'blue' },
        position: 1,
      },
      {
        id: 'gratitude',
        type: 'heading-3' as const,
        content: { text: '🙏 What I\'m grateful for' },
        position: 2,
      },
      {
        id: 'gratitude-1',
        type: 'bulleted-list' as const,
        content: { text: 'Something you\'re grateful for...' },
        position: 3,
      },
      {
        id: 'achievements',
        type: 'heading-3' as const,
        content: { text: '🎉 Today\'s achievements' },
        position: 4,
      },
      {
        id: 'achievement-1',
        type: 'bulleted-list' as const,
        content: { text: 'What did you accomplish today?' },
        position: 5,
      },
      {
        id: 'tomorrow',
        type: 'heading-3' as const,
        content: { text: '🎯 Tomorrow\'s goals' },
        position: 6,
      },
      {
        id: 'goal-1',
        type: 'to-do' as const,
        content: { text: 'Goal for tomorrow...', checked: false },
        position: 7,
      },
    ],
  },
  {
    id: 'book-notes',
    name: 'Book Notes',
    description: 'Capture key insights and quotes from your reading',
    category: 'Learning',
    preview: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0ec715ab-e23d-4b58-b9d5-55c1b1b50d3a.png',
    blocks: [
      {
        id: 'title',
        type: 'heading-1' as const,
        content: { text: 'Book Notes: [Book Title]' },
        position: 0,
      },
      {
        id: 'details',
        type: 'paragraph' as const,
        content: { text: 'Author: [Author Name] | Pages: [Number] | Genre: [Genre]' },
        position: 1,
      },
      {
        id: 'divider-1',
        type: 'divider' as const,
        content: {},
        position: 2,
      },
      {
        id: 'key-insights',
        type: 'heading-2' as const,
        content: { text: '💡 Key Insights' },
        position: 3,
      },
      {
        id: 'insight-1',
        type: 'bulleted-list' as const,
        content: { text: 'Main insight or takeaway...' },
        position: 4,
      },
      {
        id: 'quotes',
        type: 'heading-2' as const,
        content: { text: '📖 Memorable Quotes' },
        position: 5,
      },
      {
        id: 'quote-1',
        type: 'quote' as const,
        content: { text: 'Add a meaningful quote here...' },
        position: 6,
      },
      {
        id: 'rating',
        type: 'callout' as const,
        content: { text: 'Rating: ★★★★☆ | Would recommend: Yes/No', emoji: '⭐', color: 'yellow' },
        position: 7,
      },
    ],
  },
  {
    id: 'recipe',
    name: 'Recipe',
    description: 'Organize your favorite recipes with ingredients and instructions',
    category: 'Lifestyle',
    preview: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/92ace3d6-5562-4544-9d9b-dfa15dc34e4f.png',
    blocks: [
      {
        id: 'title',
        type: 'heading-1' as const,
        content: { text: '[Recipe Name]' },
        position: 0,
      },
      {
        id: 'image-placeholder',
        type: 'image' as const,
        content: { 
          url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/09f34b7f-4fe9-438e-9837-33be5e27d0ba.png',
          alt: 'Recipe photo',
          caption: 'Add a photo of your finished dish'
        },
        position: 1,
      },
      {
        id: 'info',
        type: 'callout' as const,
        content: { text: 'Prep time: [X] min | Cook time: [X] min | Serves: [X]', emoji: '⏰', color: 'green' },
        position: 2,
      },
      {
        id: 'ingredients',
        type: 'heading-2' as const,
        content: { text: '🛒 Ingredients' },
        position: 3,
      },
      {
        id: 'ingredient-1',
        type: 'bulleted-list' as const,
        content: { text: '1 cup of [ingredient]' },
        position: 4,
      },
      {
        id: 'instructions',
        type: 'heading-2' as const,
        content: { text: '👨‍🍳 Instructions' },
        position: 5,
      },
      {
        id: 'step-1',
        type: 'numbered-list' as const,
        content: { text: 'First step of preparation...' },
        position: 6,
      },
      {
        id: 'notes',
        type: 'heading-3' as const,
        content: { text: '📝 Notes' },
        position: 7,
      },
      {
        id: 'notes-text',
        type: 'paragraph' as const,
        content: { text: 'Any additional tips or variations...' },
        position: 8,
      },
    ],
  },
  {
    id: 'coding-notes',
    name: 'Coding Notes',
    description: 'Document your coding solutions and learnings',
    category: 'Development',
    preview: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6da1f1ac-2f4d-429a-99e0-900dce99826f.png',
    blocks: [
      {
        id: 'title',
        type: 'heading-1' as const,
        content: { text: 'Coding Notes: [Topic/Problem]' },
        position: 0,
      },
      {
        id: 'problem',
        type: 'heading-2' as const,
        content: { text: '🎯 Problem Description' },
        position: 1,
      },
      {
        id: 'problem-text',
        type: 'paragraph' as const,
        content: { text: 'Describe the problem or concept you\'re working on...' },
        position: 2,
      },
      {
        id: 'solution',
        type: 'heading-2' as const,
        content: { text: '💡 Solution' },
        position: 3,
      },
      {
        id: 'code-block',
        type: 'code' as const,
        content: { text: '// Your code solution here\nfunction example() {\n  return "Hello, World!";\n}', language: 'javascript' },
        position: 4,
      },
      {
        id: 'explanation',
        type: 'heading-3' as const,
        content: { text: 'Explanation' },
        position: 5,
      },
      {
        id: 'explanation-text',
        type: 'paragraph' as const,
        content: { text: 'Explain how your solution works...' },
        position: 6,
      },
      {
        id: 'resources',
        type: 'heading-3' as const,
        content: { text: '📚 Resources' },
        position: 7,
      },
      {
        id: 'resource-1',
        type: 'bulleted-list' as const,
        content: { text: 'Link to helpful documentation or tutorial' },
        position: 8,
      },
    ],
  },
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { dispatch } = useWorkspace();

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (template: typeof templates[0]) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: template.name,
      blocks: template.blocks.map((block, index) => ({
        ...block,
        id: `block-${Date.now()}-${index}`,
      })) as Block[],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'ADD_PAGE', payload: newPage });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage });
    toast.success(`Created new page from ${template.name} template`);
  };

  return (
    <>
      <WorkspaceSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold mb-2">Templates</h1>
            <p className="text-muted-foreground">Get started quickly with pre-built templates</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fa2efea8-7856-4ecc-8f3c-387bc080407c.png}`;
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="mb-4">
                    {template.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {template.blocks.length} blocks
                    </span>
                    
                    <Button 
                      size="sm" 
                      onClick={() => useTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}