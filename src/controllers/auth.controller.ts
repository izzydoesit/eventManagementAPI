import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import logger from '../utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  async register(req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> {
    logger.info('Registering user...');
    try {
        const response = await this.authService.register(req.body);
        logger.info('User registered successfully');
        res.status(201).json(response);
    } catch (error: any) {
        logger.error(`Error registering user: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    logger.info('Logging in user');
    try {
      const response = await this.authService.login(req.body);
      logger.info('User logged in successfully');
      res.status(200).json(response);
    } catch (error: any) {
      logger.error(`Error logging in user: ${error.message}`);
      res.status(401).json({
        error: error.message || 'Invalid credentials',
      });
    }
  }

  async logout(req: Request, res: Response) {
    logger.info('Logging out user');
    try {
      res.status(200).json({
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      logger.error(`Error logging out user: ${error.message}`);
      res.status(500).json({
        error: error.message || 'An error occurred during logout',
      });
    }
  }
}
