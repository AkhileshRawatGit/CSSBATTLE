import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function checkDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  console.log('Connecting to:', uri.replace(/:([^@]+)@/, ':****@'));

  try {
    await mongoose.connect(uri);
    console.log('Connected!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
      
      if (col.name === 'challenges') {
        const challenges = await mongoose.connection.db.collection(col.name).find().toArray();
        console.log('  Challenges:', challenges.map(c => ({ title: c.title, isActive: c.isActive })));
      }
      
      if (col.name === 'users') {
        const users = await mongoose.connection.db.collection(col.name).find().toArray();
        console.log('  Users:', users.map(u => ({ email: u.email, name: u.name, isAdmin: u.isAdmin })));
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkDb();
