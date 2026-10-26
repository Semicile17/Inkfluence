import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import { Sparkle } from '../ui/Doodles.jsx';
import { formatNumber } from '../../lib/utils.js';

export default function Writers({ writers = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-[220px] animate-pulse rounded-3xl border border-ink/10 bg-white" />
        ))}
      </div>
    );
  }

  if (!writers.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {writers.map((writer, index) => (
        <Link
          key={writer._id || writer.username}
          to={`/writers/${writer.username}`}
          className={`group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-soft ${
            index === 1 ? 'bg-ink text-white' : 'bg-white text-ink'
          }`}
        >
          <Sparkle
            className={`absolute -right-2 -top-2 h-20 w-20 transition-transform duration-500 group-hover:rotate-12 ${
              index === 1 ? 'text-lime-400/15' : 'text-lime-400/40'
            }`}
          />
          <div className="flex items-center gap-3">
            <Avatar user={writer} size="lg" />
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-semibold tracking-tight">{writer.name}</h3>
              <p className={`text-xs ${index === 1 ? 'text-white/40' : 'text-ink/40'}`}>
                @{writer.username}
              </p>
            </div>
            <span
              className={`ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform group-hover:rotate-45 ${
                index === 1 ? 'bg-lime-400 text-ink' : 'border border-ink/15 text-ink'
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className={`mt-4 line-clamp-2 text-xs leading-relaxed ${index === 1 ? 'text-white/50' : 'text-ink/50'}`}>
            {writer.bio || 'A curious human, writing things down.'}
          </p>
          <div className={`mt-5 flex items-center gap-4 border-t pt-4 text-[10px] font-medium ${index === 1 ? 'border-white/10 text-white/40' : 'border-ink/10 text-ink/40'}`}>
            <span>{formatNumber(writer.postCount || 0)} stories</span>
            <span>{formatNumber(writer.followersCount || 0)} followers</span>
            <span className="ml-auto inline-flex items-center gap-1">
              Read <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
