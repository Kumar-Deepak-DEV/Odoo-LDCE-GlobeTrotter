import { Router } from 'express';
import { ActivityController } from './activity.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken } from '../../middleware/auth';
import {
  createActivitySchema,
  updateActivitySchema,
  searchActivitiesQuerySchema,
  activityIdParamSchema,
  stopIdActivityParamSchema,
} from './activity.schema';

export const activityRouter = Router();
export const stopActivitiesRouter = Router({ mergeParams: true });

// GET /api/activities/search (public / searchable)
activityRouter.get(
  '/search',
  validate({ query: searchActivitiesQuerySchema }),
  ActivityController.searchActivities
);

// Protected routes on /api/activities/:id
activityRouter.put(
  '/:id',
  authenticateToken,
  validate({ params: activityIdParamSchema, body: updateActivitySchema }),
  ActivityController.updateActivity
);

activityRouter.delete(
  '/:id',
  authenticateToken,
  validate({ params: activityIdParamSchema }),
  ActivityController.deleteActivity
);

// Protected routes on /api/stops/:stopId/activities
stopActivitiesRouter.use(authenticateToken);

stopActivitiesRouter.post(
  '/',
  validate({ params: stopIdActivityParamSchema, body: createActivitySchema }),
  ActivityController.createActivity
);
