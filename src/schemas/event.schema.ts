import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    date: z.string().transform((str) => {
        const date = new Date(str);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }
        return date;
    }),
    location: z.string().min(1),
    organizer: z.string().uuid(),
    attendees: z.array(z.string().uuid()).optional(),
    maxAttendees: z.number().min(1).optional(),
    category: z.enum(['conference', 'workshop', 'social', 'other']),
    status: z.enum(['draft', 'published', 'cancelled']).default('draft')
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;