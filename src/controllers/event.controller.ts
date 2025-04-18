import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { CreateEventInput, UpdateEventInput } from '../schemas/event.schema';
import { CreateRsvpInput } from '../schemas/rsvp.schema';
import logger from '../utils/logger';

export class EventController {
    private eventService: EventService;

    constructor(eventService?: EventService) {
        this.eventService = eventService || new EventService();
    }

    async createEvent(req: Request<{}, {}, CreateEventInput>, res: Response) {
        try {
            logger.info('Creating event');
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const event = await this.eventService.createEvent(req.body, req.user.id);
            res.status(201).json(event);
        } catch (error: any) {
            logger.error(`Error creating event: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async getEvents(req: Request, res: Response) {
        try {
            logger.info('Getting events');
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { events, total } = await this.eventService.getEvents(req.query, page, limit);
            res.status(200).json({
                events,
                total,
                page,
                limit
            });
        } catch (error: any) {
            logger.error(`Error getting events: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async getEventById(req: Request, res: Response) {
        logger.info(`Getting event by ID: ${req.params.id}`);
        try {
            const event = await this.eventService.getEventById(req.params.id);
            if (!event) {
                logger.warn(`Event not found: ${req.params.id}`);
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error: any) {
            logger.error(`Error getting event by ID: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async updateEvent(req: Request<{ id: string }, {}, UpdateEventInput>, res: Response) {
        logger.info(`Updating event: ${req.params.id}`);
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const event = await this.eventService.updateEvent(req.params.id, req.user.id, req.body);
            if (!event) {
                logger.warn(`Event not found for update: ${req.params.id}`);
                return res.status(404).json({ error: 'Event not found' });
            }
            logger.info(`Event updated successfully: ${req.params.id}`);
            res.status(200).json(event);
        } catch (error: any) {
            logger.error(`Error updating event: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async deleteEvent(req: Request, res: Response) {
        logger.info(`Deleting event: ${req.params.id}`);
        try {
            if (!req.user) {
                logger.warn(`Unauthorized delete attempt: ${req.params.id}`);
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const deleted = await this.eventService.deleteEvent(req.params.id, req.user.id);
            if (!deleted) {
                logger.warn(`Event not found for deletion: ${req.params.id}`);
                return res.status(404).json({ error: 'Event not found' });
            }
            logger.info(`Event deleted successfully: ${req.params.id}`);
            res.status(204).send();
        } catch (error: any) {
            logger.error(`Error deleting event: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async registerForEvent(req: Request<{ id: string }, {}, CreateRsvpInput>, res: Response) {
        logger.info(`Registering for event: ${req.params.id}`);
        try {
            if (!req.user) {
                logger.warn(`Unauthorized registration attempt: ${req.params.id}`);
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const rsvp = await this.eventService.registerForEvent(req.params.id, req.user.id, req.body);
            logger.info(`Successfully registered for event: ${req.params.id}`);
            res.status(200).json(rsvp);
        } catch (error: any) {
            logger.error(`Error registering for event: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    }

    async getEventAttendees(req: Request, res: Response): Promise<void> {
        logger.info(`Getting event attendees: ${req.params.id}`);
        try {
            const attendees = await this.eventService.getEventAttendees(req.params.id);

            if (!attendees) {
                logger.warn(`No attendees found for event: ${req.params.id}`);
                res.status(404).json({ error: 'No attendees found' });
            }
            logger.info(`Successfully retrieved attendees for event: ${req.params.id}`);
            res.status(200).json(attendees);
        } catch (error: any) {
            logger.error(`Error getting event attendees: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async getEventsUserAttends(req: Request, res: Response): Promise<void> {
        logger.info(`Getting events user attends: ${req.user?.id}`);
        try {
            const userId = req.user?.id;
            if (!userId) {
                logger.warn(`Unauthorized attempt to get event attendees`);
                res.status(401).json({ error: 'Unauthorized' });
            } else {
                logger.info(`User ID: ${userId}`);
                const events = await this.eventService.getEventsUserAttends(userId);
                if (!events) {
                    logger.warn(`No events found for user: ${userId}`);
                    res.status(404).json({ error: 'No events found' });
                }
                logger.info(`Successfully retrieved events for user: ${userId}`);
                res.status(200).json(events);
            }
        } catch (error: any) {
            logger.error(`Error getting events user attends: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}