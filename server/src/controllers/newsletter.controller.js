import Newsletter from '../models/Newsletter.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const subscribe = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();

  await Newsletter.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, source: 'website' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({
    success: true,
    message: 'You are on the list — one thoughtful letter, every other Sunday.',
  });
});
