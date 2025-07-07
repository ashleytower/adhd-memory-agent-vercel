import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import composio from '@/lib/composio';
import { MemoryService } from '@/lib/memory';

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
      ['remember', 'store', 'save', 'keep'].forEach(word => {
        contentToStore = contentToStore.replace(new RegExp(`${word}\\s+(that\\s+)?`, 'gi'), '');
      });
      
      // Store the memory
      await MemoryService.store(userId, {
        userId,
        content: contentToStore.trim(),
        importance: 5,
        category: detectCategory(contentToStore),
        tags: extractTags(contentToStore),
        context: 'chat',
      });
    }
    
    // For retrieval, search memories
    let relevantMemories: any[] = [];
    if (isMemoryRetrieval) {
      const searchQuery = extractSearchQuery(userContent);
      relevantMemories = await MemoryService.search(userId, searchQuery, 5);
    }
    
    // Create context with memories
    const contextMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.slice(0, -1),
      {
        role: 'user' as const,
        content: relevantMemories.length > 0
          ? `${lastMessage.content}\n\n[Relevant memories found:\n${relevantMemories.map(m => `- ${m.content} (saved ${new Date(m.createdAt).toLocaleDateString()})`).join('\n')}]`
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
    
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Helper functions
function detectCategory(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('key') || lower.includes('wallet') || lower.includes('phone')) return 'objects';
  if (lower.includes('medication') || lower.includes('pill') || lower.includes('medicine')) return 'health';
  if (lower.includes('meeting') || lower.includes('appointment') || lower.includes('call')) return 'schedule';
  if (lower.includes('task') || lower.includes('todo') || lower.includes('work')) return 'tasks';
  return 'general';
}

function extractTags(content: string): string[] {
  const tags: string[] = [];
  const words = content.toLowerCase().split(/\s+/);
  
  // Extract common ADHD-related tags
  const tagWords = ['keys', 'wallet', 'phone', 'medication', 'appointment', 'task', 'reminder'];
  
  for (const word of words) {
    if (tagWords.some(tag => word.includes(tag))) {
      tags.push(word);
    }
  }
  
  return tags;
}

function extractSearchQuery(content: string): string {
  // Remove question words to get the essence
  let query = content;
  ['where', 'what', 'when', 'did', 'show', 'find', 'is', 'are', 'my', 'i', 'me'].forEach(word => {
    query = query.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  });
  return query.trim();
}