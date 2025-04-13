import request from 'supertest';
import express, { Express } from 'express';
import { EventController } from '../../controllers/event.controller';
import { Server } from 'http';


jest.mock('../../controllers/event.controller');
jest.mock('../../middleware/authenticate.middleware', () => ({
    authenticate: (_req: any, _res: any, next: any) => {
        _req.user = { id: 'mockUserId' };
        next();
    }
}));
jest.mock('../../middleware/validate.middleware', () => ({
    validate: () => (_req: any, _res: any, next: any) => next()
}));

// import eventRoutes from '../../routes/event.routes';


describe('Event Routes', () => {
    let app: Express;
    let server: Server;
    let mockEventController: jest.Mocked<EventController>;
    // let server: ReturnType<typeof app.listen>;

    // beforeAll(() => {

    // })

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
            registerForEvent: jest.fn().mockResolvedValue({})
        } as unknown as jest.Mocked<EventController>;

        (EventController as jest.Mock).mockImplementation(() => mockEventController);

        const eventRoutes = require('../../routes/event.routes').default;
        app.use('/api/events', eventRoutes);

        server = app.listen(0);
    });

    afterEach((done) => {
        if (server) server.close(done);
        else done();
    });

    // afterAll((done) => {
    //     done();
    // });

    describe('GET /events', () => {
        it('should return events list', async () => {
            const agent = request.agent(server);
            const response = await agent
                .get('/api/events')
                .expect(200);

            expect(mockEventController.getEvents).toHaveBeenCalled();
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /events', () => {
        it('should create a new event', async () => {
            const mockEvent = {
                title: 'Test Event',
                description: 'Test Description',
                date: '2025-12-31',
                location: 'Test Location',
                category: 'workshop'
            };

            const agent = request.agent(server);
            const response = await agent
                .post('/api/events')
                .set('Authorization', 'Bearer mock-token')
                .send(mockEvent)
                .expect(201);

            expect(mockEventController.createEvent).toHaveBeenCalled();
            expect(response.body).toEqual({});
        });
    });
});