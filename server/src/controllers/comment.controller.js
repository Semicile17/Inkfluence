import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const AUTHOR_FIELDS = 'name username avatar';

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('author', AUTHOR_FIELDS);

  res.json({ success: true, data: { comments } });
});

export const createComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.blogId, status: 'published' }).select('_id author');
  if (!blog) throw ApiError.notFound('That story could not be found');

  const comment = await Comment.create({
    blog: blog._id,
    author: req.user._id,
    content: req.body.content,
  });

  await Blog.updateOne({ _id: blog._id }, { $inc: { commentsCount: 1 } });
  await comment.populate('author', AUTHOR_FIELDS);

  res.status(201).json({
    success: true,
    message: 'Comment added',
    data: { comment },
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw ApiError.notFound('That comment could not be found');

  const blog = await Blog.findById(comment.blog).select('author');
  const isCommentAuthor = comment.author.equals(req.user._id);
  const isBlogAuthor = blog && blog.author.equals(req.user._id);

  if (!isCommentAuthor && !isBlogAuthor) {
    throw ApiError.forbidden('You can only delete your own comments');
  }

  await comment.deleteOne();
  await Blog.updateOne({ _id: comment.blog }, { $inc: { commentsCount: -1 } });

  res.json({ success: true, message: 'Comment deleted' });
});
