import { Router } from 'express';
import authRoutes from '../../../../Odoo-LDCE-GlobeTrotter12/server/src/modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import tripRoutes from '../modules/trip/trip.routes';
import { stopRouter, tripStopsRouter } from '../modules/stop/stop.routes';
import { activityRouter, stopActivitiesRouter } from '../modules/activity/activity.routes';
import cityRoutes from '../modules/city/city.routes';
import budgetRoutes from '../modules/budget/budget.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import communityRoutes from '../modules/community/community.routes';
import adminRoutes from '../modules/admin/admin.routes';
import { TripController } from '../modules/trip/trip.controller';
import { validate } from '../middleware/validate';
import { slugParamSchema } from '../modules/trip/trip.schema';

export const setupRoutes = (): Router => {
  const router = Router();

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'GlobeTrotter Backend API',
      },
    });
  });

  // Public trip view endpoint alias: GET /api/public/trips/:slug
  router.get(
    '/public/trips/:slug',
    validate({ params: slugParamSchema }),
    TripController.getPublicTripBySlug
  );

  // Core feature routes
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/trips', tripRoutes);
  router.use('/trips/:tripId/stops', tripStopsRouter);
  router.use('/stops', stopRouter);
  router.use('/stops/:stopId/activities', stopActivitiesRouter);
  router.use('/activities', activityRouter);
  router.use('/cities', cityRoutes);
  router.use('/budget', budgetRoutes);
  router.use('/dashboard', dashboardRoutes);
  router.use('/community', communityRoutes);
  router.use('/admin', adminRoutes);

  return router;
};

export default setupRoutes();
