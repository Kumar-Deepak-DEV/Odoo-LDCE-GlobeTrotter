import { z } from 'zod';
import { Role } from '../../types/models';

export const queryUsersSchema = z.object({
  search: z.string().trim().optional(),
  role: z.nativeEnum(Role).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10) || 20)) : 20)),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid User ID format'),
});

export type QueryUsersInput = z.infer<typeof queryUsersSchema>;
