import { z } from 'zod';
import { ActivityCategory, CostLevel } from '../../types/models';

export const createActivitySchema = z.object({
  name: z
    .string({ required_error: 'Activity name is required' })
    .min(1, 'Name cannot be empty')
    .max(150, 'Name cannot exceed 150 characters')
    .trim(),
  category: z
    .nativeEnum(ActivityCategory)
    .optional()
    .nullable(),
  dayNumber: z.number().int().min(1, 'Day number must be at least 1').optional().default(1),
  cost: z.number().min(0, 'Cost must be non-negative').optional().default(0),
  costLevel: z.nativeEnum(CostLevel).optional().nullable(),
  durationMin: z.number().int().min(0).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  description: z.string().max(2000).optional().nullable(), // alias for notes
  order: z.number().int().min(0).optional().default(0),
});

export const updateActivitySchema = z.object({
  name: z.string().min(1).max(150).trim().optional(),
  category: z.nativeEnum(ActivityCategory).optional().nullable(),
  dayNumber: z.number().int().min(1).optional(),
  cost: z.number().min(0).optional(),
  costLevel: z.nativeEnum(CostLevel).optional().nullable(),
  durationMin: z.number().int().min(0).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  order: z.number().int().min(0).optional(),
});

export const searchActivitiesQuerySchema = z.object({
  city: z.string().trim().optional(),
  category: z.nativeEnum(ActivityCategory).optional(),
  costLevel: z.nativeEnum(CostLevel).optional(),
  q: z.string().trim().optional(),
});

export const activityIdParamSchema = z.object({
  id: z.string().uuid('Invalid Activity ID format'),
});

export const stopIdActivityParamSchema = z.object({
  stopId: z.string().uuid('Invalid Stop ID format'),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type SearchActivitiesQueryInput = z.infer<typeof searchActivitiesQuerySchema>;
