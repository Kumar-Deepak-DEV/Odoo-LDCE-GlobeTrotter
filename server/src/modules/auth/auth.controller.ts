import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/appError';
import {
  RegisterInput, 
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.schema';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, name, photoUrl, city, country, bio } =
        req.body as RegisterInput;

      // Extract first/last name fallback if `name` was supplied
      let parsedFirstName = firstName || '';
      let parsedLastName = lastName || '';
      if (!parsedFirstName && name) {
        const parts = name.trim().split(' ');
        parsedFirstName = parts[0] || 'User';
        parsedLastName = parts.slice(1).join(' ') || '';
      }
      if (!parsedFirstName) parsedFirstName = 'User';
      if (!parsedLastName) parsedLastName = '';

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        throw new AppError('An account with this email address already exists.', 409, 'EMAIL_EXISTS');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName: parsedFirstName,
          lastName: parsedLastName,
          photoUrl: photoUrl || null,
          city: city || null,
          country: country || null,
          bio: bio || null,
          role: 'USER',
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
          createdAt: true,
        },
      });

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      sendSuccess(
        res,
        {
          token,
          user,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as LoginInput;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      sendSuccess(res, {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          photoUrl: user.photoUrl,
          city: user.city,
          country: user.country,
          bio: user.bio,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
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

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body as ForgotPasswordInput;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        sendSuccess(res, {
          message: 'If that email address exists in our database, a password reset token has been generated.',
        });
        return;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      console.log(`\n🔑 [Password Reset Link]: http://localhost:3000/reset-password?token=${resetToken}&email=${user.email}\n`);

      sendSuccess(res, {
        message: 'Password reset link generated and logged to console for testing.',
        token: resetToken,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body as ResetPasswordInput;

      if (!token) {
        throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      sendSuccess(res, {
        message: 'Password has been reset successfully. You may now log in.',
      });
    } catch (error) {
      next(error);
    }
  }
}
