/**
 * Seed script — run with: npx ts-node scripts/seed.ts
 * Or use the /api/admin endpoint with isAdmin=true user.
 *
 * To make yourself admin, update your user in MongoDB Atlas:
 * db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
 */

const challenges = [
  {
    title: 'Red Square',
    description: 'Create a simple red square centered on the white canvas.',
    difficulty: 'easy',
    tags: ['shapes', 'basics'],
    // image: use /public/challenges/red-square.png
  },
  {
    title: 'Blue Circle',
    description: 'A perfect blue circle in the center of the canvas.',
    difficulty: 'easy',
    tags: ['shapes', 'border-radius'],
  },
  {
    title: 'CSS Flag',
    description: 'Recreate a simple tricolor flag using CSS.',
    difficulty: 'medium',
    tags: ['layout', 'flexbox'],
  },
  {
    title: 'Gradient Sunset',
    description: 'A beautiful radial sunset gradient.',
    difficulty: 'medium',
    tags: ['gradients'],
  },
  {
    title: 'Checkerboard',
    description: 'A black and white checkerboard pattern.',
    difficulty: 'hard',
    tags: ['patterns', 'grid'],
  },
];

console.log('Seed data defined. Add challenges via the Admin Panel at /admin.');
console.log('Challenges to add:', challenges.length);
