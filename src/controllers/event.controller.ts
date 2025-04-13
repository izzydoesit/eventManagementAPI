import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { CreateEventInput, UpdateEventInput } from '../schemas/event.schema';

export class EventController {
    private eventService: EventService;

    constructor(eventService?: EventService) {
        this.eventService = eventService || new EventService();
    }

    async createEvent(req: Request<{}, {}, CreateEventInput>, res: Response) {
        try {
            const event = await this.eventService.createEvent(req.body, req.user.id);
            res.status(201).json(event);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getEvents(req: Request, res: Response) {
        try {
            const events = await this.eventService.getEvents(req.query);
            res.status(200).json(events);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEventById(req: Request, res: Response) {
        try {
            const event = await this.eventService.getEventById(req.params.id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateEvent(req: Request<{ id: string }, {}, UpdateEventInput>, res: Response) {
        try {
            const event = await this.eventService.updateEvent(req.params.id, req.user.id, req.body);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteEvent(req: Request, res: Response) {
        try {
            const deleted = await this.eventService.deleteEvent(req.params.id, req.user.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async registerForEvent(req: Request, res: Response) {
        try {
            const event = await this.eventService.registerForEvent(req.params.id, req.user.id);
            res.status(200).json(event);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
