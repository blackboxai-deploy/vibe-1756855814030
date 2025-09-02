import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, instruction, context, options } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result: string | string[];

    switch (action) {
      case 'generate':
        if (!text) {
          return NextResponse.json(
            { error: 'Text prompt is required for generation' },
            { status: 400 }
          );
        }
        result = await aiService.generateContent(text, context);
        break;

      case 'improve':
        if (!text) {
          return NextResponse.json(
            { error: 'Text is required for improvement' },
            { status: 400 }
          );
        }
        result = await aiService.improveText(text, instruction);
        break;

      case 'summarize':
        if (!text) {
          return NextResponse.json(
            { error: 'Text is required for summarization' },
            { status: 400 }
          );
        }
        result = await aiService.summarizeText(
          text,
          options?.length || 'medium'
        );
        break;

      case 'continue':
        if (!text) {
          return NextResponse.json(
            { error: 'Text is required for continuation' },
            { status: 400 }
          );
        }
        result = await aiService.continueWriting(text, instruction);
        break;

      case 'ideas':
        if (!text) {
          return NextResponse.json(
            { error: 'Topic is required for idea generation' },
            { status: 400 }
          );
        }
        result = await aiService.generateIdeas(
          text,
          options?.count || 5
        );
        break;

      case 'outline':
        if (!text) {
          return NextResponse.json(
            { error: 'Topic is required for outline generation' },
            { status: 400 }
          );
        }
        result = await aiService.generateOutline(text);
        break;

      case 'translate':
        if (!text || !options?.language) {
          return NextResponse.json(
            { error: 'Text and target language are required for translation' },
            { status: 400 }
          );
        }
        result = await aiService.translateText(text, options.language);
        break;

      case 'meeting-notes':
        if (!options?.agenda) {
          return NextResponse.json(
            { error: 'Agenda is required for meeting notes generation' },
            { status: 400 }
          );
        }
        result = await aiService.generateMeetingNotes(
          options.agenda,
          options.participants
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      action,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI API Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process AI request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Generation API',
    endpoints: {
      POST: '/api/ai/generate',
    },
    actions: [
      'generate',
      'improve',
      'summarize',
      'continue',
      'ideas',
      'outline',
      'translate',
      'meeting-notes',
    ],
    config: aiService.getConfig(),
  });
}