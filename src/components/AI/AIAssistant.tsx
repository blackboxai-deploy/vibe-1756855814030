'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AIAssistantProps {
  onInsertContent?: (content: string) => void;
  selectedText?: string;
  className?: string;
}

type AIAction = 
  | 'generate'
  | 'improve'
  | 'summarize'
  | 'continue'
  | 'ideas'
  | 'outline'
  | 'translate'
  | 'meeting-notes';

const aiActions = [
  { 
    value: 'generate' as AIAction, 
    label: 'Generate Content', 
    description: 'Create new content from a prompt',
    icon: '✨'
  },
  { 
    value: 'improve' as AIAction, 
    label: 'Improve Text', 
    description: 'Enhance existing text',
    icon: '📝'
  },
  { 
    value: 'summarize' as AIAction, 
    label: 'Summarize', 
    description: 'Create a summary of text',
    icon: '📄'
  },
  { 
    value: 'continue' as AIAction, 
    label: 'Continue Writing', 
    description: 'Extend existing content',
    icon: '➡️'
  },
  { 
    value: 'ideas' as AIAction, 
    label: 'Generate Ideas', 
    description: 'Brainstorm ideas for a topic',
    icon: '💡'
  },
  { 
    value: 'outline' as AIAction, 
    label: 'Create Outline', 
    description: 'Generate a structured outline',
    icon: '📋'
  },
  { 
    value: 'translate' as AIAction, 
    label: 'Translate', 
    description: 'Translate text to another language',
    icon: '🌍'
  },
  { 
    value: 'meeting-notes' as AIAction, 
    label: 'Meeting Notes', 
    description: 'Create meeting notes template',
    icon: '📝'
  },
];

const languages = [
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Arabic', label: 'Arabic' },
];

export function AIAssistant({ onInsertContent, selectedText, className }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AIAction>('generate');
  const [prompt, setPrompt] = useState('');
  const [inputText, setInputText] = useState(selectedText || '');
  const [instruction, setInstruction] = useState('');
  const [language, setLanguage] = useState('Spanish');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [ideaCount, setIdeaCount] = useState(5);
  const [agenda, setAgenda] = useState('');
  const [participants, setParticipants] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | string[] | null>(null);

  const handleGenerate = async () => {
    if (!prompt && !inputText) {
      toast.error('Please provide input text or a prompt');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const body: any = {
        action: selectedAction,
        text: selectedAction === 'generate' ? prompt : inputText,
      };

      // Add action-specific parameters
      switch (selectedAction) {
        case 'improve':
          if (instruction) body.instruction = instruction;
          break;
        case 'summarize':
          body.options = { length: summaryLength };
          break;
        case 'continue':
          if (instruction) body.instruction = instruction;
          break;
        case 'ideas':
          body.text = prompt;
          body.options = { count: ideaCount };
          break;
        case 'outline':
          body.text = prompt;
          break;
        case 'translate':
          body.options = { language };
          break;
        case 'meeting-notes':
          body.options = {
            agenda: agenda.split('\n').filter(item => item.trim()),
            participants: participants.split(',').map(p => p.trim()).filter(p => p),
          };
          break;
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data.result);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (result && onInsertContent) {
      const content = Array.isArray(result) ? result.join('\n• ') : result;
      onInsertContent(content);
      setIsOpen(false);
      setResult(null);
      toast.success('Content inserted!');
    }
  };

  const renderActionInputs = () => {
    switch (selectedAction) {
      case 'generate':
      case 'ideas':
      case 'outline':
        return (
          <Textarea
            placeholder="Enter your prompt or topic..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        );

      case 'improve':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter text to improve..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            <Input
              placeholder="Specific instructions (optional)"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>
        );

      case 'summarize':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter text to summarize..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            <Select value={summaryLength} onValueChange={(value: any) => setSummaryLength(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Summary length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                <SelectItem value="medium">Medium (paragraph)</SelectItem>
                <SelectItem value="long">Long (2-3 paragraphs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'continue':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter existing text to continue..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            <Input
              placeholder="Direction for continuation (optional)"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>
        );

      case 'translate':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Target language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'meeting-notes':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter agenda items (one per line)..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={4}
            />
            <Input
              placeholder="Participants (comma-separated, optional)"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const selectedActionInfo = aiActions.find(action => action.value === selectedAction);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <span className="mr-2">✨</span>
          AI Assistant
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            AI Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Action Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Choose Action</label>
                <div className="grid grid-cols-2 gap-2">
                  {aiActions.map((action) => (
                    <button
                      key={action.value}
                      onClick={() => setSelectedAction(action.value)}
                      className={`p-3 text-left border rounded-md transition-colors ${
                        selectedAction === action.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{action.icon}</span>
                        <span className="font-medium text-sm">{action.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Action Info */}
              {selectedActionInfo && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{selectedActionInfo.icon}</span>
                    <span className="font-medium">{selectedActionInfo.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedActionInfo.description}</p>
                </div>
              )}

              {/* Action Inputs */}
              <div>
                <label className="text-sm font-medium mb-2 block">Input</label>
                {renderActionInputs()}
              </div>

              {/* Special options for ideas */}
              {selectedAction === 'ideas' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Number of Ideas</label>
                  <Select value={ideaCount.toString()} onValueChange={(value) => setIdeaCount(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 ideas</SelectItem>
                      <SelectItem value="5">5 ideas</SelectItem>
                      <SelectItem value="7">7 ideas</SelectItem>
                      <SelectItem value="10">10 ideas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Generating...' : `Generate ${selectedActionInfo?.label}`}
              </Button>

              {/* Results */}
              {result && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Generated Content</label>
                    <Badge variant="secondary">
                      {Array.isArray(result) ? `${result.length} items` : 'Text'}
                    </Badge>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-muted/20">
                    {Array.isArray(result) ? (
                      <ul className="space-y-2">
                        {result.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-1">•</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm whitespace-pre-wrap">{result}</div>
                    )}
                  </div>

                  {onInsertContent && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex gap-2">
                        <Button onClick={handleInsert} className="flex-1">
                          Insert Content
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              Array.isArray(result) ? result.join('\n• ') : result
                            );
                            toast.success('Copied to clipboard!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}