import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
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
