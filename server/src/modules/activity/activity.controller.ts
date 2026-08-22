import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';
import {
  CreateActivityInput,
  UpdateActivityInput,
  SearchActivitiesQueryInput,
} from './activity.schema';

export class ActivityController {
  /**
   * Add an activity to a stop
   */
  public static async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { stopId } = req.params;
      const {
        name,
        category,
        dayNumber = 1,
        cost = 0,
        costLevel,
        durationMin,
        notes,
        description,
        order,
      } = req.body as CreateActivityInput;

      // Verify stop and trip ownership
      const stop = await prisma.stop.findUnique({
        where: { id: stopId },
        include: { trip: true },
      });

      if (!stop || (stop.trip.userId !== req.user.id && req.user.role !== 'ADMIN')) {
        throw new AppError('Stop not found or access denied', 404, 'STOP_NOT_FOUND');
      }

      // Calculate order if not provided
      let activityOrder = order;
      if (activityOrder === undefined) {
        const lastActivity = await prisma.activity.findFirst({
          where: { stopId },
          orderBy: { order: 'desc' },
          select: { order: true },
        });
        activityOrder = (lastActivity?.order ?? 0) + 1;
      }

      const activity = await prisma.activity.create({
        data: {
          stopId,
          name,
          category: category || null,
          dayNumber: dayNumber || 1,
          cost: cost ?? 0,
          costLevel: costLevel || null,
          durationMin: durationMin || null,
          notes: notes || description || null,
          order: activityOrder,
        },
      });

      sendSuccess(res, { activity }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an activity
   */
  public static async updateActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;
      const data = req.body as UpdateActivityInput;

      const activity = await prisma.activity.findUnique({
        where: { id },
        include: { stop: { include: { trip: true } } },
      });

      if (
        !activity ||
        (activity.stop.trip.userId !== req.user.id && req.user.role !== 'ADMIN')
      ) {
        throw new AppError('Activity not found or access denied', 404, 'ACTIVITY_NOT_FOUND');
      }

      const updatePayload: Record<string, unknown> = {};

      if (data.name !== undefined) updatePayload.name = data.name;
      if (data.category !== undefined) updatePayload.category = data.category;
      if (data.dayNumber !== undefined) updatePayload.dayNumber = data.dayNumber;
      if (data.cost !== undefined) updatePayload.cost = data.cost;
      if (data.costLevel !== undefined) updatePayload.costLevel = data.costLevel;
      if (data.durationMin !== undefined) updatePayload.durationMin = data.durationMin;
      if (data.notes !== undefined) updatePayload.notes = data.notes;
      else if (data.description !== undefined) updatePayload.notes = data.description;
      if (data.order !== undefined) updatePayload.order = data.order;

      const updated = await prisma.activity.update({
        where: { id },
        data: updatePayload,
      });

      sendSuccess(res, { activity: updated });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an activity
   */
  public static async deleteActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;

      const activity = await prisma.activity.findUnique({
        where: { id },
        include: { stop: { include: { trip: true } } },
      });

      if (
        !activity ||
        (activity.stop.trip.userId !== req.user.id && req.user.role !== 'ADMIN')
      ) {
        throw new AppError('Activity not found or access denied', 404, 'ACTIVITY_NOT_FOUND');
      }

      await prisma.activity.delete({
        where: { id },
      });

      sendSuccess(res, { message: 'Activity deleted successfully', id });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search activities across pre-seeded activities (PRD §8: GET /api/activities/search)
   */
  public static async searchActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { city, category, costLevel, q } = req.query as unknown as SearchActivitiesQueryInput;

      const whereClause: Record<string, unknown> = {};

      if (category) {
        whereClause.category = category;
      }

      if (costLevel) {
        whereClause.costLevel = costLevel;
      }

      if (q) {
        whereClause.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { notes: { contains: q, mode: 'insensitive' } },
        ];
      }

      if (city) {
        whereClause.stop = {
          cityName: { contains: city, mode: 'insensitive' },
        };
      }

      const activities = await prisma.activity.findMany({
        where: whereClause,
        take: 30,
        include: {
          stop: {
            select: {
              cityName: true,
              country: true,
            },
          },
        },
      });

      sendSuccess(res, { activities, count: activities.length });
    } catch (error) {
      next(error);
    }
  }
}
