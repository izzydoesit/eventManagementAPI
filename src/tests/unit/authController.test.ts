
import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user.model';
import bcrypt from 'bcrypt';
import { AuthController } from '../../controllers/auth.controller';

jest.mock('../../models/user.model');
jest.mock('bcrypt');


describe('AuthController', () => {
    let authController: AuthController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
        next = jest.fn();
        authController = new AuthController();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const mockUserData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            req.body = mockUserData;
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (User.create as jest.Mock).mockResolvedValue({ ...mockUserData, password: 'hashedPassword' });

            await authController.register(req as Request, res as Response);

            expect(User.create).toHaveBeenCalledWith({
                ...mockUserData,
                password: 'hashedPassword'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({message: "User registered successfully", 
                user: { name: mockUserData.name, email: mockUserData.email }});
        });

        it('should handle errors during registration', async () => {
            const mockUserData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            req.body = mockUserData;
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (User.create as jest.Mock).mockRejectedValue(new Error('Registration failed'));

            await authController.register(req as Request, res as Response);

            expect(User.create).toHaveBeenCalledWith({
                ...mockUserData,
                password: 'hashedPassword'
            });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
        });

        it('should validate registration schema', async () => {
            const mockUserData = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123'
            };
            req.body = mockUserData;

            await authController.register(req as Request, res as Response);
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
        });
    });

    describe('login', () => {

        it('should log in an existing user', async () => {
            const mockUserData = {
                email: 'test@example.com',
                password: 'password123'
            };
            req.body = mockUserData;
        
            const mockResponse = {
                user: {
                    id: 'mockUserId',
                    name: 'Test User',
                    email: 'test@example.com'
                },
                tokens: {
                    accessToken: 'mockAccessToken',
                    refreshToken: 'mockRefreshToken'
                }
            };
        
            // Mock the service method
            (authController as any).authService.login = jest.fn().mockResolvedValue(mockResponse);
        
            await authController.login(req as Request, res as Response);
        
            expect((authController as any).authService.login).toHaveBeenCalledWith(mockUserData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
        });

        it('should handle incorrect email', async () => {
            const mockUserData = {
            email: 'test@example.com',
            password: 'password123'
            };
            req.body = mockUserData;
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await authController.login(req as Request, res as Response);

            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email' });
        });

        it('should handle incorrect password', async () => {
            const mockUserData = {
                email: 'test@example.com',
                password: 'password123'
            };
            req.body = mockUserData;

            (authController as any).authService = {
                login: jest.fn().mockRejectedValue(new Error('Invalid credentials'))
            };

            const mockUser = {
                _id: 'userId',
                name: 'Test User',
                email: mockUserData.email,
                password: 'hashedPassword'
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await authController.login(req as Request, res as Response);

            expect((authController as any).authService.login).toHaveBeenCalledWith(mockUserData);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });

        it('should handle errors during login', async () => {
            const mockUserData = {
                email: 'test@example.com',
                password: 'password123'
            };
            req.body = mockUserData;
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Login failed'));

            await authController.login(req as Request, res as Response);

            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
        });

        it('should validate login schema', async () => {
            const mockUserData = {
            email: 'invalid-email',
            password: 'password123'
            };
            req.body = mockUserData;

            (authController as any).authService = {
                login: jest.fn().mockRejectedValue(new Error('Login failed'))
            };

            await authController.login(req as Request, res as Response);
            
            expect((authController as any).authService.login).toHaveBeenCalledWith(mockUserData);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
        });
    });

    describe('logout', () => {
        it('should log out a user', async () => {
            await authController.logout(req as Request, res as Response);

            expect(res.cookie).toHaveBeenCalledWith('token', '', {
                httpOnly: true,
                expires: new Date(0),
                secure: true,
                sameSite: 'none'
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
        });
    });

    describe('RSVP', () => {
        it('should register a new user', async () => {
            const mockUserData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            req.body = mockUserData;
        
            
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            
            (User.create as jest.Mock).mockResolvedValue({ ...mockUserData, password: 'hashedPassword' });
        
            await authController.register(req as Request, res as Response);
        
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                ...mockUserData,
                password: 'hashedPassword'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                user: { name: mockUserData.name, email: mockUserData.email }
            });
        });

        it('should handle errors during registration', async () => {
            const mockUserData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            req.body = mockUserData;
        
            // Mock bcrypt.hash to return a fake hashed password
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            // Mock User.create to throw an error
            (User.create as jest.Mock).mockRejectedValue(new Error('Registration failed'));
        
            await authController.register(req as Request, res as Response);
        
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                ...mockUserData,
                password: 'hashedPassword'
            });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
        });
    })
});