import request from 'supertest';
import express from 'express';
import { EventController } from '../../controllers/event.controller';
import { EventService } from '../../services/event.service';
import { CreateEventInput, UpdateEventInput } from '../../schemas/event.schema';
import { CreateRsvpInput } from '../../schemas/rsvp.schema';
import logger from '../../utils/logger';

jest.mock('../../services/event.service');
jest.mock('../../utils/logger');

describe('EventController', () => {
    let app: express.Application;
    let eventController: EventController;
    let eventService: jest.Mocked<EventService>;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        eventService = new EventService() as jest.Mocked<EventService>;
        eventController = new EventController(eventService);

        // Define routes
        // Mock authentication middleware
        app.use((req, res, next) => {
            req.user = { id: 'testUserId' }; // Mock authenticated user
            next();
        });
        app.post('/api/events', eventController.createEvent.bind(eventController));
        app.get('/api/events', eventController.getEvents.bind(eventController));
        app.get('/api/events/:id', eventController.getEventById.bind(eventController));
        app.put('/api/events/:id', eventController.updateEvent.bind(eventController));
        app.delete('/api/events/:id', eventController.deleteEvent.bind(eventController));
        app.post('/api/events/:id/rsvp', eventController.registerForEvent.bind(eventController));
        app.get('/api/events/:id/attendees', eventController.getEventAttendees.bind(eventController));
        app.get('/api/events/users/me/events', eventController.getEventsUserAttends.bind(eventController));
    });

    describe('createEvent', () => {
        it('should create a new event', async () => {
            const mockEventData: CreateEventInput = {
                title: 'Test Event',
                description: 'Test Description',
                date: new Date().toISOString(),
                location: 'Test Location',
                category: 'workshop'
            };
            eventService.createEvent.mockResolvedValue(mockEventData as any);

            await request(app)
                .post('/api/events')
                .send(mockEventData)
                .expect(201);

            expect(eventService.createEvent).toHaveBeenCalledWith(mockEventData, 'testUserId');
        });

        it('should handle errors when creating an event', async () => {
            eventService.createEvent.mockRejectedValue(new Error('Failed to create event'));

            await request(app)
                .post('/api/events')
                .send({})
                .expect(400);

            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('getEvents', () => {
        it('should return a list of events', async () => {
            const mockEvents = [{ _id: 'eventId', title: 'Test Event' }];
            eventService.getEvents.mockResolvedValue({ events: mockEvents, total: 1 } as any);

            const response = await request(app)
                .get('/api/events')
                .expect(200);

            expect(response.body.events).toEqual(mockEvents);
            expect(response.body).toBeInstanceOf(Array);
            expect(eventService.getEvents).toHaveBeenCalled();
        });

        it('should handle errors when getting events', async () => {
            eventService.getEvents.mockRejectedValue(new Error('Failed to get events'));

            await request(app)
                .get('/api/events')
                .expect(500);

            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('getEventById', () => {
        it('should return an event by ID', async () => {
            const mockEvent = { _id: 'eventId', title: 'Test Event' };
            eventService.getEventById.mockResolvedValue(mockEvent as any);

            const response = await request(app)
                .get('/api/events/eventId')
                .expect(200);

            expect(response.body).toEqual(mockEvent);
            expect(eventService.getEventById).toHaveBeenCalledWith('eventId');
        });

        it('should return 404 if event is not found', async () => {
            eventService.getEventById.mockResolvedValue(null);

            await request(app)
                .get('/api/events/nonexistent-id')
                .expect(404)
                .then(response => {
                    expect(response.body.error).toBe('Event not found');
                });
        });

        it('should handle errors when getting an event by ID', async () => {
            eventService.getEventById.mockRejectedValue(new Error('Failed to get event'));

            await request(app)
                .get('/api/events/eventId')
                .expect(500);

            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('updateEvent', () => {
        it('should update an event', async () => {
            const mockEventData: UpdateEventInput = { title: 'Updated Event' };
            const mockEvent = { _id: 'eventId', title: 'Updated Event' };
            eventService.updateEvent.mockResolvedValue(mockEvent as any);

            await request(app)
                .put('/api/events/eventId')
                .send(mockEventData)
                .expect(200);

            expect(eventService.updateEvent).toHaveBeenCalledWith('eventId', 'testUserId', mockEventData);
        });

        it('should return 404 if event is not found when updating', async () => {
            eventService.updateEvent.mockResolvedValue(null);

            await request(app)
                .put('/api/events/nonexistent-id')
                .send({})
                .expect(404)
                .then(response => {
                    expect(response.body.error).toBe('Event not found');
                });
        });

        it('should handle errors when updating an event', async () => {
            eventService.updateEvent.mockRejectedValue(new Error('Failed to update event'));

            await request(app)
                .put('/api/events/eventId')
                .send({})
                .expect(400);

            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event', async () => {
            eventService.deleteEvent.mockResolvedValue(true);

            await request(app)
                .delete('/api/events/eventId')
                .expect(204);

            expect(eventService.deleteEvent).toHaveBeenCalledWith('eventId', 'testUserId');
        });

        it('should return 404 if event is not found when deleting', async () => {
            eventService.deleteEvent.mockResolvedValue(false);

            await request(app)
                .delete('/api/events/nonexistent-id')
                .expect(404)
                .then(response => {
                    expect(response.body.error).toBe('Event not found');
                });
        });

        it('should handle errors when deleting an event', async () => {
            eventService.deleteEvent.mockRejectedValue(new Error('Failed to delete event'));

            await request(app)
                .delete('/api/events/eventId')
                .expect(500);

            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('registerForEvent', () => {
        it('should register a user for an event', async () => {
            const mockRsvpData: CreateRsvpInput = { status: 'attending' };
            const mockRsvp = { _id: 'rsvpId', ...mockRsvpData };
            eventService.registerForEvent.mockResolvedValue(mockRsvp as any);

            await request(app)
                .post('/api/events/eventId/rsvp')
                .send(mockRsvpData)
                .expect(200);

            expect(eventService.registerForEvent).toHaveBeenCalledWith('eventId', 'testUserId', mockRsvpData);
        });

        it('should handle errors when registering for an event', async () => {
            eventService.registerForEvent.mockRejectedValue(new Error('Failed to register'));

            await request(app)
                .post('/api/events/eventId/rsvp')
                .send({})
                .expect(400);

            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('getEventAttendees', () => {
        it('should return a list of attendees for an event', async () => {
            const mockAttendees = [{ _id: 'attendeeId', name: 'Test Attendee' }];
            eventService.getEventAttendees.mockResolvedValue(mockAttendees as any);

            const response = await request(app)
                .get('/api/events/eventId/attendees')
                .expect(200);

            expect(response.body).toEqual(mockAttendees);
            expect(eventService.getEventAttendees).toHaveBeenCalledWith('eventId');
        });

        it('should handle errors when getting event attendees', async () => {
            eventService.getEventAttendees.mockRejectedValue(new Error('Failed to get attendees'));

            await request(app)
                .get('/api/events/eventId/attendees')
                .expect(500);

            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('getEventsUserAttends', () => {
        it('should return a list of events a user is attending', async () => {
            const mockEvents = [{ _id: 'eventId', title: 'Test Event' }];
            eventService.getEventsUserAttends.mockResolvedValue(mockEvents as any);

            const response = await request(app)
                .get('/api/events/users/me/events')
                .expect(200);

            expect(response.body).toEqual(mockEvents);
            expect(eventService.getEventsUserAttends).toHaveBeenCalledWith('testUserId');
        });

        it('should handle errors when getting events a user is attending', async () => {
            eventService.getEventsUserAttends.mockRejectedValue(new Error('Failed to get user events'));

            await request(app)
                .get('/api/events/users/me/events')
                .expect(500);

            expect(logger.error).toHaveBeenCalled();
        });
    });
});
