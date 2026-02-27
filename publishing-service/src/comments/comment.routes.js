import { Router } from 'express';
import { createComment, getCommentsByPost, updateComment, deleteComment } from './comment.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateCreateComment, validateGetCommentsByPost, validateUpdateComment, validateDeleteComment } from '../../middlewares/comment-validator.js';

const router = Router();

router.get(
    '/post/:postId',
    validateGetCommentsByPost,
    getCommentsByPost
);

router.post(
    '/',
    validateJWT,
    validateCreateComment,
    createComment
);

router.put(
    '/:id',
    validateJWT,
    validateUpdateComment,
    updateComment
);

router.delete(
    '/:id',
    validateJWT,
    validateDeleteComment,
    deleteComment
);

export default router;