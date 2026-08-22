import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';

export class DashboardController {
  /**
   * Get dashboard statistics for current user (PRD §8: GET /api/dashboard/stats)
   */
  public static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const userId = req.user.id;
      const now = new Date();

      // Parallel queries for user stats
      const [
        totalTrips, 
        upcomingTrips,
        ongoingTrips,
        completedTrips,
        tripsWithStopsAndActivities,
        nextTrip,
        recentTrips,
      ] = await Promise.all([
        prisma.trip.count({ where: { userId } }),
        prisma.trip.count({ where: { userId, status: 'UPCOMING' } }),
        prisma.trip.count({ where: { userId, status: 'ONGOING' } }),
        prisma.trip.count({ where: { userId, status: 'COMPLETED' } }),
        prisma.trip.findMany({
          where: { userId },
          select: {
            stops: {
              select: {
                budget: true,
                activities: {
                  select: {
                    cost: true,
                  },
                },
              },
            },
          },
        }),
        prisma.trip.findFirst({
          where: {
            userId,
            startDate: { gte: now },
            status: { in: ['UPCOMING', 'ONGOING'] },
          },
          orderBy: { startDate: 'asc' },
          include: {
            stops: {
              orderBy: { order: 'asc' },
              take: 3,
            },
            _count: {
              select: { stops: true },
            },
          },
        }),
        prisma.trip.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          take: 4,
          include: {
            _count: {
              select: { stops: true },
            },
            stops: {
              take: 3,
              select: {
                cityName: true,
                country: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        }),
      ]);

      // Calculate totals
      let totalEstimatedBudget = 0;
      let totalActivities = 0;
      let totalStops = 0;

      for (const trip of tripsWithStopsAndActivities) {
        totalStops += trip.stops.length;
        for (const stop of trip.stops) {
          totalEstimatedBudget += Number(stop.budget) || 0;
          totalActivities += stop.activities.length;
        }
      }

      // Calculate days until next trip
      let nextTripDays: number | null = null;
      if (nextTrip) {
        const diffMs = new Date(nextTrip.startDate).getTime() - now.getTime();
        nextTripDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }

      sendSuccess(res, {
        stats: {
          totalTrips,
          upcomingCount: upcomingTrips,
          ongoingCount: ongoingTrips,
          completedCount: completedTrips,
          totalEstimatedBudget: Math.round(totalEstimatedBudget * 100) / 100,
          totalStops,
          totalActivities,
          nextTrip: nextTrip
            ? {
                id: nextTrip.id,
                name: nextTrip.name,
                startDate: nextTrip.startDate,
                endDate: nextTrip.endDate,
                daysRemaining: nextTripDays,
                stopsCount: (nextTrip as unknown as { _count: { stops: number } })._count.stops,
                coverPhotoUrl: nextTrip.coverPhotoUrl,
              }
            : null,
          recentTrips: recentTrips.map((t) => ({
            id: t.id,
            name: t.name,
            startDate: t.startDate,
            endDate: t.endDate,
            status: t.status,
            coverPhotoUrl: t.coverPhotoUrl,
            stopsCount: (t as unknown as { _count: { stops: number } })._count.stops,
            cities: t.stops.map((s) => s.cityName),
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
