import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthTokens } from '../types/auth.types';

export const generateTokens = (userId: string): AuthTokens => {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
        algorithm: env.JWT_ALGORITHM,
    });

    const refreshToken = jwt.sign({ userId }, env.JWT_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
        algorithm: env.JWT_ALGORITHM,
    });
    return { accessToken, refreshToken };
}