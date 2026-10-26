import User from '../models/User.js';
import Blog from '../models/Blog.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!user) throw ApiError.notFound('That writer could not be found');

  const [blogs, likesAgg] = await Promise.all([
    Blog.find({ author: user._id, status: 'published' })
      .sort({ publishedAt: -1 })
      .select('-content -likes')
      .populate('author', 'name username avatar bio'),
    Blog.aggregate([
      { $match: { author: user._id, status: 'published' } },
      { $group: { _id: null, likes: { $sum: '$likesCount' }, views: { $sum: '$views' } } },
    ]),
  ]);

  const isFollowing = Boolean(
    req.user && req.user.following.some((id) => id.equals(user._id))
  );

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        socials: user.socials,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        createdAt: user.createdAt,
      },
      isFollowing,
      stats: {
        posts: blogs.length,
        likes: likesAgg[0]?.likes || 0,
        views: likesAgg[0]?.views || 0,
      },
      blogs,
    },
  });
});

export const toggleFollow = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (String(req.user._id) === String(targetId)) {
    throw ApiError.badRequest('You cannot follow yourself — but we love the energy');
  }

  const target = await User.findById(targetId);
  if (!target) throw ApiError.notFound('That writer could not be found');

  const isFollowing = req.user.following.some((id) => id.equals(target._id));

  if (isFollowing) {
    await User.updateOne({ _id: req.user._id }, { $pull: { following: target._id } });
    await User.updateOne({ _id: target._id }, { $pull: { followers: req.user._id } });
  } else {
    await User.updateOne({ _id: req.user._id }, { $addToSet: { following: target._id } });
    await User.updateOne({ _id: target._id }, { $addToSet: { followers: req.user._id } });
  }

  res.json({
    success: true,
    message: isFollowing ? `Unfollowed ${target.name}` : `Now following ${target.name}`,
    data: {
      following: !isFollowing,
      followersCount: target.followers.length + (isFollowing ? -1 : 1),
    },
  });
});

export const listWriters = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 4, 12);

  const writers = await User.aggregate([
    {
      $addFields: {
        followersCount: { $size: '$followers' },
        followingCount: { $size: '$following' },
      },
    },
    { $sort: { followersCount: -1, createdAt: 1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'blogs',
        let: { authorId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$author', '$$authorId'] }, { $eq: ['$status', 'published'] }] } } },
          { $project: { _id: 1 } },
        ],
        as: 'publishedBlogs',
      },
    },
    {
      $project: {
        name: 1,
        username: 1,
        avatar: 1,
        bio: 1,
        followersCount: 1,
        followingCount: 1,
        postCount: { $size: '$publishedBlogs' },
      },
    },
  ]);

  res.json({ success: true, data: { writers } });
});
