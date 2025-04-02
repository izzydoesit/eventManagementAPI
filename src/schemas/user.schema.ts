import { z } from 'zod';

// User registration schema
export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

// Types based on the schemas
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];