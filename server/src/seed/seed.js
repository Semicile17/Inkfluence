import path from 'node:path';
import { fileURLToPath } from 'node:url';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Newsletter from '../models/Newsletter.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { calculateReadTime } from '../utils/slug.js';
import {
  seedUsers,
  seedBlogs,
  seedComments,
  followMap,
  bookmarkMap,
} from './seedData.js';

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(9 + (days % 8), 15, 0, 0);
  return date;
};

export async function seedDatabase({ silent = false } = {}) {
  const log = (...args) => {
    if (!silent) console.log(...args);
  };

  log('Clearing existing demo content...');
  await Promise.all([
    Comment.deleteMany({}),
    Blog.deleteMany({}),
    User.deleteMany({}),
    Newsletter.deleteMany({}),
  ]);

  log('Creating writers...');
  const users = await User.create(seedUsers);
  const userByUsername = new Map(users.map((user) => [user.username, user]));

  // Follow graph: build both sides in one pass.
  const following = new Map(users.map((user) => [user._id.toString(), []]));
  const followers = new Map(users.map((user) => [user._id.toString(), []]));

  for (const [username, targets] of Object.entries(followMap)) {
    const source = userByUsername.get(username);
    if (!source) continue;
    for (const targetUsername of targets) {
      const target = userByUsername.get(targetUsername);
      if (!target) continue;
      following.get(source._id.toString()).push(target._id);
      followers.get(target._id.toString()).push(source._id);
    }
  }

  await User.bulkWrite(
    users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            following: following.get(user._id.toString()),
            followers: followers.get(user._id.toString()),
          },
        },
      },
    }))
  );

  log('Planting stories...');
  const blogDocs = seedBlogs.map((blog) => {
    const author = userByUsername.get(blog.author);
    if (!author) throw new Error(`Seed author not found: ${blog.author}`);
    const likeIds = (blog.likes || [])
      .map((username) => userByUsername.get(username)?._id)
      .filter(Boolean);
    const isPublished = blog.status !== 'draft';
    const publishedAt = isPublished ? daysAgo(blog.daysAgo ?? 1) : null;

    return {
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.map((tag) => tag.toLowerCase()),
      coverTheme: blog.coverTheme,
      coverImage: '',
      featured: Boolean(blog.featured && isPublished),
      author: author._id,
      status: isPublished ? 'published' : 'draft',
      readTime: calculateReadTime(blog.content),
      views: isPublished ? blog.views ?? 0 : 0,
      likes: likeIds,
      likesCount: likeIds.length,
      commentsCount: 0,
      publishedAt,
      ...(isPublished ? { createdAt: publishedAt, updatedAt: publishedAt } : {}),
    };
  });

  const blogs = await Blog.insertMany(blogDocs, { timestamps: false });
  const blogBySlug = new Map(blogs.map((blog) => [blog.slug, blog]));

  log('Adding conversations...');
  const commentDocs = seedComments
    .map((comment) => {
      const blog = blogBySlug.get(comment.slug);
      const author = userByUsername.get(comment.author);
      if (!blog || !author) return null;
      const createdAt = daysAgo(comment.daysAgo ?? 1);
      return {
        blog: blog._id,
        author: author._id,
        content: comment.content,
        createdAt,
        updatedAt: createdAt,
      };
    })
    .filter(Boolean);

  if (commentDocs.length) {
    await Comment.insertMany(commentDocs, { timestamps: false });
  }

  const counts = await Comment.aggregate([
    { $group: { _id: '$blog', count: { $sum: 1 } } },
  ]);
  await Blog.bulkWrite(
    counts.map((entry) => ({
      updateOne: {
        filter: { _id: entry._id },
        update: { $set: { commentsCount: entry.count } },
      },
    }))
  );

  log('Curating reading lists...');
  const bookmarkOps = [];
  for (const [username, slugs] of Object.entries(bookmarkMap)) {
    const user = userByUsername.get(username);
    if (!user) continue;
    const ids = slugs.map((slug) => blogBySlug.get(slug)?._id).filter(Boolean);
    bookmarkOps.push({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { bookmarks: ids } },
      },
    });
  }
  if (bookmarkOps.length) await User.bulkWrite(bookmarkOps);

  const summary = {
    users: users.length,
    blogs: blogs.length,
    published: blogs.filter((blog) => blog.status === 'published').length,
    drafts: blogs.filter((blog) => blog.status === 'draft').length,
    comments: commentDocs.length,
  };

  log(`Seeded ${summary.users} writers, ${summary.blogs} stories, ${summary.comments} comments.`);
  log('Demo login → demo@inkfluence.app / demo1234');

  return summary;
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  try {
    await connectDB();
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}
