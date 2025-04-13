import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import mongoose from 'mongoose';

jest.mock('../../models/event.model');

describe('EventService', () => {
    let eventService: EventService;
    const mockUserId = new mongoose.Types.ObjectId().toString();
    const mockEventId = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
        eventService = new EventService();
        jest.clearAllMocks();
    });

    describe('createEvent', () => {
        it('should create an event successfully', async () => {
            const mockEventData = {
                title: 'Test Event',
                description: 'Test Description',
                date: new Date('2025-12-31'),
                location: 'Test Location',
                category: 'workshop' as const
            };

            const mockCreatedEvent = {
                ...mockEventData,
                _id: mockEventId,
                organizer: mockUserId,
                status: 'draft',
                attendees: []
            };

            (Event.create as jest.Mock).mockResolvedValue(mockCreatedEvent);

            const result = await eventService.createEvent(mockEventData, mockUserId);

            expect(Event.create).toHaveBeenCalledWith({
                ...mockEventData,
                organizer: mockUserId,
                status: 'draft'
            });
            expect(result).toEqual(mockCreatedEvent);
        });
    });

    describe('getEvents', () => {
        it('should return published events', async () => {
            const mockEvents = [
                { _id: mockEventId, title: 'Test Event', status: 'published' }
            ];

            (Event.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(mockEvents)
                })
            });

            const result = await eventService.getEvents();

            expect(result).toEqual(mockEvents);
        });
    });

});