import { validate } from '../../middleware/validate.middleware';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

describe('Validation Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('should call next if validation passes', async () => {
        const schema = z.object({
            body: z.object({
                name: z.string(),
            }),
            query: z.object({}).optional(),
            params: z.object({}).optional(),
        });
        
        req.body = { name: 'Valid Name' };

        const middleware = validate(schema);
        await middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
        const schema = z.object({
            body: z.object({
                name: z.string(),
            }),
            query: z.object({}).optional(),
            params: z.object({}).optional(),
        });
        
        req.body = { name: 123 };

        const middleware = validate(schema);
        await middleware(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    it('should handle multiple validation errors', async () => {
        const schema = z.object({
            body: z.object({
                name: z.string(),
                age: z.number(),
            }),
            query: z.object({}).optional(),
            params: z.object({}).optional(),
        });
        
        req.body = { name: 123, age: 'invalid' };

        const middleware = validate(schema);
        await middleware(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    it('should handle empty request body', async () => {
        const schema = z.object({
            body: z.object({
                name: z.string(),
            }),
            query: z.object({}).optional(),
            params: z.object({}).optional(),
        });
        
        req.body = {};

        const middleware = validate(schema);
        await middleware(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    it('should validate with different data types', async () => {
        const schema = z.object({
            body: z.object({
                name: z.string(),
                age: z.number(),
                isAdult: z.boolean(),
                email: z.string().email(),
            }),
            query: z.object({}).optional(),
            params: z.object({}).optional(),
        });

        req.body = {
            name: 'John Doe',
            age: 30,
            isAdult: true,
            email: 'john.doe@example.com',
        };

        const middleware = validate(schema);
        await middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should fail validation with different data types', async () => {
        const schema = z.object({
            body: z.object({
                name: z.string(),
                age: z.number(),
                isAdult: z.boolean(),
                email: z.string().email(),
            }),
            query: z.object({}).optional(),
            params: z.object({}).optional(),
        });

        req.body = {
            name: 123,
            age: '30',
            isAdult: 'yes',
            email: 'invalid-email',
        };

        const middleware = validate(schema);
        await middleware(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});