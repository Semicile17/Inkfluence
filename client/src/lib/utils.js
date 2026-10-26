import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const CATEGORIES = [
  'Technology',
  'Design',
  'Life',
  'Career',
  'Travel',
  'Culture',
  'Wellness',
  'Business',
  'Creativity',
  'Finance',
];

export const COVER_THEMES = [
  { id: 'lime', label: 'Lime' },
  { id: 'ink', label: 'Ink' },
  { id: 'paper', label: 'Paper' },
  { id: 'orbit', label: 'Orbit' },
  { id: 'bloom', label: 'Bloom' },
  { id: 'grid', label: 'Grid' },
];

export const formatNumber = (value = 0) => {
  if (value < 1000) return `${value}`;
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDate = (value) => {
  if (!value) return '';
  try {
    return format(typeof value === 'string' ? parseISO(value) : new Date(value), 'MMM d, yyyy');
  } catch {
    return '';
  }
};

export const timeAgo = (value) => {
  if (!value) return '';
  try {
    return formatDistanceToNow(typeof value === 'string' ? parseISO(value) : new Date(value), {
      addSuffix: true,
    });
  } catch {
    return '';
  }
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const estimateReadTime = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

export const wordCount = (text = '') => text.trim().split(/\s+/).filter(Boolean).length;

export function openMuse(prompt) {
  window.dispatchEvent(new CustomEvent('inkfluence:open-muse', { detail: { prompt } }));
}

export const categoryTone = {
  Technology: 'bg-ink text-lime-300',
  Design: 'bg-lime-300 text-ink',
  Life: 'bg-paper text-ink',
  Career: 'bg-lime-100 text-ink',
  Travel: 'bg-lime-200 text-ink',
  Culture: 'bg-ink text-white',
  Wellness: 'bg-lime-100 text-ink',
  Business: 'bg-ink text-lime-300',
  Creativity: 'bg-lime-300 text-ink',
  Finance: 'bg-paper text-ink',
};

export const coverThemes = COVER_THEMES.map((theme) => theme.id);
