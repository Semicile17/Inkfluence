import { Router } from 'express';
import { getProfile, toggleFollow, listWriters } from '../controllers/user.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listWriters);
router.get('/:username', optionalAuth, getProfile);
router.post('/:id/follow', protect, toggleFollow);
router.delete('/:id/follow', protect, toggleFollow);

export default router;
