import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Progress from '@/models/Progress';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Delete all submissions
    const subResult = await Submission.deleteMany({});
    
    // Delete all progress records
    const progResult = await Progress.deleteMany({});

    return NextResponse.json({ 
      message: 'Leaderboard reset successfully',
      deletedSubmissions: subResult.deletedCount,
      deletedProgress: progResult.deletedCount
    });
  } catch (error: unknown) {
    console.error('Reset leaderboard error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
