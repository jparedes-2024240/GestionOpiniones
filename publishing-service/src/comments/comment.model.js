'use strict'

import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, 'El comentario es requerido'],
            trim: true,
            minLength: [2, 'El comentario debe tener al menos 2 caracteres'],
            maxLength: [500, 'El comentario no puede exceder 500 caracteres'],
        },
        author: {
            type: String,
            required: [true, 'El autor es requerido'],
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, 'La publicación es requerida'],
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
commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ isActive: 1 });
commentSchema.index({ post: 1, isActive: 1 });

export default model('Comment', commentSchema);