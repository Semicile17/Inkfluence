import { Router } from 'express';
import { listComments, createComment, deleteComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { commentSchema } from '../validators/index.js';

const router = Router();

router.get('/blog/:blogId', listComments);
router.post('/blog/:blogId', protect, validate(commentSchema), createComment);
router.delete('/:id', protect, deleteComment);

export default router;
