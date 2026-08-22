import { Router } from 'express';
import { StopController } from './stop.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken } from '../../middleware/auth';
import {
  createStopSchema,
  updateStopSchema,
  reorderStopsSchema,
  stopIdParamSchema,
  tripIdStopParamSchema,
} from './stop.schema';

export const stopRouter = Router();
export const tripStopsRouter = Router({ mergeParams: true });

// Routes on /api/stops/:id
stopRouter.use(authenticateToken);

stopRouter.put(
  '/:id',
  validate({ params: stopIdParamSchema, body: updateStopSchema }),
  StopController.updateStop
);

stopRouter.delete(
  '/:id',
  validate({ params: stopIdParamSchema }),
  StopController.deleteStop
);

// Routes on /api/trips/:tripId/stops
tripStopsRouter.use(authenticateToken);

tripStopsRouter.post(
  '/',
  validate({ params: tripIdStopParamSchema, body: createStopSchema }),
  StopController.createStop
);

tripStopsRouter.put(
  '/reorder',
  validate({ params: tripIdStopParamSchema, body: reorderStopsSchema }),
  StopController.reorderStops
);
