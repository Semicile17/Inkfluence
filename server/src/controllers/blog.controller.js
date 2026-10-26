import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Newsletter from '../models/Newsletter.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildUniqueSlug, calculateReadTime } from '../utils/slug.js';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const AUTHOR_FIELDS = 'name username avatar bio';

const excerptFromContent = (content = '') =>
  content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 190);

const normalizeTags = (tags = []) => [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];

const SORTS = {
  latest: { publishedAt: -1, createdAt: -1 },
  popular: { views: -1, likesCount: -1 },
  loved: { likesCount: -1, views: -1 },
  oldest: { publishedAt: 1 },
};

export const listBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(Math.max(1, Number(req.query.limit) || 9), 24);
  const { q, tag, category, sort = 'latest', author, featured, exclude } = req.query;

  const filter = { status: 'published' };

  if (q?.trim()) {
    const regex = new RegExp(escapeRegex(q.trim().slice(0, 80)), 'i');
    filter.$or = [{ title: regex }, { excerpt: regex }, { tags: regex }, { category: regex }];
  }
  if (tag) filter.tags = tag.toLowerCase();
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (exclude && isObjectId(exclude)) filter._id = { $ne: exclude };

  if (author) {
    const writer = await User.findOne({ username: author.toLowerCase() }).select('_id');
    if (!writer) {
      return res.json({
        success: true,
        data: { blogs: [] },
        meta: { page: 1, limit, total: 0, pages: 0, hasMore: false },
      });
    }
    filter.author = writer._id;
  }

  const sortBy = SORTS[sort] || SORTS.latest;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content -likes')
      .populate('author', AUTHOR_FIELDS),
    Blog.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { blogs },
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
});

export const getBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const query = isObjectId(slug) ? { _id: slug } : { slug };

  const blog = await Blog.findOne(query).populate('author', AUTHOR_FIELDS);
  if (!blog) throw ApiError.notFound('That story could not be found');

  const isOwner = req.user && blog.author._id.equals(req.user._id);
  if (blog.status !== 'published' && !isOwner) {
    throw ApiError.notFound('That story could not be found');
  }

  if (blog.status === 'published' && !isOwner) {
    blog.views += 1;
    await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } });
  }

  const related = await Blog.find({
    _id: { $ne: blog._id },
    status: 'published',
    $or: [{ tags: { $in: blog.tags } }, { category: blog.category }],
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select('-content -likes')
    .populate('author', AUTHOR_FIELDS);

  const liked = Boolean(req.user && blog.likes.some((id) => id.equals(req.user._id)));
  const bookmarked = Boolean(req.user && req.user.bookmarks.some((id) => id.equals(blog._id)));

  res.json({
    success: true,
    data: { blog, related, liked, bookmarked, isOwner },
  });
});

export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, tags, coverTheme, coverImage, status } = req.body;

  const published = status === 'published';
  const blog = await Blog.create({
    title,
    slug: await buildUniqueSlug(title),
    excerpt: excerpt?.trim() || excerptFromContent(content),
    content,
    category,
    tags: normalizeTags(tags),
    coverTheme,
    coverImage: coverImage || '',
    status,
    readTime: calculateReadTime(content),
    author: req.user._id,
    publishedAt: published ? new Date() : null,
  });

  await blog.populate('author', AUTHOR_FIELDS);

  res.status(201).json({
    success: true,
    message: published ? 'Your story is live!' : 'Draft saved. It is safe with us.',
    data: { blog },
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw ApiError.notFound('That story could not be found');
  if (!blog.author.equals(req.user._id)) {
    throw ApiError.forbidden('You can only edit your own stories');
  }

  const { title, excerpt, content, category, tags, coverTheme, coverImage, status } = req.body;

  if (title !== undefined && title !== blog.title) {
    blog.title = title;
    blog.slug = await buildUniqueSlug(title, blog._id);
  }
  if (excerpt !== undefined) blog.excerpt = excerpt.trim() || excerptFromContent(content ?? blog.content);
  if (content !== undefined) {
    blog.content = content;
    blog.readTime = calculateReadTime(content);
    if (!excerpt) blog.excerpt = excerptFromContent(content);
  }
  if (category !== undefined) blog.category = category;
  if (tags !== undefined) blog.tags = normalizeTags(tags);
  if (coverTheme !== undefined) blog.coverTheme = coverTheme;
  if (coverImage !== undefined) blog.coverImage = coverImage;
  if (status !== undefined) {
    blog.status = status;
    if (status === 'published' && !blog.publishedAt) blog.publishedAt = new Date();
  }

  await blog.save();
  await blog.populate('author', AUTHOR_FIELDS);

  res.json({
    success: true,
    message: 'Story updated',
    data: { blog },
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw ApiError.notFound('That story could not be found');
  if (!blog.author.equals(req.user._id)) {
    throw ApiError.forbidden('You can only delete your own stories');
  }

  await Promise.all([
    blog.deleteOne(),
    Comment.deleteMany({ blog: blog._id }),
    User.updateMany({ bookmarks: blog._id }, { $pull: { bookmarks: blog._id } }),
  ]);

  res.json({ success: true, message: 'Story deleted' });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw ApiError.notFound('That story could not be found');

  const index = blog.likes.findIndex((id) => id.equals(req.user._id));
  if (index >= 0) blog.likes.splice(index, 1);
  else blog.likes.push(req.user._id);

  blog.likesCount = blog.likes.length;
  await blog.save();

  res.json({
    success: true,
    data: { liked: index < 0, likesCount: blog.likesCount },
  });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).select('_id');
  if (!blog) throw ApiError.notFound('That story could not be found');

  const user = req.user;
  const index = user.bookmarks.findIndex((id) => id.equals(blog._id));
  if (index >= 0) user.bookmarks.splice(index, 1);
  else user.bookmarks.push(blog._id);

  await user.save();

  res.json({
    success: true,
    message: index >= 0 ? 'Removed from your reading list' : 'Saved to your reading list',
    data: { bookmarked: index < 0, bookmarksCount: user.bookmarks.length },
  });
});

export const listMyBlogs = asyncHandler(async (req, res) => {
  const { status, q } = req.query;
  const filter = { author: req.user._id };
  if (status && ['draft', 'published'].includes(status)) filter.status = status;
  if (q?.trim()) filter.title = new RegExp(escapeRegex(q.trim().slice(0, 80)), 'i');

  const blogs = await Blog.find(filter)
    .sort({ updatedAt: -1 })
    .select('-content -likes')
    .populate('author', AUTHOR_FIELDS);

  res.json({ success: true, data: { blogs } });
});

export const listBookmarks = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({
    _id: { $in: req.user.bookmarks },
    status: 'published',
  })
    .sort({ publishedAt: -1 })
    .select('-content -likes')
    .populate('author', AUTHOR_FIELDS);

  res.json({ success: true, data: { blogs } });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const authorId = req.user._id;

  const [blogs, recent, top] = await Promise.all([
    Blog.find({ author: authorId }).select('status views likesCount commentsCount title slug coverTheme updatedAt publishedAt'),
    Blog.find({ author: authorId }).sort({ updatedAt: -1 }).limit(4).select('-content -likes'),
    Blog.find({ author: authorId, status: 'published' })
      .sort({ views: -1 })
      .limit(3)
      .select('title slug views likesCount coverTheme'),
  ]);

  const published = blogs.filter((blog) => blog.status === 'published');
  const stats = {
    total: blogs.length,
    published: published.length,
    drafts: blogs.length - published.length,
    views: published.reduce((sum, blog) => sum + blog.views, 0),
    likes: published.reduce((sum, blog) => sum + blog.likesCount, 0),
    comments: published.reduce((sum, blog) => sum + blog.commentsCount, 0),
  };

  res.json({
    success: true,
    data: {
      stats,
      recent,
      top,
      user: {
        followersCount: req.user.followers.length,
        followingCount: req.user.following.length,
      },
    },
  });
});

export const getPlatformStats = asyncHandler(async (req, res) => {
  const [writers, stories, totals, comments, subscribers] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    Blog.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: null,
          reads: { $sum: '$views' },
          likes: { $sum: '$likesCount' },
        },
      },
    ]),
    Comment.countDocuments(),
    Newsletter.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      writers,
      stories,
      reads: totals[0]?.reads || 0,
      likes: totals[0]?.likes || 0,
      comments,
      subscribers,
    },
  });
});

export const getTags = asyncHandler(async (req, res) => {
  const [tags, categories] = await Promise.all([
    Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 24 },
      { $project: { _id: 0, name: '$_id', count: 1 } },
    ]),
    Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
    ]),
  ]);

  res.json({ success: true, data: { tags, categories } });
});
