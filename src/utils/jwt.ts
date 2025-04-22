import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthTokens } from '../types/auth.types';

type JwtPayload = {
    userId: string;
};

export const generateTokens = (userId: string): AuthTokens => {
    const jwtSecret: Secret = env.JWT_SECRET;
    const payload: JwtPayload = { userId };
    
    const accessTokenOptions: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        algorithm: env.JWT_ALGORITHM
    };

    const refreshTokenOptions: SignOptions = {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        algorithm: env.JWT_ALGORITHM
    };

    const accessToken = jwt.sign(payload, jwtSecret, accessTokenOptions);
    const refreshToken = jwt.sign(payload, jwtSecret, refreshTokenOptions);

    return {
        accessToken,
        refreshToken
    };
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
