import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const difficulty = formData.get('difficulty') as string;
    const tags = formData.get('tags') as string;
    const timeLimit = parseInt(formData.get('timeLimit') as string || '30');

    if (!file || !title) {
      return NextResponse.json({ error: 'Image and title are required' }, { status: 400 });
    }

    // Convert image to Base64 (to avoid EROFS: read-only file system on Vercel)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    const challenge = await Challenge.create({
      title,
      description: description || '',
      image: base64Image,
      difficulty: difficulty || 'medium',
      timeLimit,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error: unknown) {
    console.error('Upload challenge error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
