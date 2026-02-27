import { createCommentRecord, fetchCommentsByPost, updateCommentRecord, deleteCommentRecord } from './comment.service.js';

export const createComment = async (req, res) => {
    try {
        const comment = await createCommentRecord({ commentData: req.body, user: req.user });

        res.status(201).json({
            success: true,
            message: 'Comentario creado exitosamente!',
            data: comment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el comentario.',
            error: err.message,
        });
    }
}

export const getCommentsByPost = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive } = req.query;
        const isActiveParsed = isActive === undefined ? true : isActive === 'true';
        const { comments, pagination } = await fetchCommentsByPost({ postId: req.params.postId, page, limit, isActive: isActiveParsed });

        res.status(200).json({
            success: true,
            message: 'Comentarios obtenidos correctamente!',
            data: comments,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios.',
            error: err.message,
        });
    }
}

export const updateComment = async (req, res) => {
    try {
        const comment = await updateCommentRecord({ id: req.params.id, commentData: req.body, user: req.user });

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado correctamente!',
            data: comment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el comentario.',
            error: err.message,
        });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const comment = await deleteCommentRecord({ id: req.params.id, user: req.user });

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado correctamente!',
            data: comment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el comentario.',
            error: err.message,
        });
    }
}