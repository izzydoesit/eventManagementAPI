import { Event, IEvent } from '../models/event.model';
import { CreateEventInput, UpdateEventInput } from '../schemas/event.schema';
import { IUser } from '../models/user.model';
import { Rsvp, IRsvp } from '../models/rsvp.model';
import { CreateRsvpInput } from '../schemas/rsvp.schema';

export class EventService {
    async createEvent(data: CreateEventInput, organizerId: IUser['_id']): Promise<IEvent> {
        const event = await Event.create({
            ...data,
            date: new Date(data.date),
            organizer: organizerId,
            status: 'draft'
        });
        return event;
    }

    async getEvents(query: any = {}, page: number = 1, limit: number = 10): Promise<{ events: IEvent[], total: number }> {
        const filter: any = { status: 'published' };

        if (query.category) {
            filter.category = query.category;
        }

        if (query.location) {
            filter.location = { $regex: query.location, $options: 'i' }; // Case-insensitive search
        }

        if (query.date) {
            const searchDate = new Date(query.date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);

            filter.date = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        const skip = (page - 1) * limit;
        const events = await Event.find(filter)
            .populate('organizer', 'name email')
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments(filter);

        return { events, total };
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

    async registerForEvent(eventId: string, userId: string, data: CreateRsvpInput): Promise<IRsvp> {
        const event = await Event.findById(eventId);
        
        if (!event || event.status !== 'published') {
            throw new Error('Event not found or not available');
        }
    
        const existingRsvp = await Rsvp.findOne({ user: userId, event: eventId });
        if (existingRsvp) {
            throw new Error('Already RSVP\'d for this event');
        }
    
        const rsvp = await Rsvp.create({
            user: userId,
            event: eventId,
            status: data.status
        });
    
        return rsvp;
    }

    async getEventAttendees(eventId: string): Promise<IRsvp[]> {
        return Rsvp.find({ event: eventId })
            .populate('user', 'name email')
            .populate('event', 'title');
    }

    async getEventsUserAttends(userId: string): Promise<IRsvp[]> {
        return Rsvp.find({ user: userId })
            .populate('event', 'title description date location')
            .populate('user', 'name email');
    }
}