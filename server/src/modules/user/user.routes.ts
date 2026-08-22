import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken } from '../../middleware/auth';
import { updateProfileSchema } from '../../../../../Odoo-LDCE-GlobeTrotter12/server/src/modules/auth/auth.schema';

const router = Router();

router.use(authenticateToken);

// GET /api/users/profile, /api/users/me, /api/users/:id
router.get('/profile', UserController.getProfile);
router.get('/me', UserController.getProfile);
router.get('/:id', UserController.getProfile);

// PUT /api/users/profile, /api/users/:id
router.put('/profile', validate({ body: updateProfileSchema }), UserController.updateProfile);
router.put('/:id', validate({ body: updateProfileSchema }), UserController.updateProfile);

export default router;
