import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Models (Minimal schemas for checking)
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ name: String }));
    const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', new mongoose.Schema({ title: String }));
    const Submission = mongoose.models.Submission || mongoose.model('Submission', new mongoose.Schema({ 
        userId: mongoose.Types.ObjectId,
        challengeId: mongoose.Types.ObjectId,
        score: Number
    }));

    const userCount = await User.countDocuments();
    const challengeCount = await Challenge.countDocuments();
    const submissionCount = await Submission.countDocuments();

    console.log('--- Stats ---');
    console.log('Users:', userCount);
    console.log('Challenges:', challengeCount);
    console.log('Submissions:', submissionCount);

    if (submissionCount > 0) {
      const subs = await Submission.find().limit(5);
      console.log('--- Sample Submissions ---');
      console.log(JSON.stringify(subs, null, 2));

      // Test with String challengeId (likely to fail)
      const sampleChallengeId = subs[0].challengeId.toString();
      const leaderboardFail = await Submission.aggregate([
        { $match: { challengeId: sampleChallengeId } }
      ]);
      console.log('--- Aggregation Test (String ID Match) ---');
      console.log('Count:', leaderboardFail.length);

      // Test with ObjectId challengeId (likely to work)
      const leaderboardSuccess = await Submission.aggregate([
        { $match: { challengeId: new mongoose.Types.ObjectId(sampleChallengeId) } }
      ]);
      console.log('--- Aggregation Test (ObjectId Match) ---');
      console.log('Count:', leaderboardSuccess.length);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkData();
