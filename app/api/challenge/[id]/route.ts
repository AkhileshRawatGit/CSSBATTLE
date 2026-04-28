import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Challenge from '@/models/Challenge';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const challenge = await Challenge.findById(params.id);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ challenge });
  } catch (error: unknown) {
    console.error('Get challenge error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const challenge = await Challenge.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ challenge });
  } catch (error: unknown) {
    console.error('Update challenge error:', error);
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const challenge = await Challenge.findByIdAndUpdate(
      params.id,
      { isActive: body.isActive },
      { new: true }
    );

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ challenge });
  } catch (error: unknown) {
    console.error('Toggle challenge error:', error);
    return NextResponse.json({ error: 'Failed to toggle challenge status' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const challenge = await Challenge.findByIdAndDelete(params.id);
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Challenge deleted' });
  } catch (error: unknown) {
    console.error('Delete challenge error:', error);
    return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 });
  }
}
