import { z } from 'zod';
import { TripStatus } from '../../types/models';

export const createTripSchema = z
  .object({
    name: z.string().min(1, 'Trip name is required').max(150).trim().optional(),
    title: z.string().min(1).max(150).trim().optional(), // backward-compatible alias
    description: z.string().max(2000).optional().nullable(),
    startDate: z
      .string({ required_error: 'Start date is required' })
      .datetime({ message: 'Invalid start date' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate: z
      .string({ required_error: 'End date is required' })
      .datetime({ message: 'Invalid end date' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    coverPhotoUrl: z.string().url().optional().nullable().or(z.literal('')),
    coverImage: z.string().url().optional().nullable().or(z.literal('')), // alias
    status: z.nativeEnum(TripStatus).optional().default(TripStatus.UPCOMING),
    isPublic: z.boolean().optional().default(false),
    shareSlug: z.string().max(100).optional().nullable(),
  })
  .refine((data) => !!data.name || !!data.title, {
    message: 'Trip name is required',
    path: ['name'],
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    }
  );

export const updateTripSchema = z.object({
  name: z.string().min(1).max(150).trim().optional(),
  title: z.string().min(1).max(150).trim().optional(),
  description: z.string().max(2000).optional().nullable(),
  startDate: z
    .string()
    .datetime({ message: 'Invalid start date' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  endDate: z
    .string()
    .datetime({ message: 'Invalid end date' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  coverPhotoUrl: z.string().url().optional().nullable().or(z.literal('')),
  coverImage: z.string().url().optional().nullable().or(z.literal('')),
  status: z.nativeEnum(TripStatus).optional(),
  isPublic: z.boolean().optional(),
  shareSlug: z.string().max(100).optional().nullable(),
});

export const listTripsQuerySchema = z.object({
  status: z
    .string()
    .optional()
    .transform((val) => (val ? (val.toUpperCase() as TripStatus) : undefined)),
  search: z.string().trim().optional(),
  isPublic: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 20)) : 20)),
  sortBy: z.enum(['startDate', 'createdAt', 'name']).optional().default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const tripIdParamSchema = z.object({
  id: z.string().uuid('Invalid Trip ID format'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type ListTripsQueryInput = z.infer<typeof listTripsQuerySchema>;
