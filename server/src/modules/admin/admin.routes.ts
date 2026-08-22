import { Router } from 'express';
import { AdminController } from './admin.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken, requireRole } from '../../middleware/auth';
import { queryUsersSchema, userIdParamSchema } from './admin.schema';
import { Role } from '../../types/models';

const router = Router();

// Restrict all admin routes to authenticated ADMIN users
router.use(authenticateToken);
router.use(requireRole(Role.ADMIN));

// GET /api/admin/users
router.get('/users', validate({ query: queryUsersSchema }), AdminController.listUsers);

// GET /api/admin/stats
router.get('/stats', AdminController.getSystemStats);

// DELETE /api/admin/users/:id and /api/admin/:id
router.delete('/users/:id', validate({ params: userIdParamSchema }), AdminController.deleteUser);
router.delete('/:id', validate({ params: userIdParamSchema }), AdminController.deleteUser);

export default router;
