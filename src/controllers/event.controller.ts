import e, { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { CreateEventInput, UpdateEventInput } from '../schemas/event.schema';
import { CreateRsvpInput } from '../schemas/rsvp.schema';
import ApiError from '../utils/apiError';
import logger from '../utils/logger';


export class EventController {
    private eventService: EventService;

    constructor(eventService?: EventService) {
        this.eventService = eventService || new EventService();
    }

    async createEvent(req: Request<{}, {}, CreateEventInput>, res: Response, next: NextFunction): Promise<void> {
        logger.info('Creating event');
        try {
            if (!req.body) {
                logger.error('Event data is required');
                throw new ApiError('Event data is required', 400);
            }
            if (!req.user) {
                logger.error('Unauthorized attempt to create event!');
                throw new ApiError('Unauthorized', 401);
            }
            const event = await this.eventService.createEvent(req.body, req.user.id);
            if (!event) {
                logger.error('Error creating event');
                throw new ApiError('Error creating event', 500);
            }
            res.status(201).json(event);
        } catch (error: any) {
            logger.error(`Error creating event: ${error.message}`);
            next(error);
        }
    }

    async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info('Getting events');
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { events, total } = await this.eventService.getEvents(req.query, page, limit);
            if (!req.body) {
                logger.warn('Event data is required');
                throw new ApiError('Event data is required', 400);
            }
            if (!req.user) {
                logger.warn('No events found');
                throw new ApiError('Unauthorized', 401);
            }
            if (!events || events.length === 0) {
                logger.warn('No events found');
                throw new ApiError('No events found', 404);
            }

            logger.info(`Successfully retrieved events: ${events.length} found`);
            res.status(200).json({
                events,
                total,
                page,
                limit
            });
        } catch (error: any) {
            logger.error(`Error getting events: ${error.message}`);
            next(error);
        }
    }

    async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info(`Getting event by ID: ${req.params.id}`);
        try {
            if (!req.params.id) {
                logger.warn(`Event ID is required`);
                throw new ApiError('Event ID is required', 400);
            }
            if (req.params.id.length !== 24) {
                logger.warn(`Invalid event ID format: ${req.params.id}`);
                throw new ApiError('Invalid event ID format', 400);
            }
            if (!req.user) {
                logger.warn(`Unauthorized attempt to get event by ID: ${req.params.id}`);
                throw new ApiError('Unauthorized', 401);
            }

            const event = await this.eventService.getEventById(req.params.id);
            if (!event) {
                logger.warn(`Event not found: ${req.params.id}`);
                throw new ApiError('Event not found', 404);
            }

            logger.info(`Successfully retrieved event: ${req.params.id}`);
            res.status(200).json(event);
        } catch (error: any) {
            logger.error(`Error getting event by ID: ${error.message}`);
            next(error);
        }
    }

    async updateEvent(req: Request<{ id: string }, {}, UpdateEventInput>, res: Response, next: NextFunction): Promise<void> {
        logger.info(`Updating event: ${req.params.id}`);
        try {
            if (!req.params.id) {
                logger.warn(`Event ID is required`);
                throw new ApiError('Event ID is required', 400);
            }
            if (!req.user) {
                throw new ApiError('Unauthorized', 401);
            }

            const event = await this.eventService.updateEvent(req.params.id, req.user.id, req.body);
            if (!event) {
                logger.warn(`Event not found for update: ${req.params.id}`);
                throw new ApiError('Event not found', 404);
            }

            logger.info(`Event updated successfully: ${req.params.id}`);
            res.status(200).json(event);
        } catch (error: any) {
            logger.error(`Error updating event: ${error.message}`);
            next(error);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info(`Deleting event: ${req.params.id}`);
        try {
            if (!req.params.id) {
                logger.warn(`Event ID is required`);
                throw new ApiError('Event ID is required', 400);
            }
            if (!req.user) {
                logger.warn(`Unauthorized delete attempt: ${req.params.id}`);
                throw new ApiError('Unauthorized', 401);
            }

            const deleted = await this.eventService.deleteEvent(req.params.id, req.user.id);
            if (!deleted) {
                logger.warn(`Event not found for deletion: ${req.params.id}`);
                throw new ApiError('Event not found', 404);
            }

            logger.info(`Event deleted successfully: ${req.params.id}`);
            res.status(204).send();
        } catch (error: any) {
            logger.error(`Error deleting event: ${error.message}`);
            next(error);
        }
    }

    async registerForEvent(req: Request<{ id: string }, {}, CreateRsvpInput>, res: Response, next: NextFunction): Promise<void> {
        logger.info(`Registering for event: ${req.params.id}`);
        try {
            if (!req.params.id) {
                logger.warn(`Event ID is required`);
                throw new ApiError('Event ID is required', 400);
            }
            if (!req.body) {
                logger.warn(`Registration data is required`);
                throw new ApiError('Registration data is required', 400);
            }
            if (!req.user) {
                logger.warn(`Unauthorized registration attempt: ${req.params.id}`);
                throw new ApiError('Unauthorized', 401);
            }

            const rsvp = await this.eventService.registerForEvent(req.params.id, req.user.id, req.body);
            if (!rsvp) {
                logger.warn(`Event not found for registration: ${req.params.id}`);
                throw new ApiError('Event not found', 404);
            }

            logger.info(`Successfully registered for event: ${req.params.id}`);
            res.status(200).json(rsvp);
        } catch (error: any) {
            logger.error(`Error registering for event: ${error.message}`);
            next(error);
        }
    }

    async getEventAttendees(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info(`Getting event attendees: ${req.params.id}`);
        try {
            if (!req.params.id) {
                logger.warn(`Event ID is required`);
                throw new ApiError('Event ID is required', 400);
            }
            if (req.params.id.length !== 24) {
                logger.warn(`Invalid event ID format: ${req.params.id}`);
                throw new ApiError('Invalid event ID format', 400);
            }
            if (!req.user) {
                logger.warn(`Unauthorized attempt to get event attendees: ${req.params.id}`);
                throw new ApiError('Unauthorized', 401);
            }

            const attendees = await this.eventService.getEventAttendees(req.params.id);
            if (!attendees) {
                logger.warn(`No attendees found for event: ${req.params.id}`);
                res.status(404).json({ error: 'No attendees found' });
            }

            logger.info(`Successfully retrieved attendees for event: ${req.params.id}`);
            res.status(200).json(attendees);
        } catch (error: any) {
            logger.error(`Error getting event attendees: ${error.message}`);
            next(error);
        }
    }

    async getEventsUserAttends(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.info(`Getting events user attends: ${req.user?.id}`);
        try {
            const userId = req.user?.id;
            if (!userId) {
                logger.warn(`Unauthorized attempt to get event attendees`);
                throw new ApiError('Unauthorized', 401);
            } else {
                logger.info(`User ID: ${userId}`);
                const events = await this.eventService.getEventsUserAttends(userId);
                if (!events) {
                    logger.warn(`No events found for user: ${userId}`);
                    throw new ApiError('No events found', 404);
                }
                
                logger.info(`Successfully retrieved events for user: ${userId}`);
                res.status(200).json(events);
            }
        } catch (error: any) {
            logger.error(`Error getting events user attends: ${error.message}`);
            next(error);
        }
    }
}