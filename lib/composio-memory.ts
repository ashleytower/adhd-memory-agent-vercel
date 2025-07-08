import { Composio } from '@composio/core';
import * as Sentry from '@sentry/nextjs';

interface MemoryItem {
  id: string;
  content: string;
  userId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class ComposioMemoryService {
  private composio: Composio;
  
  constructor() {
    this.composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY!,
    });
  }
  
  async storeMemory(userId: string, content: string, metadata?: Record<string, any>): Promise<MemoryItem> {
    try {
      const memory: MemoryItem = {
        id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        userId,
        timestamp: new Date().toISOString(),
        metadata,
      };
      
      // Store in Composio using Mem0
      // Replace 'storeMemory' with the actual action name for Mem0
      const response = await this.composio.actions.execute({
        action: 'storeMemory',
        payload: {
          userId,
          content,
          timestamp: memory.timestamp,
          metadata,
        },
      });

      // Assuming the response contains the stored memory item
      // Adjust the response parsing based on actual Composio SDK behavior
      return response.data as MemoryItem;
    } catch (error) {
      Sentry.captureException(error);
      console.error('Composio storeMemory error:', error);
      throw new Error('Failed to store memory using Composio');
    }
  }
  
  async searchMemories(userId: string, query: string, limit: number = 5): Promise<MemoryItem[]> {
    try {
      // Search memories in Composio using Mem0
      // Replace 'searchMemories' with the actual action name for Mem0
      const response = await this.composio.actions.execute({
        action: 'searchMemories',
        payload: {
          userId,
          query,
          limit,
        },
      });

      // Assuming the response contains an array of memory items
      // Adjust the response parsing based on actual Composio SDK behavior
      return response.data as MemoryItem[];
    } catch (error) {
      Sentry.captureException(error);
      console.error('Composio searchMemories error:', error);
      throw new Error('Failed to search memories using Composio');
    }
  }
  
  async getRecentMemories(userId: string, limit: number = 10): Promise<MemoryItem[]> {
    try {
      // Get recent memories from Composio using Mem0
      // Replace 'getRecentMemories' with the actual action name for Mem0
      const response = await this.composio.actions.execute({
        action: 'getRecentMemories',
        payload: {
          userId,
          limit,
        },
      });

      // Assuming the response contains an array of memory items
      // Adjust the response parsing based on actual Composio SDK behavior
      return response.data as MemoryItem[];
    } catch (error) {
      Sentry.captureException(error);
      console.error('Composio getRecentMemories error:', error);
      throw new Error('Failed to get recent memories using Composio');
    }
  }
}