import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Challenge from '@/models/Challenge';
import Progress from '@/models/Progress';
import { getUserFromRequest } from '@/lib/auth';

import { getBrowser, submissionLimiter } from '@/lib/puppeteer';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function calculateScore(visualMatch: number, characterCount: number) {
  // Base score from visual match
  const baseScore = visualMatch * 100; // 0-10000 range
  
  // Character penalty (adjust this for balance)
  const charPenalty = Math.floor(characterCount / 10);
  
  // Exponential boost when at 100% match
  let finalScore;
  // 99.4% threshold accounts for sub-pixel anti-aliasing mismatches on the edges of curves
  if (visualMatch >= 99.4) {
    // Exponential scoring for 100% matches
    const perfectBonus = 10000; // Base for perfect match
    const charBonus = Math.max(0, 2000 - characterCount);
    finalScore = perfectBonus + charBonus;
  } else {
    // Linear scoring for imperfect matches
    finalScore = baseScore - charPenalty;
  }
  
  return Math.max(0, Math.round(finalScore));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, code, isFinal } = body;

    const user = getUserFromRequest(request);
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!user && !isDev) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    if (!challengeId || !code) {
      return NextResponse.json(
        { error: 'Challenge ID and code are required' },
        { status: 400 }
      );
    }

    // Verify challenge exists
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const codeLength = code.replace(/\s+/g, '').length;

    // Load Target Base64 safely (bypassing pngjs strict parsing issues)
    let targetBase64: string;
    if (challenge.image.startsWith('data:image')) {
      targetBase64 = challenge.image;
    } else if (challenge.image.startsWith('/')) {
      const filePath = path.join(process.cwd(), 'public', challenge.image);
      const fileData = fs.readFileSync(filePath);
      targetBase64 = `data:image/png;base64,${fileData.toString('base64')}`;
    } else {
       throw new Error('Unsupported image format');
    }

    // --- PUPPETEER SCREENSHOT & COMPARISON (Limited Concurrency) ---
    const { comparisonResult, userBase64 } = await submissionLimiter.run(async () => {
      const browser = await getBrowser();
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 400, height: 300, deviceScaleFactor: 1 });
        
        // Render
        await page.setContent(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                * { margin: 0; padding: 0; }
                body { width: 400px; height: 300px; overflow: hidden; background: #ffffff; }
              </style>
            </head>
            <body>
              ${code}
            </body>
          </html>
        `);
        
        await new Promise(r => setTimeout(r, 100)); // Paint tick

        const userScreenshotBuffer = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 400, height: 300 } }) as Buffer;
        const uBase64 = `data:image/png;base64,${userScreenshotBuffer.toString('base64')}`;

        // Execute native canvas pixel comparison inside Chrome
        const comparisonResult = await page.evaluate(async (tBase64, uBase64) => {
          const loadImg = (src: string) => new Promise<HTMLImageElement | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
          });
          
          const tImg = await loadImg(tBase64);
          const uImg = await loadImg(uBase64);
          
          if (!tImg || !uImg) return null;

          const c1 = document.createElement('canvas');
          const c2 = document.createElement('canvas');
          c1.width = c2.width = 400;
          c1.height = c2.height = 300;
          
          const ctx1 = c1.getContext('2d');
          const ctx2 = c2.getContext('2d');
          if (!ctx1 || !ctx2) return null;

          ctx1.fillStyle = '#ffffff'; ctx1.fillRect(0,0,400,300);
          ctx2.fillStyle = '#ffffff'; ctx2.fillRect(0,0,400,300);

          ctx1.drawImage(tImg, 0, 0, 400, 300);
          ctx2.drawImage(uImg, 0, 0, 400, 300);

          const d1 = ctx1.getImageData(0,0,400,300).data;
          const d2 = ctx2.getImageData(0,0,400,300).data;

          // Identify background color (assume top-left pixel)
          const bgR = d1[0], bgG = d1[1], bgB = d1[2];
          
          let totalFgPixels = 0;
          let matchedFgPixels = 0;
          let totalBgPixels = 0;
          let matchedBgPixels = 0;

          for (let i = 0; i < d1.length; i += 4) {
            const isBg = Math.abs(d1[i] - bgR) < 5 && 
                         Math.abs(d1[i+1] - bgG) < 5 && 
                         Math.abs(d1[i+2] - bgB) < 5;
            
            const isMatch = Math.abs(d1[i] - d2[i]) <= 25 &&
                            Math.abs(d1[i+1] - d2[i+1]) <= 25 &&
                            Math.abs(d1[i+2] - d2[i+2]) <= 25;
            
            if (isBg) {
              totalBgPixels++;
              if (isMatch) matchedBgPixels++;
            } else {
              totalFgPixels++;
              if (isMatch) matchedFgPixels++;
            }
          }
          
          return { matchedFgPixels, totalFgPixels, matchedBgPixels, totalBgPixels };
        }, targetBase64, uBase64);

        if (!comparisonResult) throw new Error('Comparison failed');

        return { comparisonResult, userBase64: uBase64 };
      } finally {
        await page.close();
      }
    });

    if (!comparisonResult) {
      throw new Error('Image decoding failed inside Puppeteer canvas');
    }

    const { matchedFgPixels, totalFgPixels, matchedBgPixels, totalBgPixels } = comparisonResult;
    
    // Calculate weighted accuracy: Foreground match is 90%, Background match is 10%
    // This prevents "76% accuracy" for just filling the background.
    const fgMatch = totalFgPixels > 0 ? (matchedFgPixels / totalFgPixels) : 1;
    const bgMatch = totalBgPixels > 0 ? (matchedBgPixels / totalBgPixels) : 1;
    
    const rawVisualMatch = (fgMatch * 0.9 + bgMatch * 0.1) * 100;
    
    const visualMatchPercentage = Math.round(rawVisualMatch * 10) / 10;
    const score = calculateScore(visualMatchPercentage, codeLength);

    // For 'Check Score' actions (isFinal = false), return result without DB save
    if (!isFinal) {
      return NextResponse.json({ 
        score, 
        similarity: visualMatchPercentage,
        submission: { 
          _id: 'check', 
          challengeId, 
          code, 
          score, 
          similarity: visualMatchPercentage, 
          codeLength 
        },
        breakdown: { matchedFgPixels, totalFgPixels, matchedBgPixels, totalBgPixels }
      }, { status: 201 });
    }

    // In dev mode without auth, skip DB save and return mock response
    if (!user) {
      return NextResponse.json({ 
        submission: { _id: 'dev-sub', challengeId, code, score, similarity: visualMatchPercentage, codeLength }, 
        score, 
        similarity: visualMatchPercentage,
        breakdown: { matchedFgPixels, totalFgPixels, matchedBgPixels, totalBgPixels }
      }, { status: 201 });
    }

    // Check if dynamic challenge is already finished by the user
    if (user && !user.isAdmin) {
      const progress = await Progress.findOne({ userId: user.userId, challengeId });
      if (progress && progress.isFinished) {
        return NextResponse.json({ error: 'You have already submitted this challenge' }, { status: 403 });
      }
    }

    const submission = await Submission.create({
      userId: user.userId,
      challengeId,
      code,
      score,
      similarity: visualMatchPercentage,
      codeLength,
    });

    // Mark as finished in Progress model
    if (user && !user.isAdmin) {
      await Progress.findOneAndUpdate(
        { userId: user.userId, challengeId },
        { isFinished: true }
      );
    }

    return NextResponse.json({ submission, score, similarity: visualMatchPercentage }, { status: 201 });
  } catch (error: unknown) {
    console.error('Submit error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');
    const sort = searchParams.get('sort');

    const query: Record<string, unknown> = { userId: user.userId };
    if (challengeId) query.challengeId = challengeId;

    const submissions = await Submission.find(query)
      .populate('challengeId', 'title difficulty')
      .sort(sort === 'score' ? { score: -1 } : { createdAt: -1 })
      .limit(20);

    return NextResponse.json({ submissions });
  } catch (error: unknown) {
    console.error('Get submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
