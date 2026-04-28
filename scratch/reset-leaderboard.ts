import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function resetLeaderboard() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Models (Minimal schemas for deletion)
    const Submission = mongoose.models.Submission || mongoose.model('Submission', new mongoose.Schema({}));
    const Progress = mongoose.models.Progress || mongoose.model('Progress', new mongoose.Schema({}));

    const subResult = await Submission.deleteMany({});
    console.log(`🗑️ Deleted ${subResult.deletedCount} submissions`);

    const progResult = await Progress.deleteMany({});
    console.log(`🗑️ Deleted ${progResult.deletedCount} progress records`);

    console.log('✅ Leaderboard reset successfully');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error during reset:', err);
  }
}

resetLeaderboard();
