import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { sendError, sendSuccess } from './utils/response';
import { env } from './config/env';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: env.CLIENT_URL === '*' ? '*' : [env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root landing info endpoint
  app.get('/', (_req: Request, res: Response) => {
    sendSuccess(res, {
      name: 'GlobeTrotter REST API Backend',
      version: '1.0.0',
      description: 'Full-featured travel planning and itinerary management REST API',
      documentation: {
        health: '/api/health',
        auth: '/api/auth',
        trips: '/api/trips',
        stops: '/api/stops',
        activities: '/api/activities',
        cities: '/api/cities',
        budget: '/api/trips/:id/budget',
        dashboard: '/api/dashboard/stats',
        community: '/api/community/posts',
        admin: '/api/admin',
      },
    });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // 404 Route Handler
  app.use((req: Request, res: Response) => {
    sendError(
      res,
      `Cannot ${req.method} ${req.originalUrl}. Route not found.`,
      'NOT_FOUND',
      404
    );
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};
