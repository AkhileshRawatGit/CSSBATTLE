import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import { getUserFromRequest } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';

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

    // Save image to public/challenges
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `challenge-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const challengesDir = path.join(process.cwd(), 'public', 'challenges');
    
    // Ensure directory exists
    if (!fs.existsSync(challengesDir)) {
      fs.mkdirSync(challengesDir, { recursive: true });
    }

    const imagePath = path.join(challengesDir, filename);
    await writeFile(imagePath, buffer);

    const challenge = await Challenge.create({
      title,
      description: description || '',
      image: `/challenges/${filename}`,
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
