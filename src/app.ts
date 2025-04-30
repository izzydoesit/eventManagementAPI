import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler.middleware';


const app = express();

const getMongoUri = () => {
  switch (env.NODE_ENV) {
    case 'production':
      return env.MONGODB_URI;
    case 'test':
      return env.MONGODB_TEST_URI || env.MONGODB_URI;
    default:
      return env.MONGODB_URI;
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = getMongoUri();
    console.log(`Attempting to connect to MongoDB at: ${uri}`);
    
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected - ${env.NODE_ENV} environment`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: env.CORS_ORIGIN
}));
app.use(helmet());

app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);

// error handler middleware
app.use(errorHandler);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  return res.status(404).json({ message: 'Route not found' });
});


const server = app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
