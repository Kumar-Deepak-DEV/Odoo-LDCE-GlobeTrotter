import { z } from 'zod';

export const createCommunityPostSchema = z.object({
  tripId: z.string().uuid('Valid Trip ID is required'),
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(150, 'Title cannot exceed 150 characters')
    .trim(),
  content: z
    .string({ required_error: 'Content is required' })
    .min(1, 'Content cannot be empty')
    .max(5000)
    .trim(),
});

export const queryCommunityPostsSchema = z.object({
  search: z.string().trim().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(1, parseInt(val, 10) || 1) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(50, Math.max(1, parseInt(val, 10) || 10)) : 10)),
});

export const communityPostIdParamSchema = z.object({
  id: z.string().uuid('Invalid Post ID format'),
});

export type CreateCommunityPostInput = z.infer<typeof createCommunityPostSchema>;
export type QueryCommunityPostsInput = z.infer<typeof queryCommunityPostsSchema>;
