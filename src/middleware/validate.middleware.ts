import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import ApiError from '../utils/apiError';

export const validate = (schema: ZodObject<any>, property: 'body' | 'query' | 'params' = 'body') => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await schema.parseAsync(req[property]);
            if (!result.success) {
                if (result.error instanceof ZodError) {
                    return next(new ApiError('Validation Error', 400));
                }
                return next(new ApiError(`Validation Error: ${result.error.errors}`, 400));
            }

            req[property] = result.data; // This is the sanitized and typed input
            next();
        } catch (error: any) {
            next(error);
        }
    };