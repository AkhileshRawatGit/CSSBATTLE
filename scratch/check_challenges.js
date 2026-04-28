require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const ChallengeSchema = new mongoose.Schema({
  title: String,
  isActive: Boolean,
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

async function checkData() {
  await mongoose.connect(MONGODB_URI);
  const count = await Challenge.countDocuments();
  console.log(`Total challenges in DB: ${count}`);
  const active = await Challenge.find({ isActive: true });
  console.log(`Active challenges: ${active.length}`);
  if (active.length > 0) {
    console.log('First active challenge:', active[0].title);
  }
  process.exit(0);
}

checkData().catch(err => {
  console.error(err);
  process.exit(1);
});
