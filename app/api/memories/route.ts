import { NextResponse } from 'next/server';
import { MemoryService } from '@/lib/memory';
import * as Sentry from '@sentry/nextjs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = 'default_user'; // In production, get from auth
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let memories;
    
    if (query) {
      memories = await MemoryService.search(userId, query, limit);
    } else {
      memories = await MemoryService.getRecent(userId, limit);
    }
    
    return NextResponse.json({ memories });
  } catch (error) {
    console.error('Memory fetch error:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = 'default_user'; // In production, get from auth
    
    const memory = await MemoryService.store(userId, {
      userId,
      content: body.content,
      category: body.category,
      importance: body.importance || 5,
      tags: body.tags,
      context: body.context,
      metadata: body.metadata,
    });
    
    return NextResponse.json({ memory });
  } catch (error) {
    console.error('Memory store error:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Failed to store memory' },
      { status: 500 }
    );
  }
}