import { config } from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

config({ path: path.join(__dirname, '../../../.env.test') });

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_TEST_URI || '');
    console.log('Test database connected');
  } catch (error) {
    console.error('Test database connection error:', error);
    process.exit(1);
  }
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(
      collections.map((collection) => collection.deleteMany({}))
    );
    console.log('Test database collections cleared');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Test database connection closed');
});
