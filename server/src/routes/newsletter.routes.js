import { Router } from 'express';
import { subscribe } from '../controllers/newsletter.controller.js';
import { validate } from '../middleware/validate.js';
import { newsletterSchema } from '../validators/index.js';

const router = Router();

router.post('/', validate(newsletterSchema), subscribe);

export default router;
