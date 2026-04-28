import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: Record<string, unknown> = {};
    if (difficulty) query.difficulty = difficulty;

    const challenges = await Challenge.find(query)
      .select('-targetCode')
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ challenges });
  } catch (error: unknown) {
    console.error('Get challenges error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { title, description, image, difficulty, targetCode, tags } = body;

    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }

    const challenge = await Challenge.create({
      title,
      description: description || '',
      image,
      difficulty: difficulty || 'medium',
      targetCode: targetCode || '',
      tags: tags || [],
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create challenge error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
