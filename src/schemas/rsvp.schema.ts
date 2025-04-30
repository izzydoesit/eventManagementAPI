import { z } from 'zod';

export const createRsvpSchema = z.object({
    user: z.string().uuid(),
    event: z.string().uuid(),
    status: z.enum(['attending', 'maybe', 'declined']).default('attending')
});

export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;
