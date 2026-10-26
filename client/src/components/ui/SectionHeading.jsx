import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  dark = false,
  className,
}) {
  return (
    <div className={clsx('mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <span
            className={clsx(
              'mb-4 inline-block rounded-lg px-2.5 py-1 font-display text-sm font-semibold',
              dark ? 'bg-lime-400 text-ink' : 'bg-lime-400 text-ink'
            )}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={clsx(
            'font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]',
            dark ? 'text-white' : 'text-ink'
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={clsx('mt-3 max-w-xl text-sm leading-relaxed sm:text-base', dark ? 'text-white/55' : 'text-ink/55')}>
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className={clsx(
            'group inline-flex w-fit items-center gap-1.5 border-b pb-1 text-sm font-semibold transition',
            dark
              ? 'border-lime-400 text-lime-300 hover:text-white'
              : 'border-ink/20 text-ink hover:border-ink'
          )}
        >
          {actionLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
