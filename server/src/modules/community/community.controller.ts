import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';
import {
  CreateCommunityPostInput,
  QueryCommunityPostsInput,
} from './community.schema';

export class CommunityController {
  /**
   * List community shared trips / posts (PRD §8: GET /api/community)
   */ 
  public static async listPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, page = 1, limit = 10 } = req.query as unknown as QueryCommunityPostsInput;
      const skip = (page - 1) * limit;

      const whereClause: Record<string, unknown> = {
        isPublic: true,
      };

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

      const [publicTrips, total] = await Promise.all([
        prisma.trip.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
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
              select: {
                id: true,
                cityName: true,
                country: true,
                order: true,
                _count: {
                  select: { activities: true },
                },
              },
              orderBy: { order: 'asc' },
            },
            _count: {
              select: { stops: true },
            },
          },
        }),
        prisma.trip.count({ where: whereClause }),
      ]);

      const posts = publicTrips.map((trip) => ({
        id: trip.id,
        tripId: trip.id,
        title: trip.name,
        content: trip.description || `Explore ${trip.stops.map((s) => s.cityName).join(', ')}`,
        createdAt: trip.createdAt,
        user: trip.user,
        trip: {
          id: trip.id,
          name: trip.name,
          coverPhotoUrl: trip.coverPhotoUrl,
          startDate: trip.startDate,
          endDate: trip.endDate,
          stopsCount: trip._count.stops,
          shareSlug: trip.shareSlug,
          stops: trip.stops,
        },
      }));

      sendSuccess(res, {
        posts,
        trips: publicTrips,
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
   * Create / share trip to community (PRD §8: POST /api/community)
   */
  public static async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const { tripId, title, content } = req.body as CreateCommunityPostInput;

      // Verify trip belongs to user
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId: req.user.id },
      });

      if (!trip) {
        throw new AppError('Trip not found or you do not have permission to share it', 404, 'TRIP_NOT_FOUND');
      }

      // Mark trip as public
      const updatedTrip = await prisma.trip.update({
        where: { id: tripId },
        data: {
          isPublic: true,
          ...(title ? { name: title } : {}),
          ...(content ? { description: content } : {}),
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
          },
        },
      });

      sendSuccess(
        res,
        {
          post: {
            id: updatedTrip.id,
            tripId: updatedTrip.id,
            title: updatedTrip.name,
            content: updatedTrip.description,
            user: updatedTrip.user,
            trip: updatedTrip,
          },
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }
}
