import { asyncHandler } from '../utils/asyncHandler.js';
import { recommendBlogs, getAiProvider, getAiProviders } from '../services/ai.service.js';

export const recommend = asyncHandler(async (req, res) => {
  const result = await recommendBlogs(req.body.message);
  res.json({ success: true, data: result });
});

export const status = asyncHandler(async (req, res) => {
  const provider = getAiProvider();
  const providers = getAiProviders();
  res.json({
    success: true,
    data: {
      configured: provider !== 'local',
      provider,
      providers,
      label:
        provider === 'gemini'
          ? 'Gemini free tier'
          : provider === 'groq'
            ? 'Groq free tier'
            : provider === 'pollinations'
              ? 'Pollinations free AI'
              : 'On-device matching',
    },
  });
});
