import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

if (process.env.TEST_TYPE === 'integration') {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        console.log('Test database connected');
    });
    
    afterEach(async () => {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
        console.log('Test database collections cleared');
    });
    
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        console.log('Test database connection closed');
    });    
}