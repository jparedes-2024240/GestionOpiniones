import { Router } from 'express'
import { createPost, getPosts, getPostById, updatePost, deletePost } from './post.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateCreatePost, validateGetPostsQuery, validateGetPostById, validateUpdatePost, validateDeletePost } from '../../middlewares/post-validator.js';

const router = Router();

router.post(
  '/',
  validateJWT,
  validateCreatePost,
  createPost
);

router.get(
  '/',
  validateGetPostsQuery,
  getPosts
);

router.get(
  '/:id',
  validateGetPostById,
  getPostById
);

router.put(
  '/:id',
  validateJWT,
  validateUpdatePost,
  updatePost
);

router.delete(
  '/:id',
  validateJWT,
  validateDeletePost,
  deletePost
);

export default router;