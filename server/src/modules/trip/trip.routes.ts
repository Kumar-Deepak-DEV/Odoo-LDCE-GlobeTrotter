import { Router } from 'express';
import { TripController } from './trip.controller';
import { BudgetController } from '../../../../../Odoo-LDCE-GlobeTrotter12/server/src/modules/budget/budget.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken, optionalAuthenticateToken } from '../../middleware/auth';
import {
  createTripSchema,
  updateTripSchema,
  listTripsQuerySchema,
  tripIdParamSchema,
  slugParamSchema,
} from './trip.schema';

const router = Router();

// Create trip
router.post(
  '/',
  authenticateToken,
  validate({ body: createTripSchema }),
  TripController.createTrip
);

// List user trips with query filter
router.get(
  '/',
  authenticateToken,
  validate({ query: listTripsQuerySchema }),
  TripController.listTrips
);

// Public trip by slug (no auth required - PRD §8: GET /api/public/trips/:slug)
router.get(
  '/public/:slug',
  validate({ params: slugParamSchema }),
  TripController.getPublicTripBySlug
);

// Get single trip details (public trips viewable without auth)
router.get(
  '/:id',
  optionalAuthenticateToken,
  validate({ params: tripIdParamSchema }),
  TripController.getTripById
);

// Update trip
router.put(
  '/:id',
  authenticateToken,
  validate({ params: tripIdParamSchema, body: updateTripSchema }),
  TripController.updateTrip
);

// Delete trip
router.delete(
  '/:id',
  authenticateToken,
  validate({ params: tripIdParamSchema }),
  TripController.deleteTrip
);

// Get trip budget breakdown (PRD §8: GET /api/trips/:id/budget)
router.get(
  '/:id/budget',
  authenticateToken,
  validate({ params: tripIdParamSchema }),
  BudgetController.getTripBudget
);

// Copy / clone trip (PRD §8: POST /api/trips/:id/copy)
router.post(
  '/:id/copy',
  authenticateToken,
  validate({ params: tripIdParamSchema }),
  TripController.copyTrip
);

// Publish trip (PRD §8: POST /api/trips/:id/publish)
router.post(
  '/:id/publish',
  authenticateToken,
  validate({ params: tripIdParamSchema }),
  TripController.publishTrip
);

router.patch(
  '/:id/publish',
  authenticateToken,
  validate({ params: tripIdParamSchema }),
  TripController.publishTrip
);

export default router;
