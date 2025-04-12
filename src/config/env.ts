import { z } from 'zod';
import dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),
    MONGODB_URI: z.string().url('Invalid MongoDB URI'),
    MONGODB_TEST_URI: z.string().url('Invalid MongoDB test URI').optional(),
    CORS_ORIGIN: z.string().default('*'),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().regex(/^\d+[hdwmy]$/, 'Invalid expiration format'),
    JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\d+[hdwmy]$/, 'Invalid expiration format'),
    JWT_ALGORITHM: z.enum(['HS256', 'HS384', 'HS512']).default('HS256') as z.ZodType<Algorithm>,
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