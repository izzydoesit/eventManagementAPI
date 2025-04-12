import { User } from '../models/user.model';
import { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types';
import { generateTokens } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';

export class AuthService {
    async register(data: RegisterData): Promise<AuthResponse> {
        const existingUser = await User.findOne({ 
            email: data.email,
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await hashPassword(data.password);
        const user = await User.create({
            ...data,
            password: hashedPassword,
        });

        const tokens = generateTokens(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            tokens,
        };
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const user = await User.findOne({
            email: credentials.email,
        });
        if (!user) {
            throw new Error('Invalid email');
        }
        const isValidPassword = await comparePasswords(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        const tokens = generateTokens(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            tokens,
        }
    }
}
