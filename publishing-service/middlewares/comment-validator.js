import { body, param } from 'express-validator'
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

export const validateUpdateComment = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID de comentario no válido'),
    body('content')
        .optional()
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage('El comentario debe tener entre 2 y 500 caracteres'),
    checkValidators,
];

export const validateDeleteComment = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID de comentario no válido'),
    checkValidators,
];