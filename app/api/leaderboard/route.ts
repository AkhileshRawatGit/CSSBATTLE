import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const matchStage: Record<string, unknown> = {};
    if (challengeId && mongoose.Types.ObjectId.isValid(challengeId)) {
      matchStage.challengeId = new mongoose.Types.ObjectId(challengeId);
    }

    const leaderboard = await Submission.aggregate([
      { $match: matchStage },
      {
        $sort: { score: -1, createdAt: 1 },
      },
      {
        $group: {
          _id: '$userId',
          bestScore: { $first: '$score' },
          bestSimilarity: { $first: '$similarity' },
          codeLength: { $first: '$codeLength' },
          submittedAt: { $first: '$createdAt' },
          submissionId: { $first: '$_id' },
          challengeId: { $first: '$challengeId' },
        },
      },
      { $sort: { bestScore: -1, submittedAt: 1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'challenges',
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challenge',
        },
      },
      {
        $project: {
          userId: '$_id',
          name: { $arrayElemAt: ['$user.name', 0] },
          email: { $arrayElemAt: ['$user.email', 0] },
          challengeTitle: { $arrayElemAt: ['$challenge.title', 0] },
          score: '$bestScore',
          similarity: '$bestSimilarity',
          codeLength: 1,
          submittedAt: 1,
        },
      },
    ]);

    return NextResponse.json({ leaderboard });
  } catch (error: unknown) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
