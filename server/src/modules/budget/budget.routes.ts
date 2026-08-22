import { Router } from 'express';
import { BudgetController } from './budget.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken } from '../../middleware/auth';
import { tripIdParamSchema } from '../trip/trip.schema';

const router = Router();

router.use(authenticateToken);

// GET /api/budget/:id or /api/trips/:id/budget
router.get('/:id', validate({ params: tripIdParamSchema }), BudgetController.getTripBudget);
router.get('/trips/:id', validate({ params: tripIdParamSchema }), BudgetController.getTripBudget);

export default router;
