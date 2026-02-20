import { body, param } from 'express-validator'
import { validateJWT } from './validate-JWT.js'
import { checkValidators } from './check-validators.js'

// Validaciones para crear posts
export const validateCreatePost = [
    validateJWT,
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es requerido')
        .isLength({ min: 5, max: 100 })
        .withMessage('El título debe tener entre 5 y 100 caracteres'),
    body('category')
        .notEmpty()
        .withMessage('La categoría es requerida')
        .isIn(['TECNOLOGIA', 'EDUCACION', 'ENTRETENIMIENTO', 'DEPORTES', 'POLITICA', 'OTROS',])
        .withMessage('Categoría no válida'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido es requerido')
        .isLength({ min: 10, max: 2000 })
        .withMessage('El contenido debe tener entre 10 y 2000 caracteres'),
    checkValidators,
];

// Validaciones para actualizar posts
export const validateUpdatePost = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID de publicación no válido'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('El título debe tener entre 5 y 100 caracteres'),
    body('category')
        .optional()
        .isIn(['TECNOLOGIA', 'EDUCACION', 'ENTRETENIMIENTO', 'DEPORTES', 'POLITICA', 'OTROS',])
        .withMessage('Categoría no válida'),
    body('content')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('El contenido debe tener entre 10 y 2000 caracteres'),
    checkValidators,
];