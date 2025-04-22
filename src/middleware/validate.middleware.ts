import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject<any>) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: error.errors,
                });
            }
            return res.status(500).json({
                message: 'Internal server error',
                error: error.message,
            });
        }
    };