import Blog from '../models/Blog.js';

export function slugify(text = '') {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export async function buildUniqueSlug(title, excludeId = null) {
  const base = slugify(title) || 'untitled-story';
  let candidate = base;
  let counter = 2;

  // A handful of retries is plenty for human-scale collisions.
  for (let i = 0; i < 20; i += 1) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Blog.exists(query);
    if (!exists) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export function calculateReadTime(content = '') {
  const words = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
