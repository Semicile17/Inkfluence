import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function Spinner({ label = 'Loading...', className, light = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx('flex items-center justify-center gap-3 text-sm', className)}
    >
      <Loader2 className={clsx('h-5 w-5 animate-spin', light ? 'text-lime-400' : 'text-ink')} />
      <span className={light ? 'text-white/60' : 'text-ink/50'}>{label}</span>
    </div>
  );
}
