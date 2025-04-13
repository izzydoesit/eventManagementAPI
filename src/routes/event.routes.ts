import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/authenticate.middleware';
import { validate } from '../middleware/validate.middleware';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema';

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
router.post('/:id/register', eventController.registerForEvent.bind(eventController));

export default router;
