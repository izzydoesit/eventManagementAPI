import cors from 'cors';
import { env } from '../config/env';


const allowedOrigins = env.CORS_ORIGIN || ['https://myfrontend.com', 'http://localhost:3000'];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies & auth headers
};
