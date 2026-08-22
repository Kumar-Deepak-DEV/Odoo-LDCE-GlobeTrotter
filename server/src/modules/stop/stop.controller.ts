import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';
import {
  CreateStopInput,
  UpdateStopInput,
  ReorderStopsInput,
} from './stop.schema';

export class StopController {
  /** 
   * Add a stop to a trip
   */
  public static async createStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { tripId } = req.params;
      const {
        cityName,
        country,
        countryName,
        cityExternalId,
        lat,
        lng,
        startDate,
        endDate,
        budget,
        order,
      } = req.body as CreateStopInput;

      // Verify trip exists and belongs to user
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId: req.user.id },
      });

      if (!trip) {
        throw new AppError('Trip not found or access denied', 404, 'TRIP_NOT_FOUND');
      }

      // Calculate next order if not explicitly specified
      let stopOrder = order;
      if (stopOrder === undefined) {
        const lastStop = await prisma.stop.findFirst({
          where: { tripId },
          orderBy: { order: 'desc' },
          select: { order: true },
        });
        stopOrder = (lastStop?.order ?? 0) + 1;
      }

      const stop = await prisma.stop.create({
        data: {
          tripId,
          cityName,
          country: country || countryName || null,
          cityExternalId: cityExternalId || null,
          lat: lat ?? null,
          lng: lng ?? null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          budget: budget ?? 0,
          order: stopOrder,
        },
        include: {
          activities: {
            orderBy: { order: 'asc' },
          },
        },
      });

      sendSuccess(res, { stop }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a stop
   */
  public static async updateStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;
      const data = req.body as UpdateStopInput;

      const stop = await prisma.stop.findUnique({
        where: { id },
        include: { trip: true },
      });

      if (!stop || (stop.trip.userId !== req.user.id && req.user.role !== 'ADMIN')) {
        throw new AppError('Stop not found or access denied', 404, 'STOP_NOT_FOUND');
      }

      const updatePayload: Record<string, unknown> = {};

      if (data.cityName !== undefined) updatePayload.cityName = data.cityName;
      if (data.country !== undefined) updatePayload.country = data.country;
      else if (data.countryName !== undefined) updatePayload.country = data.countryName;

      if (data.cityExternalId !== undefined) updatePayload.cityExternalId = data.cityExternalId;
      if (data.lat !== undefined) updatePayload.lat = data.lat;
      if (data.lng !== undefined) updatePayload.lng = data.lng;
      if (data.startDate !== undefined) updatePayload.startDate = new Date(data.startDate);
      if (data.endDate !== undefined) updatePayload.endDate = new Date(data.endDate);
      if (data.budget !== undefined) updatePayload.budget = data.budget;
      if (data.order !== undefined) updatePayload.order = data.order;

      const updatedStop = await prisma.stop.update({
        where: { id },
        data: updatePayload,
        include: {
          activities: {
            orderBy: { order: 'asc' },
          },
        },
      });

      sendSuccess(res, { stop: updatedStop });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a stop
   */
  public static async deleteStop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;

      const stop = await prisma.stop.findUnique({
        where: { id },
        include: { trip: true },
      });

      if (!stop || (stop.trip.userId !== req.user.id && req.user.role !== 'ADMIN')) {
        throw new AppError('Stop not found or access denied', 404, 'STOP_NOT_FOUND');
      }

      await prisma.stop.delete({
        where: { id },
      });

      sendSuccess(res, { message: 'Stop deleted successfully', id });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder stops in a trip
   */
  public static async reorderStops(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { tripId } = req.params;
      const { stopIds, orders } = req.body as ReorderStopsInput;

      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId: req.user.id },
      });

      if (!trip) {
        throw new AppError('Trip not found or access denied', 404, 'TRIP_NOT_FOUND');
      }

      // Reorder using transaction
      await prisma.$transaction(async (tx) => {
        if (stopIds && stopIds.length > 0) {
          for (let index = 0; index < stopIds.length; index++) {
            await tx.stop.update({
              where: { id: stopIds[index] },
              data: { order: index + 1 },
            });
          }
        } else if (orders && orders.length > 0) {
          for (const item of orders) {
            await tx.stop.update({
              where: { id: item.id },
              data: { order: item.order },
            });
          }
        }
      });

      const updatedStops = await prisma.stop.findMany({
        where: { tripId },
        orderBy: { order: 'asc' },
        include: {
          activities: {
            orderBy: { order: 'asc' },
          },
        },
      });

      sendSuccess(res, { stops: updatedStops });
    } catch (error) {
      next(error);
    }
  }
}
