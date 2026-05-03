import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Progress from '@/models/Progress';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');

    await dbConnect();

    // If no challengeId, return all progress for this user
    if (!challengeId) {
      const allProgress = await Progress.find({ userId: user.userId });
      return NextResponse.json({ progress: allProgress });
    }

    // Find existing progress or create new one atomically (Start)
    const progress = await Progress.findOneAndUpdate(
      { userId: user.userId, challengeId },
      { 
        $setOnInsert: { 
          userId: user.userId, 
          challengeId, 
          startTime: new Date(),
          tabSwitches: 0,
          isFinished: false 
        } 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error('Fetch progress error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { challengeId, tabSwitches, isFinished } = body;

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 });
    }

    const update: any = {};
    if (tabSwitches !== undefined) update.tabSwitches = tabSwitches;
    if (isFinished !== undefined) update.isFinished = isFinished;

    const progress = await Progress.findOneAndUpdate(
      { userId: user.userId, challengeId },
      update,
      { new: true }
    );

    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
