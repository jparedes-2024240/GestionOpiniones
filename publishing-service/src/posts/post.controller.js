import { createPostRecord, fetchPosts, updatePostRecord, deletePostRecord } from './post.service.js';

export const createPost = async (req, res) => {
    try {
        const post = await createPostRecord({ postData: req.body, user: req.user, });

        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente!',
            data: post,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la publicación.',
            error: err.message,
        });
    }
}

export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, author, isActive = true } = req.query;
        const { posts, pagination } = await fetchPosts({ page, limit, category, author, isActive });

        res.status(200).json({
            success: true,
            message: 'Publicaciones obtenidas correctamente!',
            data: posts,
            pagination,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las publicaciones.',
            error: err.message,
        });
    }
}

export const updatePost = async (req, res) => {
    try {
        const post = await updatePostRecord({ id: req.params.id, postData: req.body, user: req.user });

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada correctamente!',
            data: post,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la publicación.',
            error: err.message,
        });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await deletePostRecord({ id: req.params.id, user: req.user });

        res.status(200).json({
            success: true,
            message: 'Publicación eliminada correctamente!',
            data: post,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicación.',
            error: err.message,
        });
    }
}