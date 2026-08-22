import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';
import { UpdateProfileInput } from '../auth/auth.schema';

export class UserController {
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id || req.user?.id;

      if (!targetUserId) {
        throw new AppError('Authentication required or user ID missing.', 401, 'UNAUTHORIZED');
      }

      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
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
          updatedAt: true,
          trips: {
            take: 5,
            orderBy: { startDate: 'desc' },
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
              status: true,
              coverPhotoUrl: true,
            },
          },
          _count: {
            select: {
              trips: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
      }

      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id || req.user?.id;

      if (!targetUserId) {
        throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
      }

      // Check permission: user updating their own profile or admin
      if (req.user?.id !== targetUserId && req.user?.role !== 'ADMIN') {
        throw new AppError('You do not have permission to update this profile.', 403, 'FORBIDDEN');
      }

      const { firstName, lastName, photoUrl, city, country, bio, currentPassword, newPassword } =
        req.body as UpdateProfileInput;

      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
      });

      if (!user) {
        throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
      }

      let passwordHash = user.passwordHash;
      if (newPassword) {
        if (!currentPassword) {
          throw new AppError('Current password is required to set a new password.', 400, 'PASSWORD_REQUIRED');
        }

        const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentValid) {
          throw new AppError('Current password provided is incorrect.', 400, 'INVALID_CURRENT_PASSWORD');
        }

        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(newPassword, salt);
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: {
          firstName: firstName !== undefined ? firstName : user.firstName,
          lastName: lastName !== undefined ? lastName : user.lastName,
          photoUrl: photoUrl !== undefined ? photoUrl : user.photoUrl,
          city: city !== undefined ? city : user.city,
          country: country !== undefined ? country : user.country,
          bio: bio !== undefined ? bio : user.bio,
          passwordHash,
        },
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
          updatedAt: true,
        },
      });

      sendSuccess(res, { user: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}
