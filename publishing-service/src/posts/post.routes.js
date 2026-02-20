import { Router } from 'express'
import { createPost, getPosts, updatePost, deletePost } from './post.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateCreatePost, validateUpdatePost } from '../../middlewares/post-validator.js';

const router = Router();

router.get('/', getPosts);

router.post(
  '/',
  validateJWT,
  validateCreatePost,
  createPost
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
  deletePost
);

export default router;