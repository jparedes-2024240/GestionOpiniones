import Comment from './comment.model.js'
import Post from '../posts/post.model.js'

export const createCommentRecord = async ({ commentData, user }) => {
    const post = await Post.findById(commentData.post);

    if (!post || !post.isActive) {
        throw new Error('La publicación no existe o está inactiva')
    };

    const data = {
        ...commentData,
        author: user._id,
    };

    const comment = new Comment(data);
    await comment.save();

    return comment;
}

export const fetchCommentsByPost = async ({ postId, page = 1, limit = 10, isActive = true }) => {
    const filter = {
        post: postId,
        isActive,
    };

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const comments = await Comment.find(filter)
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Comment.countDocuments(filter);

    return {
        comments,
        pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalRecords: total,
        limit: limitNumber,
        },
    };
}

export const updateCommentRecord = async ({ id, commentData, user }) => {
    const comment = await Comment.findById(id);

    if (!comment) {
        throw new Error('Comentario no encontrado')
    };

    if (comment.author.toString() !== user._id.toString()) {
        throw new Error('No autorizado para modificar este comentario')
    };

    Object.assign(comment, commentData);
    await comment.save();

    return comment;
}

export const deleteCommentRecord = async ({ id, user }) => {
    const comment = await Comment.findById(id);

    if (!comment) {
        throw new Error('Comentario no encontrado')
    };

    if (comment.author.toString() !== user._id.toString()) {
        throw new Error('No autorizado para eliminar este comentario')
    };

    comment.isActive = false;
    await comment.save();

    return comment;
}