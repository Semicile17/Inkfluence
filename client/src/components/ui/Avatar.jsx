import clsx from 'clsx';
import { initials } from '../../lib/utils.js';

const palettes = [
  'bg-lime-400 text-ink',
  'bg-ink text-lime-300',
  'bg-lime-200 text-ink',
  'bg-[#e7e3db] text-ink',
  'bg-ink-700 text-white',
  'bg-lime-300 text-ink',
];

const hash = (value = '') =>
  [...value].reduce((total, character) => total + character.charCodeAt(0), 0);

export default function Avatar({ user, size = 'md', className, ring = true }) {
  const name = user?.name || 'Inkfluence writer';
  const palette = palettes[hash(user?.username || name) % palettes.length];
  const sizes = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
    '2xl': 'h-32 w-32 text-4xl',
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        loading="lazy"
        className={clsx(
          'shrink-0 rounded-full object-cover',
          ring && 'ring-2 ring-white',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-grid shrink-0 place-items-center rounded-full font-display font-bold tracking-tight',
        ring && 'ring-2 ring-white',
        palette,
        sizes[size],
        className
      )}
    >
      {initials(name) || '✦'}
    </span>
  );
}
