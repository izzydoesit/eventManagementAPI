import { EventService } from '../../services/event.service';
import { Event, IEvent } from '../../models/event.model';
import { Rsvp } from '../../models/rsvp.model';
import mongoose from 'mongoose';
import { CreateEventInput, UpdateEventInput } from '../../schemas/event.schema';
import { CreateRsvpInput } from '../../schemas/rsvp.schema';

jest.mock('../../models/event.model');
jest.mock('../../models/rsvp.model');

describe('EventService', () => {
    let eventService: EventService;
    const mockUserId = new mongoose.Types.ObjectId().toString();
    const mockEventId = new mongoose.Types.ObjectId().toString();
    const mockRsvpId = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
        eventService = new EventService();
        jest.clearAllMocks();
    });

    describe('createEvent', () => {
        it('should create an event successfully', async () => {
            const mockEventData: CreateEventInput = {
                title: 'Test Event',
                description: 'Test Description',
                date: new Date('2025-12-31'),
                location: 'Test Location',
                category: 'workshop'
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
                    sort: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue(mockEvents)
                        })
                    })
                })
            });
            (Event.countDocuments as jest.Mock).mockResolvedValue(mockEvents.length);

            const result = await eventService.getEvents();

            expect(result.events).toEqual(mockEvents);
        });

        it('should filter events by category', async () => {
            const mockEvents = [
                { _id: mockEventId, title: 'Test Event', status: 'published', category: 'workshop' }
            ];

            (Event.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue(mockEvents)
                        })
                    })
                })
            });
            (Event.countDocuments as jest.Mock).mockResolvedValue(mockEvents.length);

            const result = await eventService.getEvents({ category: 'workshop' });

            expect(Event.find).toHaveBeenCalledWith({ status: 'published', category: 'workshop' });
            expect(result.events).toEqual(mockEvents);
        });

        it('should filter events by location', async () => {
            const mockEvents = [
                { _id: mockEventId, title: 'Test Event', status: 'published', location: 'Test Location' }
            ];

            (Event.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue(mockEvents)
                        })
                    })
                })
            });
            (Event.countDocuments as jest.Mock).mockResolvedValue(mockEvents.length);

            const result = await eventService.getEvents({ location: 'Test Location' });

            expect(Event.find).toHaveBeenCalledWith({ status: 'published', location: { $regex: 'Test Location', $options: 'i' } });
            expect(result.events).toEqual(mockEvents);
        });

        it('should filter events by date', async () => {
            const mockEvents = [
                { _id: mockEventId, title: 'Test Event', status: 'published', date: new Date('2025-12-31') }
            ];

            const searchDate = new Date('2025-12-31');
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);

            (Event.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockReturnValue({
                        skip: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue(mockEvents)
                        })
                    })
                })
            });
            (Event.countDocuments as jest.Mock).mockResolvedValue(mockEvents.length);

            const result = await eventService.getEvents({ date: '2025-12-31' });

            expect(Event.find).toHaveBeenCalledWith({
                status: 'published',
                date: {
                    $gte: searchDate,
                    $lt: nextDay
                }
            });
            expect(result.events).toEqual(mockEvents);
        });
    });

    describe('getEventById', () => {
        it('should return an event by ID', async () => {
            const mockEvent = { _id: mockEventId, title: 'Test Event' };

            (Event.findById as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockEvent)
                })
            });

            const result = await eventService.getEventById(mockEventId);

            expect(Event.findById).toHaveBeenCalledWith(mockEventId);
            expect(result).toEqual(mockEvent);
        });
    });

    describe('updateEvent', () => {
        it('should update an event', async () => {
            const mockEventData: UpdateEventInput = { title: 'Updated Event' };
            const mockUpdatedEvent = { _id: mockEventId, title: 'Updated Event' };

            (Event.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedEvent);

            const result = await eventService.updateEvent(mockEventId, mockUserId, mockEventData);

            expect(Event.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockEventId, organizer: mockUserId },
                mockEventData,
                { new: true }
            );
            expect(result).toEqual(mockUpdatedEvent);
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event', async () => {
            (Event.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

            const result = await eventService.deleteEvent(mockEventId, mockUserId);

            expect(Event.deleteOne).toHaveBeenCalledWith({ _id: mockEventId, organizer: mockUserId });
            expect(result).toBe(true);
        });

        it('should return false if event is not found', async () => {
            (Event.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

            const result = await eventService.deleteEvent(mockEventId, mockUserId);

            expect(result).toBe(false);
        });
    });

    describe('registerForEvent', () => {
        it('should register a user for an event', async () => {
            const mockRsvpData: CreateRsvpInput = { status: 'attending' };
            const mockRsvp = {
                _id: mockRsvpId,
                user: mockUserId,
                event: mockEventId,
                status: mockRsvpData.status,
                timestamp: new Date()
            };

            (Event.findById as jest.Mock).mockResolvedValue({
                _id: mockEventId,
                status: 'published'
            });
            (Rsvp.findOne as jest.Mock).mockResolvedValue(null);
            (Rsvp.create as jest.Mock).mockResolvedValue(mockRsvp);

            const result = await eventService.registerForEvent(mockEventId, mockUserId, mockRsvpData);

            expect(Rsvp.create).toHaveBeenCalledWith({
                user: mockUserId,
                event: mockEventId,
                status: mockRsvpData.status
            });
            expect(result).toEqual(mockRsvp);
        });

        it('should throw an error if the event is not found', async () => {
            (Event.findById as jest.Mock).mockResolvedValue(null);

            await expect(eventService.registerForEvent(mockEventId, mockUserId, { status: 'attending' }))
                .rejects
                .toThrow('Event not found or not available');
        });

        it('should throw an error if the user is already registered', async () => {
            (Event.findById as jest.Mock).mockResolvedValue({
                _id: mockEventId,
                status: 'published'
            });
            (Rsvp.findOne as jest.Mock).mockResolvedValue({});

            await expect(eventService.registerForEvent(mockEventId, mockUserId, { status: 'attending' }))
                .rejects
                .toThrow('Already RSVP\'d for this event');
        });
    });

    describe('getEventAttendees', () => {
        it('should return a list of attendees for an event', async () => {
            const mockAttendees = [
                { _id: mockRsvpId, user: mockUserId, event: mockEventId, status: 'attending' }
            ];

            (Rsvp.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockAttendees)
                })
            });

            const result = await eventService.getEventAttendees(mockEventId);

            expect(Rsvp.find).toHaveBeenCalledWith({ event: mockEventId });
            expect(result).toEqual(mockAttendees);
        });
    });

    describe('getEventsUserAttends', () => {
        it('should return a list of events a user is attending', async () => {
            const mockEvents = [
                { _id: mockEventId, title: 'Test Event', description: 'Test Description', date: new Date(), location: 'Test Location' }
            ];

            (Rsvp.find as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockEvents)
                })
            });

            const result = await eventService.getEventsUserAttends(mockUserId);

            expect(Rsvp.find).toHaveBeenCalledWith({ user: mockUserId });
            expect(result).toEqual(mockEvents);
        });
    });
});