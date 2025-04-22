import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { validate } from '../../middleware/validate.middleware';

jest.mock('../../controllers/auth.controller');
jest.mock('../../middleware/validate.middleware', () => ({
    validate: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

describe('Auth Routes', () => {
    let app: express.Application;
    let mockAuthController: jest.Mocked<AuthController>;

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());

        mockAuthController = {
            register: jest.fn().mockImplementation((_req, res) => res.status(201).json({})),
            login: jest.fn().mockImplementation((_req, res) => res.status(200).json({})),
            logout: jest.fn().mockImplementation((_req, res) => res.status(200).json({}))
        } as unknown as jest.Mocked<AuthController>;
        // (validate as jest.Mock).mockImplementation(() => (req: any, res: any, next: any) => next());

        // Mock the constructor to return our mock controller
        (AuthController as jest.Mock).mockImplementation(() => mockAuthController);

        // Import routes AFTER mocking the controller
        jest.isolateModules(() => {
            const authRoutes = require('../../routes/auth.routes').default;
            app.use('/api/auth', authRoutes);
        });
    });

    describe('POST /register', () => {
        it('should route to auth controller register', async () => {
            const mockRegisterData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(mockRegisterData);

            expect(response.status).toBe(201);
            expect(mockAuthController.register).toHaveBeenCalled();
            expect(mockAuthController.register.mock.calls[0][0].body).toEqual(mockRegisterData);
        });
    });

    describe('POST /login', () => {
        it('should route to auth controller login', async () => {
            const mockLoginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(mockLoginData);

            expect(response.status).toBe(200);
            expect(mockAuthController.login).toHaveBeenCalled();
            expect(mockAuthController.login.mock.calls[0][0].body).toEqual(mockLoginData);
        });
    });

    describe('POST /logout', () => {
        it('should route to auth controller login', async () => {
            const response = await request(app)
                .post('/api/auth/logout')

            expect(response.status).toBe(200);
            expect(mockAuthController.logout).toHaveBeenCalled();
        });
    });
});
