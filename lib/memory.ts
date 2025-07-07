import { kv } from '@vercel/kv';

export interface Memory {
  id: string;
  userId: string;
  content: string;
  category?: string;
  importance: number;
  createdAt: Date;
  lastAccessed?: Date;
  tags?: string[];
  context?: string;
  metadata?: Record<string, any>;
}

export class MemoryService {
  static async store(userId: string, memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
    const id = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullMemory: Memory = {
      ...memory,
      id,
      userId,
      createdAt: new Date(),
    };
    
    // Store in Vercel KV
    await kv.hset(`user:${userId}:memories`, id, JSON.stringify(fullMemory));
    
    // Also store in a searchable index
    await kv.zadd(`user:${userId}:memories:index`, {
      score: Date.now(),
      member: id,
    });
    
    return fullMemory;
  }
  
  static async search(userId: string, query: string, limit: number = 10): Promise<Memory[]> {
    // Get all memory IDs (in production, use proper search)
    const memoryIds = await kv.zrange(`user:${userId}:memories:index`, 0, -1, {
      rev: true,
    });
    
    const memories: Memory[] = [];
    
    for (const id of memoryIds.slice(0, limit)) {
      const memoryStr = await kv.hget(`user:${userId}:memories`, id as string);
      if (memoryStr) {
        const memory = JSON.parse(memoryStr as string) as Memory;
        
        // Simple text search (in production, use vector search)
        if (memory.content.toLowerCase().includes(query.toLowerCase()) ||
            memory.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))) {
          memories.push(memory);
        }
      }
    }
    
    return memories;
  }
  
  static async getRecent(userId: string, limit: number = 10): Promise<Memory[]> {
    const memoryIds = await kv.zrange(`user:${userId}:memories:index`, 0, limit - 1, {
      rev: true,
    });
    
    const memories: Memory[] = [];
    
    for (const id of memoryIds) {
      const memoryStr = await kv.hget(`user:${userId}:memories`, id as string);
      if (memoryStr) {
        memories.push(JSON.parse(memoryStr as string) as Memory);
      }
    }
    
    return memories;
  }
  
  static async getAll(userId: string): Promise<Memory[]> {
    const allMemories = await kv.hgetall(`user:${userId}:memories`);
    return Object.values(allMemories || {}).map(m => JSON.parse(m as string) as Memory);
  }
}