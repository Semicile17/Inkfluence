import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

const variants = {
  dark: 'bg-ink text-white hover:-translate-y-0.5 hover:bg-ink-700 active:translate-y-0',
  lime: 'bg-lime-400 text-ink hover:-translate-y-0.5 hover:bg-lime-300 active:translate-y-0',
  outline:
    'border border-ink/20 bg-white text-ink hover:-translate-y-0.5 hover:border-ink hover:bg-paper active:translate-y-0',
  ghost: 'text-ink/70 hover:bg-ink/[0.06] hover:text-ink',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-3.5 text-[15px]',
};

export const buttonStyles = (variant = 'dark', size = 'md', extra = '') =>
  clsx(base, variants[variant] || variants.dark, sizes[size] || sizes.md, extra);

export default function Button({
  children,
  variant = 'dark',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
