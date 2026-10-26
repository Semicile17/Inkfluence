import { Router } from 'express';
import { register, login, logout, getMe, getSession, updateMe } from '../controllers/auth.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/index.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/session', optionalAuth, getSession);
router.get('/me', protect, getMe);
router.patch('/me', protect, validate(updateProfileSchema), updateMe);

export default router;
