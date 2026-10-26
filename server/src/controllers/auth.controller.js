import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';

export const serializeSelf = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  socials: user.socials,
  role: user.role,
  bookmarks: user.bookmarks,
  following: user.following,
  followersCount: user.followers?.length ?? 0,
  followingCount: user.following?.length ?? 0,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const [emailTaken, usernameTaken] = await Promise.all([
    User.exists({ email }),
    User.exists({ username }),
  ]);

  if (emailTaken) throw ApiError.conflict('An account with that email already exists');
  if (usernameTaken) throw ApiError.conflict('That username is already taken — try another');

  const user = await User.create({ name, username, email, password });
  setAuthCookie(res, signToken(user._id));

  res.status(201).json({
    success: true,
    message: `Welcome to Inkfluence, ${user.name.split(' ')[0]}!`,
    data: { user: serializeSelf(user) },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Email or password is incorrect');
  }

  setAuthCookie(res, signToken(user._id));

  res.json({
    success: true,
    message: `Welcome back, ${user.name.split(' ')[0]}!`,
    data: { user: serializeSelf(user) },
  });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Signed out. See you soon.' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: serializeSelf(req.user) } });
});

/** Returns the current user or null for guests, without a noisy 401. */
export const getSession = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user ? serializeSelf(req.user) : null } });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, bio, avatar, socials } = req.body;
  const user = req.user;

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (socials !== undefined) {
    user.socials = { ...(user.socials?.toObject?.() ?? user.socials), ...socials };
  }

  await user.save();
  res.json({
    success: true,
    message: 'Profile updated',
    data: { user: serializeSelf(user) },
  });
});
