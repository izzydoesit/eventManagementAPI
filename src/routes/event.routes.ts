import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema';
import { createRsvpSchema } from '../schemas/rsvp.schema';

const router = Router();
const eventController = new EventController();

// Public routes
router.get('/', eventController.getEvents.bind(eventController));
router.get('/:id', eventController.getEventById.bind(eventController));

// Protected routes
router.use(authenticate);
router.post('/', validate(createEventSchema), eventController.createEvent.bind(eventController));
router.put('/:id', validate(updateEventSchema), eventController.updateEvent.bind(eventController));
router.delete('/:id', eventController.deleteEvent.bind(eventController));
router.post('/:id/rsvp', validate(createRsvpSchema), eventController.registerForEvent.bind(eventController));
router.get('/:id/attendees', eventController.getEventAttendees.bind(eventController));
router.get('/users/me/events', eventController.getEventsUserAttends.bind(eventController));

export default router;