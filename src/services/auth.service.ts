import { User, IUser } from '../models/user.model';
import { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types';
import { generateTokens } from '../utils/jwt';
import { hashPassword } from '../utils/password';
import logger from '../utils/logger';

export class AuthService {
    async register(data: RegisterData): Promise<AuthResponse> {
        logger.info('Registering user...');
        const existingUser: IUser | null = await User.findOne({ 
            email: data.email,
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await hashPassword(data.password);
        const user: IUser = await User.create({
            ...data,
            password: hashedPassword,
        });

        const tokens = generateTokens(user.id.toString());

        return {
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
            },
            tokens,
        };
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const user: IUser | null = await User.findOne({
            email: credentials.email,
        });
        if (!user) {
            throw new Error('Invalid email');
        }
        
        const isValidPassword = await user.comparePassword(credentials.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        const tokens = generateTokens(user.id.toString());

        return {
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
            },
            tokens,
        };
    }
}