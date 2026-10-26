import { Router } from 'express';
import { recommend, status } from '../controllers/ai.controller.js';
import { validate } from '../middleware/validate.js';
import { aiRecommendSchema } from '../validators/index.js';

const router = Router();

router.get('/status', status);
router.post('/recommend', validate(aiRecommendSchema), recommend);

export default router;
