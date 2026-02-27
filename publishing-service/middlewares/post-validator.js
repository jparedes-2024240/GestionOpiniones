import { body, param, query } from 'express-validator'
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

// Validaciones para obtener posts
export const validateGetPostsQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page debe ser un entero >= 1'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('limit debe ser un entero entre 1 y 50'),
    query('category')
        .optional()
        .isIn(['TECNOLOGIA', 'EDUCACION', 'ENTRETENIMIENTO', 'DEPORTES', 'POLITICA', 'OTROS',])
        .withMessage('Categoría no válida'),
    query('author')
        .optional()
        .isMongoId()
        .withMessage('author debe ser un MongoId válido'),
    query('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive debe ser boolean (true/false)'),
    checkValidators,
];

// Validaciones para obtener un post
export const validateGetPostById = [
    param('id')
        .isMongoId()
        .withMessage('ID de publicación no válido'),
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

// Validaciones para eliminar posts
export const validateDeletePost = [
    validateJWT,
    param('id')
        .isMongoId()
        .withMessage('ID de publicación no válido'),
    checkValidators,
];