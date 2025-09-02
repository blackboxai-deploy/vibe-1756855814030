export interface AIConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export const defaultAIConfig: AIConfig = {
  model: 'openrouter/claude-sonnet-4',
  systemPrompt: `You are a helpful writing assistant integrated into a Notion-like productivity app. Help users create, improve, and organize their content.

Guidelines:
- Provide clear, well-structured content
- Match the user's tone and style
- Be concise but informative
- Format your response appropriately for the context
- When generating content blocks, use proper formatting

Capabilities:
- Writing assistance and content generation
- Summarization and organization
- Creative writing and brainstorming
- Technical documentation
- Meeting notes and planning`,
  temperature: 0.7,
  maxTokens: 1000,
};

export class AIService {
  private config: AIConfig;
  private readonly endpoint = 'https://oi-server.onrender.com/chat/completions';
  private readonly headers = {
    'customerId': 'cus_SyNYhVHpC4H5OJ',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx',
  };

  constructor(config: AIConfig = defaultAIConfig) {
    this.config = config;
  }

  updateConfig(updates: Partial<AIConfig>) {
    this.config = { ...this.config, ...updates };
  }

  async generateContent(prompt: string, context?: string): Promise<string> {
    try {
      const messages = [
        {
          role: 'system' as const,
          content: this.config.systemPrompt + (context ? `\n\nContext: ${context}` : ''),
        },
        {
          role: 'user' as const,
          content: prompt,
        },
      ];

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid AI API response format');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async improveText(text: string, instruction?: string): Promise<string> {
    const prompt = instruction 
      ? `Please improve this text according to the instruction: "${instruction}"\n\nText: ${text}`
      : `Please improve this text by making it clearer, more engaging, and better structured:\n\nText: ${text}`;
    
    return this.generateContent(prompt);
  }

  async summarizeText(text: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
    const lengthInstructions = {
      short: 'in 1-2 sentences',
      medium: 'in a paragraph',
      long: 'in 2-3 paragraphs with key points'
    };

    const prompt = `Please summarize this text ${lengthInstructions[length]}:\n\nText: ${text}`;
    return this.generateContent(prompt);
  }

  async continueWriting(existingText: string, direction?: string): Promise<string> {
    const prompt = direction
      ? `Continue writing this text in the direction of: ${direction}\n\nExisting text: ${existingText}`
      : `Continue writing this text naturally:\n\nExisting text: ${existingText}`;
    
    return this.generateContent(prompt);
  }

  async generateIdeas(topic: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} creative and useful ideas related to: ${topic}. Provide each idea as a separate line starting with a bullet point.`;
    
    const response = await this.generateContent(prompt);
    
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
      .map(line => line.replace(/^[•\-]\s*/, '').trim())
      .filter(idea => idea.length > 0)
      .slice(0, count);
  }

  async generateOutline(topic: string): Promise<string> {
    const prompt = `Create a detailed outline for: ${topic}. Use proper heading hierarchy and bullet points.`;
    return this.generateContent(prompt);
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const prompt = `Translate this text to ${targetLanguage}. Maintain the original tone and style:\n\nText: ${text}`;
    return this.generateContent(prompt);
  }

  async generateMeetingNotes(agenda: string[], participants?: string[]): Promise<string> {
    const participantList = participants ? `\nParticipants: ${participants.join(', ')}` : '';
    const agendaList = agenda.map((item, index) => `${index + 1}. ${item}`).join('\n');
    
    const prompt = `Create a meeting notes template with the following agenda:${participantList}

Agenda:
${agendaList}

Please create a structured template with sections for each agenda item, action items, and next steps.`;
    
    return this.generateContent(prompt);
  }

  getConfig(): AIConfig {
    return { ...this.config };
  }
}

export const aiService = new AIService();