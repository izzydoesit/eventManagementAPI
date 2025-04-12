import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { AuthResponse, LoginCredentials, RegisterData } from '../../types/auth.types';
import mongoose from 'mongoose';

// Mock the entire module
jest.mock('../../services/auth.service');

describe('AuthController', () => {
    let authController: AuthController;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    const mockAuthResponse: AuthResponse = {
        user: {
            id: new mongoose.Types.ObjectId().toString(),
            name: 'Test User',
            email: 'test@example.com',
        },
        tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
        },
    };

    beforeEach(() => {
        mockAuthService = {
            register: jest.fn(),
            login: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        authController = new AuthController(mockAuthService);
        
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('register', () => {
        const registerData: RegisterData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        beforeEach(() => {
            mockRequest = {
                body: registerData,
            };
        });

        it('should successfully register a new user', async () => {
            mockAuthService.register.mockResolvedValue(mockAuthResponse);

            await authController.register(
                mockRequest as Request<{}, {}, RegisterData>,
                mockResponse as Response,
            );

            expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
        });

        it('should handle registration error when email exists', async () => {
            const errorMessage = 'Email already registered';
            mockAuthService.register.mockRejectedValue(new Error(errorMessage));

            await authController.register(
                mockRequest as Request<{}, {}, RegisterData>,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('login', () => {
        const loginCredentials: LoginCredentials = {
            email: 'test@example.com',
            password: 'password123',
        };

        beforeEach(() => {
            mockRequest = {
                body: loginCredentials,
            };
        });

        it('should successfully log in a user', async () => {
            mockAuthService.login.mockResolvedValue(mockAuthResponse);

            await authController.login(
                mockRequest as Request<{}, {}, LoginCredentials>,
                mockResponse as Response,
            );

            expect(mockAuthService.login).toHaveBeenCalledWith(loginCredentials);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
        });

        it('should handle invalid credentials', async () => {
            const errorMessage = 'Invalid email';
            mockAuthService.login.mockRejectedValue(new Error(errorMessage));

            await authController.login(
                mockRequest as Request<{}, {}, LoginCredentials>,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});