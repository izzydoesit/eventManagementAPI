import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { hashPassword } from '../../utils/password';
import { generateTokens } from '../../utils/jwt';
import mongoose from 'mongoose';

jest.mock('../../models/user.model');
jest.mock('../../utils/password');
jest.mock('../../utils/jwt');

describe('AuthService', () => {
    let authService: AuthService;
    const mockUserId = new mongoose.Types.ObjectId();

    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
    });

    describe('register', () => {
        const registerData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        it('should register a new user successfully', async () => {
            const mockUser = {
                _id: mockUserId,
                id: mockUserId.toString(),
                ...registerData,
            };
            const mockHashedPassword = 'hashedPassword123';
            const mockTokens = {
                accessToken: 'mockAccessToken',
                refreshToken: 'mockRefreshToken'
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);
            (hashPassword as jest.Mock).mockResolvedValue(mockHashedPassword);
            (User.create as jest.Mock).mockResolvedValue(mockUser);
            (generateTokens as jest.Mock).mockReturnValue(mockTokens);

            const result = await authService.register(registerData);

            expect(result).toEqual({
                user: {
                    id: mockUserId.toString(),
                    name: registerData.name,
                    email: registerData.email
                },
                tokens: mockTokens
            });
        });

        it('should throw error if email already exists', async () => {
            (User.findOne as jest.Mock).mockResolvedValue({ email: registerData.email });

            await expect(authService.register(registerData))
                .rejects
                .toThrow('Email already registered');
        });
    });

    describe('login', () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should login user successfully', async () => {
            const mockUser = {
                _id: mockUserId,
                id: mockUserId.toString(),
                email: loginData.email,
                name: 'Test User',
                comparePassword: jest.fn().mockResolvedValue(true)
            };
            const mockTokens = {
                accessToken: 'mockAccessToken',
                refreshToken: 'mockRefreshToken'
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (generateTokens as jest.Mock).mockReturnValue(mockTokens);

            const result = await authService.login(loginData);

            expect(result).toEqual({
                user: {
                    id: mockUserId.toString(),
                    name: mockUser.name,
                    email: mockUser.email
                },
                tokens: mockTokens
            });
        });

        it('should throw error if user not found', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(authService.login(loginData))
                .rejects
                .toThrow('Invalid email');
        });

        it('should throw error if password is invalid', async () => {
            const mockUser = {
                comparePassword: jest.fn().mockResolvedValue(false)
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await expect(authService.login(loginData))
                .rejects
                .toThrow('Invalid password');
        });
    });
});
