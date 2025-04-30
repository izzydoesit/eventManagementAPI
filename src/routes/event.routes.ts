import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema';
import { createRsvpSchema } from '../schemas/rsvp.schema';

const router = Router();
const eventController = new EventController();


// -------> PUBLIC ROUTES <--------- */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', eventController.getEvents.bind(eventController));
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the event to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.get('/:id', eventController.getEventById.bind(eventController));


// -------> PROTECTED ROUTES <--------- */

router.use(authenticate);
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: The created event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.post('/', validate(createEventSchema), eventController.createEvent.bind(eventController));
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The updated event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.put('/:id', validate(updateEventSchema), eventController.updateEvent.bind(eventController));
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:id', eventController.deleteEvent.bind(eventController));
/**
 * @swagger
 * /events/{id}/rsvp:
 *   post:
 *     summary: RSVP to an event
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the event to RSVP to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rsvp'
 *     responses:
 *       201:
 *         description: The RSVP object
 */
router.post('/:id/rsvp', validate(createRsvpSchema), eventController.registerForEvent.bind(eventController));
/**
 * @swagger
 * /events/{id}/attendees:
 *   get:
 *     summary: Get attendees of an event
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the event to get attendees for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of attendees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/:id/attendees', eventController.getEventAttendees.bind(eventController));
/**
 * @swagger
 * /events/me:
 *   get:
 *     summary: Get events the user is attending
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events the user is attending
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/users/me/events', eventController.getEventsUserAttends.bind(eventController));

export default router;