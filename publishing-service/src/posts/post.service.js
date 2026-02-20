import Post from './post.model.js'

export const createPostRecord = async ({ postData, user }) => {
  const data = {...postData, author: user._id,}

  const post = new Post(data)
  await post.save()

  return post
}

export const fetchPosts = async ({
  page = 1,
  limit = 10,
  category,
  author,
  isActive = true,
}) => {
  const filter = { isActive }

  if (category) filter.category = category
  if (author) filter.author = author

  const pageNumber = parseInt(page)
  const limitNumber = parseInt(limit)

  const posts = await Post.find(filter)
    .populate('author', 'username email')
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 })

  const total = await Post.countDocuments(filter)

  return {
    posts,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  }
}

export const updatePostRecord = async ({ id, postData, user }) => {
  const post = await Post.findById(id)

  if (!post) {
    throw new Error('Publicación no encontrada.')
  }

  if (post.author.toString() !== user._id.toString()) {
    throw new Error('No autorizado para modificar esta publicación.')
  }

  Object.assign(post, postData)
  await post.save()

  return post
}

export const deletePostRecord = async ({ id, user }) => {
  const post = await Post.findById(id)

  if (!post) {
    throw new Error('Publicación no encontrada.')
  }

  if (post.author.toString() !== user._id.toString()) {
    throw new Error('No autorizado para eliminar esta publicación.')
  }

  post.isActive = false
  await post.save()

  return post
}