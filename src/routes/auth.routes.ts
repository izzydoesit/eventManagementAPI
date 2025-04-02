import express from 'express';
import { 
  register,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { 
  registerUserSchema,
} from '../schemas/user.schema';

const router = express.Router();

router.post('/register', validate(registerUserSchema), register);

export default router;