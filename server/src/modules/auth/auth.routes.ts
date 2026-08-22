import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken } from '../../middleware/auth';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.schema';

const router = Router();

// POST /api/auth/register
router.post('/register', validate({ body: registerSchema }), AuthController.register);

// POST /api/auth/login
router.post('/login', validate({ body: loginSchema }), AuthController.login);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  AuthController.forgotPassword
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  AuthController.resetPassword
);

// GET /api/auth/me (JWT protected)
router.get('/me', authenticateToken, AuthController.me);

export default router;
