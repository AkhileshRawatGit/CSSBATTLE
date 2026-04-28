import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const leaderboardLock = await Settings.findOne({ key: 'isLeaderboardLocked' });
    
    return NextResponse.json({ 
      isLeaderboardLocked: leaderboardLock ? leaderboardLock.value : false 
    });
  } catch (error: unknown) {
    return NextResponse.json({ isLeaderboardLocked: false });
  }
}
