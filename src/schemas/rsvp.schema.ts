import { z } from 'zod';

export const createRsvpSchema = z.object({
    status: z.enum(['attending', 'maybe', 'declined']).default('attending')
});

export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;
