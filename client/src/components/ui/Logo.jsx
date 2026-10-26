import { Link } from 'react-router-dom';
import clsx from 'clsx';

function StarMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16 0c.9 8.7 6.4 14.2 16 16-9.6 1.8-15.1 7.3-16 16-.9-8.7-6.4-14.2-16-16C9.6 14.2 15.1 8.7 16 0Z" />
    </svg>
  );
}

export default function Logo({ dark = false, compact = false, className }) {
  return (
    <Link
      to="/"
      aria-label="Inkfluence home"
      className={clsx('group inline-flex items-center gap-2.5', className)}
    >
      <span className="grid h-9 w-9 place-items-center rounded-[13px] bg-lime-400 text-ink transition-transform duration-300 group-hover:rotate-12">
        <StarMark className="h-[18px] w-[18px]" />
      </span>
      {!compact && (
        <span
          className={clsx(
            'font-display text-[1.35rem] font-bold tracking-[-0.04em]',
            dark ? 'text-white' : 'text-ink'
          )}
        >
          inkfluence
          <span className="text-lime-400">.</span>
        </span>
      )}
    </Link>
  );
}

export { StarMark };
