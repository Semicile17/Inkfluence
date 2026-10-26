import Blog from '../models/Blog.js';
import { env } from '../config/env.js';
import { CATEGORIES } from '../constants.js';

const AUTHOR_FIELDS = 'name username avatar bio';
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'about', 'that', 'this', 'you', 'your', 'have', 'has', 'are',
  'was', 'were', 'will', 'would', 'can', 'could', 'should', 'something', 'some', 'anything',
  'want', 'wanna', 'need', 'like', 'looking', 'find', 'read', 'reading', 'blog', 'blogs',
  'story', 'stories', 'please', 'recommend', 'recommendation', 'recommendations', 'show',
  'give', 'know', 'more', 'into', 'from', 'them', 'they', 'their', 'what', 'when', 'where',
  'which', 'how', 'why', 'not', 'but', 'all', 'any', 'get', 'got', 'out', 'day', 'today',
  'good', 'great', 'best', 'new', 'feel', 'feeling', 'mood',
]);

// A tiny, friendly concept map so the free local fallback still feels thoughtful.
const CONCEPTS = {
  focus: ['productivity', 'mindfulness', 'attention', 'deep work', 'habits', 'distraction'],
  productivity: ['focus', 'habits', 'systems', 'deep work', 'time'],
  procrastination: ['focus', 'productivity', 'habits', 'motivation'],
  burnout: ['wellness', 'rest', 'boundaries', 'mindfulness', 'work'],
  calm: ['mindfulness', 'wellness', 'slow living', 'rest', 'nature'],
  mindfulness: ['wellness', 'calm', 'presence', 'slow living', 'gratitude'],
  startup: ['business', 'founder', 'building in public', 'entrepreneur', 'side project'],
  founder: ['startup', 'business', 'building', 'leadership'],
  business: ['startup', 'freelance', 'money', 'leadership', 'career'],
  career: ['work', 'job', 'growth', 'freelance', 'learning'],
  job: ['career', 'work', 'interview', 'learning'],
  money: ['finance', 'freelance', 'budget', 'saving', 'income'],
  finance: ['money', 'budget', 'saving', 'investing'],
  freelance: ['money', 'career', 'clients', 'business', 'independence'],
  travel: ['culture', 'city', 'wander', 'slow travel', 'belonging'],
  culture: ['travel', 'belonging', 'identity', 'city'],
  design: ['ux', 'typography', 'creativity', 'tech', 'css'],
  tech: ['technology', 'code', 'design', 'ai', 'web'],
  code: ['coding', 'technology', 'learning', 'css', 'programming'],
  learning: ['code', 'career', 'skills', 'growth', 'beginner'],
  write: ['writing', 'creativity', 'drafts', 'books', 'reading'],
  writing: ['creativity', 'drafts', 'books', 'reading', 'editing'],
  book: ['books', 'reading', 'writing', 'lifestyle'],
  books: ['reading', 'writing', 'lifestyle'],
  creativity: ['creative', 'writing', 'design', 'ideas', 'side project'],
  ideas: ['creativity', 'startup', 'writing', 'building'],
  quiet: ['slow living', 'mindfulness', 'minimalism', 'rest'],
  slow: ['slow living', 'travel', 'mindfulness', 'rest'],
  habit: ['productivity', 'focus', 'wellness', 'routine'],
  habits: ['productivity', 'focus', 'wellness', 'routine'],
  sunday: ['routine', 'wellness', 'lifestyle', 'reset'],
  nature: ['travel', 'wellness', 'slow living'],
  funny: ['humor', 'quirky', 'life'],
  sad: ['wellness', 'comfort', 'life', 'mindfulness'],
  lost: ['belonging', 'career', 'travel', 'identity'],
  change: ['life', 'career', 'identity', 'growth'],
  beginner: ['learning', 'code', 'career', 'guide'],
  web: ['technology', 'css', 'code', 'design'],
  ai: ['technology', 'future', 'design', 'code'],
};

const tokenize = (text = '') =>
  [...new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9+#]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2 && !STOPWORDS.has(word))
  )].slice(0, 14);

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const cleanStrings = (value, max = 8) =>
  Array.isArray(value)
    ? [...new Set(value.filter((item) => typeof item === 'string').map((item) => item.trim().toLowerCase()).filter(Boolean))].slice(0, max)
    : [];

const cleanReply = (value) =>
  typeof value === 'string' ? value.replace(/[*_#`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 280) : '';

function scoreBlog(blog, signal) {
  const title = blog.title.toLowerCase();
  const excerpt = (blog.excerpt || '').toLowerCase();
  const tags = (blog.tags || []).map((tag) => tag.toLowerCase());
  const category = (blog.category || '').toLowerCase();

  let score = 0;

  for (const rawKeyword of signal.keywords) {
    const keyword = rawKeyword.toLowerCase();
    if (!keyword) continue;
    if (title.includes(keyword)) score += 8;
    if (tags.some((tag) => tag.includes(keyword) || keyword.includes(tag))) score += 6;
    if (category.includes(keyword)) score += 4;
    if (excerpt.includes(keyword)) score += 3.5;
  }

  for (const rawTag of signal.tags) {
    const tag = rawTag.toLowerCase();
    if (tags.some((existing) => existing === tag || existing.includes(tag) || tag.includes(existing))) score += 9;
    if (title.includes(tag)) score += 4;
  }

  for (const rawCategory of signal.categories) {
    if (category === rawCategory.toLowerCase()) score += 10;
  }

  for (const token of signal.tokens) {
    if (title.includes(token)) score += 6;
    if (tags.some((tag) => tag.includes(token))) score += 5;
    if (category.includes(token)) score += 3;
    if (excerpt.includes(token)) score += 2;
  }

  // Concept expansion makes "I feel burned out" find stories about rest and
  // boundaries even when none of the literal words appear.
  const haystack = `${title} ${excerpt} ${tags.join(' ')} ${category}`;
  for (const token of signal.tokens) {
    const related = CONCEPTS[token];
    if (!related) continue;
    for (const concept of related) {
      if (haystack.includes(concept)) score += 2.2;
    }
  }

  // Gentle popularity nudge only as a tie-breaker.
  score += Math.min(blog.views / 2500, 1.6) + Math.min(blog.likesCount / 400, 1.2);
  return score;
}

function localReply(message, picks) {
  const first = picks[0]?.title;
  const moods = picks
    .flatMap((blog) => blog.tags || [])
    .slice(0, 3)
    .join(', ');

  if (first) {
    return moods
      ? `That mood sounds like ${moods}. I'd start with “${first}” — then wander through the rest of these.`
      : `Here's a little stack for that mood. Start with “${first}” and see where it takes you.`;
  }
  return 'I could not find an exact match, but these fresh stories are worth a look. Try a topic like “slow living”, “startups” or “design”.';
}

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(7000),
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 800,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini responded with ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGroq(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.groqApiKey}`,
    },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      model: env.groqModel,
      temperature: 0.55,
      max_tokens: 900,
      messages: [
        { role: 'system', content: 'You are Muse, a warm and concise blog discovery assistant. Reply with strict JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Groq responded with ${response.status}${detail ? ` (${detail.slice(0, 160)})` : ''}`);
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

const providerCooldowns = new Map();

const coolDownProvider = (provider, ms) => providerCooldowns.set(provider, Date.now() + ms);
const isCoolingDown = (provider) => (providerCooldowns.get(provider) || 0) > Date.now();

async function callPollinations(prompt) {
  const response = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(7000),
    body: JSON.stringify({
      model: env.pollinationsModel,
      temperature: 0.55,
      max_tokens: 900,
      messages: [
        {
          role: 'system',
          content: 'You are Muse, a warm and concise blog discovery assistant. Reply with strict JSON only, no markdown.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429 || response.status === 403) {
      coolDownProvider('pollinations', 90 * 1000);
    }
    throw new Error(`Pollinations responded with ${response.status}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

function parseAiJson(raw) {
  if (!raw) return null;
  const withoutFence = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = withoutFence.indexOf('{');
  const end = withoutFence.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(withoutFence.slice(start, end + 1));
  } catch {
    return null;
  }
}

function buildPrompt(message, availableTags) {
  return `You are Muse, the friendly blog-discovery assistant inside Inkfluence (a blogging platform).
A reader said: "${message}"

Pick the closest topics from the library and reply with STRICT JSON only:
{
  "intent": "a 3-7 word summary of what they want",
  "reply": "a warm, concise, slightly playful reply under 45 words. Do not use markdown. Do not invent blog titles.",
  "keywords": ["3-6 specific lowercase search terms"],
  "tags": ["0-4 tags from the available list only"],
  "categories": ["0-2 categories from the list only"]
}

Available categories: ${CATEGORIES.join(', ')}.
Available tags: ${availableTags.join(', ') || 'life, writing, technology, design, career, wellness'}.
If the request is vague, suggest a pleasant mix. Never mention that you are an AI model.`;
}

function configuredProviders() {
  const providers = [];
  if (env.geminiApiKey) providers.push('gemini');
  if (env.groqApiKey) providers.push('groq');
  if (env.pollinationsEnabled) providers.push('pollinations');
  return providers;
}

/**
 * The preferred provider that is configured. Actual requests walk the full
 * chain (Gemini → Groq → Pollinations) and skip any provider in cooldown.
 */
export function getAiProvider() {
  return configuredProviders()[0] || 'local';
}

export function getAiProviders() {
  return configuredProviders();
}

async function callProvider(provider, prompt) {
  if (provider === 'gemini') return callGemini(prompt);
  if (provider === 'groq') return callGroq(prompt);
  return callPollinations(prompt);
}

/**
 * Uses a free AI provider when a key is configured, falling through to the
 * next one on failure, then ranks real stories from MongoDB. Always falls back
 * to local scoring so the feature never breaks.
 */
export async function recommendBlogs(message) {
  const [candidates, tagAgg] = await Promise.all([
    Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(150)
      .select('title slug excerpt coverTheme coverImage category tags readTime views likesCount commentsCount publishedAt createdAt author')
      .populate('author', AUTHOR_FIELDS),
    Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]),
  ]);

  const availableTags = tagAgg.map((tag) => tag._id);
  const tokens = tokenize(message);
  let ai = null;
  let source = 'local';
  let providerError = null;

  const prompt = buildPrompt(message, availableTags);
  const attempts = [];

  for (const provider of configuredProviders()) {
    if (isCoolingDown(provider)) {
      attempts.push(`${provider}: cooling down`);
      continue;
    }

    try {
      const raw = await callProvider(provider, prompt);
      const parsed = parseAiJson(raw);

      if (!parsed) {
        // A malformed reply usually means the model is struggling; try the
        // next provider and retry this one again in a minute.
        providerError = `${provider} returned an unreadable response`;
        attempts.push(providerError);
        coolDownProvider(provider, 60 * 1000);
        continue;
      }

      ai = {
        intent: cleanReply(parsed.intent),
        reply: cleanReply(parsed.reply),
        keywords: cleanStrings(parsed.keywords, 6),
        tags: cleanStrings(parsed.tags, 4),
        categories: cleanStrings(parsed.categories, 2),
      };
      source = provider;
      break;
    } catch (error) {
      providerError = `${provider}: ${error.message}`;
      attempts.push(providerError);
      // Keep brief outages from adding latency to every chat message.
      coolDownProvider(provider, provider === 'pollinations' ? 90 * 1000 : 3 * 60 * 1000);
      console.warn(`[Muse] ${provider} unavailable → trying next provider (${error.message})`);
    }
  }

  if (!ai && attempts.length) {
    console.warn(`[Muse] all AI providers unavailable → local fallback (${attempts.join(' | ')})`);
  }

  const signal = {
    keywords: ai?.keywords?.length ? ai.keywords : tokens,
    tags: ai?.tags ?? [],
    categories: ai?.categories ?? [],
    tokens,
  };

  const scored = candidates
    .map((blog) => ({ blog, score: scoreBlog(blog, signal) }))
    .sort((a, b) => b.score - a.score);

  let picks = scored.filter((item) => item.score > 2).slice(0, 4).map((item) => item.blog);
  if (picks.length < 3) {
    const fallbackPicks = candidates
      .filter((blog) => !picks.some((pick) => pick._id.equals(blog._id)))
      .sort((a, b) => b.likesCount - a.likesCount || b.views - a.views)
      .slice(0, 3 - picks.length);
    picks = [...picks, ...fallbackPicks];
  }

  const reply = ai?.reply || localReply(message, picks);

  return {
    reply,
    intent: ai?.intent || (tokens.length ? tokens.slice(0, 4).join(' · ') : 'a little of everything'),
    blogs: picks.slice(0, 4),
    source,
    providerConfigured: configuredProviders().length > 0,
    ...(providerError && !env.isProduction ? { providerError } : {}),
  };
}
