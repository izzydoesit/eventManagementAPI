import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import logger from '../utils/logger';
import ApiError from '@/utils/apiError';


export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
  }

  /** 
  * @swagger 
  * /api/v1/auth/register:  
  *   post:
  *     tags:
  *       - Auth
  *      summary: Register a new user
  *     description: Register a new user with email and password
  *     requestBody:
  *      required: true
  *     content:
  *       application/json:
  *        schema:
  *         type: object
  *        properties:
  *         email:
  *         type: string
  *        example:
  *         email:
  * 
  */
  async register(req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction): Promise<void> {
    logger.info('Registering user...');
    try {
        const response = await this.authService.register(req.body);
        if (!res) {
          logger.error('User registration failed!');
          throw new ApiError('Error registering user', 400);
        }
        logger.info('User registered successfully');
        res.status(201).json({ 
          success: true,
          message: 'User registered successfully', 
          user: response.user 
        });
    } catch (error: any) {
      // passes error to centralized handler
      next(error);
    }
  }

  /*
  @swagger
  * /api/v1/auth/login:
  *   post:
  *    tags:
  *     - Auth
  *   summary: Login a user
  *   description: Login a user with email and password
  *  requestBody:
  *   required: true
  *  content:
  *   application/json:
  *    schema:
  *     type: object
  *    properties:
  *    email:
  *    type: string
  *   example:
  *    email:
  *   type: string
  *   password:
  *  type: string
  *  example:
  *   password:
  *  type: string
  *  responses:
  *   200:
  *    description: User logged in successfully
  *   content:
  *    application/json:
  *   schema:
  *   type: object
  *  properties:
  *   success:
  *  type: boolean
  *  example:
  *   success:
  *  type: boolean
  *  message:
  *  type: string
  * example:
  *  message:
  * type: string
  *  user:
  * type: object
  * properties:
  *  id:
  * type: string
  * example:
  * id:
  * type: string
  * email:
  * type: string
  * example:
  * email:
  * type: string
  * accessTokens:
  * type: object
  * properties:
  * accessToken:
  * type: string
  * example:
  * accessToken:
  * type: string
  * refreshToken:
  * type: string
  * example:
  * refreshToken:
  * type: string
  * 
  */
  async login(req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction): Promise<void> {
    logger.info('Logging in user');
    try {
      const response = await this.authService.login(req.body);
      if (!response) {
        logger.error('User login failed!');
        throw new ApiError('Error logging in user: Invalid credentials', 401);
      }
      logger.info('User logged in successfully', response.user.email);
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/auth/logout:
   *   post:
   *  tags:
   *   - Auth
   *  summary: Logout a user
   *  description: Logout a user and clear the session
   * responses:
   *  200:
   *   description: User logged out successfully
   *  content:
   *  application/json:
   *  schema:
   *  type: object
   * properties:
   *  message:
   * type: string
   * example:
   * message:
   * type: string
   * */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Logging out user');
    try {
      if (!req.user) {
        logger.error('User not found');
        throw new ApiError('User not found', 404);
      }
      if (!req.cookies.tokens) {
        logger.error('User already logged out');
        throw new ApiError('User already logged out', 400);
      }
      res.cookie('tokens', {}, {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: 'none'
      });
      if (!res) {
        logger.error('User logout failed!');
        throw new ApiError('Error logging out user', 500);
      }
      logger.info('User logged out successfully', req.user);
      res.status(200).json({
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }
}
