import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { ComposioMemoryService } from '@/lib/composio-memory';
import * as Sentry from '@sentry/nextjs';

const memoryService = new ComposioMemoryService();

const SYSTEM_PROMPT = `You are an ADHD Memory Agent. You help people with ADHD remember things.

Be supportive and understanding. When someone tells you to remember something, say "Got it! I'll remember that for you 💙"

When they ask you to recall something, try to help them find what they're looking for.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userId = 'default_user';
    
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.content.toLowerCase();
    
    // Simple memory storage trigger
    if (userText.includes('remember') || userText.includes('save')) {
      await memoryService.storeMemory(userId, lastMessage.content);
    }
    
    // Simple memory search
    let context = '';
    if (userText.includes('where') || userText.includes('what') || userText.includes('find')) {
      const memories = await memoryService.searchMemories(userId, userText);
      if (memories.length > 0) {
        context = `\n\nI found these memories that might help:\n${memories.map(m => `- ${m.content}`).join('\n')}`;
      }
    }
    
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(0, -1),
        { role: 'user', content: lastMessage.content + context },
      ],
      temperature: 0.7,
      maxTokens: 300,
    });
    
    return result.toResponse();
  } catch (error) {
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ error: 'Chat failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}