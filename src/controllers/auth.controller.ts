import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/user.model';
import { RegisterUserInput } from '../schemas/user.schema';
import { AuthService } from '../services/auth.service';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request<{}, {}, RegisterInput>, res: Response) {
    try {
        const response = await this.authService.register(req.body);
        res.status(201).json(response);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    try {
      const response = await this.authService.login(req.body);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(401).json({
        error: error.message || 'Invalid credentials',
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Invalidate the token (if using a blacklist or similar strategy)
      res.status(200).json({
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'An error occurred during logout',
      });
    }
  }
}

// Generate JWT token
const generateToken = (user: IUserDocument): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  } as jwt.SignOptions);
};

// Format user response without sensitive data
const formatUserResponse = (user: IUserDocument) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// Register a new user
export const register = async (req: Request<{}, {}, RegisterUserInput>, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user);

    // Return user and token
    return res.status(201).json({
      message: 'User registered successfully',
      user: formatUserResponse(user),
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'An error occurred during registration' });
  }
};