import { z } from 'zod';
import { CATEGORIES, COVER_THEMES } from '../constants.js';

const username = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username needs at least 3 characters')
  .max(24, 'Username must be 24 characters or fewer')
  .regex(/^[a-z0-9_]+$/, 'Use lowercase letters, numbers and underscores only');

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or fewer');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Tell us your name').max(60, 'Name is too long'),
    username,
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    password,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    password: z.string().min(1, 'Enter your password'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is too short').max(60, 'Name is too long').optional(),
    bio: z.string().trim().max(280, 'Keep your bio under 280 characters').optional(),
    avatar: z
      .union([z.string().trim().url('Avatar must be a valid URL'), z.literal('')])
      .optional(),
    socials: z
      .object({
        website: z.union([z.string().trim().url('Enter a valid URL'), z.literal('')]).optional(),
        twitter: z.string().trim().max(100).optional(),
        instagram: z.string().trim().max(100).optional(),
      })
      .optional(),
  }),
});

const tag = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Tags cannot be empty')
  .max(24, 'Tags must be 24 characters or fewer')
  .regex(/^[a-z0-9][a-z0-9 +#.-]*$/, 'Tags can use letters, numbers, spaces, +, #, . and -');

const blogBody = {
  title: z.string().trim().min(3, 'Title needs at least 3 characters').max(120, 'Title is too long'),
  excerpt: z.string().trim().max(280, 'Excerpt must be under 280 characters').optional(),
  content: z.string().min(40, 'Write at least 40 characters').max(60000, 'This story is too long'),
  category: z.enum(CATEGORIES).default('Life'),
  tags: z.array(tag).max(5, 'Use up to 5 tags').default([]),
  coverTheme: z.enum(COVER_THEMES).default('lime'),
  coverImage: z.union([z.string().trim().url('Cover must be a valid URL'), z.literal('')]).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
};

export const createBlogSchema = z.object({ body: z.object(blogBody) });

export const updateBlogSchema = z.object({
  body: z.object(blogBody).partial().refine((data) => Object.keys(data).length > 0, {
    message: 'Nothing to update',
  }),
});

export const commentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, 'Write a comment first')
      .max(1000, 'Keep comments under 1000 characters'),
  }),
});

export const newsletterSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
  }),
});

export const aiRecommendSchema = z.object({
  body: z.object({
    message: z.string().trim().min(2, 'Tell Muse what you feel like reading').max(400, 'Keep it short and sweet'),
  }),
});
