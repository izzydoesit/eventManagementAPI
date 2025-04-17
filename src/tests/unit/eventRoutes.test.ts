import request from 'supertest';
import express from 'express';
import { EventController } from '../../controllers/event.controller';
import eventRoutes from '../../routes/event.routes';

jest.mock('../../controllers/event.controller');
jest.mock('../../middleware/auth.middleware', () => ({
    authenticate: (_req: any, _res: any, next: any) => {
        _req.user = { id: 'mockUserId' };
        next();
    }
}));
jest.mock('../../middleware/validate.middleware', () => ({
    validate: () => (_req: any, _res: any, next: any) => next()
}));



describe('Event Routes', () => {
    let app: express.Application;
    let mockEventController: jest.Mocked<EventController>;

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());

        mockEventController = {
            createEvent: jest.fn().mockResolvedValue({}),
            getEvents: jest.fn().mockResolvedValue([]),
            getEventById: jest.fn().mockResolvedValue({}),
            updateEvent: jest.fn().mockResolvedValue({}),
            deleteEvent: jest.fn().mockResolvedValue(true),
            registerForEvent: jest.fn().mockResolvedValue({}),
            getEventAttendees: jest.fn().mockResolvedValue([]),
            getEventsUserAttends: jest.fn().mockResolvedValue([])
        } as unknown as jest.Mocked<EventController>;

        (EventController as jest.Mock).mockImplementation(() => mockEventController);
        
        const eventRoutes = require('../../routes/event.routes').default;
        app.use('/api/event', eventRoutes);
    });

    describe('GET /event', () => {
        it('should return events list', async () => {
            const response = await request(app)
                .get('/api/event')
                .expect(200);
            
            expect(mockEventController.getEvents).toHaveBeenCalled();
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /event', () => {
        it('should create a new event', async () => {
            const mockEvent = {
                title: 'Test Event',
                description: 'Test Description',
                date: '2025-12-31',
                location: 'Test Location',
                category: 'workshop'
            };

            const response = await request(app)
                .post('/api/event')
                .set('Authorization', 'Bearer mock-token')
                .send(mockEvent)
                .expect(201);

            expect(mockEventController.createEvent).toHaveBeenCalled();
            expect(response.body).toEqual({});
        });
    });
});