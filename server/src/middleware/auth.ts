import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../types/models';
import { env } from '../config/env';
import { sendError } from '../utils/response';
import { prisma } from '../config/prisma';

interface JwtDecodedToken {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication token missing or invalid format', 'UNAUTHORIZED', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    sendError(res, 'Authentication token missing', 'UNAUTHORIZED', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtDecodedToken;

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, firstName: true, lastName: true },
    });

    if (!user) {
      sendError(res, 'User associated with this token no longer exists', 'UNAUTHORIZED', 401);
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as unknown as Role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 'Token has expired. Please log in again.', 'TOKEN_EXPIRED', 401);
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, 'Invalid token provided.', 'INVALID_TOKEN', 401);
      return;
    }
    sendError(res, 'Authentication failed.', 'UNAUTHORIZED', 401);
  }
};

export const optionalAuthenticateToken: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtDecodedToken;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, firstName: true, lastName: true },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role as unknown as Role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }
  } catch {
    // Ignore invalid tokens for optional auth and proceed as anonymous
  }

  next();
};

export const requireRole = (...allowedRoles: Role[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required for this action.', 'UNAUTHORIZED', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        'Forbidden. You do not have permission to perform this action.',
        'FORBIDDEN',
        403
      );
      return;
    }

    next();
  };
};
