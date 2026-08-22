import { Router } from 'express';
import { CommunityController } from './community.controller';
import { validate } from '../../middleware/validate';
import { authenticateToken } from '../../middleware/auth';
import {
  createCommunityPostSchema,
  queryCommunityPostsSchema,
} from './community.schema';

const router = Router();

// GET /api/community and /api/community/posts (public)
router.get(
  '/',
  validate({ query: queryCommunityPostsSchema }),
  CommunityController.listPosts
);
router.get(
  '/posts',
  validate({ query: queryCommunityPostsSchema }),
  CommunityController.listPosts
);

// POST /api/community and /api/community/posts (auth required)
router.post(
  '/',
  authenticateToken,
  validate({ body: createCommunityPostSchema }),
  CommunityController.createPost
);
router.post(
  '/posts',
  authenticateToken,
  validate({ body: createCommunityPostSchema }),
  CommunityController.createPost
);

export default router;
