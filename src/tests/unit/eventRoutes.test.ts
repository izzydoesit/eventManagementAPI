import request from 'supertest';
import express from 'express';
import eventRoutes from '../../routes/event.routes';

jest.mock('mongoose')

jest.mock('../../controllers/event.controller', () => {
  return {
    EventController: jest.fn().mockImplementation(() => ({
      getEvents: jest.fn((req, res) => res.status(200).json([{ id: '1', title: 'Event 1' }])),
      getEventById: jest.fn((req, res) => res.status(200).json({ id: req.params.id, title: 'Event' })),
      createEvent: jest.fn((req, res) => res.status(201).json({ id: '2', ...req.body })),
      updateEvent: jest.fn((req, res) => res.status(200).json({ id: req.params.id, ...req.body })),
      deleteEvent: jest.fn((req, res) => res.status(200).json({ message: 'Event deleted' })),
      registerForEvent: jest.fn((req, res) => res.status(200).json({ message: 'RSVP registered' })),
      getEventAttendees: jest.fn((req, res) => res.status(200).json([{ userId: 'u1' }])),
      getEventsUserAttends: jest.fn((req, res) => res.status(200).json([{ id: '1', title: 'Event 1' }])),
    })),
  };
});

jest.mock('../../middleware/auth.middleware', () => ({
  authenticate: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../../middleware/validate.middleware', () => ({
  validate: () => (_req: any, _res: any, next: any) => next(),
}));

describe.skip('Event Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/event', eventRoutes);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('GET /api/event should return events', async () => {
    const res = await request(app).get('/api/event');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1', title: 'Event 1' }]);
  });

  it('GET /api/event/:id should return event by id', async () => {
    const res = await request(app).get('/api/event/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '123', title: 'Event' });
  });

  it('POST /api/event should create event', async () => {
    const res = await request(app)
      .post('/api/event')
      .send({ title: 'New Event' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'New Event' });
  });

  it('PUT /api/event/:id should update event', async () => {
    const res = await request(app)
      .put('/api/event/123')
      .send({ title: 'Updated Event' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: '123', title: 'Updated Event' });
  });

  it('DELETE /api/event/:id should delete event', async () => {
    const res = await request(app).delete('/api/event/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Event deleted' });
  });

  it('POST /api/event/:id/rsvp should register RSVP', async () => {
    const res = await request(app)
      .post('/api/event/123/rsvp')
      .send({ status: 'attending' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'RSVP registered' });
  });

  it('GET /api/event/:id/attendees should get attendees', async () => {
    const res = await request(app).get('/api/event/123/attendees');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ userId: 'u1' }]);
  });

  it('GET /api/event/users/me/events should get user events', async () => {
    const res = await request(app).get('/api/event/users/me/events');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1', title: 'Event 1' }]);
  });
});