import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

router.use(authenticateToken);

// GET /api/dashboard/stats
router.get('/stats', DashboardController.getStats);

export default router;
