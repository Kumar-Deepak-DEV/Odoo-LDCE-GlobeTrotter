import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';
import { QueryUsersInput } from './admin.schema';

export class AdminController {
  /**
   * List all registered users (Admin only - PRD §8: GET /api/admin/users)
   */
  public static async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, role, page = 1, limit = 20 } = req.query as unknown as QueryUsersInput;
      const skip = (page - 1) * limit;

      const whereClause: Record<string, unknown> = {
        ...(role ? { role } : {}),
        ...(search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            photoUrl: true,
            city: true,
            country: true,
            bio: true,
            createdAt: true,
            _count: {
              select: {
                trips: true,
              },
            },
          },
        }),
        prisma.user.count({ where: whereClause }),
      ]);

      sendSuccess(res, {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Platform-wide system stats (Admin only - PRD §8: GET /api/admin/stats)
   */
  public static async getSystemStats(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [
        totalUsers,
        newUsersLast7Days,
        totalTrips,
        tripsCreatedLast7Days,
        totalStops,
        totalActivities,
        allTrips,
        allStops,
        allActivities,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.trip.count(),
        prisma.trip.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.stop.count(),
        prisma.activity.count(),
        prisma.trip.findMany({
          select: {
            startDate: true,
            endDate: true,
            stops: {
              select: {
                budget: true,
              },
            },
          },
        }),
        prisma.stop.findMany({
          select: {
            cityName: true,
          },
        }),
        prisma.activity.findMany({
          select: {
            name: true,
            category: true,
            cost: true,
          },
        }),
      ]);

      // Top 5 Cities
      const cityCounts: Record<string, number> = {};
      for (const stop of allStops) {
        cityCounts[stop.cityName] = (cityCounts[stop.cityName] || 0) + 1;
      }
      const topCities = Object.entries(cityCounts)
        .map(([cityName, count]) => ({ cityName, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
 
      // Top 5 Activities
      const actCounts: Record<string, number> = {};
      for (const act of allActivities) {
        actCounts[act.name] = (actCounts[act.name] || 0) + 1;
      }
      const topActivities = Object.entries(actCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Category Distribution (Pie Chart)
      const categoryDistribution: Record<string, number> = {};
      for (const act of allActivities) {
        const cat = act.category || 'OTHER';
        categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
      }

      // Average Duration & Budget
      let totalDurationDays = 0;
      let totalBudgetSum = 0;
      for (const t of allTrips) {
        const duration = Math.max(
          1,
          Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24))
        );
        totalDurationDays += duration;
        for (const s of t.stops) {
          totalBudgetSum += Number(s.budget) || 0;
        }
      }

      const averageTripDuration =
        allTrips.length > 0 ? Math.round((totalDurationDays / allTrips.length) * 10) / 10 : 0;
      const averageBudgetPerTrip =
        allTrips.length > 0 ? Math.round((totalBudgetSum / allTrips.length) * 100) / 100 : 0;

      sendSuccess(res, {
        stats: {
          totalUsers,
          newUsersLast7Days,
          totalTrips,
          tripsCreatedLast7Days,
          totalStops,
          totalActivities,
          topCities,
          topActivities,
          averageTripDuration,
          averageBudgetPerTrip,
          categoryDistribution: Object.entries(categoryDistribution).map(([category, count]) => ({
            category,
            count,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user by ID (Admin only)
   */
  public static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (req.user?.id === id) {
        throw new AppError('Admin cannot delete their own account', 400, 'CANNOT_DELETE_SELF');
      }

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      await prisma.user.delete({
        where: { id },
      });

      sendSuccess(res, { message: 'User deleted successfully', id });
    } catch (error) {
      next(error);
    }
  }
}
