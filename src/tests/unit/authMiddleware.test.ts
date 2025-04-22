import { authenticate } from '../../middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import * as jwtUtils from '../../utils/jwt';

jest.mock('../../utils/jwt', () => ({
    verifyToken: jest.fn(),
}));

describe('Auth Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            cookies: {},
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should authenticate a valid cookie token', async () => {
        const mockToken = 'validToken';
        req.cookies = { token: mockToken };
        (jwtUtils.verifyToken as jest.Mock).mockReturnValue({ userId: 'userId' });

        await authenticate(req as Request, res as Response, next);

        expect(jwtUtils.verifyToken).toHaveBeenCalledWith(mockToken);
        expect(req.user).toEqual({ id: 'userId' });
        expect(next).toHaveBeenCalled();
    });

    it('should authenticate a valid bearer token', async () => {
        const mockToken = 'validBearerToken';
        req.headers = { authorization: `Bearer ${mockToken}` };
        (jwtUtils.verifyToken as jest.Mock).mockReturnValue({ userId: 'userId' });

        await authenticate(req as Request, res as Response, next);

        expect(jwtUtils.verifyToken).toHaveBeenCalledWith(mockToken);
        expect(req.user).toEqual({ id: 'userId' });
        expect(next).toHaveBeenCalled();
    });

    it('should return 401 for missing token', async () => {
        await authenticate(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
        const mockToken = 'invalidToken';
        req.cookies = { token: mockToken };
        (jwtUtils.verifyToken as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

        await authenticate(req as Request, res as Response, next);

        expect(jwtUtils.verifyToken).toHaveBeenCalledWith(mockToken);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
        expect(next).not.toHaveBeenCalled();
    });
});