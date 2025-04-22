import { Request, Response, NextFunction } from 'express';
import * as jwtUtils from '../utils/jwt';
import logger from '../utils/logger';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logger.info('Authenticating user...');
        const authHeader = req.headers.authorization;
        let token = req.cookies?.token;
        
        if (!token && authHeader?.startsWith('Bearer ')) {
            logger.info('Extracting token from Authorization header');
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            logger.warn('Authentication failed: No token provided');
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        } 

        logger.info('Verifying token...');
        const decoded = jwtUtils.verifyToken(token);
        
        req.user = {
            id: decoded.userId
        };
        logger.info('Token verified successfully, user authenticated:', req.user);

        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
};
