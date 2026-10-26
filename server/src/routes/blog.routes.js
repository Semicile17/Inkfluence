import { Router } from 'express';
import {
  listBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  toggleBookmark,
  listMyBlogs,
  listBookmarks,
  getDashboard,
  getTags,
  getPlatformStats,
} from '../controllers/blog.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBlogSchema, updateBlogSchema } from '../validators/index.js';

const router = Router();

router.get('/tags', getTags);
router.get('/stats', getPlatformStats);
router.get('/bookmarks', protect, listBookmarks);
router.get('/mine', protect, listMyBlogs);
router.get('/dashboard', protect, getDashboard);

router.get('/', listBlogs);
router.post('/', protect, validate(createBlogSchema), createBlog);

router.get('/:slug', optionalAuth, getBlog);
router.patch('/:id', protect, validate(updateBlogSchema), updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
