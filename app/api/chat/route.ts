import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
// import composio from '@/lib/composio'; // composio instance is now in ComposioMemoryService
import { ComposioMemoryService } from '@/lib/composio-memory';
import * as Sentry from '@sentry/nextjs';

const memoryService = new ComposioMemoryService();

// ADHD-friendly system prompt
const SYSTEM_PROMPT = `You are an ADHD Memory Agent - a supportive, non-judgmental AI companion designed specifically to help people with ADHD manage their memories and daily life.

Your personality:
- Warm, friendly, and understanding
- Never judgmental or critical
- Patient with context switching and scattered thoughts
- Encouraging and supportive
- Uses simple, clear language

Key behaviors:
1. When someone tells you something to remember, acknowledge it warmly and confirm you've saved it
2. When asked to recall information, provide it clearly without making them feel bad for forgetting
3. Handle context switches gracefully - if someone suddenly changes topics, go with the flow
4. Use emojis sparingly but warmly (🧠 💙 ✨)
5. Keep responses concise but friendly

IMPORTANT: You help with ADHD-specific challenges like:
- Object permanence (where things are)
- Task memory (what they were doing)
- Time blindness (when things happened)
- Medication reminders
- Context switching support

Remember: You're here to reduce cognitive load, not add to it. Be their external memory with a smile.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userId = 'default_user'; // In production, get from auth
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.content.toLowerCase();
    
    // Determine intent
    const isMemoryStorage = ['remember', 'store', 'save', 'keep', 'don\'t forget'].some(word => userContent.includes(word));
    const isMemoryRetrieval = ['where', 'find', 'what', 'when', 'show', 'did i'].some(word => userContent.includes(word));
    
    // Handle memory operations
    if (isMemoryStorage) {
      // Extract what to remember (remove trigger words)
      let contentToStore = lastMessage.content;
      ['remember', 'store', 'save', 'keep', "don't forget"].forEach(word => {
        // More robust replacement to handle different phrasing
        contentToStore = contentToStore.replace(new RegExp(`\\b${word}\\b(\\s+(me\\s+to|that))?\\s*`, 'gi'), '');
      });
      
      // Store the memory using ComposioMemoryService
      await memoryService.storeMemory(userId, contentToStore.trim(), { context: 'chat' });
    }
    
    // For retrieval, search memories
    let relevantMemories: any[] = [];
    if (isMemoryRetrieval) {
      // The search query can be the user's content directly, or a processed version
      // depending on how Composio's search is implemented.
      // For now, we'll use the user's raw content for search.
      relevantMemories = await memoryService.searchMemories(userId, userContent, 5);
    }
    
    // Create context with memories
    const contextMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.slice(0, -1), // All messages except the last one
      {
        role: 'user' as const,
        content: relevantMemories.length > 0
          ? `${lastMessage.content}\n\n[Relevant memories found:\n${relevantMemories.map(m => `- ${m.content} (saved ${new Date(m.timestamp).toLocaleDateString()})`).join('\n')}]`
          : lastMessage.content,
      },
    ];
    
    // Stream response
    const result = streamText({
      model: openai('gpt-4-turbo'),
      messages: contextMessages,
      temperature: 0.7,
      maxTokens: 500,
    });
    
    return result.toResponse();
  } catch (error) {
    console.error('Chat error:', error);
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Helper functions like detectCategory, extractTags, and extractSearchQuery
// are removed as Composio's Mem0 is expected to handle these aspects or
// provide different mechanisms for categorization and searching.
// If specific preprocessing is still needed before sending to Composio,
// it can be added here or within the ComposioMemoryService.