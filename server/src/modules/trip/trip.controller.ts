import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';
import {
  CreateTripInput,
  UpdateTripInput,
  ListTripsQueryInput,
} from './trip.schema';

export class TripController {
  /**
   * Create a new trip 
   */
  public static async createTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const {
        name,
        title,
        description,
        startDate,
        endDate,
        coverPhotoUrl,
        coverImage,
        status,
        isPublic,
        shareSlug,
      } = req.body as CreateTripInput;

      const tripName = (name || title || 'My Trip').trim();
      const photo = coverPhotoUrl || coverImage || null;

      const trip = await prisma.trip.create({
        data: {
          userId: req.user.id,
          name: tripName,
          description: description || null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          coverPhotoUrl: photo,
          status: status || 'UPCOMING',
          isPublic: isPublic ?? false,
          shareSlug: shareSlug || (isPublic ? crypto.randomBytes(6).toString('hex') : null),
        },
        include: {
          stops: {
            orderBy: { order: 'asc' },
            include: {
              activities: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      sendSuccess(res, { trip }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List trips for the logged-in user with filters
   */
  public static async listTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { status, search, isPublic, page = 1, limit = 20, sortBy = 'startDate', sortOrder = 'asc' } =
        req.query as unknown as ListTripsQueryInput;

      const whereClause: Record<string, unknown> = {
        userId: req.user.id,
      };

      if (status) {
        whereClause.status = status;
      }

      if (isPublic !== undefined) {
        whereClause.isPublic = isPublic;
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            stops: {
              some: {
                cityName: { contains: search, mode: 'insensitive' },
              },
            },
          },
        ];
      }

      const skip = (page - 1) * limit;

      const [trips, totalCount] = await Promise.all([
        prisma.trip.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            _count: {
              select: {
                stops: true,
              },
            },
            stops: {
              select: {
                id: true,
                cityName: true,
                country: true,
                order: true,
                startDate: true,
                endDate: true,
                budget: true,
                _count: {
                  select: { activities: true },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        }),
        prisma.trip.count({ where: whereClause }),
      ]);

      sendSuccess(res, {
        trips,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trip details with all stops and nested activities
   */
  public static async getTripById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              photoUrl: true,
            },
          },
          stops: {
            orderBy: { order: 'asc' },
            include: {
              activities: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      if (!trip) {
        throw new AppError('Trip not found', 404, 'TRIP_NOT_FOUND');
      }

      // Check access permission: creator or public or admin
      if (trip.userId !== userId && !trip.isPublic && req.user?.role !== 'ADMIN') {
        throw new AppError('Access denied to private trip', 403, 'FORBIDDEN');
      }

      sendSuccess(res, { trip });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public trip by shareSlug (no auth required)
   */
  public static async getPublicTripBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      const trip = await prisma.trip.findFirst({
        where: {
          shareSlug: slug,
          isPublic: true,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
            },
          },
          stops: {
            orderBy: { order: 'asc' },
            include: {
              activities: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      if (!trip) {
        throw new AppError('Public trip not found', 404, 'TRIP_NOT_FOUND');
      }

      sendSuccess(res, { trip });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a trip
   */
  public static async updateTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;
      const data = req.body as UpdateTripInput;

      // Verify trip ownership
      const existingTrip = await prisma.trip.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existingTrip) {
        throw new AppError('Trip not found or you do not have permission to edit it', 404, 'TRIP_NOT_FOUND');
      }

      const updatePayload: Record<string, unknown> = {};

      if (data.name !== undefined) updatePayload.name = data.name;
      else if (data.title !== undefined) updatePayload.name = data.title;

      if (data.description !== undefined) updatePayload.description = data.description;
      if (data.startDate !== undefined) updatePayload.startDate = new Date(data.startDate);
      if (data.endDate !== undefined) updatePayload.endDate = new Date(data.endDate);

      if (data.coverPhotoUrl !== undefined) updatePayload.coverPhotoUrl = data.coverPhotoUrl;
      else if (data.coverImage !== undefined) updatePayload.coverPhotoUrl = data.coverImage;

      if (data.status !== undefined) updatePayload.status = data.status;
      if (data.isPublic !== undefined) {
        updatePayload.isPublic = data.isPublic;
        if (data.isPublic && !existingTrip.shareSlug) {
          updatePayload.shareSlug = crypto.randomBytes(6).toString('hex');
        }
      }
      if (data.shareSlug !== undefined) updatePayload.shareSlug = data.shareSlug;

      const updatedTrip = await prisma.trip.update({
        where: { id },
        data: updatePayload,
        include: {
          stops: {
            orderBy: { order: 'asc' },
            include: {
              activities: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      sendSuccess(res, { trip: updatedTrip });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a trip (cascading deletes stops & activities)
   */
  public static async deleteTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;

      const existingTrip = await prisma.trip.findFirst({
        where: {
          id,
          ...(req.user.role === 'ADMIN' ? {} : { userId: req.user.id }),
        },
      });

      if (!existingTrip) {
        throw new AppError('Trip not found or you do not have permission to delete it', 404, 'TRIP_NOT_FOUND');
      }

      await prisma.trip.delete({
        where: { id },
      });

      sendSuccess(res, { message: 'Trip deleted successfully', id });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Copy / Duplicate an existing trip
   */
  public static async copyTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;

      const originalTrip = await prisma.trip.findUnique({
        where: { id },
        include: {
          stops: {
            orderBy: { order: 'asc' },
            include: {
              activities: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      if (!originalTrip) {
        throw new AppError('Trip not found to duplicate', 404, 'TRIP_NOT_FOUND');
      }

      if (originalTrip.userId !== req.user.id && !originalTrip.isPublic && req.user.role !== 'ADMIN') {
        throw new AppError('Cannot copy private trip of another user', 403, 'FORBIDDEN');
      }

      // Create cloned trip in a transaction
      const clonedTrip = await prisma.$transaction(async (tx) => {
        const newTrip = await tx.trip.create({
          data: {
            userId: req.user!.id,
            name: `${originalTrip.name} (Copy)`,
            description: originalTrip.description,
            startDate: originalTrip.startDate,
            endDate: originalTrip.endDate,
            coverPhotoUrl: originalTrip.coverPhotoUrl,
            status: 'UPCOMING',
            isPublic: false,
          },
        });

        for (const stop of originalTrip.stops) {
          const newStop = await tx.stop.create({
            data: {
              tripId: newTrip.id,
              cityName: stop.cityName,
              country: stop.country,
              cityExternalId: stop.cityExternalId,
              lat: stop.lat,
              lng: stop.lng,
              startDate: stop.startDate,
              endDate: stop.endDate,
              budget: stop.budget,
              order: stop.order,
            },
          });

          if (stop.activities.length > 0) {
            await tx.activity.createMany({
              data: stop.activities.map((act) => ({
                stopId: newStop.id,
                name: act.name,
                category: act.category,
                dayNumber: act.dayNumber,
                cost: act.cost,
                costLevel: act.costLevel,
                durationMin: act.durationMin,
                notes: act.notes,
                order: act.order,
              })),
            });
          }
        }

        return tx.trip.findUnique({
          where: { id: newTrip.id },
          include: {
            stops: {
              orderBy: { order: 'asc' },
              include: {
                activities: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        });
      });

      sendSuccess(res, { trip: clonedTrip }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish a trip and generate share slug
   */
  public static async publishTrip(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { id } = req.params;

      const trip = await prisma.trip.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!trip) {
        throw new AppError('Trip not found', 404, 'TRIP_NOT_FOUND');
      }

      const shareSlug = trip.shareSlug || crypto.randomBytes(6).toString('hex');

      const updated = await prisma.trip.update({
        where: { id },
        data: {
          isPublic: true,
          shareSlug,
        },
      });

      sendSuccess(res, {
        trip: updated,
        shareSlug,
        publicUrl: `/trips/public/${shareSlug}`,
        message: 'Trip is now public and ready to share!',
      });
    } catch (error) {
      next(error);
    }
  }
}
