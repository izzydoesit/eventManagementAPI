import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),
    MONGODB_URI: z.string().url('Invalid MongoDB URI'),
    MONGODB_TEST_URI: z.string().url('Invalid MongoDB test URI').optional(),
    CORS_ORIGIN: z.string().default('*'),
    JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters long'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    JWT_ALGORITHM: z.enum(['HS256', 'HS384', 'HS512']).default('HS256'),
  });

  type EnvSchema = z.infer<typeof envSchema>;

  let env: EnvSchema;
  
  try {
    env = envSchema.parse(process.env);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:', error.errors);
        process.exit(1);
    } else {
        console.error('❌ Unexpected error while parsing environment variables:', error);
    }
    process.exit(1);
  }
  
  export { env };