'use strict';

import { Schema, model } from 'mongoose';

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'El título es requerido'],
            trim: true,
            minLength: [5, 'El título debe tener al menos 5 caracteres'],
            maxLength: [100, 'El título no puede exceder 100 caracteres'],
        },
        category: {
            type: String,
            required: [true, 'La categoría es requerida'],
            enum: {
                values: ['TECNOLOGIA', 'EDUCACION', 'ENTRETENIMIENTO', 'DEPORTES', 'POLITICA', 'OTROS'],
                message: 'Categoría no válida.',
            },
        },
        content: {
            type: String,
            required: [true, 'El contenido es requerido'],
            trim: true,
            minLength: [10, 'El contenido debe tener al menos 10 caracteres'],
            maxLength: [2000, 'El contenido no puede exceder 2000 caracteres'],
        },
        author: {
            type: String,
            required: [true, 'El autor es requerido'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Índices
postSchema.index({ author: 1 })
postSchema.index({ category: 1 })
postSchema.index({ isActive: 1 })
postSchema.index({ isActive: 1, category: 1 })

export default model('Post', postSchema);