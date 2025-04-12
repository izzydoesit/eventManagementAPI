import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';

// Mock AuthService
jest.mock('../../src/services/auth.service');

describe('AuthController', () => {
    let authController: AuthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockAuthService: jest.Mocked<AuthService>;

    beforeEach(() => {
        // reset mocks
        mockAuthService = new AuthService() as jest.Mocked<AuthService>;
        authController = new AuthController();

        mockRequest = {
            body: {
                email: 'test@test.com',
                password: 'password123',
                name: 'Test User',
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const expectedResponse = {
                user: {
                    id: '123',
                    email: 'test@test.com',
                    name: 'Test User'
                },
                tokens: {
                    accessToken: 'mockToken',
                    refreshToken: 'mockRefreshToken'
                }
            };

            mockAuthService.register.mockResolvedValue(expectedResponse);

            await authController.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it ('should handle registration errors', async () => {
            const errorMessage = 'Email already registered';
            mockAuthService.register.mockRejectedValue(new Error(errorMessage));

            await authController.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('login', () => {
        it('should successfully log in a user', async () => {
            const expectedResponse = {
                user: {
                    id: '123',
                    email: 'test@test.com',
                    name: 'Test User'
                },
                tokens: {
                    accessToken: 'mockToken',
                    refreshToken: 'mockRefreshToken'
                }
            };

            mockAuthService.login.mockResolvedValue(expectedResponse);

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle invalid credentials', async () => {
            const errorMessage = 'Invalid credentials';
            mockAuthService.login.mockRejectedValue(new Error(errorMessage));

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        })
    });
});