import { z } from 'zod';

export const citySearchQuerySchema = z.object({
  q: z
    .string({ required_error: 'Query parameter q is required' })
    .min(1, 'Search query cannot be empty')
    .trim(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10) || 10)) : 10)),
});

export const popularCitiesQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10) || 6)) : 6)),
});

export type CitySearchQueryInput = z.infer<typeof citySearchQuerySchema>;
export type PopularCitiesQueryInput = z.infer<typeof popularCitiesQuerySchema>;
