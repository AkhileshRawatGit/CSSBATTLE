import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
  console.error('❌ MONGODB_URI is not set or contains placeholders in .env.local');
  process.exit(1);
}

const challenges = [
  {
    title: 'The Radial Maze',
    description: 'A series of concentric broken rings that test rotation and border-clipping precision.',
    difficulty: 'medium',
    image: '/challenges/challenge-1.png',
    colors: ['#1A4341', '#F3AC3C', '#E35064'],
    tags: ['rotation', 'borders'],
    isActive: true,
  },
  {
    title: 'The Mechanical Eye',
    description: 'A complex ocular structure with gradients and surrounding bolt patterns.',
    difficulty: 'hard',
    image: '/challenges/challenge-2.png',
    colors: ['#111111', '#F2BC1B', '#E35064'],
    tags: ['gradients', 'precision', 'pro'],
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Models
    const ChallengeSchema = new mongoose.Schema({
      title: String,
      description: String,
      difficulty: String,
      image: String,
      tags: [String],
      isActive: Boolean,
    }, { timestamps: true });

    const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('🗑️ Cleared existing challenges');

    // Insert new challenges
    await Challenge.insertMany(challenges);
    console.log(`🚀 Successfully seeded ${challenges.length} challenges`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
