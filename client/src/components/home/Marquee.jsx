import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Asterisk } from '../ui/Doodles.jsx';

const marqueeItems = [
  'slow living',
  'design',
  'startups',
  'good sentences',
  'field notes',
  'career pivots',
  'books',
  'weekend projects',
  'attention',
  'travel',
  'money talks',
  'writing badly',
];

export default function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="border-y border-ink/10 bg-white py-3.5">
      <div className="group relative flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 group-hover:[animation-play-state:paused]">
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8">
              <Link
                to={`/explore?q=${encodeURIComponent(item)}`}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45 transition hover:text-ink"
              >
                {item}
              </Link>
              <Asterisk className="h-3 w-3 shrink-0 text-lime-500" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TagsStrip({ tags = [] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, 8).map((tag) => (
        <Link
          key={tag.name}
          to={`/explore?tag=${encodeURIComponent(tag.name)}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-medium text-ink/60 transition hover:border-ink/30 hover:text-ink"
        >
          #{tag.name}
          <ArrowUpRight className="h-3 w-3 opacity-40" />
        </Link>
      ))}
    </div>
  );
}
