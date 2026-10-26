import { Link } from 'react-router-dom';
import { Sparkle } from './Doodles.jsx';
import { buttonStyles } from './Button.jsx';

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = 'Try adjusting your filters, or come back in a little while.',
  actionLabel,
  actionTo,
  onAction,
  children,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-ink/20 bg-white px-6 py-16 text-center">
      <Sparkle className="absolute -right-4 -top-4 h-24 w-24 text-lime-400/60" />
      <div className="relative mx-auto max-w-md">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-lime-400 text-ink">
          {icon || <Sparkle className="h-6 w-6" />}
        </div>
        <h3 className="font-display text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/55">{description}</p>
        <div className="mt-6 flex justify-center">
          {actionLabel && actionTo && (
            <Link to={actionTo} className={buttonStyles('dark', 'md')}>
              {actionLabel}
            </Link>
          )}
          {actionLabel && onAction && (
            <button type="button" onClick={onAction} className={buttonStyles('dark', 'md')}>
              {actionLabel}
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
