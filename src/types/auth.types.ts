export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    tokens: AuthTokens;
}
