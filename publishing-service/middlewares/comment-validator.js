import { body, param, query } from 'express-validator'
import { validateJWT } from './validate-JWT.js'
import { checkValidators } from './check-validators.js'

export const validateCreateComment = [
    validateJWT,
    body('post')
        .notEmpty()
        .withMessage('La publicación es requerida')
        .isMongoId()
        .withMessage('ID de publicación no válido'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El comentario es requerido')
        .isLength({ min: 2, max: 500 })
        .withMessage('El comentario debe tener entre 2 y 500 caracteres'),
    checkValidators,
];

export const validateGetCommentsByPost = [
    param('postId')
        .isMongoId()
        .withMessage('ID de post no válido'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page debe ser un entero >= 1'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('limit debe ser un entero entre 1 y 50'),
    query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive debe ser boolean (true/false)'),
    checkValidators,
];

export const validateUpdateComment = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID de comentario no válido'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido es requerido')
        .isLength({ min: 1, max: 500 })
        .withMessage('El comentario debe tener entre 1 y 500 caracteres'),
    checkValidators,
];

export const validateDeleteComment = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID de comentario no válido'),
    checkValidators,
];