import express from 'express';
import { 
  AuthController
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { 
  registerUserSchema,
} from '../schemas/user.schema';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';

const router = express.Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;