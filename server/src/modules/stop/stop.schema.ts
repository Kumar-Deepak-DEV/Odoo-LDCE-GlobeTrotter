import { z } from 'zod';

export const createStopSchema = z
  .object({
    cityName: z
      .string({ required_error: 'City name is required' })
      .min(1, 'City name cannot be empty')
      .trim(),
    country: z.string().trim().optional().nullable(),
    countryName: z.string().trim().optional().nullable(), // alias
    cityExternalId: z.string().trim().optional().nullable(),
    lat: z.number().min(-90).max(90).optional().nullable(),
    lng: z.number().min(-180).max(180).optional().nullable(),
    startDate: z
      .string({ required_error: 'Start date is required' })
      .datetime({ message: 'Invalid start date' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate: z
      .string({ required_error: 'End date is required' })
      .datetime({ message: 'Invalid end date' })
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    budget: z.number().min(0, 'Budget must be non-negative').optional().default(0),
    order: z.number().int().min(0).optional(),
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    {
      message: 'Stop end date must be on or after start date',
      path: ['endDate'],
    }
  );

export const updateStopSchema = z.object({
  cityName: z.string().min(1).trim().optional(),
  country: z.string().trim().optional().nullable(),
  countryName: z.string().trim().optional().nullable(),
  cityExternalId: z.string().trim().optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
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
  budget: z.number().min(0).optional(),
  order: z.number().int().min(0).optional(),
});

export const reorderStopsSchema = z
  .object({
    stopIds: z
      .array(z.string().uuid())
      .min(1, 'At least one stop ID must be provided')
      .optional(),
    orders: z
      .array(
        z.object({
          id: z.string().uuid(),
          order: z.number().int().min(0),
        })
      )
      .optional(),
  })
  .refine((data) => !!data.stopIds || !!data.orders, {
    message: 'Either stopIds array or orders array must be provided',
    path: ['stopIds'],
  });

export const stopIdParamSchema = z.object({
  id: z.string().uuid('Invalid Stop ID format'),
});

export const tripIdStopParamSchema = z.object({
  tripId: z.string().uuid('Invalid Trip ID format'),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type ReorderStopsInput = z.infer<typeof reorderStopsSchema>;
