import { Event, IEvent } from '../models/event.model';
import { CreateEventInput, UpdateEventInput } from '../schemas/event.schema';
import { IUser } from '../models/user.model';

export class EventService {
    async createEvent(data: CreateEventInput, organizerId: IUser['_id']): Promise<IEvent> {
        const event = await Event.create({
            ...data,
            organizer: organizerId,
            status: 'draft'
        });
        return event;
    }

    async getEvents(query: Partial<IEvent> = {}): Promise<IEvent[]> {
        return Event.find({ ...query, status: 'published' })
            .populate('organizer', 'name email')
            .sort({ date: 1 });
    }

    async getEventById(eventId: string): Promise<IEvent | null> {
        return Event.findById(eventId)
            .populate('organizer', 'name email')
            .populate('attendees', 'name email');
    }

    async updateEvent(eventId: string, organizerId: string, data: UpdateEventInput): Promise<IEvent | null> {
        return Event.findOneAndUpdate(
            { _id: eventId, organizer: organizerId },
            data,
            { new: true }
        );
    }

    async deleteEvent(eventId: string, organizerId: string): Promise<boolean> {
        const result = await Event.deleteOne({ _id: eventId, organizer: organizerId });
        return result.deletedCount > 0;
    }

    async registerForEvent(eventId: string, userId: string): Promise<IEvent | null> {
        const event = await Event.findById(eventId);
        
        if (!event || event.status !== 'published') {
            throw new Error('Event not found or not available');
        }

        if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
            throw new Error('Event is full');
        }

        if (event.attendees.includes(userId)) {
            throw new Error('Already registered for this event');
        }

        event.attendees.push(userId);
        return event.save();
    }
}
