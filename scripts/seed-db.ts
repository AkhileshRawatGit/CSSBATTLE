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
    title: 'Purple Circle',
    description: 'A perfect centered purple circle.',
    difficulty: 'easy',
    image: '/challenges/challenge-2.png',
    colors: ['#7c3aed', '#ffffff'],
    tags: ['basics', 'borderRadius'],
    isActive: true,
  },
  {
    title: 'Double Trouble',
    description: 'Two overlapping circles forming a pattern.',
    difficulty: 'medium',
    image: '/challenges/challenge-3.png',
    colors: ['#243c5a', '#ffffff'],
    tags: ['shapes', 'overlap'],
    isActive: true,
  },
  {
    title: 'Interlock',
    description: 'Two interlocking figures in black and white.',
    difficulty: 'medium',
    image: '/challenges/challenge-4.png',
    colors: ['#5d3fd3', '#000000', '#ffffff'],
    tags: ['shapes', 'interlock'],
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
